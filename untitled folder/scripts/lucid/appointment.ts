import { Lucid, Contract, Tx, Data } from "lucid-cardano";
import * as dotenv from "dotenv";

dotenv.config();

const NETWORK = process.env.NETWORK || "mainnet"; // 
const SENDER_ADDRESS = process.env.SENDER_ADDRESS || ""; 

const connectToCardano = async () => {
  const lucid = await Lucid.new(NETWORK, SENDER_ADDRESS);
  return lucid;
};

const createAppointment = async (patientAddress: string, doctorAddress: string, appointmentTime: string) => {
  const lucid = await connectToCardano();

  const contract: Contract = await lucid.contract("../appointment_contract.plutus");

  const datum: Data = {
    "patientAddress": patientAddress,
    "doctorAddress": doctorAddress,
    "appointmentTime": appointmentTime
  };

  const redeemer: Data = {
    "action": "create_appointment"
  };

  const tx: Tx = await lucid.newTx()
    .payToContract(
      "", 
      datum, 
      redeemer // action
    )
    .complete();

  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();

  console.log(`Appointment created. Transaction hash: ${txHash}`);
};

createAppointment("patient_address_here", "doctor_address_here", "2025-01-01T10:00:00Z").catch((error) => {
  console.error("Error creating appointment:", error);
});
