use cardano/transaction
use shared/types
use consent/types

validator consent {
  spend(
    datum: Option<ConsentDatum>,
    _redeemer: Unit,
    _oref: transaction::OutputReference,
    tx: transaction::Transaction,
  ) {
    expect Some(d) = datum

    expect list.has(tx.extra_signatories, d.user.id)?
    expect d.signed_at <= tx.valid_range.upper?

    true
  }
  else(_) {
    fail
  }
}
