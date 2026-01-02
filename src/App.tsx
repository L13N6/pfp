import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { keccak256, stringToBytes } from 'viem';

/* ---------- helpers ---------- */
const pick = (dna: string, i: number, arr: string[]) =>
  arr[parseInt(dna.slice(i, i + 2), 16) % arr.length];

/* ---------- SVG generator ---------- */
function PlanetSVG({ dna }: { dna: string }) {
  const colors = ['#6aa9ff', '#6aff9d', '#ffd36a', '#ff6a6a', '#b06aff', '#222'];
  const mouths = ['_', 'o', '-', '~'];
  const eyes = ['.', '•', 'o'];
  const accessories = ['none', 'hat', 'smoke'];

  const color = pick(dna, 2, colors);
  const mouth = pick(dna, 6, mouths);
  const eye = pick(dna, 8, eyes);
  const accessory = pick(dna, 10, accessories);
  const hasRing = parseInt(dna[12], 16) % 2 === 0;

  return (
    <svg viewBox="0 0 200 200" width="200">
      {/* aura */}
      <circle cx="100" cy="100" r="78" fill={color} opacity="0.15" />

      {/* ring */}
      {hasRing && (
        <ellipse
          cx="100"
          cy="115"
          rx="90"
          ry="22"
          fill="none"
          stroke="#000"
          strokeWidth="6"
          opacity="0.4"
        />
      )}

      {/* planet */}
      <circle
        cx="100"
        cy="100"
        r="70"
        fill={color}
        stroke="#000"
        strokeWidth="6"
      />

      {/* face */}
      <text x="70" y="95" fontSize="18">{eye}</text>
      <text x="120" y="95" fontSize="18">{eye}</text>
      <text x="95" y="120" fontSize="18">{mouth}</text>

      {/* accessory */}
      {accessory === 'hat' && (
        <rect x="60" y="35" width="80" height="20" fill="#000" />
      )}

      {accessory === 'smoke' && (
        <text x="140" y="120" fontSize="20">~</text>
      )}
    </svg>
  );
}

function App() {
  const [fid, setFid] = useState<number | null>(null);
  const [dna, setDna] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        sdk.actions.ready();
        const context = await sdk.context;
        if (context?.user?.fid) {
          setFid(context.user.fid);
        }
      } catch {}
    };
    init();
  }, []);

  const generate = () => {
    if (!fid) return;
    const hash = keccak256(stringToBytes(fid.toString()));
    setDna(hash);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#05010f', color: '#fff', padding: 32 }}>
      <h1>🪐 ZETA PLANETS</h1>

      {!fid && <p>Open inside Farcaster</p>}

      {fid && !dna && (
        <button onClick={generate}>Generate My Planet</button>
      )}

      {dna && (
        <>
          <PlanetSVG dna={dna} />
          <pre style={{ fontSize: 10 }}>{dna}</pre>
          <button>Mint (soon)</button>
        </>
      )}
    </div>
  );
}

export default App;
