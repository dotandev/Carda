// validators/med_data_sharing.ak

use aiken/collection/list
use cardano/address.{VerificationKey}
use cardano/assets
use cardano/transaction.{InlineDatum, OutputReference, Transaction}

pub type RecordDatum {
  patient_id: ByteArray,
  record_hash: ByteArray, // hash of encrypted medical record off-chain
  authorized_parties: List<ByteArray>, // pubkey hashes allowed access
  last_updated: Int, // unix timestamp
}

pub type RecordAction {
  Share
  Revoke { revoked_party: ByteArray }
  Update { new_record_hash: ByteArray, new_timestamp: Int }
}

validator med_data_sharing {
  spend(
    datum: Option<RecordDatum>,
    action: RecordAction,
    oref: OutputReference,
    tx: Transaction,
  ) {
    trace @"Starting validator"

    expect Some(d) = datum

    // Extract signer pubkey from tx extra_signatories (assuming single signer for simplicity)
    expect Some(signer) = list.head(tx.extra_signatories)

    // trace string.concat(@"Signer: ", string.from_bytes(signer))

    // Helper: is signer authorized?
    let is_authorized = list.has(d.authorized_parties, signer)

    when action is {
      Share -> {
        trace @"Share action"
        // Only authorized parties can share (grant access)
        is_authorized
      }

      Revoke { revoked_party } -> {
        trace @"Revoke action"
        // Only authorized parties can revoke access
        and {
          is_authorized,
          // revoked party must be in authorized list
          list.has(d.authorized_parties, revoked_party),
          // signer can't revoke themselves
          signer != revoked_party,
        }
      }

      Update { new_record_hash, new_timestamp } -> {
        trace @"Update action"
        // Only authorized parties can update
        and {
          is_authorized,
          // new timestamp must be greater than old
          new_timestamp > d.last_updated,
        }
      }
    }
  }

  else(_) {
    fail
  }
}
