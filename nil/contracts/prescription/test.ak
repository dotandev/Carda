use prescription/types
use prescription/minting_policy
use prescription/redeemer
use cardano/transaction
use cardano/time

test prescription_system_test {
  setup {
    let patient = User { id = "patient_001", role = "patient" }
    let doctor = Some(User { id = "doctor_001", role = "doctor" })

    let prescription = PrescriptionDatum {
      prescription_id = "RX123456",
      patient = patient.id,
      doctor = doctor,
      diagnosis = "Flu",
      medications = ["Medicine A", "Medicine B"],
      issued_at = time.now(),
      approved = false
    }

    let tx = Transaction {
      tx_id = "RX123456",
      inputs = [],
      outputs = [Output { value = 1_000_000n, address = "script_address" }],
      extra_signatories = ["AI_PUBKEY_HASH"]
    }

    trace @"Test Setup Completed"
    true
  }

  test_create_prescription {
    let action = Action::CreatePrescription
    let result = minting_policy::prescription_minting_policy(action, 1, tx)
    
    assert result == true "Prescription minting should succeed"
  }

  test_approve_prescription {
    let action = Action::ApprovePrescription
    let result = redeemer::prescription_redeemer(action, Some(prescription), tx)
    
    assert result == true "Prescription approval should succeed"
  }

  test_invalid_action {
    let action = Action::CreatePrescription
    let result = redeemer::prescription_redeemer(action, Some(prescription), tx)
    
    assert result == false "Invalid redeemer action should fail"
  }
}
