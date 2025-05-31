// 'use client';

// import { useState } from 'react';
// import {
//   Lucid,
//   Koios,
//   generateSeedPhrase,
//   fromText,
// } from '@lucid-evolution/lucid';

// export default function SendAdaTest() {
//   const [status, setStatus] = useState('');
//   const [txHash, setTxHash] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   async function handleSend() {
//     setStatus('Initializing Lucid...');
//     setError(null);
//     setTxHash(null);

//     try {
//       // Initialize Lucid with Koios provider (Preprod)
//       const lucid = await Lucid(
//         new Koios('https://preprod.koios.rest/api/v1'),
//         'Preprod'
//       );

//       const seedPhrase = generateSeedPhrase();
//       lucid.selectWallet.fromSeed(seedPhrase); // Select wallet

//       setStatus('Building transaction...');

//       const tx = await lucid
//         .newTx()

//         .pay.ToAddress('addr_test1...', { lovelace: 5_000_000n })
//         .pay.ToAddress('addr_test1...', { lovelace: 5_000_000n })
//         .complete();

//       setStatus('Signing transaction...');

//       const signedTx = await tx.sign.withWallet().complete();

//       setStatus('Submitting transaction...');
//       const hash = await signedTx.submit();

//       setTxHash(hash);
//       setStatus('Transaction submitted!');
//     } catch (err: any) {
//       console.error('Transaction error:', err);
//       setError(
//         err?.message || 'Something went wrong while sending the transaction.'
//       );
//       setStatus('Failed to submit transaction.');
//     }
//   }

//   return (
//     <div className="p-4 max-w-lg mx-auto bg-gray-900 text-white rounded-xl shadow-lg">
//       <h2 className="text-xl font-semibold mb-2">Test Send ADA</h2>
//       <p className="text-sm text-gray-400 mb-4">
//         Send 5 ADA each to two recipients on the Preprod testnet.
//       </p>

//       <button
//         onClick={handleSend}
//         className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md"
//       >
//         Send ADA
//       </button>

//       <div className="mt-4">
//         {status && <p className="text-sm text-blue-300">Status: {status}</p>}
//         {txHash && (
//           <p className="text-sm text-green-400">
//             ✅ Tx Hash:{' '}
//             <a
//               href={`https://preprod.cardanoscan.io/transaction/${txHash}`}
//               target="_blank"
//               rel="noreferrer"
//               className="underline"
//             >
//               {txHash}
//             </a>
//           </p>
//         )}
//         {error && <p className="text-sm text-red-400">❌ {error}</p>}
//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import {
  Lucid,
  Blockfrost,
  generateSeedPhrase,
} from '@lucid-evolution/lucid';

export default function SendAdaTest() {
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    setStatus('Initializing Lucid...');
    setError(null);
    setTxHash(null);

    try {
      // ✅ Use Blockfrost instead of Koios
      const lucid = await Lucid(
        new Blockfrost(
          'https://cardano-preprod.blockfrost.io/api/v0',
          'preprodbMjdgcWd6oyhiUqtpalLZXqPmZj461Oe' // ⬅️ Put your Blockfrost key here
        ),
        'Preprod'
      );

      const seedPhrase = generateSeedPhrase();
      lucid.selectWallet.fromSeed(seedPhrase);

      setStatus('Building transaction...');

      const tx = await lucid
        .newTx()
        .pay.ToAddress(
          'addr_test1qruhzp76q0zftama0ttvwaucr3ut2ln90w5wty5e435mw40sfacyjygwqef6538nmsyn42exyrul8mxul2vahakvt2ssl93988', // ⬅️ Replace with a second real Preprod address
          { lovelace: 1_000_000n }
        )
        .complete();

      setStatus('Signing transaction...');
      const signedTx = await tx.sign.withWallet().complete();

      setStatus('Submitting transaction...');
      const hash = await signedTx.submit();

      setTxHash(hash);
      setStatus('✅ Transaction submitted!');
    } catch (err: any) {
      console.error('Transaction error:', err);
      setError(
        err?.message || 'Something went wrong while sending the transaction.'
      );
      setStatus('❌ Failed to submit transaction.');
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-900 text-white rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-2">Test Send ADA</h2>
      <p className="text-sm text-gray-400 mb-4">
        Send 5 ADA each to two recipients on the Preprod testnet.
      </p>

      <button
        onClick={handleSend}
        className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md"
      >
        Send ADA
      </button>

      <div className="mt-4">
        {status && <p className="text-sm text-blue-300">Status: {status}</p>}
        {txHash && (
          <p className="text-sm text-green-400">
            ✅ Tx Hash:{' '}
            <a
              href={`https://preprod.cardanoscan.io/transaction/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {txHash}
            </a>
          </p>
        )}
        {error && <p className="text-sm text-red-400">❌ {error}</p>}
      </div>
    </div>
  );
}
