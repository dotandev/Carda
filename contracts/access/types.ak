use aiken/serialise
use shared/types

type AccessDatum {
  owner: User,
  accessor: User,
  access_granted: Bool
}

type AccessAction {
  GrantAccess
  RevokeAccess
}

impl serialise::Data for AccessDatum
impl serialise::Data for AccessAction

