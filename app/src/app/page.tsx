import React from 'react'; // Imports React framework to enable JSX and component lifecycle management.
import QRCode from 'react-qr-code'; // Imports the QR code generator library to display the Solana Action link.

export default function Home() { // Defines the main "Home" page component for the Hardware Kiosk UI.
  // Construct the absolute Action URL following the Dialect specification
  // In production, localhost:3000 is replaced by the actual domain.
  const host = "http://localhost:3000"; // Defines the base URL for the local development server hosting the API.
  const actionLink = `solana-action:${host}/api/actions/borrow`; // Formats the URL into a Solana Action protocol string for wallet recognition.
  const dialectUrl = `https://dial.to/?action=${encodeURIComponent(actionLink)}`; // Wraps the action in a Dialect validator URL for testing and mobile compatibility.

  return ( // Returns the JSX structure that defines the visual layout of the kiosk screen.
    <div style={{ display: 'flex', width: '100%', maxWidth: '1200px', margin: '0 auto', gap: '6rem', alignItems: 'center' }}> // Main flex container to align text and QR code.
      
      {/* Left Column: Stark Instructional Text */}
      <div style={{ flex: 1 }}> // Container for the instructional text column, taking up available flex space.
        <h1 className="font-sans" style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1, textTransform: 'uppercase', marginBottom: '2rem' }}> // Bold, high-visibility header to grab user attention.
          Scan to Unlock System // Instructions for the user to initiate the DeFi interaction.
        </h1> // End of the main header.
        
        <p className="font-mono" style={{ fontSize: '1.25rem', color: '#888', marginBottom: '3rem', maxWidth: '80%' }}> // Secondary text block using a monospace font for a technical/brutalist feel.
           Tap NFC device or scan the matrix code with a Solana-compatible wallet to bypass local hardware locks and issue active flash credit. // Description of how the user interacts with the machine.
        </p> // End of the instructional paragraph.

        <div style={{ borderTop: '2px solid #333', paddingTop: '2rem' }}> // Decorative border to separate instructions from technical metadata.
          <div style={{ display: 'flex', gap: '4rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#666', textTransform: 'uppercase' }}> // Row container for system status indicators.
            <div> // Wrapper for the "Collateral" status block.
              <div style={{ color: '#fff', marginBottom: '0.5rem', fontWeight: 'bold' }}>Collateral Route</div> // Metadata label for the input asset.
              <div>Wrapped SOL</div> // Displays that SOL is the asset required for the loan.
            </div> // End of collateral block.
            <div> // Wrapper for the "Disbursement" status block.
              <div style={{ color: '#fff', marginBottom: '0.5rem', fontWeight: 'bold' }}>Disbursement</div> // Metadata label for the output asset.
              <div>Synthetic CRED</div> // Displays that the user will receive CRED stablecoins.
            </div> // End of disbursement block.
            <div> // Wrapper for the "Security" status block.
              <div style={{ color: '#a00', marginBottom: '0.5rem', fontWeight: 'bold' }}>Security</div> // Metadata label for protocol safety features.
              <div>Autonomous LTV limits</div> // Highlights the smart contract's role in maintaining solvency.
            </div> // End of security block.
          </div> // End of status indicator row.
        </div> // End of metadata section.
      </div> // End of the left column.

      {/* Right Column: The "Action" Vector (QR Code) */}
      <div style={{ flex: '0 0 450px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}> // Flex column dedicated to the QR code interaction point.
        <div style={{ // Styled container for the QR code to make it look prominent and central.
            background: '#fff', // White background to provide high contrast for the QR scanner.
            padding: '2rem', // Spacing around the QR code.
            borderRadius: '8px', // Slightly rounded corners for a modern look.
            boxShadow: '0 0 40px rgba(0, 255, 65, 0.1)', // Subtle green glow to represent an "active" blockchain node.
            border: '4px solid #fff' // Thick border to frame the code.
          }}> // End of QR code container styling.
          <QRCode // The component that renders the actual scannable matrix.
            value={dialectUrl} // The encoded URL that tells the wallet which action to execute.
            size={380} // Explicit size for high-resolution scanning on physical kiosks.
            level="L" // Error correction level set to Low for maximum data density.
            fgColor="#000000" // Black foreground color for the QR blocks.
            bgColor="#ffffff" // White background color for the QR blocks.
          /> // End of QRCode component.
        </div> // End of the QR code wrapper.
        
        <div className="font-mono" style={{ marginTop: '2rem', color: '#00ff41', textAlign: 'center', letterSpacing: '0.2em', fontSize: '0.9rem' }}> // Status message indicating the machine is ready.
          WAITING FOR MOBILE APPARATUS... // Text that mimics a hardware terminal waiting for a connection.
        </div> // End of status message.
      </div> // End of the right column.
      
    </div> // End of the main page wrapper.
  ); // End of the return statement.
} // End of the Home function.
