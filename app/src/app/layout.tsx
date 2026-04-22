import type { Metadata } from 'next'; // Imports the Metadata type for SEO and browser tab configuration.
import './globals.css'; // Imports the project-wide CSS file for global styling and font variables.

export const metadata: Metadata = { // Defines the page metadata for SEO and tab labels.
  title: 'YieldStation | Hardware Node', // Sets the browser tab title for the kiosk interface.
  description: 'Proximity-Triggered Yield Engine', // Provides a brief summary for search engines and site crawlers.
}; // End of metadata object.

export default function RootLayout({ // Defines the root layout component that wraps every page in the app.
  children, // Destructures the "children" prop, which represents the content of individual pages.
}: { // TypeScript type definition for the props.
  children: React.ReactNode; // Specifies that "children" can be any valid React element.
}) { // Start of the layout component function body.
  return ( // Returns the fundamental HTML shell for the entire web application.
    <html lang="en"> // Sets the primary language of the document to English for accessibility.
      <body style={{ backgroundColor: '#000', color: '#fff', margin: 0, overflow: 'hidden' }}> // Styles the body with a "brutalist" dark theme and prevents scrolling.
        <div className="container" style={{ maxWidth: '100vw', padding: '0 4rem' }}> // Wraps the entire visible viewport in a container with horizontal padding.
          <header className="header" style={{ borderBottom: '2px solid #333', padding: '1.5rem 0' }}> // Defines the top navigation bar with a distinct border.
            <div className="logo" style={{ color: '#fff', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>YIELDSTATION</div> // Displays the protocol name in a bold, high-contrast font.
            <div className="nav-right"> // Container for indicators on the right side of the header.
              <span className="font-mono" style={{ color: '#00ff41', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}> // A "status" badge using monospace font and high-visibility green.
                <span style={{ width: '8px', height: '8px', backgroundColor: '#00ff41', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #00ff41' }}></span> // A glowing green dot representing an active network connection.
                NODE ACTIVE // Text indicating the hardware kiosk is online and synced with the blockchain.
              </span> // End of status span.
            </div> // End of right nav container.
          </header> // End of the header section.
          <main style={{ minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}> // The central area where page content (like the QR code) is rendered.
            {children} // Injects the page-specific component (e.g., Home) into the layout.
          </main> // End of the main content area.
        </div> // End of the outer container.
      </body> // End of the body element.
    </html> // End of the html element.
  ); // End of the layout return statement.
} // End of the RootLayout function.
