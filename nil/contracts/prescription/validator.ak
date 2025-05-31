use aiken/collection/list
use aiken/primitive/string
use cardano/address
use cardano/transaction.{Transaction, OutputReference, InlineDatum}
use prescription/types

const AI_PUBKEY_HASH: ByteArray = "your_ai_pubkey_hash_here"

validator prescription {
  spend(
    datum: Option<PrescriptionDatum>,
    redeemer: Action,
    oref: OutputReference,
    tx: Transaction,
  ) {
    trace @"Validating prescription..."
    expect Some(d) = datum

    when redeemer is {
      CreatePrescription -> {
        expect list.has(tx.extra_signatories, AI_PUBKEY_HASH)?
        expect string.starts_with(d.prescription_id, "RX")?
        expect string.length(d.prescription_id) >= 8?
        expect d.diagnosis != ""?
        expect list.length(d.medications) > 0?
        expect d.approved == false?
        true
      }

      ApprovePrescription -> {
        expect Some(doc_pk) = d.doctor
        expect list.has(tx.extra_signatories, doc_pk)?

        expect Some(input) = list.find(tx.inputs, fn(i) { i.output_reference == oref })
        let input_value = input.output.value
        let input_address = input.output.address.payment_credential

        expect Some(output) = list.find(
          tx.outputs,
          fn(o) {
            o.address.payment_credential == input_address &&
            o.value == input_value
          }
        )

        expect InlineDatum(newDatum) = output.datum
        expect new: PrescriptionDatum = newDatum

        and {
          new.prescription_id == d.prescription_id,
          new.patient == d.patient,
          new.diagnosis == d.diagnosis,
          new.medications == d.medications,
          new.issued_at == d.issued_at,
          new.doctor == d.doctor,
          new.approved == true
        }
      }
    }
  }

  else(_) {
    trace @"Invalid execution context"
    fail
  }
}
