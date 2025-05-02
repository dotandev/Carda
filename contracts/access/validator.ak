use aiken/collection/list
use cardano/transaction
use access/types

validator access {
  spend(
    datum: Option<AccessDatum>,
    action: AccessAction,
    _oref: transaction::OutputReference,
    tx: transaction::Transaction,
  ) {
    expect Some(d) = datum

    expect list.has(tx.extra_signatories, d.owner.id)?

    when action is {
      GrantAccess -> {
        expect d.access_granted == false?
        true
      }

      RevokeAccess -> {
        expect d.access_granted == true?
        true
      }
    }
  }
  else(_) {
    fail
  }
}
