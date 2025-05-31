use aiken/primitive/string
use cardano/transaction
use cardano/assets
use prescription/types

minting_policy prescription_minting_policy {
  mint(
    action: Action,
    _minted_amount: Int,
    tx: transaction::Transaction
  ) {
    match action {
      CreatePrescription -> {
        trace @"Creating prescription token..."

        // Ensure that prescription ID follows a format and is valid
        expect string.starts_with(tx.tx_id, "RX")?
        expect string.length(tx.tx_id) >= 8?

        //[todo] Ensure our AI backend can sign the token mint
        expect list.has(tx.extra_signatories, AI_PUBKEY_HASH)?

        true
      }
      _ -> {
        trace @"Invalid action for minting prescription token"
        fail
      }
    }
  }
}
