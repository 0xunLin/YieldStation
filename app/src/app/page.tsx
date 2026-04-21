import React from 'react';
import QRCode from 'react-qr-code';

export default function Home() {
  // Construct the absolute Action URL following the Dialect specification
  // In production, localhost:3000 is replaced by the actual domain.
  const host = "http://localhost:3000";
  const actionLink = `solana-action:${host}/api/actions/borrow`;
  const dialectUrl = `https://dial.to/?action=${encodeURIComponent(actionLink)}`;

  return (
    <div style={{ display: 'flex', width: '100%', maxWidth: '1200px', margin: '0 auto', gap: '6rem', alignItems: 'center' }}>
      
      {/* Left Column: Stark Instructional Text */}
      <div style={{ flex: 1 }}>
        <h1 className="font-sans" style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1, textTransform: 'uppercase', marginBottom: '2rem' }}>
          Scan to Unlock System
        </h1>
        
        <p className="font-mono" style={{ fontSize: '1.25rem', color: '#888', marginBottom: '3rem', maxWidth: '80%' }}>
           Tap NFC device or scan the matrix code with a Solana-compatible wallet to bypass local hardware locks and issue active flash credit. 
        </p>

        <div style={{ borderTop: '2px solid #333', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', gap: '4rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#666', textTransform: 'uppercase' }}>
            <div>
              <div style={{ color: '#fff', marginBottom: '0.5rem', fontWeight: 'bold' }}>Collateral Route</div>
              <div>Wrapped SOL</div>
            </div>
            <div>
              <div style={{ color: '#fff', marginBottom: '0.5rem', fontWeight: 'bold' }}>Disbursement</div>
              <div>Synthetic CRED</div>
            </div>
            <div>
              <div style={{ color: '#a00', marginBottom: '0.5rem', fontWeight: 'bold' }}>Security</div>
              <div>Autonomous LTV limits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: The "Action" Vector (QR Code) */}
      <div style={{ flex: '0 0 450px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ 
            background: '#fff', 
            padding: '2rem', 
            borderRadius: '8px',
            boxShadow: '0 0 40px rgba(0, 255, 65, 0.1)',
            border: '4px solid #fff' 
          }}>
          <QRCode 
            value={dialectUrl} 
            size={380} 
            level="L"
            fgColor="#000000"
            bgColor="#ffffff"
          />
        </div>
        
        <div className="font-mono" style={{ marginTop: '2rem', color: '#00ff41', textAlign: 'center', letterSpacing: '0.2em', fontSize: '0.9rem' }}>
          WAITING FOR MOBILE APPARATUS...
        </div>
      </div>
      
    </div>
  );
}
