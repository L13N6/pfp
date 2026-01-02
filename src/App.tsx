import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { keccak256, toUtf8Bytes } from 'viem';

function App() {
  const [fid, setFid] = useState<number | null>(null);
  const [dna, setDna] = useState<string>('');
  const [pfpUrl, setPfpUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sdk.actions.ready();
    sdk.auth.getUser()
      .then(user => {
        setFid(user.fid);
        const hash = keccak256(toUtf8Bytes(user.fid.toString()));
        setDna(hash);
      })
      .catch(err => console.error('Auth error:', err));
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
      if (data.imageUrl) {
        setPfpUrl(data.imageUrl);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to server');
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
          margin: '30px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Generating Magic...' : 'Generate My PFP'}
      </button>

      {pfpUrl && (
        <div style={{ marginTop: '40px' }}>
          <h2>Your Unique DNA PFP:</h2>
          <img
            src={pfpUrl}
            alt="Your DNA-based PFP"
            style={{
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              border: '6px solid #0ff',
              boxShadow: '0 0 30px #0ff'
            }}
          />
          <p style={{ marginTop: '20px', fontSize: '18px' }}>
            Right-click → Save image<br />
            Use it as your Warpcast profile picture!
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
