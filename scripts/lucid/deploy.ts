import { Lucid, Contract, Tx, Data } from "lucid-cardano";
import { C } from "lucid-cardano/dist/interfaces";
import * as dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const NETWORK = process.env.NETWORK || "mainnet"; // e.g., mainnet or testnet
const SENDER_ADDRESS = process.env.SENDER_ADDRESS || ""; // The address of the sender

const connectToCardano = async () => {
  const lucid = await Lucid.new(NETWORK, SENDER_ADDRESS);
  return lucid;
};

const deployContract = async () => {
  const lucid = await connectToCardano();

  const contract: Contract = await lucid.contract("../compiled_contract.plutus");

  const initialDatum: Data = {
    "key": "initial value"
  };

  const initialRedeemer: Data = {
    "action": "deploy"
  };

  const tx: Tx = await lucid.newTx()
    .payToContract(
      "", 
      initialDatum, 
      initialRedeemer // redeemer action
    )
    .complete();

  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();

  console.log(`Contract deployed. Transaction hash: ${txHash}`);
};

deployContract().catch((error) => {
  console.error("Error deploying contract:", error);
});
