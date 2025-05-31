use aiken/collection/list
use aiken/primitive/string
use cardano/transaction
use cardano/address
use cardano/time
use shared/types
use appointment/types

validator appointment {
  spend(
    datum: Option<AppointmentDatum>,
    action: AppointmentAction,
    oref: transaction::OutputReference,
    tx: transaction::Transaction,
  ) {
    expect Some(d) = datum

    when action is {
      CreateAppointment -> {
        expect d.patient.role == "patient"?
        expect d.scheduled_at > time.now()?
        expect d.confirmed == false?
        true
      }

      ConfirmAppointment -> {
        expect Some(doc) = d.doctor
        expect list.has(tx.extra_signatories, doc.id)?
        expect d.confirmed == false?
        true
      }
    }
  }
  else(_) {
    fail
  }
}
