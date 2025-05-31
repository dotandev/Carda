import { lucid } from "./setup";
import { ConsentDatum } from "./types";

export async function submitConsent(datum: ConsentDatum) {
  const tx = await lucid
    .newTx()
    .payToContract("script_address", { inline: datum }, { lovelace: 2_000_000n })
    .complete();

  const signedTx = await tx.sign().complete();
  return await signedTx.submit();
}


export async function getConsentDatum() {
  const tx = await lucid
    .newTx()
    .payToContract("script_address", { inline: {} }, { lovelace: 2_000_000n })
    .complete();

  const signedTx = await tx.sign().complete();
  return await signedTx.submit();
}