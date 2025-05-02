use aiken/serialise
use aiken/collection/list
use shared/types.{User}

type AppointmentDatum {
  patient: User,
  doctor: Option<User>,
  scheduled_at: Int,
  confirmed: Bool
}

type AppointmentAction {
  CreateAppointment
  ConfirmAppointment
}

impl serialise::Data for AppointmentDatum
impl serialise::Data for AppointmentAction
