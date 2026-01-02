import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { keccak256, stringToBytes } from 'viem';

function App() {
  const [fid, setFid] = useState<number | null>(null);
  const [dna, setDna] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Idle');

  // Detect FID (works in Farcaster Mini App)
  const detectFid = async () => {
    try {
      setStatus('Detecting Farcaster context...');
      sdk.actions.ready();

      const context = await sdk.context;
      const user = context?.user;

      if (!user?.fid) {
        setStatus('No Farcaster context detected');
        return;
      }

      setFid(user.fid);
      setStatus('FID detected');
    } catch (err) {
      console.error(err);
      setStatus('Error detecting FID');
    }
  };

  // Auto-detect on load
  useEffect(() => {
    detectFid();
  }, []);

  // Generate deterministic planet DNA from FID
  const generatePlanetDna = () => {
    if (!fid) return;

    const bytes = stringToBytes(fid.toString());
    const hash = keccak256(bytes);

    setDna(hash);
    setStatus('Planet DNA generated');
  };

  // Placeholder mint action
  const mintPlanet = () => {
    if (!dna) return;
    alert(`Minting planet with DNA:\n${dna}`);
  };

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <h1>🪐 Planet PFP Generator</h1>

      <p>Status: {status}</p>

      {!fid && (
        <button onClick={detectFid}>
          Detect Farcaster FID
        </button>
      )}

      {fid && (
        <>
          <p>FID: {fid}</p>

          {!dna && (
            <button onClick={generatePlanetDna}>
              Generate Planet DNA
            </button>
          )}
        </>
      )}

      {dna && (
        <>
          <p><strong>Planet DNA</strong></p>
          <pre style={{ wordBreak: 'break-all' }}>{dna}</pre>

          <button onClick={mintPlanet}>
            Mint Planet (placeholder)
          </button>
        </>
      )}

      {!fid && (
        <p style={{ marginTop: 16, opacity: 0.7 }}>
          Open this app inside Farcaster (Warpcast) to auto-detect your FID.
        </p>
      )}
    </div>
  );
}

export default App;
