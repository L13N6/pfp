import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { keccak256, stringToBytes } from 'viem';

function App() {
  const [fid, setFid] = useState<number | null>(null);
  const [dna, setDna] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Idle');

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

  useEffect(() => {
    detectFid();
  }, []);

  const generatePlanetDna = () => {
    if (!fid) return;
    const bytes = stringToBytes(fid.toString());
    const hash = keccak256(bytes);
    setDna(hash);
    setStatus('Planet DNA generated');
  };

  const mintPlanet = () => {
    if (!dna) return;
    alert(`Minting planet with DNA:\n${dna}`);
  };

  return (
    <div className="space">
      {/* planets */}
      <div className="planet p1" />
      <div className="planet p2" />
      <div className="planet p3" />
      <div className="planet p4" />
      <div className="planet p5" />
      <div className="planet p6" />
      <div className="planet p7" />

      {/* UI */}
      <div className="panel">
        <h1>🪐 ZETA · 7 PLANETS</h1>
        <p>Status: {status}</p>

        {!fid && (
          <button onClick={detectFid}>Detect Farcaster FID</button>
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
            <pre>{dna}</pre>
            <button onClick={mintPlanet}>
              Mint Planet (placeholder)
            </button>
          </>
        )}

        {!fid && (
          <p className="hint">
            Open inside Farcaster to auto-detect your identity
          </p>
        )}
      </div>

      {/* styles */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        body, html, #root {
          margin: 0;
          width: 100%;
          height: 100%;
        }

        .space {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: radial-gradient(circle at bottom, #05010f, #000);
          color: #fff;
          font-family: monospace;
        }

        .panel {
          position: relative;
          z-index: 10;
          max-width: 420px;
          margin: 8vh auto;
          padding: 24px;
          background: rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          backdrop-filter: blur(6px);
        }

        button {
          display: block;
          width: 100%;
          margin-top: 12px;
          padding: 10px;
          background: #1a1aff;
          border: none;
          color: white;
          font-weight: bold;
          cursor: pointer;
          border-radius: 6px;
        }

        button:hover {
          background: #3333ff;
        }

        pre {
          white-space: pre-wrap;
          word-break: break-all;
          background: #000;
          padding: 10px;
          border-radius: 6px;
        }

        .hint {
          margin-top: 12px;
          opacity: 0.6;
          font-size: 12px;
        }

        .planet {
          position: absolute;
          border-radius: 50%;
          filter: blur(0.3px);
          opacity: 0.9;
        }

        .p1 { width: 120px; height: 120px; background: #ff6a00; top: 10%; left: 15%; }
        .p2 { width: 80px; height: 80px; background: #6afff3; top: 25%; right: 20%; }
        .p3 { width: 50px; height: 50px; background: #a66bff; top: 60%; left: 10%; }
        .p4 { width: 140px; height: 140px; background: #ffe066; bottom: 10%; right: 15%; }
        .p5 { width: 60px; height: 60px; background: #ff4d6d; top: 70%; right: 35%; }
        .p6 { width: 90px; height: 90px; background: #4dff88; bottom: 25%; left: 30%; }
        .p7 { width: 40px; height: 40px; background: #4da6ff; top: 40%; left: 50%; }
      `}</style>
    </div>
  );
}

export default App;
