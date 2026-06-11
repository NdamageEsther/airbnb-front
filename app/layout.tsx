import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Airbnb Clone',
  description: 'Find your next perfect place',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#fff' }}>

        {/* Navbar */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: '#fff', borderBottom: '1px solid #ebebeb',
          padding: '0 40px', height: '80px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#ff385c', fontSize: '32px' }}>⬡</span>
            <span style={{ color: '#ff385c', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.5px' }}>
              airbnb
            </span>
          </Link>

          {/* Center Search */}
          <div style={{
            border: '1px solid #ddd', borderRadius: '40px',
            padding: '8px 16px', display: 'flex', alignItems: 'center',
            gap: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer', fontSize: '14px', fontWeight: 500,
          }}>
            <span>Anywhere</span>
            <span style={{ borderLeft: '1px solid #ddd', paddingLeft: '8px' }}>Any week</span>
            <span style={{ borderLeft: '1px solid #ddd', paddingLeft: '8px', color: '#717171' }}>Add guests</span>
            <span style={{
              background: '#ff385c', borderRadius: '50%',
              width: '32px', height: '32px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px',
            }}>🔍</span>
          </div>

          {/* Right Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/listings" style={{
              textDecoration: 'none', color: '#222', fontSize: '14px',
              fontWeight: 500, padding: '8px 12px', borderRadius: '24px',
            }}>
              Airbnb your home
            </Link>
            <Link href="/login" style={{
              textDecoration: 'none',
              border: '1px solid #ddd', borderRadius: '24px',
              padding: '8px 16px', display: 'flex', alignItems: 'center',
              gap: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
            }}>
              <span style={{ fontSize: '18px' }}>☰</span>
              <span style={{
                background: '#717171', borderRadius: '50%',
                width: '32px', height: '32px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '16px',
              }}>👤</span>
            </Link>
          </div>
        </nav>

        <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 40px' }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid #ebebeb', padding: '24px 40px',
          background: '#f7f7f7', fontSize: '13px', color: '#717171',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>© 2026 Airbnb Clone. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="#" style={{ color: '#717171', textDecoration: 'none' }}>Privacy</Link>
            <Link href="#" style={{ color: '#717171', textDecoration: 'none' }}>Terms</Link>
            <Link href="#" style={{ color: '#717171', textDecoration: 'none' }}>Sitemap</Link>
          </div>
        </footer>

      </body>
    </html>
  );
}