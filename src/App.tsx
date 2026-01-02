import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { keccak256, stringToBytes } from 'viem';

function App() {
  const [fid, setFid] = useState<number | null>(null);
  const [dna, setDna] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const context = await sdk.context;
      const user = context?.user;

      if (user?.fid) {
        setFid(user.fid);

        const bytes = stringToBytes(user.fid.toString());
        const hash = keccak256(bytes);
        setDna(hash);
      }
    };

    init();
  }, []);

  return (
    <div>
      <h1>Safe PFP DNA</h1>
      {fid && <p>FID: {fid}</p>}
      {dna && <p>DNA: {dna}</p>}
    </div>
  );
}

export default App;
