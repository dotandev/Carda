import { Lucid, Data, TxHash } from "lucid-cardano";
import { prescriptionValidator } from "./compiled";

export async function createPrescription(
  lucid: Lucid,
  patient: string,
  diagnosis: string,
  medications: string[],
  issuedAt: number
): Promise<TxHash> {
  const datum = Data.to({
    prescription_id: "RX" + Date.now().toString(),
    patient,
    doctor: null,
    diagnosis,
    medications,
    issued_at: issuedAt,
    approved: false,
  });

  const tx = await lucid
    .newTx()
    .payToContract(prescriptionValidator.address, { inline: datum }, { lovelace: 2000000n })
    .complete()
    .sign()
    .submit();

  return tx;
}
