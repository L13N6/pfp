import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { keccak256, stringToBytes } from 'viem';
import { utf8 } from 'viem/encoding';

function App() {
  const [fid, setFid] = useState<number | null>(null);
  const [dna, setDna] = useState<string>('');
  const [pfpUrl, setPfpUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Hide loading splash
    sdk.actions.ready();

    // Get user from context (current SDK method)
    if (sdk.context.user?.fid) {
      const userFid = sdk.context.user.fid;
      setFid(userFid);
      const bytes = stringToBytes(utf8(userFid.toString()));
      const hash = keccak256(bytes);
      setDna(hash);
    }
  }, []);

  const generatePfp = async () => {
    if (!dna) return;
    setLoading(true);
    try {
      const res = await fetch('/generate-pfp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dna })
      });
      const data = await res.json();
      if (data.imageUrl) setPfpUrl(data.imageUrl);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      background: '#000',
      color: '#0ff',
      minHeight: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <h1>🔮 Farcaster DNA PFP Generator</h1>
      <p>Your FID: <strong>{fid || 'Loading...'}</strong></p>
      <p>DNA Hash: <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>{dna || 'Generating...'}</code></p>

      <button
        onClick={generatePfp}
        disabled={loading || !dna}
        style={{
          padding: '20px 40px',
          fontSize: '24px',
          background: '#0ff',
          color: '#000',
          border: 'none',
          borderRadius: '20px',
          margin: '30px'
        }}
      >
        {loading ? 'Generating...' : 'Generate My PFP'}
      </button>

      {pfpUrl && (
        <div style={{ marginTop: '40px' }}>
          <h2>Your Unique PFP:</h2>
          <img
            src={pfpUrl}
            alt="DNA PFP"
            style={{ width: '320px', height: '320px', borderRadius: '50%', border: '5px solid #0ff' }}
          />
          <p>Save & use as profile picture!</p>
        </div>
      )}
    </div>
  );
}

export default App;
