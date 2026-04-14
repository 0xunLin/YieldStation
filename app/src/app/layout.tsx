import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YieldStation',
  description: 'Proximity-Triggered Self-Repaying Loans',
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
            <div className="logo">YieldStation</div>
            <nav className="nav-links">
              <a href="#">Dashboard</a>
              <a href="#">Proximity Node</a>
              <a href="#">Treasury</a>
            </nav>
            <button className="btn-primary">Connect Wallet</button>
          </header>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
