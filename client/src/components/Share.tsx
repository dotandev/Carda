'use client';

import { useState } from 'react';
import {
    Lucid,
    Blockfrost,
    generateSeedPhrase,
    fromText,
    Network,
    Data,
    SpendingValidator,
    Constr,
    UTxO,
    RedeemerBuilder,
    Redeemer,
} from '@lucid-evolution/lucid';
import { validatorToAddress, getAddressDetails } from "@lucid-evolution/lucid";
import { NetworkType } from '@cardano-foundation/cardano-connect-with-wallet-core';
import { useCardano } from '@cardano-foundation/cardano-connect-with-wallet';

export default function ShareRecord() {
    const [status, setStatus] = useState('');
    const [txHash, setTxHash] = useState(null as string | null);;
    const [error, setError] = useState(null as string | null);
    const network = NetworkType.TESTNET;
    // process.env.NODE_ENV === "development" ? NetworkType.TESTNET : NetworkType.MAINNET;

    const {
        isConnected,
        stakeAddress,
        usedAddresses,
        meerkatAddress,
        unusedAddresses,
        disconnect,
        accountBalance,
        connect,
        installedExtensions,
    } = useCardano({
        limitNetwork: network,
    });

    let publicKeyHash: string = '';

    const datum = Data.to(new Constr(0, [publicKeyHash]));


    const spend_val: SpendingValidator = {
        type: "PlutusV3",
        script: "5901f801010029800aba2aba1aba0aab9faab9eaab9dab9a488888896600264653001300800198041804800cdc3a400530080024888966002600460106ea800e26466453001159800980098059baa002899912cc004c00cc034dd5000c660026eb8c044c038dd5000c8c048c04cc04c00644646600200200644b30010018a508acc004cdc79bae30150010038a51899801001180b000a020404d300d37540129111192cc004c02000a2003159800980600144c966002005159800998021bac3005301437540100031980099b8f006001a50a51404914a0809229410121bae30163013375401d1323259800801c4cdc41bad3018301930193019301537540126eb4c060c06400a29410131bae30170013013375401c8089011198011bac30033012375400c0088b2018300f300c375400464b30010018a60103d87a8000899ba548000cc03cc0400052f5c08070dd618079808180818081808180818081808180818061baa0048b201498059baa0079807801a444b300130040028acc004c03cdd5005400e2c80822b30013008002899192cc004c05400a00b1640486eb8c04c004c03cdd5005456600266e1d20040028991919912cc004c05c00e00f1640506eb4c050004dd7180a001180a00098079baa00a8b201a40348068601a601c0026e1d20003009375400716401c300800130033754011149a26cac8009", // CBOR format from plutus.json
    };

    const scriptAddress = validatorToAddress("Preprod", spend_val);

    const handleShare = async () => {
        setStatus('Initializing...');
        setError(null);
        setTxHash(null);

        try {
            const lucid = await Lucid(
                new Blockfrost('https://cardano-preprod.blockfrost.io/api/v0', 'preprodbMjdgcWd6oyhiUqtpalLZXqPmZj461Oe'),
                'Preprod'
            );

            //   5901f801010029800aba2aba1aba0aab9faab9eaab9dab9a488888896600264653001300800198041804800cdc3a400530080024888966002600460106ea800e26466453001159800980098059baa002899912cc004c00cc034dd5000c660026eb8c044c038dd5000c8c048c04cc04c00644646600200200644b30010018a508acc004cdc79bae30150010038a51899801001180b000a020404d300d37540129111192cc004c02000a2003159800980600144c966002005159800998021bac3005301437540100031980099b8f006001a50a51404914a0809229410121bae30163013375401d1323259800801c4cdc41bad3018301930193019301537540126eb4c060c06400a29410131bae30170013013375401c8089011198011bac30033012375400c0088b2018300f300c375400464b30010018a60103d87a8000899ba548000cc03cc0400052f5c08070dd618079808180818081808180818081808180818061baa0048b201498059baa0079807801a444b300130040028acc004c03cdd5005400e2c80822b30013008002899192cc004c05400a00b1640486eb8c04c004c03cdd5005456600266e1d20040028991919912cc004c05c00e00f1640506eb4c050004dd7180a001180a00098079baa00a8b201a40348068601a601c0026e1d20003009375400716401c300800130033754011149a26cac8009


            // const scriptAddress = lucid.utils.validatorToAddress(spend_val);
            //   const seedPhrase = generateSeedPhrase();
            //   lucid.selectWallet.fromSeed(seedPhrase);

            //   const blueprint = await fetch('/plutus.json').then(res => res.json());
            //   const script = lucid.utils.validatorToScript(blueprint.validators[0]);
            //   const scriptAddress = lucid.utils.scriptAddress(script);

            // Find the UTxO we want to spend
            const allUTxOs = await lucid.utxosAt(scriptAddress);
            const ownerUTxO = allUTxOs.find((utxo) => {
                if (utxo.datum) {
                    const datum = Data.from(utxo.datum, recordDatum);
                    // const addressDetailsI = getAddressDetails(await lucid.wallet.address()).paymentCredential.hash;
                    const address = [...datum.authorized_parties];
                    return datum.authorized_parties === address;
                }
            });

            // const redeemer: Redeemer = {
            //     action: "spend",
            //   };

            const redeemer = "spend";

            // Spend script UTxO
            const tx = await lucid
                .newTx()
                .collectFrom([ownerUTxO as UTxO], redeemer) // Provide the redeemer argument
                .attach.SpendingValidator(spend_val) // Attach validator
                .complete();

            const recordDatum = {
                patient_id: fromText('patient123'),
                record_hash: fromText('hash_of_encrypted_record'),
                authorized_parties: [stakeAddress],
                last_updated: Math.floor(Date.now() / 1000),
            };

            // const datum = Data.to(recordDatum);

            setStatus('Building transaction...');

            // const tx = await lucid
            //     .newTx()
            //     .payToContract(scriptAddress, { inline: datum }, { lovelace: 2_000_000n })
            //     .complete();

            const seedPhrase = generateSeedPhrase();
            lucid.selectWallet.fromSeed(seedPhrase);

            const api = await window.cardano['eternl'].enable()
            lucid.selectWallet.fromAPI(api)

            setStatus('Signing transaction...');
            const signedTx = await tx.sign.withWallet().complete();

            setStatus('Submitting transaction...');
            const hash = await signedTx.submit();

            setTxHash(hash);
            setStatus('Transaction submitted!');
        } catch (err) {
            console.error('Transaction error:', err);
            setError(
                // err.message || 
                'An error occurred.');
            setStatus('Transaction failed.');
        }
    };

    // const handleLock = async () => {
    //     const lucid = await Lucid(
    //         new Blockfrost('https://cardano-preprod.blockfrost.io/api/v0', 'preprodbMjdgcWd6oyhiUqtpalLZXqPmZj461Oe'),
    //         'Preprod'
    //     );

    //     const recordDatum = {
    //         patient_id: fromText('patient123'),
    //         record_hash: fromText('hash_of_encrypted_record'),
    //         authorized_parties: [getAddressDetails(await lucid.wallet.address())?.paymentCredential?.hash as unknown as string],
    //         last_updated: Math.floor(Date.now() / 1000),
    //     };

    //     const tx = await lucid
    //         .newTx()
    //         .pay.ToContract(scriptAddress, { inline: recordDatum }, { lovelace: 10_000_000n })
    //         .complete();
    // }

    return (
        <div>
            <h2>Share Medical Record</h2>
            <button onClick={handleShare}>Share Record</button>
            {status && <p>Status: {status}</p>}
            {txHash && <p>Transaction Hash: {txHash}</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
}
