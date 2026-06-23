'use client';

import { useState } from 'react';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-manrope)',
        fontWeight: 500,
        fontSize: 13,
        color: 'var(--dim)',
        textDecoration: 'none',
        position: 'relative',
        paddingBottom: 2,
        transition: 'color 0.2s ease',
      }}
    >
      {children}
      <span style={{
        position: 'absolute',
        bottom: 0, left: 0,
        height: '1px',
        width: hovered ? '100%' : '0%',
        backgroundColor: 'var(--foreground)',
        transition: 'width 0.25s ease',
        display: 'block',
      }} />
    </a>
  );
}

interface Section {
  title: string;
  body: string;
}

interface LegalPageProps {
  label: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
}

function renderBody(text: string) {
  return text.split('\n\n').map((para, i) => {
    const parts = para.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} style={{
        fontFamily: 'var(--font-manrope)',
        fontWeight: 400,
        fontSize: 15,
        lineHeight: 1.8,
        color: 'var(--dim)',
        marginBottom: 16,
      }}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={j} style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part.split('\n').map((line, k, arr) => (
            <span key={k}>
              {line}
              {k < arr.length - 1 && <br />}
            </span>
          ));
        })}
      </p>
    );
  });
}

export default function LegalPage({ label, title, subtitle, lastUpdated, sections }: LegalPageProps) {
  return (
    <div style={{ fontFamily: 'var(--font-manrope)', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--background)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 5vw, 40px)',
          height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <a href="/" style={{
            fontFamily: 'var(--font-bricolage)', fontWeight: 800,
            fontSize: 16, letterSpacing: '-0.02em', color: 'var(--foreground)',
            textDecoration: 'none',
          }}>
            HARDPACT
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <NavLink href="/privacy">Privacy</NavLink>
            <NavLink href="/terms">Terms</NavLink>
            <NavLink href="/subscription">Subscription</NavLink>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        paddingTop: 'calc(56px + clamp(56px, 8vw, 100px))',
        paddingBottom: 'clamp(48px, 7vw, 80px)',
        paddingLeft: 'clamp(20px, 5vw, 40px)',
        paddingRight: 'clamp(20px, 5vw, 40px)',
        maxWidth: 1200, margin: '0 auto',
        borderBottom: '1px solid var(--border)',
      }}>
        <p style={{
          fontFamily: 'var(--font-manrope)', fontWeight: 500,
          fontSize: 11, letterSpacing: '0.3em', color: 'var(--dim)',
          marginBottom: 20,
        }}>
          {label}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-bricolage)', fontWeight: 800,
          fontSize: 'clamp(40px, 7vw, 88px)',
          lineHeight: 1.02, letterSpacing: '-0.04em',
          color: 'var(--foreground)',
          marginBottom: 20, maxWidth: 760,
        }}>
          {title}
        </h1>
        <p style={{
          fontFamily: 'var(--font-manrope)', fontWeight: 400,
          fontSize: 16, lineHeight: 1.65, color: 'var(--dim)',
          maxWidth: 560, marginBottom: 32,
        }}>
          {subtitle}
        </p>
        <p style={{
          fontFamily: 'var(--font-manrope)', fontWeight: 500,
          fontSize: 12, letterSpacing: '0.1em', color: 'var(--dim)',
          opacity: 0.7,
        }}>
          LAST UPDATED: {lastUpdated.toUpperCase()}
        </p>
      </section>

      {/* CONTENT */}
      <main style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(48px, 7vw, 80px) clamp(20px, 5vw, 40px)',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 680px)',
        justifyContent: 'center',
      }}>
        {sections.map((section, i) => (
          <div key={i} style={{
            paddingBottom: 48,
            marginBottom: 48,
            borderBottom: i < sections.length - 1 ? '1px solid var(--border)' : undefined,
          }}>
            <h2 style={{
              fontFamily: 'var(--font-bricolage)', fontWeight: 700,
              fontSize: 'clamp(18px, 2.5vw, 22px)',
              letterSpacing: '-0.02em', lineHeight: 1.2,
              color: 'var(--foreground)',
              marginBottom: 20,
            }}>
              {section.title}
            </h2>
            {renderBody(section.body)}
          </div>
        ))}
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px clamp(20px, 5vw, 40px)' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 16,
        }}>
          <a href="/" style={{
            fontFamily: 'var(--font-bricolage)', fontWeight: 800,
            fontSize: 14, letterSpacing: '-0.02em', color: 'var(--foreground)',
            textDecoration: 'none',
          }}>
            HARDPACT
          </a>
          <p style={{ fontFamily: 'var(--font-manrope)', fontSize: 12, color: 'var(--dim)' }}>
            © {new Date().getFullYear()} Hardpact. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Subscription', href: '/subscription' },
              { label: 'Support', href: '/support' },
            ].map(({ label, href }) => (
              <a key={label} href={href} style={{
                fontFamily: 'var(--font-manrope)', fontWeight: 400,
                fontSize: 13, color: 'var(--dim)', textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--foreground)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--dim)')}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
