import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YieldStation',
  description: 'Proximity-Triggered Yield Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div className="logo">ystation</div>
            <nav className="nav-links">
              <a href="#">Ecosystem</a>
              <a href="#">Writing</a>
              <a href="#">Architecture</a>
            </nav>
            <div className="nav-right">
              <button className="btn-outline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', display: 'inline-block'}}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                Docs
              </button>
              <button className="btn-primary">Connect Wallet</button>
            </div>
          </header>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
