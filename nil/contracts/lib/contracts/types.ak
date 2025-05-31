use cardano/transaction.{ Datum, Redeemer, Transaction, OutputReference }

pub type Role = Enum 
  Patient
  Doctor
  Pharmacy
  Government
  Organization



pub type MedicalRecordRef = {
  record_id: String,
  author: ByteArray, // doctor pubkey hash
  timestamp: Int,
  encrypted_hash: ByteArray
}

pub type Comment = {
  author: ByteArray, // pharmacy or authorized user
  timestamp: Int,
  comment: String
}

pub type Event = {
  actor: ByteArray,
  action: String,
  timestamp: Int
}

pub type IdentityDatum = {
  owner: ByteArray, // patient public key hash
  role: Role,
  email: String,
  name: String,
  authorized_entities: List<ByteArray>,  // doctors/orgs with read/write access
  revoked_entities: List<ByteArray>,    // revoked keys
  records: List<MedicalRecordRef>,
  comments: List<Comment>,
  logs: List<Event>  // audit trail
}

pub type IdentityAction = Enum {
  JoinPlatform { public_key: ByteArray, name: String, email: String, role: Role },
  GrantAccess { entity: ByteArray },
  RevokeAccess { entity: ByteArray },
  AddRecord { record: MedicalRecordRef },
  AddComment { comment: Comment },
  RemoveEntity { entity: ByteArray },
  UpdateRole { entity: ByteArray, role: Role }
}