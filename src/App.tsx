import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { keccak256, stringToBytes } from 'viem';

/* ---------------- SVG GENERATOR ---------------- */

function generateFwogPlanetSVG(dna: string) {
  const pick = (i: number, arr: string[]) =>
    arr[parseInt(dna.slice(i, i + 2), 16) % arr.length];

  const planetColors = ['#6aa9ff', '#6aff9d', '#ffd36a', '#ff6a6a', '#b06aff'];
  const backgrounds = ['#f4f1ec', '#e6f7ff', '#fff0f6', '#f0fff4'];
  const mouths = ['_', '-', 'o', '~'];

  const planetColor = pick(0, planetColors);
  const bg = pick(2, backgrounds);
  const mouth = pick(4, mouths);
  const hasRing = parseInt(dna[6], 16) % 2 === 0;

  return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <!-- background -->
  <rect width="300" height="300" fill="${bg}" />

  <!-- fwog-style body -->
  <rect x="110" y="120" rx="40" ry="40" width="80" height="100"
        fill="#9bf6ff" stroke="#000" stroke-width="5"/>

  <!-- head -->
  <circle cx="150" cy="90" r="45"
          fill="#9bf6ff" stroke="#000" stroke-width="5"/>

  <!-- remilio face -->
  <circle cx="135" cy="85" r="3" fill="#000"/>
  <circle cx="165" cy="85" r="3" fill="#000"/>
  <text x="147" y="105" font-size="14" text-anchor="middle">${mouth}</text>

  <!-- arm -->
  <line x1="190" y1="150" x2="235" y2="165"
        stroke="#000" stroke-width="6" stroke-linecap="round"/>

  <!-- planet in hand -->
  <circle cx="250" cy="170" r="22"
          fill="${planetColor}" stroke="#000" stroke-width="4"/>

  ${hasRing ? `
    <ellipse cx="250" cy="175" rx="30" ry="10"
             fill="none" stroke="#000" stroke-width="3"/>
  ` : ''}

</svg>
`;
}

/* ---------------- APP ---------------- */

function App() {
  const [fid, setFid] = useState<number | null>(null);
  const [dna, setDna] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Idle');

  // Detect Farcaster FID
  const detectFid = async () => {
    try {
      setStatus('Detecting Farcaster...');
      sdk.actions.ready();

      const context = await sdk.context;
      const user = context?.user;

      if (!user?.fid) {
        setStatus('No Farcaster context (open in Warpcast)');
        return;
      }

      setFid(user.fid);
      setStatus('FID detected');
    } catch (e) {
      console.error(e);
      setStatus('Error detecting FID');
    }
  };

  // Auto-detect on load
  useEffect(() => {
    detectFid();
  }, []);

  // Generate DNA from FID
  const generatePlanet = () => {
    if (!fid) return;
    const hash = keccak256(stringToBytes(fid.toString()));
    setDna(hash);
    setStatus('Planet generated');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#05010f',
      color: '#fff',
      fontFamily: 'monospace',
      padding: 24,
      textAlign: 'center'
    }}>
      <h1>🪐 ZETA PLANETS</h1>
      <p>{status}</p>

      {!fid && (
        <button onClick={detectFid}>
          Detect Farcaster FID
        </button>
      )}

      {fid && !dna && (
        <>
          <p>FID: {fid}</p>
          <button onClick={generatePlanet}>
            Generate My Planet
          </button>
        </>
      )}

      {dna && (
        <>
          <div
            style={{ margin: '20px auto', width: 300 }}
            dangerouslySetInnerHTML={{
              __html: generateFwogPlanetSVG(dna),
            }}
          />
          <pre style={{
            fontSize: 10,
            opacity: 0.7,
            wordBreak: 'break-all'
          }}>
            {dna}
          </pre>
          <button>
            Mint (coming soon)
          </button>
        </>
      )}
    </div>
  );
}

export default App;
