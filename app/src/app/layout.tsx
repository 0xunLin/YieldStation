import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YieldStation | Hardware Node',
  description: 'Proximity-Triggered Yield Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#000', color: '#fff', margin: 0, overflow: 'hidden' }}>
        <div className="container" style={{ maxWidth: '100vw', padding: '0 4rem' }}>
          <header className="header" style={{ borderBottom: '2px solid #333', padding: '1.5rem 0' }}>
            <div className="logo" style={{ color: '#fff', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>YIELDSTATION</div>
            <div className="nav-right">
              <span className="font-mono" style={{ color: '#00ff41', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#00ff41', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #00ff41' }}></span>
                NODE ACTIVE
              </span>
            </div>
          </header>
          <main style={{ minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
