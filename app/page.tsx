'use client'

import { useState, useEffect, useRef } from 'react'

interface FloatingHeart {
  id: number
  left: number
  delay: number
  size: number
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

function Section({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView()
  return (
    <section
      id={id}
      ref={ref as React.RefObject<HTMLElement>}
      className={`reveal-section ${inView ? 'in-view' : ''} ${className}`}
    >
      {children}
    </section>
  )
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [giftOpened, setGiftOpened] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [musicReady, setMusicReady] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const navItems = ['Home', 'Journey', 'Messages', 'Gallery', 'Reel', 'Gift']

  const videoMemories = [
    {
      id: 1,
      title: 'Class Memory Film',
      description: 'A short video of our shared moments, laughter, and growth together.',
      src: '/memories_Video.mp4',
      poster: '/class-photo-1.jpg',
    },
  ]

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100)

    const handleScroll = () => {
      const sections = ['home', 'journey', 'message', 'gallery', 'reel', 'messages', 'gift', 'closing']
      const scrollPosition = window.scrollY + window.innerHeight / 2
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.volume = volume
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  const handleGiftClick = () => {
    setGiftOpened(true)
    const hearts: FloatingHeart[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: i * 60,
      size: 1 + Math.random() * 1.5,
    }))
    setFloatingHearts(hearts)
    setTimeout(() => setFloatingHearts([]), 4000)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --gold: #C8A96E;
          --gold-light: #E8C98E;
          --cream: #FAF6F0;
          --ink: #1A1410;
          --ink-soft: #4A3F35;
          --rose: #C4736E;
          --sage: #7A9E8E;
          --card-bg: #FFFFFF;
          --border: rgba(200,169,110,0.25);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--ink);
          overflow-x: hidden;
        }

        /* Custom cursor glow */
        .cursor-glow {
          position: fixed;
          top: 0; left: 0;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,169,110,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          transform: translate(-50%, -50%);
          transition: transform 0.06s linear;
        }

        /* Noise texture overlay */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 9999;
          opacity: 0.4;
        }

        /* Heading font */
        h1, h2, h3, .serif { font-family: 'Cormorant Garamond', serif; }

        /* Scroll reveal */
        .reveal-section {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1);
        }
        .reveal-section.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        /* Nav */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(250,246,240,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          transition: all 0.4s ease;
        }
        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 2rem;
          height: 68px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo img { height: 48px; width: auto; }
        .nav-links { display: flex; gap: 2.5rem; }
        .nav-links a {
          font-size: 0.8rem; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--ink-soft); text-decoration: none;
          position: relative; padding-bottom: 2px;
          transition: color 0.3s;
        }
        .nav-links a::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0; height: 1px; background: var(--gold);
          transition: width 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-links a:hover, .nav-links a.active {
          color: var(--ink);
        }
        .nav-links a:hover::after, .nav-links a.active::after { width: 100%; }

        /* Hero */
        .hero {
          min-height: 100vh; position: relative;
          display: flex; align-items: center; justify-content: center;
          padding: 6rem 2rem 4rem;
          overflow: hidden;
        }
        .hero-bg-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(200,169,110,0.18);
          pointer-events: none;
        }
        .hero-bg-ring-1 { width: 600px; height: 600px; top: 50%; left: 50%; transform: translate(-50%,-50%); animation: slowRotate 40s linear infinite; }
        .hero-bg-ring-2 { width: 900px; height: 900px; top: 50%; left: 50%; transform: translate(-50%,-50%); animation: slowRotate 70s linear infinite reverse; }
        .hero-bg-ring-3 { width: 1200px; height: 1200px; top: 50%; left: 50%; transform: translate(-50%,-50%); animation: slowRotate 100s linear infinite; }

        @keyframes slowRotate {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to { transform: translate(-50%,-50%) rotate(360deg); }
        }

        .hero-inner {
          position: relative; z-index: 2;
          text-align: center; max-width: 860px;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 0.75rem;
          font-size: 0.72rem; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--gold); font-weight: 600; margin-bottom: 2rem;
          opacity: 0; animation: fadeUp 0.9s 0.3s forwards;
        }
        .hero-eyebrow-line { width: 36px; height: 1px; background: var(--gold); }
        .hero-title {
          font-size: clamp(3.2rem, 8vw, 7rem); line-height: 1.05;
          font-weight: 700; margin-bottom: 1.75rem;
          opacity: 0; animation: fadeUp 1s 0.5s forwards;
        }
        .hero-title em {
          font-style: italic; color: var(--gold);
          background: linear-gradient(135deg, var(--gold), var(--rose), var(--gold-light));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: 1.15rem; color: var(--ink-soft); line-height: 1.7;
          max-width: 520px; margin: 0 auto 3rem;
          opacity: 0; animation: fadeUp 1s 0.7s forwards;
        }
        .hero-ctas {
          display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
          opacity: 0; animation: fadeUp 1s 0.9s forwards;
        }
        .btn-primary {
          padding: 0.9rem 2.2rem; border-radius: 100px;
          background: var(--gold); color: #fff;
          font-size: 0.85rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration: none; border: none; cursor: pointer;
          transition: transform 0.25s, box-shadow 0.25s, background 0.25s;
          box-shadow: 0 4px 20px rgba(200,169,110,0.4);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(200,169,110,0.5); background: #b8965a; }
        .btn-outline {
          padding: 0.9rem 2.2rem; border-radius: 100px;
          background: transparent; color: var(--ink);
          font-size: 0.85rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration: none; border: 1.5px solid rgba(26,20,16,0.2); cursor: pointer;
          transition: border-color 0.25s, transform 0.25s, background 0.25s;
        }
        .btn-outline:hover { border-color: var(--gold); background: rgba(200,169,110,0.07); transform: translateY(-2px); }
        .scroll-indicator {
          position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          opacity: 0; animation: fadeIn 1s 1.5s forwards;
        }
        .scroll-indicator span { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); }
        .scroll-line {
          width: 1px; height: 48px;
          background: linear-gradient(to bottom, var(--gold), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.1); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Divider */
        .ornament {
          display: flex; align-items: center; justify-content: center; gap: 1rem;
          margin: 0 auto 4rem;
        }
        .ornament-line { flex: 1; max-width: 100px; height: 1px; background: linear-gradient(to right, transparent, var(--gold)); }
        .ornament-line.rev { background: linear-gradient(to left, transparent, var(--gold)); }
        .ornament-diamond {
          width: 8px; height: 8px; background: var(--gold);
          transform: rotate(45deg); flex-shrink: 0;
        }

        /* Section title */
        .section-eyebrow {
          font-size: 0.68rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--gold); font-weight: 600; margin-bottom: 0.75rem; display: block;
        }
        .section-title {
          font-size: clamp(2.2rem, 5vw, 4rem); line-height: 1.1;
          margin-bottom: 1.25rem; color: var(--ink);
        }
        .section-sub { font-size: 1.05rem; color: var(--ink-soft); line-height: 1.7; max-width: 500px; margin: 0 auto; }

        /* Journey cards */
        .journey { padding: 8rem 2rem; background: var(--ink); position: relative; overflow: hidden; }
        .journey::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 20% 50%, rgba(200,169,110,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 50%, rgba(196,115,110,0.06) 0%, transparent 60%);
        }
        .journey .section-eyebrow, .journey .section-title { color: var(--gold); }
        .journey .section-sub { color: rgba(255,255,255,0.6); }
        .journey-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5px; margin-top: 4rem; }
        .journey-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(200,169,110,0.15);
          padding: 2.5rem;
          position: relative; overflow: hidden;
          transition: background 0.4s, transform 0.4s;
          cursor: pointer;
        }
        .journey-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(200,169,110,0.12) 0%, transparent 100%);
          opacity: 0; transition: opacity 0.4s;
        }
        .journey-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-4px); }
        .journey-card:hover::before { opacity: 1; }
        .journey-card-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 4rem; font-weight: 700; line-height: 1;
          color: rgba(200,169,110,0.18); position: absolute; top: 1.5rem; right: 1.5rem;
          transition: color 0.4s;
        }
        .journey-card:hover .journey-card-num { color: rgba(200,169,110,0.35); }
        .journey-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, var(--gold), var(--rose));
          border-radius: 12px; margin-bottom: 1.5rem;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(200,169,110,0.3);
          transition: transform 0.3s;
        }
        .journey-card:hover .journey-icon { transform: scale(1.1) rotate(-3deg); }
        .journey-card h3 { font-size: 1.4rem; font-weight: 600; color: #fff; margin-bottom: 0.75rem; font-family: 'Cormorant Garamond', serif; }
        .journey-card p { font-size: 0.9rem; color: rgba(255,255,255,0.55); line-height: 1.7; }

        /* Letter */
        .letter-section { padding: 8rem 2rem; position: relative; }
        .letter-wrap {
          max-width: 760px; margin: 0 auto;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 2px;
          padding: 4rem 4.5rem;
          position: relative;
          box-shadow: 0 24px 80px rgba(26,20,16,0.08), 0 2px 0 var(--gold) inset;
        }
        .letter-wrap::before {
          content: '"';
          position: absolute; top: 2.5rem; left: 3.5rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 8rem; line-height: 1; color: rgba(200,169,110,0.12);
          pointer-events: none;
        }
        .letter-salutation { font-size: 1.1rem; color: var(--gold); font-style: italic; font-family: 'Cormorant Garamond', serif; margin-bottom: 1.5rem; }
        .letter-body p { font-size: 1.05rem; line-height: 1.85; color: var(--ink-soft); margin-bottom: 1.4rem; }
        .letter-sign { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: var(--gold); margin-top: 2rem; }
        .letter-from { font-size: 0.9rem; color: var(--ink-soft); margin-top: 0.5rem; }

        /* Gallery */
        .gallery-section { padding: 8rem 2rem; background: var(--cream); }
        .photo-grid { display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: auto; gap: 0.75rem; margin-top: 4rem; }
        .photo-item {
          overflow: hidden; border-radius: 4px; position: relative;
          cursor: pointer; background: #e8e0d4;
        }
        .photo-item:nth-child(1) { grid-column: span 3; grid-row: span 2; }
        .photo-item:nth-child(2) { grid-column: span 2; }
        .photo-item:nth-child(3) { grid-column: span 1; }
        .photo-item:nth-child(4) { grid-column: span 1; }
        .photo-item:nth-child(5) { grid-column: span 2; }
        .photo-item:nth-child(6) { grid-column: span 3; }
        .photo-item img {
          width: 100%; height: 100%; min-height: 180px;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1), filter 0.4s;
          filter: brightness(0.95) saturate(0.9);
        }
        .photo-item:hover img { transform: scale(1.06); filter: brightness(1) saturate(1.1); }
        .photo-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(200,169,110,0.6), transparent 60%);
          opacity: 0; transition: opacity 0.4s;
          display: flex; align-items: flex-end; padding: 1rem;
        }
        .photo-item:hover .photo-overlay { opacity: 1; }
        .photo-overlay span { color: #fff; font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; }

        /* Reel */
        .reel-section { padding: 8rem 2rem; background: var(--ink); position: relative; overflow: hidden; }
        .reel-section .section-eyebrow { color: var(--gold); }
        .reel-section .section-title { color: #fff; }
        .reel-section .section-sub { color: rgba(255,255,255,0.5); }
        .reel-card {
          margin-top: 4rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(200,169,110,0.2);
          border-radius: 4px;
          overflow: hidden;
          display: grid; grid-template-columns: 1fr 340px;
        }
        .reel-video-wrap { background: #000; aspect-ratio: 16/9; }
        .reel-video-wrap video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .reel-info {
          padding: 3rem 2.5rem;
          display: flex; flex-direction: column; justify-content: space-between;
          border-left: 1px solid rgba(200,169,110,0.15);
        }
        .reel-tag { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; display: block; }
        .reel-info h3 { font-family: 'Cormorant Garamond', serif; font-size: 2rem; color: #fff; margin-bottom: 1rem; }
        .reel-info p { font-size: 0.9rem; color: rgba(255,255,255,0.5); line-height: 1.7; }
        .reel-quote { font-size: 0.85rem; color: rgba(200,169,110,0.8); font-style: italic; font-family: 'Cormorant Garamond', serif; font-size: 1rem; line-height: 1.6; margin-top: 1.5rem; }

        /* Testimonials */
        .testimonials-section { padding: 8rem 2rem; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; margin-top: 4rem; }
        .testimonial-card {
          padding: 2rem 2.25rem;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 2px;
          position: relative; overflow: hidden;
          transition: transform 0.35s, box-shadow 0.35s, border-color 0.35s;
        }
        .testimonial-card::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(to right, var(--gold), var(--rose));
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .testimonial-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(26,20,16,0.1); border-color: var(--gold); }
        .testimonial-card:hover::after { transform: scaleX(1); }
        .testimonial-stars { color: var(--gold); font-size: 0.9rem; letter-spacing: 0.1em; margin-bottom: 1.25rem; }
        .testimonial-card p { font-size: 0.95rem; color: var(--ink-soft); line-height: 1.75; font-style: italic; margin-bottom: 1.5rem; }
        .testimonial-name { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink); }

        /* Gift */
        .gift-section { padding: 8rem 2rem; background: var(--ink); position: relative; overflow: hidden; }
        .gift-section::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(200,169,110,0.15) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%,-50%);
          pointer-events: none;
        }
        .gift-section .section-eyebrow { color: var(--gold); }
        .gift-section .section-title { color: #fff; }
        .gift-section .section-sub { color: rgba(255,255,255,0.5); }
        .gift-box-wrap { max-width: 600px; margin: 4rem auto 0; position: relative; }
        .gift-box {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(200,169,110,0.3);
          border-radius: 4px; padding: 3.5rem;
          text-align: center; position: relative; overflow: hidden;
        }
        .gift-box::before { content: ''; position: absolute; inset-x: 0; top: 0; height: 2px; background: linear-gradient(to right, transparent, var(--gold), var(--rose), var(--gold), transparent); }
        .gift-btn-icon {
          width: 80px; height: 80px;
          background: linear-gradient(135deg, var(--gold), var(--rose));
          border-radius: 50%; margin: 0 auto 1.5rem;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 12px 40px rgba(200,169,110,0.5);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .gift-box-btn:hover .gift-btn-icon { transform: scale(1.08) rotate(-5deg); box-shadow: 0 16px 50px rgba(200,169,110,0.6); }
        .gift-box-btn {
          background: none; border: none; cursor: pointer; width: 100%;
          padding: 0; text-align: center;
        }
        .gift-box-btn h3 { font-family: 'Cormorant Garamond', serif; font-size: 2rem; color: #fff; margin-bottom: 0.5rem; }
        .gift-box-btn p { font-size: 0.9rem; color: rgba(255,255,255,0.5); line-height: 1.6; }
        .gift-reveal { animation: giftReveal 0.7s cubic-bezier(0.22,1,0.36,1) forwards; }
        @keyframes giftReveal {
          from { opacity: 0; transform: scale(0.94) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .gift-message-inner {
          background: linear-gradient(135deg, rgba(200,169,110,0.15), rgba(196,115,110,0.1));
          border: 1px solid rgba(200,169,110,0.3);
          border-radius: 2px; padding: 2.5rem; text-align: center;
        }
        .gift-message-inner h3 { font-family: 'Cormorant Garamond', serif; font-size: 2.25rem; color: var(--gold-light); margin-bottom: 1rem; }
        .gift-message-inner p { font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.8; margin-bottom: 1.25rem; }
        .gift-sig { font-size: 0.85rem; color: var(--gold); font-weight: 600; letter-spacing: 0.08em; }

        /* Floating hearts */
        .floating-heart {
          position: absolute; pointer-events: none; z-index: 30;
          animation: floatUp 3.5s ease-out forwards;
        }
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          60% { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(-200px) scale(0.6) rotate(15deg); }
        }

        /* Closing */
        .closing-section { padding: 10rem 2rem; text-align: center; position: relative; overflow: hidden; }
        .closing-section::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(to bottom right, rgba(200,169,110,0.05), rgba(196,115,110,0.05));
        }
        .closing-large {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(4rem, 12vw, 10rem);
          font-weight: 700; line-height: 0.9;
          color: transparent;
          -webkit-text-stroke: 1px rgba(200,169,110,0.4);
          letter-spacing: -0.03em;
          margin-bottom: 3rem;
          user-select: none;
        }
        .closing-text { font-size: 1.15rem; color: var(--ink-soft); line-height: 1.8; max-width: 520px; margin: 0 auto 3rem; }
        .closing-sig { font-family: 'Cormorant Garamond', serif; font-size: 2rem; color: var(--gold); }

        /* Footer */
        footer { padding: 2rem; border-top: 1px solid var(--border); text-align: center; }
        footer p { font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); opacity: 0.7; }

        /* Mobile */
        .mobile-menu-btn {
          display: none; background: none; border: 1px solid var(--border);
          border-radius: 8px; width: 40px; height: 40px;
          align-items: center; justify-content: center; cursor: pointer;
          color: var(--ink); transition: border-color 0.3s;
        }
        .mobile-menu-btn:hover { border-color: var(--gold); }
        .mobile-nav {
          display: none; flex-direction: column; padding: 1rem 2rem 1.5rem;
          border-top: 1px solid var(--border); gap: 0.25rem;
        }
        .mobile-nav a { padding: 0.6rem 0.5rem; font-size: 0.85rem; color: var(--ink-soft); text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase; transition: color 0.3s; }
        .mobile-nav a:hover { color: var(--gold); }
        .mobile-nav.open { display: flex; }

        @media (max-width: 1024px) {
          .reel-card { grid-template-columns: 1fr; }
          .reel-info { border-left: none; border-top: 1px solid rgba(200,169,110,0.15); }
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .mobile-menu-btn { display: flex; }
          .photo-grid { grid-template-columns: repeat(2, 1fr); }
          .photo-item:nth-child(n) { grid-column: span 1; grid-row: span 1; }
          .letter-wrap { padding: 2.5rem 1.75rem; }
          .journey { padding: 5rem 1.5rem; }
          .letter-section, .gallery-section, .reel-section, .testimonials-section, .gift-section { padding: 5rem 1.5rem; }
        }
        /* Music Player */
        .music-player {
          position: fixed;
          bottom: 2rem; right: 2rem;
          z-index: 200;
          display: flex; align-items: center; gap: 0;
          background: rgba(26,20,16,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(200,169,110,0.3);
          border-radius: 100px;
          padding: 0.55rem 1rem 0.55rem 0.55rem;
          box-shadow: 0 8px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(200,169,110,0.08);
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
          min-width: 52px;
        }
        .music-player:hover { box-shadow: 0 12px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(200,169,110,0.2); }

        .music-play-btn {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, var(--gold), var(--rose));
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(200,169,110,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .music-play-btn:hover { transform: scale(1.08); box-shadow: 0 6px 22px rgba(200,169,110,0.55); }
        .music-play-btn:active { transform: scale(0.96); }

        .music-info {
          overflow: hidden;
          max-width: 0;
          opacity: 0;
          transition: max-width 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.4s, margin 0.4s;
          margin-left: 0;
        }
        .music-player.expanded .music-info {
          max-width: 200px; opacity: 1; margin-left: 0.85rem;
        }

        .music-title {
          display: block;
          font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.9);
          white-space: nowrap;
          overflow: hidden;
        }
        .music-title-inner {
          display: inline-block;
          animation: marquee 12s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          30% { transform: translateX(0); }
          80% { transform: translateX(-60%); }
          100% { transform: translateX(0); }
        }
        .music-sub {
          display: block;
          font-size: 0.6rem; color: rgba(200,169,110,0.8);
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-top: 1px;
          white-space: nowrap;
        }

        /* Sound bars animation */
        .sound-bars {
          display: flex; align-items: flex-end; gap: 2px;
          height: 14px; margin-top: 4px;
        }
        .sound-bar {
          width: 2px; border-radius: 2px;
          background: var(--gold);
          transform-origin: bottom;
        }
        .sound-bar:nth-child(1) { height: 4px; animation: bar1 0.8s ease-in-out infinite; }
        .sound-bar:nth-child(2) { height: 8px; animation: bar2 0.9s ease-in-out infinite 0.1s; }
        .sound-bar:nth-child(3) { height: 12px; animation: bar3 0.7s ease-in-out infinite 0.05s; }
        .sound-bar:nth-child(4) { height: 6px; animation: bar4 1s ease-in-out infinite 0.15s; }
        .sound-bar:nth-child(5) { height: 9px; animation: bar1 0.85s ease-in-out infinite 0.2s; }
        .sound-bars.paused .sound-bar { animation-play-state: paused !important; }

        @keyframes bar1 { 0%,100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
        @keyframes bar2 { 0%,100% { transform: scaleY(0.5); } 50% { transform: scaleY(1); } }
        @keyframes bar3 { 0%,100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }
        @keyframes bar4 { 0%,100% { transform: scaleY(0.6); } 50% { transform: scaleY(1); } }

        /* Volume */
        .music-volume-wrap {
          display: flex; align-items: center; gap: 0.5rem;
          overflow: hidden;
          max-width: 0; opacity: 0;
          transition: max-width 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s, margin 0.3s;
          margin-left: 0;
        }
        .music-player.expanded .music-volume-wrap { max-width: 120px; opacity: 1; margin-left: 0.75rem; }

        .vol-btn {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.5); padding: 0; flex-shrink: 0;
          transition: color 0.2s;
        }
        .vol-btn:hover { color: var(--gold); }

        .vol-slider {
          -webkit-appearance: none; appearance: none;
          width: 70px; height: 2px;
          background: rgba(255,255,255,0.15);
          border-radius: 2px; outline: none; cursor: pointer;
          flex-shrink: 0;
        }
        .vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--gold); cursor: pointer;
          box-shadow: 0 0 6px rgba(200,169,110,0.5);
          transition: transform 0.2s;
        }
        .vol-slider::-webkit-slider-thumb:hover { transform: scale(1.3); }

        @media (max-width: 768px) {
          .music-player { bottom: 1.25rem; right: 1.25rem; }
          .music-player.expanded .music-volume-wrap { max-width: 0; opacity: 0; }
        }
      `}</style>

      {/* Cursor glow */}
      <div
        className="cursor-glow"
        style={{ transform: `translate(calc(${cursorPos.x}px - 50%), calc(${cursorPos.y}px - 50%))` }}
      />

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onCanPlayThrough={() => setMusicReady(true)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src="/memories_Music.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Music Player */}
      <div className={`music-player ${isPlaying ? 'expanded' : ''}`}>
        {/* Play / Pause button */}
        <button className="music-play-btn" onClick={toggleMusic} aria-label={isPlaying ? 'Pause music' : 'Play music'}>
          {isPlaying ? (
            /* Pause icon */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
              <rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/>
            </svg>
          ) : (
            /* Play icon */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          )}
        </button>

        {/* Song info + bars */}
        <div className="music-info">
          <span className="music-title">
            <span className="music-title-inner">Memories &nbsp;·&nbsp; Class Memory Film &nbsp;·&nbsp;&nbsp;</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '3px' }}>
            <div className={`sound-bars ${isPlaying ? '' : 'paused'}`}>
              <div className="sound-bar"/><div className="sound-bar"/><div className="sound-bar"/>
              <div className="sound-bar"/><div className="sound-bar"/>
            </div>
            <span className="music-sub">Now Playing</span>
          </div>
        </div>

        {/* Volume */}
        <div className="music-volume-wrap">
          <button
            className="vol-btn"
            onClick={() => {
              const newVol = volume === 0 ? 0.5 : 0
              setVolume(newVol)
              if (audioRef.current) audioRef.current.volume = newVol
            }}
            aria-label="Toggle mute"
          >
            {volume === 0 ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            )}
          </button>
          <input
            type="range" min="0" max="1" step="0.01"
            value={volume}
            onChange={handleVolume}
            className="vol-slider"
            aria-label="Volume"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <div className="nav-inner">
          <div className="nav-logo">
            <img src="/idt-logo.png" alt="IDT Logo" />
          </div>
          <div className="nav-links">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={activeSection === item.toLowerCase() ? 'active' : ''}
              >
                {item}
              </a>
            ))}
          </div>
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
        <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)}>{item}</a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="hero">
        <div className="hero-bg-ring hero-bg-ring-1" />
        <div className="hero-bg-ring hero-bg-ring-2" />
        <div className="hero-bg-ring hero-bg-ring-3" />

        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-line" />
            Data Science G2 · 2024
            <span className="hero-eyebrow-line" />
          </div>

          <h1 className="hero-title serif">
            Thank You,<br />
            <em>Teacher Socheat</em>
          </h1>

          <p className="hero-sub">
            With gratitude and deep respect — a tribute from the class you transformed with your passion and dedication.
          </p>

          <div className="hero-ctas">
            <a href="#message" className="btn-primary">Read Our Message</a>
            <a href="#gallery" className="btn-outline">View Our Journey</a>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* Journey */}
      <Section id="journey" className="journey">
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span className="section-eyebrow">What We Learned</span>
            <h2 className="section-title serif" style={{ color: '#fff' }}>Our Learning Journey</h2>
            <p className="section-sub">In three months, you gave us lessons that no textbook could teach.</p>
          </div>

          <div className="journey-grid">
            {[
              {
                num: '01', title: 'Communication', desc: 'We learned to express ourselves clearly, listen actively, and connect meaningfully with the world around us.',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                )
              },
              {
                num: '02', title: 'Teamwork', desc: 'We discovered that extraordinary things happen when we collaborate with respect, trust, and shared purpose.',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                )
              },
              {
                num: '03', title: 'Confidence', desc: 'You empowered us to believe in our abilities and step bravely into our own unique potential.',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                )
              },
              {
                num: '04', title: 'Career Readiness', desc: 'We gained the mindset, skills, and vision to face the professional world with courage and clarity.',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                )
              },
            ].map((card) => (
              <div key={card.num} className="journey-card">
                <div className="journey-card-num">{card.num}</div>
                <div className="journey-icon">
                  {card.icon}
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Letter */}
      <Section id="message" className="letter-section">
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="section-eyebrow">From the Heart</span>
            <h2 className="section-title serif">A Message to Remember</h2>
          </div>

          <div className="letter-wrap">
            <p className="letter-salutation">Dear Teacher,</p>
            <div className="letter-body">
              <p>Over these three months, you&apos;ve been more than just an instructor — you&apos;ve been a mentor, a cheerleader, and an enduring source of inspiration. You created a space where we felt safe to grow, challenge ourselves, and discover strengths we didn&apos;t know we had.</p>
              <p>Your passion for our development, your genuine care for each of us, and your unwavering belief in our potential has left an indelible mark on our hearts. You taught us that career readiness isn&apos;t just about resumes and interviews — it&apos;s about becoming the very best version of ourselves.</p>
              <p>This gift is a small token of our immense gratitude. But know that the greatest gift you&apos;ve given us is confidence, hope, and the courage to dream big.</p>
            </div>
            <p className="letter-sign">Thank you for believing in us.</p>
            <p className="letter-from">With deep appreciation, <strong>Data Science G2</strong></p>
          </div>
        </div>
      </Section>

      {/* Gallery */}
      <Section id="gallery" className="gallery-section">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <span className="section-eyebrow">Captured Moments</span>
            <h2 className="section-title serif">Our Unforgettable Memories</h2>
            <p className="section-sub">These images carry the joy, collaboration, and bonds we created together.</p>
          </div>

          <div className="photo-grid">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="photo-item">
                <img src={`/class-photo-${num}.jpg`} alt={`Class moment ${num}`} />
                <div className="photo-overlay">
                  <span>Memory {num}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Reel */}
      <Section id="reel" className="reel-section">
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center' }}>
            <span className="section-eyebrow">Memories in Motion</span>
            <h2 className="section-title serif">Class Memory Reel</h2>
            <p className="section-sub">One film. Many moments we will carry with us forever.</p>
          </div>

          {videoMemories.map((video) => (
            <div key={video.id} className="reel-card">
              <div className="reel-video-wrap">
                <video controls preload="metadata" poster={video.poster} playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
                  <source src={video.src} type="video/mp4" />
                </video>
              </div>
              <div className="reel-info">
                <div>
                  <span className="reel-tag">Featured Video</span>
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                  <p className="reel-quote">"Thank you for giving us moments worth replaying, not just lessons worth remembering."</p>
                </div>
                <a href="#gift" className="btn-primary" style={{ display: 'inline-block', marginTop: '2rem', textAlign: 'center' }}>
                  Open Special Gift →
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="messages" className="testimonials-section">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <span className="section-eyebrow">Words from Students</span>
            <h2 className="section-title serif">What We Want You to Know</h2>
          </div>

          <div className="testimonials-grid">
            {[
              { name: 'Khean Sievlinh', msg: 'Your class changed how I see myself and my future. Thank you for believing in me when I couldn\'t believe in myself.' },
              { name: 'Im SreyPin', msg: 'You made us feel valued and heard. That means everything to a student. Thank you from the bottom of my heart.' },
              { name: 'Mao Monioudom', msg: 'Beyond the lessons, you taught us kindness and integrity. Those are gifts we will carry our entire lives.' },
              { name: 'Vorn Sina', msg: 'Your enthusiasm is contagious! You made learning something we genuinely looked forward to every single week.' },
              { name: 'Pov Yanghai', msg: 'Thank you for pushing us to be better and celebrating our victories with such genuine and unrestrained joy.' },
              { name: 'Data Science G2', msg: 'You are an extraordinary teacher and an even better human being. We are so fortunate to have had you.' },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p>"{t.msg}"</p>
                <div className="testimonial-name">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Gift */}
      <Section id="gift" className="gift-section">
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center' }}>
            <span className="section-eyebrow">A Special Surprise</span>
            <h2 className="section-title serif">A Gift from All of Us</h2>
            <p className="section-sub">Made with love, gratitude, and the warmest wishes.</p>
          </div>

          <div className="gift-box-wrap">
            {/* Floating hearts */}
            {floatingHearts.map((h) => (
              <div
                key={h.id}
                className="floating-heart"
                style={{ left: `${h.left}%`, bottom: '2rem', animationDelay: `${h.delay}ms` }}
                aria-hidden="true"
              >
                <svg width={`${h.size * 20}px`} height={`${h.size * 20}px`} viewBox="0 0 24 24" fill="#e5393s" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#e53935" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            ))}

            <div className="gift-box">
              {!giftOpened ? (
                <button className="gift-box-btn" onClick={handleGiftClick}>
                  <div className="gift-btn-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v4H3V7zm2 4h14v10H5V11zm7-8c-1.8 0-3 1.3-3 2.8V7h6V5.8C15 4.3 13.8 3 12 3z" />
                    </svg>
                  </div>
                  <h3>Tap to Open Your Gift</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Click to reveal our heartfelt message for you.</p>
                </button>
              ) : (
                <div className="gift-reveal gift-message-inner">
                  <h3>For Teacher Socheat</h3>
                  <p>Thank you for being the kind of teacher who changes lives. Your guidance, patience, and belief in us gave our class a confidence we will carry forever. You are unforgettable.</p>
                  <p className="gift-sig">With respect, gratitude & love — Data Science G2</p>
                </div>
              )}
            </div>

            {giftOpened && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  onClick={() => { setGiftOpened(false); setFloatingHearts([]); }}
                  className="btn-outline"
                  style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(200,169,110,0.3)', background: 'rgba(255,255,255,0.05)' }}
                >
                  Close Gift
                </button>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Closing */}
      <Section id="closing" className="closing-section">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="closing-large">Thank You</div>
          <p className="closing-text">
            Your impact extends far beyond the classroom. You&apos;ve shaped our futures and our hearts. We carry your lessons, your belief in us, and your kindness with us always.
          </p>
          <div className="ornament" style={{ margin: '0 auto 2rem' }}>
            <span className="ornament-line" />
            <span className="ornament-diamond" />
            <span className="ornament-line rev" />
          </div>
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>With gratitude & respect</p>
          <p className="closing-sig">Data Science G2</p>
        </div>
      </Section>

      {/* Footer */}
      <footer>
        <p>Created with love by Data Science G2 · {new Date().getFullYear()}</p>
      </footer>
    </>
  )
}