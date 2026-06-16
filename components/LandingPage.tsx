'use client';

import { useEffect, useRef, useState } from 'react';

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useScramble(target: string, active: boolean) {
  const [display, setDisplay] = useState(target);
  useEffect(() => {
    if (!active) return;
    const chars = '0123456789';
    let frame = 0;
    const total = 22;
    const id = setInterval(() => {
      frame++;
      if (frame >= total) { setDisplay(target); clearInterval(id); return; }
      setDisplay(
        target.split('').map((c, i) => {
          if (frame / total > (i / target.length) + 0.4) return c;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
    }, 55);
    return () => clearInterval(id);
  }, [active, target]);
  return display;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TASKS = [
  { n: '01', label: 'Morning Workout', detail: '45 min · any format' },
  { n: '02', label: 'Outdoor Workout', detail: '45 min · outside only' },
  { n: '03', label: 'Follow Your Diet', detail: 'zero cheat meals' },
  { n: '04', label: 'Drink Your Water', detail: 'one gallon daily' },
  { n: '05', label: 'Read Ten Pages', detail: 'non-fiction' },
  { n: '06', label: 'Zero Alcohol', detail: 'no exceptions' },
];

const FEATURES: Array<{
  tag: string; title: string; body: string;
  wide: boolean; borderRight: boolean; borderBottom: boolean;
}> = [
  {
    tag: 'HYDRATION',
    title: 'Smart Water Logging',
    body: 'Tap to log. Visual goal progress. Instant feedback on every sip. Never miss your daily intake again.',
    wide: false, borderRight: true, borderBottom: true,
  },
  {
    tag: 'NUTRITION',
    title: 'AI Meal Scanner',
    body: 'Point your camera at any meal. Instant nutrition breakdown. No manual logging, no estimates.',
    wide: false, borderRight: false, borderBottom: true,
  },
  {
    tag: 'TRANSFORMATION',
    title: 'Progress Photography',
    body: 'Date-stamped progress photos stored securely in the app. Your visual proof of every day you showed up.',
    wide: true, borderRight: false, borderBottom: true,
  },
  {
    tag: 'REFLECTION',
    title: 'Daily Journal',
    body: 'One entry per day. Write what matters. Build the discipline of reflection alongside the discipline of action.',
    wide: false, borderRight: true, borderBottom: false,
  },
  {
    tag: 'ACCOUNTABILITY',
    title: 'Friends & Challenges',
    body: 'Challenge friends, see their daily progress. Shared accountability is the sharpest motivator.',
    wide: false, borderRight: false, borderBottom: false,
  },
];

const CHALLENGES = [
  { name: '75 HARD', desc: 'The original. No modifications. No mercy.' },
  { name: '75 SOFT', desc: 'A challenging but forgiving start.' },
  { name: '1% BETTER', desc: 'Compound improvement, tracked daily.' },
  { name: 'CUSTOM', desc: 'Your rules. Your tasks. Your hard.' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function Btn({ href, primary, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-manrope)',
        fontWeight: 600,
        fontSize: 14,
        textDecoration: 'none',
        padding: '13px 26px',
        borderRadius: 100,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        letterSpacing: '-0.01em',
        border: '1px solid var(--foreground)',
        transition: 'background-color 0.22s ease, color 0.22s ease',
        backgroundColor: primary
          ? (hovered ? 'transparent' : 'var(--foreground)')
          : (hovered ? 'var(--foreground)' : 'transparent'),
        color: primary
          ? (hovered ? 'var(--foreground)' : 'var(--background)')
          : (hovered ? 'var(--background)' : 'var(--foreground)'),
      }}
    >
      {children}
    </a>
  );
}

function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function FeatureCell({ tag, title, body, wide, borderRight, borderBottom, delay }: typeof FEATURES[0] & { delay: number }) {
  const { ref, visible } = useReveal(0.08);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: wide ? 'span 2' : 'span 1',
        backgroundColor: hovered ? 'var(--card)' : 'var(--background)',
        padding: 'clamp(32px, 5vw, 52px)',
        borderRight: borderRight ? '1px solid var(--border)' : undefined,
        borderBottom: borderBottom ? '1px solid var(--border)' : undefined,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms, background-color 0.2s ease`,
        cursor: 'default',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-manrope)',
        fontWeight: 500,
        fontSize: 10,
        letterSpacing: '0.28em',
        color: 'var(--dim)',
        marginBottom: 20,
      }}>
        {tag}
      </p>
      <h3 style={{
        fontFamily: 'var(--font-bricolage)',
        fontWeight: 700,
        fontSize: wide ? 'clamp(22px, 3vw, 36px)' : 'clamp(18px, 2.5vw, 24px)',
        letterSpacing: '-0.025em',
        lineHeight: 1.1,
        color: 'var(--foreground)',
        marginBottom: 14,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 0.3s ease',
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-manrope)',
        fontWeight: 400,
        fontSize: 14,
        lineHeight: 1.7,
        color: 'var(--dim)',
        maxWidth: wide ? 540 : 280,
      }}>
        {body}
      </p>
    </div>
  );
}

function ChallengeCard({ name, desc, delay }: typeof CHALLENGES[0] & { delay: number }) {
  const { ref, visible } = useReveal(0.08);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '36px 32px',
        borderRight: '1px solid var(--border)',
        backgroundColor: hovered ? 'var(--foreground)' : 'var(--background)',
        transition: `background-color 0.25s ease, opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        cursor: 'default',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-bricolage)',
        fontWeight: 800,
        fontSize: 'clamp(16px, 2vw, 22px)',
        letterSpacing: '-0.02em',
        color: hovered ? 'var(--background)' : 'var(--foreground)',
        marginBottom: 10,
        transition: 'color 0.25s ease',
      }}>
        {name}
      </p>
      <p style={{
        fontFamily: 'var(--font-manrope)',
        fontWeight: 400,
        fontSize: 13,
        lineHeight: 1.6,
        color: hovered ? 'rgba(250,250,250,0.65)' : 'var(--dim)',
        transition: 'color 0.25s ease',
      }}>
        {desc}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LandingPage({ authed }: { authed: boolean }) {
  const [heroVisible, setHeroVisible] = useState(false);
  const scrambled = useScramble('75', heroVisible);

  const { ref: checkRef, visible: checkVisible } = useReveal(0.15);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!checkVisible) return;
    TASKS.forEach((_, i) => {
      setTimeout(() => setCheckedItems(prev => new Set([...prev, i])), 500 + i * 420);
    });
  }, [checkVisible]);

  const fade = (delay: number): React.CSSProperties => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
  });

  return (
    <div style={{ fontFamily: 'var(--font-manrope)', overflowX: 'hidden' }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
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
          <span style={{
            fontFamily: 'var(--font-bricolage)', fontWeight: 800,
            fontSize: 16, letterSpacing: '-0.02em', color: 'var(--foreground)',
          }}>
            HARDPACT
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <NavLink href="/signin">{authed ? 'Dashboard' : 'Sign in'}</NavLink>
            <Btn href="/signup" primary>{authed ? 'Open app →' : 'Get started →'}</Btn>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{
        paddingTop: 'calc(56px + clamp(64px, 10vw, 120px))',
        paddingBottom: 'clamp(64px, 10vw, 120px)',
        paddingLeft: 'clamp(20px, 5vw, 40px)',
        paddingRight: 'clamp(20px, 5vw, 40px)',
        maxWidth: 1200, margin: '0 auto',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Giant background "75" */}
        <div aria-hidden style={{
          position: 'absolute', top: 20, right: -20,
          fontFamily: 'var(--font-bricolage)', fontWeight: 800,
          fontSize: 'clamp(180px, 28vw, 420px)', lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px var(--border)',
          userSelect: 'none', pointerEvents: 'none',
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateX(0)' : 'translateX(40px)',
          transition: 'opacity 1.3s ease 0.1s, transform 1.3s ease 0.1s',
        }}>
          {scrambled}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'var(--font-manrope)', fontWeight: 500,
            fontSize: 11, letterSpacing: '0.3em', color: 'var(--dim)',
            marginBottom: 28, ...fade(80),
          }}>
            75 / HARD TRACKER
          </p>

          <h1 style={{
            fontFamily: 'var(--font-bricolage)', fontWeight: 800,
            fontSize: 'clamp(52px, 9vw, 120px)',
            lineHeight: 1.01, letterSpacing: '-0.04em',
            color: 'var(--foreground)',
            marginBottom: 32, maxWidth: 760,
            ...fade(160),
          }}>
            Build the person<br />
            you meant<br />
            to become.
          </h1>

          <p style={{
            fontFamily: 'var(--font-manrope)', fontWeight: 400,
            fontSize: 18, lineHeight: 1.65, color: 'var(--dim)',
            marginBottom: 52, maxWidth: 400,
            ...fade(280),
          }}>
            Six tasks. Every day. No excuses.<br />
            Hardpact keeps you honest.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', ...fade(380) }}>
            <Btn href="#" primary>Download for iOS</Btn>
            <Btn href="#">Android</Btn>
          </div>
        </div>
      </section>

      {/* ── TICKER ──────────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden', padding: '14px 0' }}>
        <div style={{ display: 'flex', gap: 48, animation: 'ticker 20s linear infinite', whiteSpace: 'nowrap' }}>
          {['Daily Tasks', 'Water Logging', 'AI Meal Scanner', 'Progress Photos', 'Daily Journal', 'Friends', 'Challenge History', 'Custom Challenges',
            'Daily Tasks', 'Water Logging', 'AI Meal Scanner', 'Progress Photos', 'Daily Journal', 'Friends', 'Challenge History', 'Custom Challenges'].map((item, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-manrope)', fontWeight: 500,
              fontSize: 12, letterSpacing: '0.2em', color: 'var(--dim)',
            }}>
              {item} <span style={{ opacity: 0.3 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── THE DAILY SIX ───────────────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(64px, 10vw, 120px) clamp(20px, 5vw, 40px)',
        maxWidth: 1200, margin: '0 auto',
      }}>
        <Reveal style={{ marginBottom: 64 }}>
          <p style={{
            fontFamily: 'var(--font-manrope)', fontWeight: 500,
            fontSize: 11, letterSpacing: '0.3em', color: 'var(--dim)', marginBottom: 16,
          }}>
            THE DAILY SIX
          </p>
          <h2 style={{
            fontFamily: 'var(--font-bricolage)', fontWeight: 800,
            fontSize: 'clamp(36px, 5.5vw, 72px)',
            lineHeight: 1.02, letterSpacing: '-0.035em',
            color: 'var(--foreground)', maxWidth: 520,
          }}>
            Six non-negotiables. Zero excuses.
          </h2>
        </Reveal>

        <div ref={checkRef} style={{ borderTop: '1px solid var(--border)' }}>
          {TASKS.map((task, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 'clamp(14px, 3vw, 28px)',
              padding: 'clamp(16px, 2.5vw, 22px) 0',
              borderBottom: '1px solid var(--border)',
              opacity: checkVisible ? 1 : 0,
              transform: checkVisible ? 'translateX(0)' : 'translateX(-16px)',
              transition: `opacity 0.55s ease ${i * 70}ms, transform 0.55s ease ${i * 70}ms`,
            }}>
              <span style={{
                fontFamily: 'var(--font-bricolage)', fontWeight: 500,
                fontSize: 11, letterSpacing: '0.1em', color: 'var(--dim)',
                width: 24, flexShrink: 0,
              }}>
                {task.n}
              </span>

              <div style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                border: checkedItems.has(i) ? '2px solid var(--foreground)' : '1.5px solid var(--border)',
                backgroundColor: checkedItems.has(i) ? 'var(--foreground)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
                {checkedItems.has(i) && (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M2 5.5L4.5 8L9 3" stroke="var(--background)"
                      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                      style={{ animation: 'checkDraw 0.3s ease forwards' }}
                    />
                  </svg>
                )}
              </div>

              <span style={{
                fontFamily: 'var(--font-bricolage)', fontWeight: 700,
                fontSize: 'clamp(18px, 2.8vw, 28px)',
                letterSpacing: '-0.025em', flex: 1,
                color: checkedItems.has(i) ? 'var(--dim)' : 'var(--foreground)',
                textDecoration: checkedItems.has(i) ? 'line-through' : 'none',
                transition: 'color 0.35s ease',
              }}>
                {task.label}
              </span>

              <span className="task-detail" style={{
                fontFamily: 'var(--font-manrope)', fontWeight: 400,
                fontSize: 13, color: 'var(--dim)', letterSpacing: '0.01em',
                flexShrink: 0,
              }}>
                {task.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <Reveal delay={200} style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 560 }}>
            {Array.from({ length: 75 }).map((_, i) => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: 2,
                backgroundColor: i < 12 ? 'var(--foreground)' : 'var(--border)',
              }} />
            ))}
          </div>
          <p style={{
            marginTop: 12, fontFamily: 'var(--font-manrope)',
            fontSize: 12, color: 'var(--dim)', letterSpacing: '0.08em',
          }}>
            DAY 12 OF 75
          </p>
        </Reveal>
      </section>

      {/* ── FEATURES BENTO ──────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--border)' }} />
      <section style={{
        padding: 'clamp(64px, 10vw, 120px) clamp(20px, 5vw, 40px)',
        maxWidth: 1200, margin: '0 auto',
      }}>
        <Reveal style={{ marginBottom: 64 }}>
          <p style={{
            fontFamily: 'var(--font-manrope)', fontWeight: 500,
            fontSize: 11, letterSpacing: '0.3em', color: 'var(--dim)', marginBottom: 16,
          }}>
            BUILT FOR DISCIPLINE
          </p>
          <h2 style={{
            fontFamily: 'var(--font-bricolage)', fontWeight: 800,
            fontSize: 'clamp(36px, 5.5vw, 72px)',
            lineHeight: 1.02, letterSpacing: '-0.035em',
            color: 'var(--foreground)',
          }}>
            Everything you need.<br />Nothing you don't.
          </h2>
        </Reveal>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          border: '1px solid var(--border)',
        }}>
          {FEATURES.map((f, i) => (
            <FeatureCell key={i} {...f} delay={i * 70} />
          ))}
        </div>
      </section>

      {/* ── CHALLENGE TYPES ─────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--border)' }} />
      <section style={{
        padding: 'clamp(64px, 10vw, 120px) clamp(20px, 5vw, 40px)',
        maxWidth: 1200, margin: '0 auto',
      }}>
        <Reveal style={{ marginBottom: 64 }}>
          <p style={{
            fontFamily: 'var(--font-manrope)', fontWeight: 500,
            fontSize: 11, letterSpacing: '0.3em', color: 'var(--dim)', marginBottom: 16,
          }}>
            CHALLENGE FORMATS
          </p>
          <h2 style={{
            fontFamily: 'var(--font-bricolage)', fontWeight: 800,
            fontSize: 'clamp(36px, 5.5vw, 72px)',
            lineHeight: 1.02, letterSpacing: '-0.035em',
            color: 'var(--foreground)',
          }}>
            Pick your hard.
          </h2>
        </Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          border: '1px solid var(--border)',
          borderRight: 'none',
        }}>
          {CHALLENGES.map((c, i) => (
            <ChallengeCard key={i} {...c} delay={i * 70} />
          ))}
        </div>
      </section>

      {/* ── ACCOUNTABILITY STRIP ────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: 'clamp(48px, 8vw, 96px) clamp(20px, 5vw, 40px)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center',
        }}>
          <Reveal>
            <p style={{
              fontFamily: 'var(--font-manrope)', fontWeight: 500,
              fontSize: 11, letterSpacing: '0.3em', color: 'var(--dim)', marginBottom: 16,
            }}>
              SOCIAL ACCOUNTABILITY
            </p>
            <h2 style={{
              fontFamily: 'var(--font-bricolage)', fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 52px)',
              lineHeight: 1.06, letterSpacing: '-0.03em',
              color: 'var(--foreground)', marginBottom: 20,
            }}>
              Harder together.
            </h2>
            <p style={{
              fontFamily: 'var(--font-manrope)', fontWeight: 400,
              fontSize: 16, lineHeight: 1.7, color: 'var(--dim)',
            }}>
              Challenge friends, see who checked in today, and hold each other to the standard. Accountability doesn&apos;t get sharper than this.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div style={{
              border: '1px solid var(--border)',
              borderRadius: 12, overflow: 'hidden',
            }}>
              {[
                { name: 'You', day: 12, done: 6, total: 6 },
                { name: 'Marcus', day: 12, done: 5, total: 6 },
                { name: 'Elena', day: 11, done: 6, total: 6 },
                { name: 'James', day: 9, done: 3, total: 6 },
              ].map((friend, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 20px',
                  borderBottom: i < 3 ? '1px solid var(--border)' : undefined,
                  backgroundColor: i === 0 ? 'var(--card)' : 'var(--background)',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    border: '1px solid var(--border)',
                    backgroundColor: i === 0 ? 'var(--foreground)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-bricolage)', fontWeight: 700,
                      fontSize: 12,
                      color: i === 0 ? 'var(--background)' : 'var(--dim)',
                    }}>
                      {friend.name[0]}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: 'var(--font-bricolage)', fontWeight: 700,
                      fontSize: 14, letterSpacing: '-0.01em', color: 'var(--foreground)',
                      marginBottom: 2,
                    }}>
                      {friend.name}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-manrope)', fontSize: 11, color: 'var(--dim)',
                    }}>
                      Day {friend.day}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: friend.total }).map((_, j) => (
                      <div key={j} style={{
                        width: 7, height: 7, borderRadius: 2,
                        backgroundColor: j < friend.done ? 'var(--foreground)' : 'var(--border)',
                      }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── DOWNLOAD CTA ────────────────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 5vw, 40px)',
        maxWidth: 1200, margin: '0 auto', textAlign: 'center',
      }}>
        <Reveal>
          <p style={{
            fontFamily: 'var(--font-manrope)', fontWeight: 500,
            fontSize: 11, letterSpacing: '0.3em', color: 'var(--dim)',
            marginBottom: 24,
          }}>
            START TODAY
          </p>
          <h2 style={{
            fontFamily: 'var(--font-bricolage)', fontWeight: 800,
            fontSize: 'clamp(52px, 9vw, 120px)',
            lineHeight: 1.01, letterSpacing: '-0.04em',
            color: 'var(--foreground)', marginBottom: 52,
          }}>
            Download<br />Hardpact.
          </h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn href="#" primary>Download for iOS</Btn>
            <Btn href="#">Android</Btn>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px clamp(20px, 5vw, 40px)' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 16,
        }}>
          <span style={{
            fontFamily: 'var(--font-bricolage)', fontWeight: 800,
            fontSize: 14, letterSpacing: '-0.02em', color: 'var(--foreground)',
          }}>
            HARDPACT
          </span>
          <p style={{ fontFamily: 'var(--font-manrope)', fontSize: 12, color: 'var(--dim)' }}>
            © {new Date().getFullYear()} Hardpact. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Support'].map(label => (
              <a key={label} href={`/${label.toLowerCase()}`} style={{
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

      {/* ── Global styles ───────────────────────────────────────────────── */}
      <style>{`
        @keyframes checkDraw {
          from { stroke-dasharray: 14; stroke-dashoffset: 14; }
          to   { stroke-dasharray: 14; stroke-dashoffset: 0; }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (max-width: 640px) {
          .task-detail { display: none; }
        }
        @media (max-width: 768px) {
          .feature-grid { grid-template-columns: 1fr !important; }
          .challenge-grid { grid-template-columns: 1fr 1fr !important; }
          .accountability-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
