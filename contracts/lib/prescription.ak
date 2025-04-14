use aiken/collection/list
use aiken/primitive/string
use cardano/address.{VerificationKey}
use cardano/transaction.{InlineDatum, OutputReference, Transaction}
use cardano/time
use cardano/assets

// Prescription system types

type Action {
  CreatePrescription
  ApprovePrescription
}

type PrescriptionDatum {
  prescription_id: String,
  patient: ByteArray,
  doctor: Option<ByteArray>,
  diagnosis: String,
  medications: List<String>,
  issued_at: Int, 
  approved: Bool
}

// Constants
const AI_PUBKEY_HASH: ByteArray = process.env.hash

// Main validator
validator prescription {
  spend(
    datum: Option<PrescriptionDatum>,
    action: Action,
    oref: OutputReference,
    tx: Transaction,
  ) {
    trace @"Processing prescription..."

    expect Some(d) = datum

    when action is {
      CreatePrescription -> {
        trace @"Creating prescription..."

        // Validate it’s signed by the AI backend
        expect list.has(tx.extra_signatories, AI_PUBKEY_HASH)?

        // Validate prescription ID format: starts with "RX"
        expect string.starts_with(d.prescription_id, "RX")?
        expect string.length(d.prescription_id) >= 8?

        // Ensure mandatory fields exist
        expect d.diagnosis != ""?
        expect list.length(d.medications) > 0?
        expect d.approved == false?

        trace string.concat(@"Issued at timestamp: ", string.from_int(d.issued_at))

        true
      }

      ApprovePrescription -> {
        trace @"Approving prescription..."

        // Only doctor in datum can approve
        expect Some(doc_pk) = d.doctor

        expect list.has(tx.extra_signatories, doc_pk)?

        // Find input and output by this script address
        expect Some(input) = list.find(
          tx.inputs,
          fn(i) { i.output_reference == oref }
        )

        let input_value = input.output.value
        let input_address = input.output.address.payment_credential

        // Find matching output (same value, same address)
        expect Some(output) = list.find(
          tx.outputs,
          fn(o) {
            o.address.payment_credential == input_address &&
            o.value == input_value
          }
        )

        // Validate the updated datum
        expect InlineDatum(newDatum) = output.datum
        expect new: PrescriptionDatum = newDatum

        trace @"Verifying updated approved status..."

        // Ensure all fields are same except `approved = true`
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
    trace @"Invalid context for prescription validator"
    fail
  }
}
