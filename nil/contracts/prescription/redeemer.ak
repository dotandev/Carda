use cardano/transaction
use prescription/types

redeemer prescription_redeemer {
  spend(
    action: Action,
    datum: Option<PrescriptionDatum>,
    tx: transaction::Transaction
  ) {
    expect Some(d) = datum

    match action {
      ApprovePrescription -> {
        // Ensure the doctor can approve a prescription
        expect Some(doc_pk) = d.doctor
        expect list.has(tx.extra_signatories, doc_pk)?

        // Ensure the prescription is updated correctly with approval
        expect d.approved == false?
        true
      }
      _ -> {
        trace @"Invalid action for redeeming prescription"
        fail
      }
    }
  }
}
