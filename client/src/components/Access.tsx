// import fs from "fs";
// import path from "path";
// import { Lucid, Blockfrost } from "@lucid-evolution/lucid";

// const lucid = await Lucid(
//   new Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", "YOUR_BLOCKFROST_API_KEY"),
//   "Preprod"
// );


// const blueprint = JSON.parse(fs.readFileSync(path.join(__dirname, "plutus.json"), "utf8"));
// const script = lucid.utils.validatorToScript(blueprint.validators[0]);
// const scriptAddress = lucid.utils.scriptAddress(script);


// import { Data, fromText } from "@lucid-evolution/lucid";

// const recordDatum = {
//   patient_id: fromText("patient123"),
//   record_hash: fromText("hash_of_encrypted_record"),
//   authorized_parties: [lucid.utils.getAddressDetails(await lucid.wallet.address()).paymentCredential.hash],
//   last_updated: Math.floor(Date.now() / 1000),
// };

// const datum = Data.to(recordDatum);


// const tx = await lucid
//   .newTx()
//   .payToContract(scriptAddress, { inline: datum }, { lovelace: 2_000_000n })
//   .complete();

// const signedTx = await tx.sign().complete();
// const txHash = await signedTx.submit();

// console.log("Transaction submitted with hash:", txHash);
