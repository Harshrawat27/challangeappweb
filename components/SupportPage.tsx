'use client';

import { useState } from 'react';

// ─── Nav ──────────────────────────────────────────────────────────────────────

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-manrope)', fontWeight: 500,
        fontSize: 13, color: 'var(--dim)', textDecoration: 'none',
        position: 'relative', paddingBottom: 2, transition: 'color 0.2s ease',
      }}
    >
      {children}
      <span style={{
        position: 'absolute', bottom: 0, left: 0, height: '1px',
        width: hovered ? '100%' : '0%', backgroundColor: 'var(--foreground)',
        transition: 'width 0.25s ease', display: 'block',
      }} />
    </a>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Is there a free trial?',
    a: 'No. Hardpact is a fully paid app with no free tier and no free trial. Every feature — task tracking, water logging, progress photos, journals, AI meal scanner, and social challenges — requires an active subscription. You can view all pricing on our subscription page before purchasing.',
  },
  {
    q: 'What plans are available and how much do they cost?',
    a: 'We offer three plans: Weekly at $5.99/week, Monthly at $12.99/month, and Yearly at $39.99/year. All plans give you full access to every feature. The yearly plan works out to under $0.80/week — the best value if you\'re committing to a full challenge.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'Subscriptions are managed by Apple (App Store). To cancel: open the Settings app on your iPhone → tap your name → Subscriptions → Hardpact → Cancel Subscription. Cancellation stops future charges immediately. You keep full access until the end of your current billing period.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Refunds are handled by Apple, not Hardpact directly. To request one, visit reportaproblem.apple.com, find your Hardpact purchase, and submit a refund request. Apple\'s team will review and respond. We have no control over their decision, but if you\'re having trouble, email us at hello@hardpact.com and we\'ll do our best to help.',
  },
  {
    q: 'What happens if I miss a day on my challenge?',
    a: 'The 75 Hard rules are clear: miss a day and you start over from Day 1. Hardpact enforces this — if you don\'t complete all your tasks for the day, your streak resets. This is by design. The challenge is about building real discipline, and that only works if there are real consequences.',
  },
  {
    q: 'What is 75 Hard?',
    a: '75 Hard is a mental toughness program created by Andy Frisella. It requires completing six daily tasks for 75 consecutive days with zero exceptions: two 45-minute workouts (one must be outdoors), follow a diet with no cheat meals or alcohol, drink one gallon of water, and read 10 pages of a non-fiction book. Miss any task and you start over.',
  },
  {
    q: 'What challenges does Hardpact support?',
    a: 'Hardpact supports 75 Hard (the original, no modifications), 75 Medium (a more forgiving version), 75 Soft (a solid entry point), and Custom (you set your own tasks and duration). You can switch challenges at any time from your Profile screen.',
  },
  {
    q: 'Can I add my own daily habits?',
    a: 'Yes. On top of your challenge\'s built-in tasks, you can add custom daily habits during onboarding or by changing your challenge in the Profile screen. Custom habits are tracked alongside your standard tasks each day.',
  },
  {
    q: 'How does the friends and accountability feature work?',
    a: 'You can connect with friends inside the app using their Hardpact username. Once connected, you can see their daily check-in status — which tasks they\'ve completed for the day. They can see yours too. No private journal entries or progress photos are shared — only your daily task completion.',
  },
  {
    q: 'Can I use Hardpact on multiple devices?',
    a: 'Yes. Sign in with the same account on any device and your data — challenge progress, journal entries, water logs, and progress photos — will sync automatically. Your subscription is tied to your Apple ID, so it\'s recognized across devices as long as you\'re signed into the same App Store account.',
  },
  {
    q: 'How do I change my challenge duration?',
    a: 'Go to Profile → Change Challenge. You can adjust the duration or switch to a different challenge type. Note that starting a new challenge resets your progress — your history from previous challenges is saved under Challenge History.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Go to Profile → scroll to the bottom → Delete Account. This permanently deletes your account and all associated data including challenge history, journal entries, and progress photos. This cannot be undone. Make sure you also cancel your subscription separately through Apple to avoid future charges.',
  },
  {
    q: 'I forgot my password. How do I sign in?',
    a: 'On the sign-in screen, tap "Forgot password?" and enter your email address. You\'ll receive a password reset link. If you signed up with Apple Sign-In, you don\'t have a password — just use "Continue with Apple" on the sign-in screen.',
  },
  {
    q: 'The app is crashing or behaving unexpectedly. What should I do?',
    a: 'First, try force-closing the app and reopening it. If the issue persists, make sure you\'re on the latest version — open the App Store, search Hardpact, and update if available. If it still doesn\'t work, email us at hello@hardpact.com with a description of what happened and what device and iOS version you\'re on. We\'ll get back to you quickly.',
  },
  {
    q: 'Is my data private and secure?',
    a: 'Yes. Your journal entries, progress photos, and challenge data are stored securely and are only visible to you. The only information shared with connected friends is your daily task completion status. We do not sell your data. For full details, read our Privacy Policy.',
  },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a, isLast }: { q: string; a: string; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 16, padding: '22px 0', background: 'none', border: 'none',
          cursor: 'pointer',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-bricolage)', fontWeight: 700,
          fontSize: 'clamp(15px, 2vw, 17px)', letterSpacing: '-0.02em',
          color: 'var(--foreground)', lineHeight: 1.3,
        }}>
          {q}
        </span>
        <span style={{
          fontFamily: 'var(--font-manrope)', fontWeight: 400,
          fontSize: 22, color: 'var(--dim)', flexShrink: 0,
          lineHeight: 1, marginTop: 2,
          transition: 'transform 0.25s ease',
          display: 'inline-block',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          +
        </span>
      </button>
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? 400 : 0,
        transition: 'max-height 0.32s ease',
      }}>
        <p style={{
          fontFamily: 'var(--font-manrope)', fontWeight: 400,
          fontSize: 15, lineHeight: 1.8, color: 'var(--dim)',
          paddingBottom: 22,
        }}>
          {a}
        </p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SupportPage() {
  return (
    <div style={{ fontFamily: 'var(--font-manrope)', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--background)', backdropFilter: 'blur(12px)',
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
            <NavLink href="/support">Support</NavLink>
            <NavLink href="/privacy">Privacy</NavLink>
            <NavLink href="/terms">Terms</NavLink>
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
          fontSize: 11, letterSpacing: '0.3em', color: 'var(--dim)', marginBottom: 20,
        }}>
          SUPPORT
        </p>
        <h1 style={{
          fontFamily: 'var(--font-bricolage)', fontWeight: 800,
          fontSize: 'clamp(40px, 7vw, 88px)',
          lineHeight: 1.02, letterSpacing: '-0.04em',
          color: 'var(--foreground)', marginBottom: 20, maxWidth: 720,
        }}>
          We&apos;re here to help.
        </h1>
        <p style={{
          fontFamily: 'var(--font-manrope)', fontWeight: 400,
          fontSize: 16, lineHeight: 1.65, color: 'var(--dim)',
          maxWidth: 480, marginBottom: 40,
        }}>
          Browse the FAQs below or reach out directly. We typically reply within one business day.
        </p>

        {/* Contact card */}
        <a
          href="mailto:hello@hardpact.com"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 14,
            padding: '18px 24px',
            border: '1px solid var(--border)',
            borderRadius: 12,
            textDecoration: 'none',
            transition: 'background-color 0.2s ease',
            backgroundColor: 'var(--card)',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--foreground)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--card)')}
          onMouseEnterCapture={undefined}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--dim)' }}>
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div>
            <p style={{
              fontFamily: 'var(--font-bricolage)', fontWeight: 700,
              fontSize: 15, letterSpacing: '-0.01em', color: 'var(--foreground)',
              marginBottom: 2,
            }}>
              Email support
            </p>
            <p style={{
              fontFamily: 'var(--font-manrope)', fontWeight: 400,
              fontSize: 13, color: 'var(--dim)',
            }}>
              hello@hardpact.com
            </p>
          </div>
        </a>
      </section>

      {/* FAQ */}
      <section style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(48px, 7vw, 80px) clamp(20px, 5vw, 40px)',
        display: 'grid', gridTemplateColumns: 'minmax(0, 760px)',
        justifyContent: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-manrope)', fontWeight: 500,
          fontSize: 11, letterSpacing: '0.3em', color: 'var(--dim)',
          marginBottom: 12,
        }}>
          FREQUENTLY ASKED
        </p>
        <h2 style={{
          fontFamily: 'var(--font-bricolage)', fontWeight: 800,
          fontSize: 'clamp(28px, 4vw, 44px)',
          letterSpacing: '-0.035em', lineHeight: 1.08,
          color: 'var(--foreground)', marginBottom: 40,
        }}>
          Quick answers.
        </h2>

        <div style={{ borderTop: '1px solid var(--border)' }}>
          {FAQS.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} isLast={i === FAQS.length - 1} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: 64, padding: '40px',
          border: '1px solid var(--border)', borderRadius: 16,
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-manrope)', fontWeight: 500,
            fontSize: 11, letterSpacing: '0.3em', color: 'var(--dim)', marginBottom: 12,
          }}>
            STILL STUCK?
          </p>
          <h3 style={{
            fontFamily: 'var(--font-bricolage)', fontWeight: 800,
            fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.03em',
            color: 'var(--foreground)', marginBottom: 12,
          }}>
            Just email us.
          </h3>
          <p style={{
            fontFamily: 'var(--font-manrope)', fontWeight: 400,
            fontSize: 15, color: 'var(--dim)', lineHeight: 1.7, marginBottom: 24,
          }}>
            We read every message and respond within one business day.
          </p>
          <a
            href="mailto:hello@hardpact.com"
            style={{
              fontFamily: 'var(--font-manrope)', fontWeight: 600,
              fontSize: 14, textDecoration: 'none',
              padding: '13px 28px', borderRadius: 100,
              display: 'inline-block',
              border: '1px solid var(--foreground)',
              backgroundColor: 'var(--foreground)', color: 'var(--background)',
              transition: 'background-color 0.22s ease, color 0.22s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--foreground)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--foreground)';
              e.currentTarget.style.color = 'var(--background)';
            }}
          >
            hello@hardpact.com
          </a>
        </div>
      </section>

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
