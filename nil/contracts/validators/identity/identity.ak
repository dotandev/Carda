use cardano/transaction.{ Datum, Redeemer, Transaction, OutputReference }
use aiken/collection/list
use lib/contracts.{ Role, MedicalRecordRef, Comment, Event, IdentityDatum, IdentityAction, JoinPlatform, GrantAccess, RevokeAccess, AddRecord, AddComment, RemoveEntity, UpdateRole }

fn is_authorized(entity: ByteArray, authorized_entities: List<ByteArray>) -> Bool {
  list.has(authorized_entities, entity)?
}

fn is_revoked(entity: ByteArray, revoked_entities: List<ByteArray>) -> Bool {
  list.has(revoked_entities, entity)?
}

fn is_owner(entity: ByteArray, owner: ByteArray) -> Bool {
  entity == owner
}

fn is_doctor(role: Role) -> Bool {
  role == Role.Doctor
}

fn is_pharmacy(role: Role) -> Bool {
  role == Role.Pharmacy
}

fn is_government(role: Role) -> Bool {
  role == Role.Government
}

fn is_organization(role: Role) -> Bool {
  role == Role.Organization
}

fn is_patient(role: Role) -> Bool {
  role == Role.Patient
}

fn is_authorized_doctor(entity: ByteArray, role: Role, authorized_entities: List<ByteArray>) -> Bool {
  is_doctor(role) && is_authorized(entity, authorized_entities)
}

fn is_authorized_pharmacy(entity: ByteArray, role: Role, authorized_entities: List<ByteArray>) -> Bool {
  is_pharmacy(role) && is_authorized(entity, authorized_entities)
}

validator identity {
  spend(
    datum: Option<IdentityDatum>,
    redeemer: IdentityAction,
    _oref: OutputReference,
    tx: Transaction,
  ) -> Bool {
    expect Some(d) = datum

    // get signers list from tx
    let signers = tx.extra_signatories

    // check if any signer is the owner
    let owner_signed = list.has(signers, d.owner)?

    // get first signer safely for access checks
    let first_signer = list.head(signers)?

    when redeemer is {
      JoinPlatform { public_key, name, email, role } ->
        owner_signed

      GrantAccess { entity } ->
        if owner_signed
          let new_datum = tx.outputs[0].datum
          expect Some(new_d) = new_datum
          list.has(new_d.authorized_entities, entity)?
        else
          False

      RevokeAccess { entity } ->
        if owner_signed
          let new_datum = tx.outputs[0].datum
          expect Some(new_d) = new_datum
          list.has(new_d.revoked_entities, entity)? &&
          !(list.has(new_d.authorized_entities, entity)?)
        else
          False

      AddRecord { record } ->
        if is_authorized_doctor(first_signer, d.role, d.authorized_entities)
          let new_datum = tx.outputs[0].datum
          expect Some(new_d) = new_datum
          list.has(new_d.records, record)?
        else
          False

      AddComment { comment } ->
        if is_authorized_pharmacy(first_signer, d.role, d.authorized_entities)
          let new_datum = tx.outputs[0].datum
          expect Some(new_d) = new_datum
          list.has(new_d.comments, comment)?
        else
          False

      RemoveEntity { entity } ->
        if owner_signed
          let new_datum = tx.outputs[0].datum
          expect Some(new_d) = new_datum
          !(list.has(new_d.authorized_entities, entity)?) &&
          list.has(d.authorized_entities, entity)?
        else
          False

      UpdateRole { entity, role } ->
        if owner_signed
          True
        else
          False
    }
  }
}
