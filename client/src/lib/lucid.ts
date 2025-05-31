// import { Lucid, Blockfrost, type Script, Data, type UTxO, type PolicyId } from "lucid-cardano"

// // Datum and Redeemer types matching Aiken validators
// const MedicalRecordDatum = Data.Object({
//   patient_address: Data.Bytes(),
//   doctor_address: Data.Bytes(),
//   record_hash: Data.Bytes(),
//   permissions: Data.Array(Data.Bytes()),
//   created_at: Data.Integer(),
//   expires_at: Data.Integer(),
//   emergency_access: Data.Boolean(),
// })

// const PrescriptionDatum = Data.Object({
//   patient_address: Data.Bytes(),
//   doctor_address: Data.Bytes(),
//   medication: Data.Bytes(),
//   dosage: Data.Bytes(),
//   quantity: Data.Integer(),
//   refills: Data.Integer(),
//   dispensed: Data.Integer(),
//   created_at: Data.Integer(),
//   expires_at: Data.Integer(),
// })

// const EmergencyAccessDatum = Data.Object({
//   patient_address: Data.Bytes(),
//   authorized_addresses: Data.Array(Data.Bytes()),
//   emergency_contacts: Data.Array(Data.Bytes()),
//   medical_conditions: Data.Array(Data.Bytes()),
//   active: Data.Boolean(),
// })

// const MultiSigDatum = Data.Object({
//   required_signatures: Data.Integer(),
//   signatories: Data.Array(Data.Bytes()),
//   operation_type: Data.Bytes(),
//   operation_data: Data.Bytes(),
//   signatures_collected: Data.Integer(),
//   deadline: Data.Integer(),
// })

// // Redeemer types
// const RecordRedeemer = Data.Enum([
//   Data.Literal("Create"),
//   Data.Literal("Share"),
//   Data.Literal("Revoke"),
//   Data.Object({ Emergency: {
//     params: [],
//     static: undefined,
//     [Kind]: "",
//     [Kind]: ""
//   } }),
// ])

// const PrescriptionRedeemer = Data.Enum([
//   Data.Literal("Mint"),
//   Data.Literal("Dispense"),
//   Data.Literal("Transfer"),
//   Data.Literal("Burn"),
// ])

// const EmergencyRedeemer = Data.Enum([
//   Data.Literal("Activate"),
//   Data.Literal("Deactivate"),
//   Data.Object({ Access: {
//     emergency_type: Data.Bytes(),
//     params: [],
//     static: undefined,
//     [Kind]: "",
//     [Kind]: "",
//     [Kind]: "",
//     [Kind]: ""
//   } }),
// ])

// const MultiSigRedeemer = Data.Enum([
//   Data.Literal("Propose"),
//   Data.Literal("Sign"),
//   Data.Literal("Execute"),
//   Data.Literal("Cancel"),
// ])

// export interface MedicalRecord {
//   id: string
//   patientAddress: string
//   doctorAddress: string
//   recordType: string
//   diagnosis: string
//   treatment: string
//   medications: string[]
//   timestamp: number
//   txHash?: string
//   scriptUtxo?: UTxO
// }

// export interface Prescription {
//   id: string
//   patientAddress: string
//   doctorAddress: string
//   medication: string
//   dosage: string
//   quantity: number
//   refills: number
//   dispensed: number
//   timestamp: number
//   expiresAt: number
//   txHash?: string
//   policyId?: PolicyId
//   assetName?: string
// }

// export interface EmergencyAccess {
//   patientAddress: string
//   authorizedAddresses: string[]
//   emergencyContacts: string[]
//   medicalConditions: string[]
//   active: boolean
//   scriptUtxo?: UTxO
// }

// export interface MultiSigOperation {
//   id: string
//   requiredSignatures: number
//   signatories: string[]
//   operationType: string
//   operationData: any
//   signaturesCollected: number
//   deadline: number
//   scriptUtxo?: UTxO
// }

// export class CardanoService {
//   private lucid: Lucid | null = null
//   private api: Blockfrost
//   private medicalRecordScript: Script | null = null
//   private prescriptionScript: Script | null = null
//   private emergencyAccessScript: Script | null = null
//   private multiSigScript: Script | null = null

//   constructor() {
//     this.api = new Blockfrost(
//       "https://cardano-mainnet.blockfrost.io/api/v0",
//       process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "",
//     )
//   }

//   async initializeLucid() {
//     if (!this.lucid) {
//       this.lucid = await Lucid.new(this.api, "Mainnet")
//       await this.loadValidators()
//     }
//     return this.lucid
//   }

//   private async loadValidators() {
//     // In a real implementation, these would be compiled Aiken scripts
//     // For now, we'll use placeholder scripts
//     this.medicalRecordScript = {
//       type: "PlutusV2",
//       script: "590a4d590a4a0100003323332332233333333...", // Compiled medical_record.ak
//     }

//     this.prescriptionScript = {
//       type: "PlutusV2",
//       script: "590b2d590b2a0100003323332332233333333...", // Compiled prescription_nft.ak
//     }

//     this.emergencyAccessScript = {
//       type: "PlutusV2",
//       script: "590c1d590c1a0100003323332332233333333...", // Compiled emergency_access.ak
//     }

//     this.multiSigScript = {
//       type: "PlutusV2",
//       script: "590d0d590d0a0100003323332332233333333...", // Compiled multi_signature.ak
//     }
//   }

//   async connectWallet(walletName: "nami" | "eternl" | "flint" = "nami") {
//     const lucid = await this.initializeLucid()

//     try {
//       if (!window.cardano || !window.cardano[walletName]) {
//         throw new Error(`${walletName} wallet not found. Please install the wallet extension.`)
//       }

//       const api = await window.cardano[walletName].enable()
//       lucid.selectWallet(api)
//       const address = await lucid.wallet.address()

//       localStorage.setItem("connectedWallet", walletName)
//       localStorage.setItem("walletAddress", address)

//       return address
//     } catch (error) {
//       console.error("Failed to connect wallet:", error)
//       throw new Error(`Wallet connection failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   async createMedicalRecord(record: Omit<MedicalRecord, "id" | "timestamp" | "txHash">): Promise<string> {
//     const lucid = await this.initializeLucid()
//     if (!this.medicalRecordScript) throw new Error("Medical record validator not loaded")

//     const recordId = `MR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
//     const timestamp = Date.now()
//     const expiresAt = timestamp + 365 * 24 * 60 * 60 * 1000 // 1 year

//     const scriptAddress = lucid.utils.validatorToAddress(this.medicalRecordScript)

//     const datum = Data.to(
//       {
//         patient_address: record.patientAddress,
//         doctor_address: record.doctorAddress,
//         record_hash: recordId,
//         permissions: ["read", "share"],
//         created_at: BigInt(timestamp),
//         expires_at: BigInt(expiresAt),
//         emergency_access: true,
//         static: undefined,
//         type: "object",
//         properties: undefined,
//         [Kind]: "Object",
//         params: []
//       },
//       MedicalRecordDatum,
//     )

//     const redeemer = Data.to("Create", RecordRedeemer)

//     try {
//       const tx = await lucid
//         .newTx()
//         .payToContract(scriptAddress, { inline: datum }, { lovelace: BigInt(5000000) })
//         .attachSpendingValidator(this.medicalRecordScript)
//         .attachMetadata(721, {
//           medical_record: {
//             id: recordId,
//             patient: record.patientAddress,
//             doctor: record.doctorAddress,
//             type: record.recordType,
//             diagnosis: record.diagnosis,
//             treatment: record.treatment,
//             medications: record.medications,
//             timestamp: timestamp,
//             version: "2.0",
//           },
//         })
//         .complete()

//       const signedTx = await tx.sign().complete()
//       const txHash = await signedTx.submit()

//       this.storeRecordLocally({
//         ...record,
//         id: recordId,
//         timestamp,
//         txHash,
//       })

//       return txHash
//     } catch (error) {
//       console.error("Failed to create medical record:", error)
//       throw new Error(`Transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   async createPrescriptionNFT(
//     prescription: Omit<Prescription, "id" | "timestamp" | "txHash" | "dispensed">,
//   ): Promise<string> {
//     const lucid = await this.initializeLucid()
//     if (!this.prescriptionScript) throw new Error("Prescription validator not loaded")

//     const prescriptionId = `RX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
//     const timestamp = Date.now()
//     const expiresAt = timestamp + 90 * 24 * 60 * 60 * 1000 // 90 days

//     // Create minting policy for prescription NFT
//     const mintingPolicy = lucid.utils.nativeScriptFromJson({
//       type: "all",
//       scripts: [
//         {
//           type: "sig",
//           keyHash: lucid.utils.getAddressDetails(prescription.doctorAddress).paymentCredential?.hash || "",
//         },
//         {
//           type: "before",
//           slot: lucid.utils.unixTimeToSlot(expiresAt),
//         },
//       ],
//     })

//     const policyId = lucid.utils.mintingPolicyToId(mintingPolicy)
//     const assetName = prescriptionId
//     const unit = policyId + assetName

//     const scriptAddress = lucid.utils.validatorToAddress(this.prescriptionScript)

//     const datum = Data.to(
//       {
//         patient_address: prescription.patientAddress,
//         doctor_address: prescription.doctorAddress,
//         medication: prescription.medication,
//         dosage: prescription.dosage,
//         quantity: BigInt(prescription.quantity),
//         refills: BigInt(prescription.refills),
//         dispensed: BigInt(0),
//         created_at: BigInt(timestamp),
//         expires_at: BigInt(expiresAt),
//         static: undefined,
//         type: "object",
//         properties: undefined,
//         [Kind]: "Object",
//         params: []
//       },
//       PrescriptionDatum,
//     )

//     const redeemer = Data.to("Mint", PrescriptionRedeemer)

//     try {
//       const tx = await lucid
//         .newTx()
//         .mintAssets({ [unit]: BigInt(1) }, redeemer)
//         .payToContract(scriptAddress, { inline: datum }, { [unit]: BigInt(1), lovelace: BigInt(3000000) })
//         .attachMintingPolicy(mintingPolicy)
//         .attachSpendingValidator(this.prescriptionScript)
//         .attachMetadata(721, {
//           [policyId]: {
//             [assetName]: {
//               name: `Prescription ${prescriptionId}`,
//               description: `Medical prescription for ${prescription.medication}`,
//               image: "ipfs://QmPrescriptionImage...",
//               medication: prescription.medication,
//               dosage: prescription.dosage,
//               quantity: prescription.quantity,
//               refills: prescription.refills,
//               doctor: prescription.doctorAddress,
//               patient: prescription.patientAddress,
//               created: timestamp,
//               expires: expiresAt,
//             },
//           },
//         })
//         .complete()

//       const signedTx = await tx.sign().complete()
//       const txHash = await signedTx.submit()

//       this.storePrescriptionLocally({
//         ...prescription,
//         id: prescriptionId,
//         timestamp,
//         expiresAt,
//         dispensed: 0,
//         txHash,
//         policyId,
//         assetName,
//       })

//       return txHash
//     } catch (error) {
//       console.error("Failed to create prescription NFT:", error)
//       throw new Error(`Prescription transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   async dispensePrescription(prescriptionUtxo: UTxO, pharmacistAddress: string): Promise<string> {
//     const lucid = await this.initializeLucid()
//     if (!this.prescriptionScript) throw new Error("Prescription validator not loaded")

//     const datum = Data.from(prescriptionUtxo.datum!, PrescriptionDatum)
//     const updatedDatum = Data.to(
//       {
//         ...datum,
//         dispensed: datum.dispensed + BigInt(1),
//       },
//       PrescriptionDatum,
//     )

//     const redeemer = Data.to("Dispense", PrescriptionRedeemer)

//     try {
//       const tx = await lucid
//         .newTx()
//         .collectFrom([prescriptionUtxo], redeemer)
//         .payToContract(
//           lucid.utils.validatorToAddress(this.prescriptionScript),
//           { inline: updatedDatum },
//           prescriptionUtxo.assets,
//         )
//         .payToAddress(pharmacistAddress, { lovelace: BigInt(1000000) }) // Dispensing fee
//         .attachSpendingValidator(this.prescriptionScript)
//         .complete()

//       const signedTx = await tx.sign().complete()
//       const txHash = await signedTx.submit()

//       return txHash
//     } catch (error) {
//       console.error("Failed to dispense prescription:", error)
//       throw new Error(`Dispensing failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   async setupEmergencyAccess(emergencyData: Omit<EmergencyAccess, "scriptUtxo">): Promise<string> {
//     const lucid = await this.initializeLucid()
//     if (!this.emergencyAccessScript) throw new Error("Emergency access validator not loaded")

//     const scriptAddress = lucid.utils.validatorToAddress(this.emergencyAccessScript)

//     const datum = Data.to(
//       {
//         patient_address: emergencyData.patientAddress,
//         authorized_addresses: emergencyData.authorizedAddresses,
//         emergency_contacts: emergencyData.emergencyContacts,
//         medical_conditions: emergencyData.medicalConditions,
//         active: emergencyData.active,
//         static: undefined,
//         type: "object",
//         properties: undefined,
//         [Kind]: "Object",
//         params: []
//       },
//       EmergencyAccessDatum,
//     )

//     const redeemer = Data.to("Activate", EmergencyRedeemer)

//     try {
//       const tx = await lucid
//         .newTx()
//         .payToContract(scriptAddress, { inline: datum }, { lovelace: BigInt(10000000) })
//         .attachSpendingValidator(this.emergencyAccessScript)
//         .complete()

//       const signedTx = await tx.sign().complete()
//       const txHash = await signedTx.submit()

//       return txHash
//     } catch (error) {
//       console.error("Failed to setup emergency access:", error)
//       throw new Error(`Emergency setup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   async triggerEmergencyAccess(patientAddress: string, emergencyType: string): Promise<string> {
//     const lucid = await this.initializeLucid()
//     if (!this.emergencyAccessScript) throw new Error("Emergency access validator not loaded")

//     const scriptAddress = lucid.utils.validatorToAddress(this.emergencyAccessScript)
//     const utxos = await lucid.utxosAt(scriptAddress)

//     const emergencyUtxo = utxos.find((utxo) => {
//       if (!utxo.datum) return false
//       const datum = Data.from(utxo.datum, EmergencyAccessDatum)
//       return datum.patient_address === patientAddress && datum.active
//     })

//     if (!emergencyUtxo) {
//       throw new Error("No active emergency access found for patient")
//     }

//     const redeemer = Data.to({
//       Access: { emergency_type: emergencyType },
//       static: undefined,
//       anyOf: [],
//       [Kind]: "Union",
//       params: []
//     }, EmergencyRedeemer)

//     try {
//       const tx = await lucid
//         .newTx()
//         .collectFrom([emergencyUtxo], redeemer)
//         .attachSpendingValidator(this.emergencyAccessScript)
//         .addSigner(await lucid.wallet.address())
//         .complete()

//       const signedTx = await tx.sign().complete()
//       const txHash = await signedTx.submit()

//       return txHash
//     } catch (error) {
//       console.error("Failed to trigger emergency access:", error)
//       throw new Error(`Emergency access failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   async createMultiSigOperation(operation: Omit<MultiSigOperation, "id" | "scriptUtxo">): Promise<string> {
//     const lucid = await this.initializeLucid()
//     if (!this.multiSigScript) throw new Error("Multi-signature validator not loaded")

//     const operationId = `MS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
//     const deadline = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days

//     const scriptAddress = lucid.utils.validatorToAddress(this.multiSigScript)

//     const datum = Data.to(
//       {
//         required_signatures: BigInt(operation.requiredSignatures),
//         signatories: operation.signatories,
//         operation_type: operation.operationType,
//         operation_data: JSON.stringify(operation.operationData),
//         signatures_collected: BigInt(0),
//         deadline: BigInt(deadline),
//         static: undefined,
//         type: "object",
//         properties: undefined,
//         [Kind]: "Object",
//         params: []
//       },
//       MultiSigDatum,
//     )

//     const redeemer = Data.to("Propose", MultiSigRedeemer)

//     try {
//       const tx = await lucid
//         .newTx()
//         .payToContract(scriptAddress, { inline: datum }, { lovelace: BigInt(5000000) })
//         .attachSpendingValidator(this.multiSigScript)
//         .complete()

//       const signedTx = await tx.sign().complete()
//       const txHash = await signedTx.submit()

//       return txHash
//     } catch (error) {
//       console.error("Failed to create multi-sig operation:", error)
//       throw new Error(`Multi-sig creation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   async signMultiSigOperation(operationUtxo: UTxO): Promise<string> {
//     const lucid = await this.initializeLucid()
//     if (!this.multiSigScript) throw new Error("Multi-signature validator not loaded")

//     const datum = Data.from(operationUtxo.datum!, MultiSigDatum)
//     const updatedDatum = Data.to(
//       {
//         ...datum,
//         signatures_collected: datum.signatures_collected + BigInt(1),
//       },
//       MultiSigDatum,
//     )

//     const redeemer = Data.to("Sign", MultiSigRedeemer)

//     try {
//       const tx = await lucid
//         .newTx()
//         .collectFrom([operationUtxo], redeemer)
//         .payToContract(
//           lucid.utils.validatorToAddress(this.multiSigScript),
//           { inline: updatedDatum },
//           operationUtxo.assets,
//         )
//         .attachSpendingValidator(this.multiSigScript)
//         .addSigner(await lucid.wallet.address())
//         .complete()

//       const signedTx = await tx.sign().complete()
//       const txHash = await signedTx.submit()

//       return txHash
//     } catch (error) {
//       console.error("Failed to sign multi-sig operation:", error)
//       throw new Error(`Multi-sig signing failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   async shareRecord(recordHash: string, doctorAddress: string, permissions: string[]): Promise<string> {
//     const lucid = await this.initializeLucid()
//     if (!this.medicalRecordScript) throw new Error("Medical record validator not loaded")

//     const scriptAddress = lucid.utils.validatorToAddress(this.medicalRecordScript)
//     const utxos = await lucid.utxosAt(scriptAddress)

//     const recordUtxo = utxos.find((utxo) => {
//       if (!utxo.datum) return false
//       const datum = Data.from(utxo.datum, MedicalRecordDatum)
//       return datum.record_hash === recordHash
//     })

//     if (!recordUtxo) {
//       throw new Error("Medical record not found")
//     }

//     const datum = Data.from(recordUtxo.datum!, MedicalRecordDatum)
//     const updatedDatum = Data.to(
//       {
//         ...datum,
//         permissions: [...datum.permissions, ...permissions],
//       },
//       MedicalRecordDatum,
//     )

//     const redeemer = Data.to("Share", RecordRedeemer)

//     try {
//       const tx = await lucid
//         .newTx()
//         .collectFrom([recordUtxo], redeemer)
//         .payToContract(scriptAddress, { inline: updatedDatum }, recordUtxo.assets)
//         .payToAddress(doctorAddress, { lovelace: BigInt(1500000) })
//         .attachSpendingValidator(this.medicalRecordScript)
//         .attachMetadata(721, {
//           record_sharing: {
//             record_hash: recordHash,
//             shared_with: doctorAddress,
//             permissions: permissions,
//             timestamp: Date.now(),
//             expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
//           },
//         })
//         .complete()

//       const signedTx = await tx.sign().complete()
//       const txHash = await signedTx.submit()

//       return txHash
//     } catch (error) {
//       console.error("Failed to share record:", error)
//       throw new Error(`Sharing transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   async verifyRecord(txHash: string) {
//     try {
//       const tx = await this.api.txsMetadata(txHash)
//       return tx.find((metadata) => metadata.label === "721")
//     } catch (error) {
//       console.error("Failed to verify record:", error)
//       return null
//     }
//   }

//   async getWalletBalance(): Promise<number> {
//     const lucid = await this.initializeLucid()

//     try {
//       const utxos = await lucid.wallet.getUtxos()
//       const balance = utxos.reduce((acc, utxo) => acc + utxo.assets.lovelace, BigInt(0))
//       return Number(balance) / 1000000
//     } catch (error) {
//       console.error("Failed to get wallet balance:", error)
//       return 0
//     }
//   }

//   async getTransactionHistory(address: string): Promise<any[]> {
//     try {
//       const transactions = await this.api.addressesTransactions(address)
//       return transactions.slice(0, 10)
//     } catch (error) {
//       console.error("Failed to get transaction history:", error)
//       return []
//     }
//   }

//   async getScriptUtxos(scriptType: "medical" | "prescription" | "emergency" | "multisig"): Promise<UTxO[]> {
//     const lucid = await this.initializeLucid()

//     let script: Script | null = null
//     switch (scriptType) {
//       case "medical":
//         script = this.medicalRecordScript
//         break
//       case "prescription":
//         script = this.prescriptionScript
//         break
//       case "emergency":
//         script = this.emergencyAccessScript
//         break
//       case "multisig":
//         script = this.multiSigScript
//         break
//     }

//     if (!script) return []

//     const scriptAddress = lucid.utils.validatorToAddress(script)
//     return await lucid.utxosAt(scriptAddress)
//   }

//   // Local storage methods
//   private storeRecordLocally(record: MedicalRecord) {
//     const records = this.getLocalRecords()
//     records.push(record)
//     localStorage.setItem("medicalRecords", JSON.stringify(records))
//   }

//   private storePrescriptionLocally(prescription: Prescription) {
//     const prescriptions = this.getLocalPrescriptions()
//     prescriptions.push(prescription)
//     localStorage.setItem("prescriptions", JSON.stringify(prescriptions))
//   }

//   getLocalRecords(): MedicalRecord[] {
//     if (typeof window === "undefined") return []
//     const records = localStorage.getItem("medicalRecords")
//     return records ? JSON.parse(records) : []
//   }

//   getLocalPrescriptions(): Prescription[] {
//     if (typeof window === "undefined") return []
//     const prescriptions = localStorage.getItem("prescriptions")
//     return prescriptions ? JSON.parse(prescriptions) : []
//   }

//   isWalletConnected(): boolean {
//     if (typeof window === "undefined") return false
//     return !!localStorage.getItem("walletAddress")
//   }

//   getConnectedWalletAddress(): string | null {
//     if (typeof window === "undefined") return null
//     return localStorage.getItem("walletAddress")
//   }

//   disconnectWallet() {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("connectedWallet")
//       localStorage.removeItem("walletAddress")
//     }
//     this.lucid = null
//   }
// }

// export const cardanoService = new CardanoService()
