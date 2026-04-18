export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ maxWidth: '800px', marginBottom: '6rem' }}>
        <h1 className="display-title">
          YieldStation <span className="display-subtitle font-sans" style={{ verticalAlign: 'middle' }}>Hardware Activated</span>
        </h1>
        <p style={{ marginTop: '1.5rem', lineHeight: '1.8' }}>
          YieldStation is an open, neutral protocol for proximity-triggered yield generation. It 
          resolves the disconnect between physical endpoints and decentralized finance by natively 
          issuing self-repaying stablecoin loans based on real-world actions, creating win-win economies
          that orchestrate agentic payments at scale.
        </p>

        {/* Code Mockup */}
        <div className="code-mockup">
          <p style={{ fontWeight: 600, color: '#000', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            Accept yield with a single tap of code
          </p>
          <pre style={{ margin: 0 }}>
{`creditEngine.use(
  proximityMiddleware(
    {
      "POST /endpoint": {
        accepts: ["USDC", "SOL"],      // Supported collateral routes
        description: "Vending Mach.",  // Your hardware node identity
      },
    },
  )
);`}
          </pre>
          <p style={{ color: '#888', marginTop: '2rem', borderTop: '1px solid #e5e5e5', paddingTop: '1rem' }}>
            That's it. Add one library to require immediate settlement for each physical NFC interaction.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <span className="eyebrow">LAST 30 DAYS</span>
        <div className="stat-row">
          <div className="stat-item">
            <div className="stat-value">75.41M</div>
            <div className="stat-label">Transactions</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">$24.24M</div>
            <div className="stat-label">Volume</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">94.06K</div>
            <div className="stat-label">Borrowers</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">22K</div>
            <div className="stat-label">Nodes</div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section style={{ textAlign: 'center', margin: '8rem 0' }}>
        <h2 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '4rem' }}>
          It's how yield should be: open, free, and effortless
        </h2>
        
        <div className="feature-row">
          <div>
            <div className="icon-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <h4 className="feature-title">Zero protocol fees</h4>
            <p className="feature-desc font-sans" style={{ color: 'var(--muted)' }}>YieldStation is free for the consumer and the merchant—just pay nominal transaction network fees</p>
          </div>
          <div>
            <div className="icon-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path></svg>
            </div>
            <h4 className="feature-title">Zero wait</h4>
            <p className="feature-desc font-sans" style={{ color: 'var(--muted)' }}>Assets collateralize at the speed of the Solana blockchain</p>
          </div>
          <div>
            <div className="icon-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <h4 className="feature-title">Zero friction</h4>
            <p className="feature-desc font-sans" style={{ color: 'var(--muted)' }}>No accounts, KYC, or personal information needed</p>
          </div>
          <div>
            <div className="icon-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            </div>
            <h4 className="feature-title">Zero centralization</h4>
            <p className="feature-desc font-sans" style={{ color: 'var(--muted)' }}>YieldStation is a neutral standard, fully dictated by Anchor Smart Contracts</p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Comparison Section */}
      <section style={{ textAlign: 'center', margin: '6rem 0' }}>
        <h2 className="section-title">We need a new way to interact with hardware...</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          The old way of interacting with kiosks is barely working for a human world, let alone an agentic future. YieldStation does in moments what existing systems can't do at all.
        </p>

        <div className="comparison-grid" style={{ textAlign: 'left', marginTop: '5rem' }}>
          <div className="comparison-column">
            <h3>THE OLD WAY</h3>
            
            <div className="list-item">
              <div className="list-number">1</div>
              <div className="list-content">
                <h4>Sign up and link credit card</h4>
                <p>Time consuming setup</p>
              </div>
            </div>
            
            <div className="list-item">
              <div className="list-number">2</div>
              <div className="list-content">
                <h4>Wait for POS terminal payment</h4>
                <p>KYC required, delaying access and requiring approval</p>
              </div>
            </div>

            <div className="list-item">
              <div className="list-number">3</div>
              <div className="list-content">
                <h4>Receive product</h4>
                <p>Prepaid commitment &rarr; overpay or run out of funds</p>
              </div>
            </div>
          </div>

          <div className="comparison-column green-accent">
            <h3>WITH YIELDSTATION</h3>
            
            <div className="list-item">
              <div className="list-number">1</div>
              <div className="list-content">
                <h4>User taps phone on NFC hardware</h4>
                <p>No account setup, instant onboarding</p>
              </div>
            </div>

            <div className="list-item">
              <div className="list-number">2</div>
              <div className="list-content">
                <h4>Blink issues instant stablecoin loan via collateral</h4>
                <p>No signups or approvals required</p>
              </div>
            </div>

            <div className="list-item">
              <div className="list-number">3</div>
              <div className="list-content">
                <h4>Product vended, yield pays off loan automatically</h4>
                <p>No debt management and zero manual settlement</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
