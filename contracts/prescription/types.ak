use aiken/collection/list
use aiken/primitive/string
use aiken/serialise
use cardano/address
use cardano/assets

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

impl serialise::Serialise for PrescriptionDatum
