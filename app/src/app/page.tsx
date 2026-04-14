export default function Home() {
  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <section style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Proximity-Triggered Yield Engine
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto', color: '#a1a1aa' }}>
          Deposit SOL, mint stablecoins, and let the Yield Router pay off your balance while you interact with physical endpoints.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass-card">
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Credit Engine</h2>
          <p>Instantly draw down stablecoin lines of credit against your staked collateral with zero manual repayment.</p>
          <button className="btn-primary" style={{ width: '100%' }}>Launch App</button>
        </div>

        <div className="glass-card">
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Hardware Trigger</h2>
          <p>Interact with our terminal UI kiosk to sign Blink transactions directly via NFC tap-to-pay functionality.</p>
          <button className="btn-primary" style={{ width: '100%', backgroundColor: 'var(--glass-bg)', color: 'var(--foreground)', border: '1px solid var(--glass-border)' }}>View Demo</button>
        </div>

        <div className="glass-card">
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>RWA Tranches</h2>
          <p>Gain exposure to tokenized real-world asset yields wrapped in programmable Metaplex NFTs.</p>
          <button className="btn-primary" style={{ width: '100%', backgroundColor: 'var(--glass-bg)', color: 'var(--foreground)', border: '1px solid var(--glass-border)' }}>Explore Vaults</button>
        </div>
      </div>
    </div>
  );
}
