use aiken/collection/list
use aiken/serialise
use cardano/address

type User {
  id: ByteArray,
  role: String  // "patient", "doctor", "ai", "pharmacist"
}

type Credential {
  pubkey: ByteArray
}
