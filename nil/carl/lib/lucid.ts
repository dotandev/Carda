import { Lucid, Blockfrost } from "lucid-cardano"

export interface MedicalRecord {
  id: string
  patientAddress: string
  doctorAddress: string
  recordType: string
  diagnosis: string
  treatment: string
  medications: string[]
  timestamp: number
  txHash?: string
}

export interface Prescription {
  id: string
  patientAddress: string
  doctorAddress: string
  medication: string
  dosage: string
  quantity: number
  refills: number
  timestamp: number
  txHash?: string
}

export class CardanoService {
  private lucid: Lucid | null = null
  private api: Blockfrost

  constructor() {
    this.api = new Blockfrost(
      "https://cardano-mainnet.blockfrost.io/api/v0",
      process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "",
    )
  }

  async initializeLucid() {
    if (!this.lucid) {
      this.lucid = await Lucid.new(this.api, "Mainnet")
    }
    return this.lucid
  }

  async connectWallet(walletName: "nami" | "eternl" | "flint" = "nami") {
    const lucid = await this.initializeLucid()

    try {
      if (!window.cardano || !window.cardano[walletName]) {
        throw new Error(`${walletName} wallet not found. Please install the wallet extension.`)
      }

      const api = await window.cardano[walletName].enable()
      lucid.selectWallet(api)
      const address = await lucid.wallet.address()

      // Store wallet info in localStorage
      localStorage.setItem("connectedWallet", walletName)
      localStorage.setItem("walletAddress", address)

      return address
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw new Error(`Wallet connection failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async createMedicalRecord(record: Omit<MedicalRecord, "id" | "timestamp" | "txHash">): Promise<string> {
    const lucid = await this.initializeLucid()

    const recordId = `MR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const timestamp = Date.now()

    const metadata = {
      721: {
        medical_record: {
          id: recordId,
          patient: record.patientAddress,
          doctor: record.doctorAddress,
          type: record.recordType,
          diagnosis: record.diagnosis,
          treatment: record.treatment,
          medications: record.medications,
          timestamp: timestamp,
          version: "1.0",
        },
      },
    }

    try {
      const tx = await lucid
        .newTx()
        .payToAddress(record.patientAddress, { lovelace: BigInt(2000000) })
        .attachMetadata(721, metadata)
        .complete()

      const signedTx = await tx.sign().complete()
      const txHash = await signedTx.submit()

      // Store record locally for quick access
      this.storeRecordLocally({
        ...record,
        id: recordId,
        timestamp,
        txHash,
      })

      return txHash
    } catch (error) {
      console.error("Failed to create medical record:", error)
      throw new Error(`Transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async createPrescription(prescription: Omit<Prescription, "id" | "timestamp" | "txHash">): Promise<string> {
    const lucid = await this.initializeLucid()

    const prescriptionId = `RX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const timestamp = Date.now()

    const metadata = {
      721: {
        prescription: {
          id: prescriptionId,
          patient: prescription.patientAddress,
          doctor: prescription.doctorAddress,
          medication: prescription.medication,
          dosage: prescription.dosage,
          quantity: prescription.quantity,
          refills: prescription.refills,
          timestamp: timestamp,
          version: "1.0",
        },
      },
    }

    try {
      const tx = await lucid
        .newTx()
        .payToAddress(prescription.patientAddress, { lovelace: BigInt(2500000) })
        .attachMetadata(721, metadata)
        .complete()

      const signedTx = await tx.sign().complete()
      const txHash = await signedTx.submit()

      // Store prescription locally
      this.storePrescriptionLocally({
        ...prescription,
        id: prescriptionId,
        timestamp,
        txHash,
      })

      return txHash
    } catch (error) {
      console.error("Failed to create prescription:", error)
      throw new Error(`Prescription transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async shareRecord(recordHash: string, doctorAddress: string, permissions: string[]): Promise<string> {
    const lucid = await this.initializeLucid()

    const metadata = {
      721: {
        record_sharing: {
          record_hash: recordHash,
          shared_with: doctorAddress,
          permissions: permissions,
          timestamp: Date.now(),
          expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        },
      },
    }

    try {
      const tx = await lucid
        .newTx()
        .payToAddress(doctorAddress, { lovelace: BigInt(1500000) })
        .attachMetadata(721, metadata)
        .complete()

      const signedTx = await tx.sign().complete()
      const txHash = await signedTx.submit()

      return txHash
    } catch (error) {
      console.error("Failed to share record:", error)
      throw new Error(`Sharing transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async verifyRecord(txHash: string) {
    try {
      const tx = await this.api.txsMetadata(txHash)
      return tx.find((metadata) => metadata.label === "721")
    } catch (error) {
      console.error("Failed to verify record:", error)
      return null
    }
  }

  async getWalletBalance(): Promise<number> {
    const lucid = await this.initializeLucid()

    try {
      const utxos = await lucid.wallet.getUtxos()
      const balance = utxos.reduce((acc, utxo) => acc + utxo.assets.lovelace, BigInt(0))
      return Number(balance) / 1000000 // Convert to ADA
    } catch (error) {
      console.error("Failed to get wallet balance:", error)
      return 0
    }
  }

  async getTransactionHistory(address: string): Promise<any[]> {
    try {
      const transactions = await this.api.addressesTransactions(address)
      return transactions.slice(0, 10) // Return last 10 transactions
    } catch (error) {
      console.error("Failed to get transaction history:", error)
      return []
    }
  }

  // Local storage methods for offline access
  private storeRecordLocally(record: MedicalRecord) {
    const records = this.getLocalRecords()
    records.push(record)
    localStorage.setItem("medicalRecords", JSON.stringify(records))
  }

  private storePrescriptionLocally(prescription: Prescription) {
    const prescriptions = this.getLocalPrescriptions()
    prescriptions.push(prescription)
    localStorage.setItem("prescriptions", JSON.stringify(prescriptions))
  }

  getLocalRecords(): MedicalRecord[] {
    if (typeof window === "undefined") return []
    const records = localStorage.getItem("medicalRecords")
    return records ? JSON.parse(records) : []
  }

  getLocalPrescriptions(): Prescription[] {
    if (typeof window === "undefined") return []
    const prescriptions = localStorage.getItem("prescriptions")
    return prescriptions ? JSON.parse(prescriptions) : []
  }

  isWalletConnected(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("walletAddress")
  }

  getConnectedWalletAddress(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("walletAddress")
  }

  disconnectWallet() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("connectedWallet")
      localStorage.removeItem("walletAddress")
    }
    this.lucid = null
  }
}

export const cardanoService = new CardanoService()
