'use client'

import { useState, useEffect } from 'react'

interface FloatingHeart {
  id: number
  left: number
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [giftOpened, setGiftOpened] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])
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
    setIsLoaded(true)
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

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleGiftClick = () => {
    setGiftOpened(true)
    
    // Create floating hearts
    const hearts: FloatingHeart[] = []
    for (let i = 0; i < 12; i++) {
      hearts.push({
        id: i,
        left: Math.random() * 100
      })
    }
    setFloatingHearts(hearts)
    
    // Clear hearts after animation
    setTimeout(() => setFloatingHearts([]), 3000)
  }

  return (
    <main className="relative bg-background text-foreground overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-112 -right-16 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/idt-logo.png" alt="IDT Logo" className="h-12 w-auto" />
          </div>

          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-sm font-medium transition-colors duration-300 ${
                  activeSection === item.toLowerCase()
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item}
              </a>
            ))}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden border-t border-border/80 bg-background/95 backdrop-blur transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.toLowerCase()
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className={`relative min-h-screen flex items-center justify-center px-6 pt-20 transition-all duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-4xl w-full mx-auto text-center space-y-8">
          {/* Decorative accent */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
          </div>

          <h1
            className={`text-5xl md:text-7xl font-bold leading-tight transition-all duration-1000 delay-200 ${
              isLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            Thank You, Teacher <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Nhip Socheat</span>
          </h1>

          <p
            className={`text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${
              isLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            With gratitude and respect from Data Science G2, a class transformed by your passion and dedication
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center pt-8 transition-all duration-1000 delay-400 ${
              isLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <a
              href="#message"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Read Our Message
            </a>
            <a
              href="#gallery"
              className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-all duration-300"
            >
              View Our Journey
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="pt-12">
            <div className="animate-bounce text-primary">
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey" className="px-6 py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Learning Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              In three months, you taught us invaluable lessons that go beyond textbooks
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Communication',
                description: 'We learned to express ourselves clearly, listen actively, and connect meaningfully with others',
                icon: (
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )
              },
              {
                title: 'Teamwork',
                description: 'We discovered that great things happen when we work together with respect and trust',
                icon: (
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 12H9m4 5h4m-8 2h8M4 12a8 8 0 1116 0 8 8 0 01-16 0z" />
                  </svg>
                )
              },
              {
                title: 'Confidence',
                description: 'You empowered us to believe in ourselves and embrace our unique potential',
                icon: (
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                )
              },
              {
                title: 'Career Readiness',
                description: 'We gained the mindset, skills, and vision to face the professional world with courage',
                icon: (
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`p-8 bg-card rounded-xl border border-border hover:border-primary transition-all duration-500 group cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transitionDelay: isLoaded ? `${index * 100}ms` : '0ms',
                }}
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Message to Teacher */}
      <section id="message" className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">A Message from the Heart</h2>
          </div>

          <div className={`p-12 bg-gradient-to-br from-card to-muted/10 rounded-2xl border border-border transition-all duration-1000 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <p className="text-xl leading-relaxed text-muted-foreground mb-6 italic">
              Dear Teacher,
            </p>
            <p className="text-lg leading-relaxed text-foreground mb-6">
              Over these three months, you&apos;ve been more than just an instructor—you&apos;ve been a mentor, cheerleader, and inspiration. You created a space where we felt safe to grow, challenge ourselves, and discover strengths we didn&apos;t know we had.
            </p>
            <p className="text-lg leading-relaxed text-foreground mb-6">
              Your passion for our development, your genuine care for each of us, and your belief in our potential has left an indelible mark on our hearts. You taught us that career readiness isn&apos;t just about resumes and interviews—it&apos;s about becoming the best version of ourselves.
            </p>
            <p className="text-lg leading-relaxed text-foreground mb-6">
              This gift is a small token of our immense gratitude. But know that the greatest gift you&apos;ve given us is confidence, hope, and the courage to dream big.
            </p>
            <p className="text-xl leading-relaxed text-primary font-semibold">
              Thank you for believing in us. We are so grateful.
            </p>
            <p className="text-lg text-muted-foreground mt-8">
              With deep appreciation,<br />
              Data Science G2
            </p>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section id="gallery" className="px-6 py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Unforgettable Moments</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These memories capture the joy, collaboration, and bonds we created together
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((photoNum) => (
              <div
                key={photoNum}
                className={`relative h-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group cursor-pointer ${
                  isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{
                  transitionDelay: isLoaded ? `${photoNum * 80}ms` : '0ms',
                }}
              >
                <img
                  src={`/class-photo-${photoNum}.jpg`}
                  alt={`Class moment ${photoNum}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-white font-semibold text-sm">Memory {photoNum}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memory Reel */}
      <section id="reel" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.22em] text-primary font-semibold mb-3">Memories In Motion</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">Class Memory Reel</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One film, many meaningful moments we will carry with us forever.
            </p>
          </div>

          {videoMemories.map((video, index) => (
            <article
              key={video.id}
              className={`relative overflow-hidden rounded-3xl border border-border bg-card/90 backdrop-blur-sm p-4 sm:p-6 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.35)] transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: isLoaded ? `${index * 120}ms` : '0ms',
              }}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-accent to-secondary" aria-hidden="true" />
              <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-stretch">
                <div className="overflow-hidden rounded-2xl border border-border bg-black/85">
                  <video
                    className="w-full aspect-video object-cover"
                    controls
                    preload="metadata"
                    poster={video.poster}
                    playsInline
                  >
                    <source src={video.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="rounded-2xl border border-border/80 bg-background/70 p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Featured Video</p>
                    <h3 className="text-2xl font-bold tracking-tight mb-3">{video.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{video.description}</p>
                  </div>
                  <div className="mt-6 space-y-3">
                    <p className="text-sm text-muted-foreground">Thank you for giving us moments worth replaying, not just lessons worth remembering.</p>
                    <a
                      href="#gift"
                      className="inline-flex w-fit rounded-xl bg-primary px-5 py-2.5 text-primary-foreground font-semibold transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      Open Special Gift
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Student Messages */}
      <section id="messages" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Words from Our Hearts</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              What your students want you to know
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Khean Sievlinh',
                message: 'Your class changed how I see myself and my future. Thank you for believing in me.',
              },
              {
                name: 'Im SreyPin',
                message: 'You made us feel valued and heard. That means everything to us. Thank you!',
              },
              {
                name: 'Mao Monioudom',
                message: 'Beyond the lessons, you taught us kindness and integrity. We are grateful.',
              },
              {
                name: 'Vorn Sina',
                message: 'Your enthusiasm is contagious! You made learning something we looked forward to.',
              },
              {
                name: 'Pov Yanghai',
                message: 'Thank you for pushing us to be better and celebrating our wins with genuine joy.',
              },
              {
                name: 'Data Science G2',
                message: 'You are an amazing teacher and an even better human. We all admire you so much.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`p-6 bg-card rounded-xl border border-border hover:border-primary transition-all duration-500 group hover:shadow-lg ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: isLoaded ? `${index * 60}ms` : '0ms',
                }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary text-lg">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4 leading-relaxed">
                  &apos;&apos;{item.message}&apos;&apos;
                </p>
                <p className="font-semibold text-foreground">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Gift Section */}
      <section id="gift" className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-5">A Special Gift for You</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A small surprise from our class, made with love and gratitude.
            </p>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-accent/15 to-secondary/20 blur-3xl rounded-full" aria-hidden="true" />

            {floatingHearts.map((heart) => (
              <div
                key={heart.id}
                className="absolute pointer-events-none animate-float z-20"
                style={{
                  left: `${heart.left}%`,
                  bottom: '1.5rem',
                  animationDelay: `${heart.id * 70}ms`,
                }}
                aria-hidden="true"
              >
                <span className="text-2xl text-red-500">❤</span>
              </div>
            ))}

            <div className="relative rounded-3xl border border-border bg-card/90 backdrop-blur-sm shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] p-6 sm:p-10 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" aria-hidden="true" />

              {!giftOpened ? (
                <button
                  onClick={handleGiftClick}
                  className="w-full rounded-2xl border border-border bg-background/70 p-8 sm:p-10 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v4H3V7zm2 4h14v10H5V11zm7-8c-1.8 0-3 1.3-3 2.8V7h6V5.8C15 4.3 13.8 3 12 3zm0 0c1.8 0 3 1.3 3 2.8V7H9V5.8C9 4.3 10.2 3 12 3z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold tracking-tight">Tap to open your gift</p>
                  <p className="mt-3 text-muted-foreground">Click once and we will reveal our heartfelt note.</p>
                </button>
              ) : (
                <div className="animate-fadeIn">
                  <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 sm:p-8 text-center">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3">For Teacher</h3>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                      Thank you for being the kind of teacher who changes lives. Your guidance, patience, and belief in us gave our class confidence we will carry forever.
                    </p>
                    <p className="mt-5 text-sm sm:text-base font-semibold text-primary">With respect, gratitude, and love from Data Science G2</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {giftOpened && (
            <div className="text-center mt-10">
              <button
                onClick={() => {
                  setGiftOpened(false)
                  setFloatingHearts([])
                }}
                className="px-7 py-3 rounded-xl border border-border bg-background hover:bg-muted/50 font-semibold transition-colors duration-300"
              >
                Close Gift
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Closing Section */}
      <section id="closing" className="px-6 py-24 bg-gradient-to-br from-primary/5 to-accent/5 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Thank You</h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">
            Your impact extends far beyond the classroom. You&apos;ve shaped our futures and our hearts. We carry your lessons, your belief in us, and your kindness with us always.
          </p>
          <div className="inline-block">
            <p className="text-lg font-semibold text-primary mb-2">With gratitude and respect,</p>
            <p className="text-2xl font-bold text-foreground">Data Science G2</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border bg-card/50">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>Created with love by Data Science G2 • {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  )
}
