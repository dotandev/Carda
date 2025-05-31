// import { Lucid, Data, Blockfrost, TxHash, validatorToAddress } from "@lucid-evolution/lucid";
// import fs from "fs";

// const BLOCKFROST_API_KEY = "YOUR_BLOCKFROST_API_KEY"; // Put your testnet Blockfrost key here

// async function main() {
//   // Initialize Lucid with Blockfrost Testnet
//   const lucid = await Lucid(
//     new Blockfrost("https://cardano-testnet.blockfrost.io/api/v0", BLOCKFROST_API_KEY),
//     "Preprod" // Use "Preprod" for Cardano Testnet  
//   );

//   // Select your wallet for signing (using private key, hardware wallet, or browser wallet)
//   // For testing, you can use lucid.selectWalletFromSeed, lucid.selectWalletFromPrivateKey, etc.
//   // Here, I assume you have a private key loaded in environment variable or elsewhere
//   // Example: lucid.selectWalletFromSeed(yourSeedPhrase)
//   // Replace with your own wallet connection code here:
//   // For now, prompt user to connect wallet or load from environment (mock)
//   // lucid.selectWallet(...)

//   // Read plutus.json
//   const plutusJson = JSON.parse(fs.readFileSync("./plutus.json", "utf8"));

//   // Find validator you want to use (adjust the title as necessary)
//   const validator = plutusJson.validators.find(
//     (v: any) => v.title === "access_control.med_data_sharing.spend"
//   );

//   if (!validator) {
//     throw new Error("Validator not found in plutus.json");
//   }

//   const compiledCode = validator.compiledCode;
//   const script = {
//     type: "PlutusV3",
//     script: compiledCode,
//   };

//   // Get script address
//   const scriptAddress = validatorToAddress(script);
//   console.log("Script address:", scriptAddress);

//   // === STEP 1: Lock 2 ADA at the script address with datum ===

//   // Example datum matching your contract's expected datum structure:
//   // Here, I am guessing the datum is a record with a string field 'recordId' (adjust as per your contract)
//   // Replace this with your actual datum schema!
//   const datum: Data = {
//     // recordId: "example-record-001",
//   };

//   // Build transaction to lock ADA at the script address
//   const lockTx = await lucid
//     .newTx()
//     .payToContract(scriptAddress, { inline: datum }, { lovelace: 2_000_000 })
//     .complete();

//   // Sign transaction
//   const signedLockTx = await lockTx.sign().complete();

//   // Submit transaction
//   const lockTxHash: TxHash = await signedLockTx.submit();
//   console.log("Lock transaction submitted with tx hash:", lockTxHash);

//   // === Wait for this transaction to be confirmed on chain before spending ===
//   console.log("Please wait for confirmation of the locking transaction...");

//   // In production code, poll the network or listen for confirmation, here we'll just pause
//   await new Promise((r) => setTimeout(r, 30000)); // wait 30 seconds (adjust as needed)

//   // === STEP 2: Spend the locked UTXO from the script ===

//   // Find UTXOs locked at the script address
//   const utxosAtScript = await lucid.utxosAt(scriptAddress);
//   if (utxosAtScript.length === 0) {
//     throw new Error("No UTXOs found at script address to spend");
//   }
//   const utxoToSpend = utxosAtScript[0];
//   console.log("UTXO to spend:", utxoToSpend);

//   // Example redeemer, adjust to your contract's redeemer schema
//   const redeemer: Data = {
//     action: "spend",
//   };

//   // Build transaction to spend the script UTXO and send funds back to wallet
//   const spendTx = await lucid
//     .newTx()
//     .collectFrom([utxoToSpend], redeemer)
//     .payToAddress(await lucid.wallet.address(), { lovelace: utxoToSpend.assets.lovelace })
//     .complete();

//   // Sign and submit spend transaction
//   const signedSpendTx = await spendTx.sign().complete();
//   const spendTxHash = await signedSpendTx.submit();
//   console.log("Spend transaction submitted with tx hash:", spendTxHash);
// }

// main().catch((err) => {
//   console.error("Error:", err);
//   process.exit(1);
// });
