import { Lucid, Contract, Tx, Data } from "lucid-cardano";
import * as dotenv from "dotenv";

dotenv.config();

const NETWORK = process.env.NETWORK || "mainnet"; 
const SENDER_ADDRESS = process.env.SENDER_ADDRESS || "";

const connectToCardano = async () => {
  const lucid = await Lucid.new(NETWORK, SENDER_ADDRESS);
  return lucid;
};

const grantAccess = async (userAddress: string, accessLevel: string) => {
  const lucid = await connectToCardano();

  const contract: Contract = await lucid.contract("../access_contract.plutus");

  const datum: Data = {
    "userAddress": userAddress,
    "accessLevel": accessLevel
  };

  const redeemer: Data = {
    "action": "grant_access"
  };

  const tx: Tx = await lucid.newTx()
    .payToContract(
      "", // contract address
      datum, 
      redeemer // action
    )
    .complete();

  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();

  console.log(`Access granted. Transaction hash: ${txHash}`);
};

grantAccess("user_address_here", "read").catch((error) => {
  console.error("Error granting access:", error);
});
