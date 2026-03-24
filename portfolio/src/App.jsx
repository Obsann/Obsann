import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const cursorRef = useRef(null)
  const manifestoRef = useRef(null)

  useEffect(() => {
    // Lenis smooth scroll — integrated with GSAP ticker for production safety
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 2,
    })

    // Critical: sync Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Run Lenis inside GSAP's ticker (not a separate RAF loop)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Shutter animation on load
    setTimeout(() => {
      document.body.classList.add('loaded')
    }, 100)

    // Custom cursor
    const cursor = cursorRef.current
    const hoverTriggers = document.querySelectorAll('.hover-trigger')

    const handleMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out',
      })
    }

    document.addEventListener('mousemove', handleMouseMove)

    hoverTriggers.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'))
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'))
    })

    // Grid drawing
    const gridCells = document.querySelectorAll('.grid-cell')
    gridCells.forEach((cell) => {
      ScrollTrigger.create({
        trigger: cell,
        start: 'top 85%',
        onEnter: () => cell.classList.add('active'),
      })
    })

    // Marquee scroll
    gsap.to('.marquee-content', {
      xPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.marquee-container',
        scrub: 1.5,
      },
    })

    // Manifesto text highlight
    const manifesto = manifestoRef.current
    if (manifesto) {
      const text = manifesto.innerText
      manifesto.innerHTML = ''
      text.split(' ').forEach((word) => {
        const span = document.createElement('span')
        span.innerText = word + ' '
        span.style.opacity = '0.1'
        span.style.transition = 'opacity 0.3s ease'
        manifesto.appendChild(span)
      })

      const spans = manifesto.querySelectorAll('span')
      gsap.to(spans, {
        opacity: 1,
        color: '#ffffff',
        stagger: 0.05,
        scrollTrigger: {
          trigger: manifesto,
          start: 'top 80%',
          end: 'bottom 50%',
          scrub: 1,
        },
      })
    }

    // Horizontal scroll process
    const processSection = document.querySelector('.process-wrapper')
    const processContainer = document.querySelector('.process-container')

    if (processSection && processContainer) {
      gsap.to(processContainer, {
        x: () => -(processContainer.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: processSection,
          pin: true,
          scrub: 1,
          end: () => '+=' + (processContainer.scrollWidth - window.innerWidth),
        },
      })
    }

    // Zoom mask effect
    gsap.to('.zoom-circle', {
      scale: 500,
      borderRadius: '0%',
      scrollTrigger: {
        trigger: '.zoom-wrapper',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove((time) => { lenis.raf(time * 1000) })
      lenis.destroy()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div className="selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="cursor-dot" ref={cursorRef}></div>
      <div className="noise"></div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="rounded-full border border-white/5 backdrop-blur-md px-6 py-4 flex items-center justify-between bg-black/40 transition-all duration-300 hover:border-white/10 hover:bg-black/60 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-neutral-500 bg-neutral-900/50 px-3 py-1.5 rounded-full border border-white/5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <span className="text-sm font-semibold tracking-tight heading-font text-white">OBSANN / DEV</span>
            </div>
            <div className="hidden md:flex gap-8 text-[11px] font-mono uppercase tracking-widest text-neutral-400">
              <a href="#about" className="hover:text-indigo-400 transition-colors hover-trigger relative group">
                Skills
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 transition-all group-hover:w-full"></span>
              </a>
              <a href="#work" className="hover:text-emerald-400 transition-colors hover-trigger relative group">
                Projects
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-emerald-500 transition-all group-hover:w-full"></span>
              </a>
              <a href="#process" className="hover:text-rose-400 transition-colors hover-trigger relative group">
                Process
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-rose-500 transition-all group-hover:w-full"></span>
              </a>
              <a href="#contact" className="hover:text-cyan-400 transition-colors hover-trigger relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-500 transition-all group-hover:w-full"></span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col md:px-12 border-neutral-900/50 border-b pt-24 pr-6 pl-6 relative justify-center bg-[#030303] overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse-ring"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        <div className="max-w-7xl mx-auto w-full z-10">
          <div className="mb-10 overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-white/10 bg-white/5 backdrop-blur-sm shutter-wrapper">
              <span className="shutter-text text-[10px] mono-font text-indigo-300 uppercase tracking-widest">
                Available for Hire
              </span>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-medium tracking-tighter leading-[0.85] text-white uppercase mb-12 heading-font">
            <div className="shutter-wrapper">
              <span className="shutter-text bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-neutral-500">Full-Stack</span>
            </div>
            <div className="shutter-wrapper flex items-center gap-4 md:gap-8">
              <span className="shutter-text text-neutral-700 italic font-serif">Developer</span>
              <div className="h-[2px] w-12 md:w-32 bg-indigo-500 shutter-text"></div>
            </div>
            <div className="shutter-wrapper">
              <span className="shutter-text bg-clip-text text-transparent bg-gradient-to-br from-neutral-200 to-neutral-600">&amp; Builder</span>
            </div>
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-10 w-full backdrop-blur-sm">
            <div className="max-w-lg text-sm md:text-base text-neutral-400 leading-relaxed mb-8 md:mb-0 shutter-wrapper delay-500">
              <span className="shutter-text">
                Building web applications from concept to deployment.
                Merging <span className="text-white">problem-solving</span> with <span className="text-white">creative design</span>.
              </span>
            </div>
            <a href="#work" className="group flex items-center gap-6 hover-trigger">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="w-14 h-14 border border-white/10 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white group-hover:rotate-45 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 17L17 7"></path>
                    <path d="M7 7h10v10"></path>
                  </svg>
                </div>
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 group-hover:text-indigo-400 transition-colors">
                Explore Work
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-16 bg-[#030303] overflow-hidden whitespace-nowrap border-b border-neutral-900/50 marquee-container relative z-10">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030303] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030303] to-transparent z-10"></div>
        <div className="inline-flex items-center gap-16 marquee-content opacity-50 hover:opacity-100 transition-opacity duration-500">
          <span className="text-7xl md:text-8xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-neutral-700 to-neutral-900 tracking-tighter heading-font uppercase stroke-text hover:from-white hover:to-neutral-400 transition-all">JavaScript</span>
          <span className="text-7xl md:text-8xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-neutral-800 to-neutral-950 tracking-tighter heading-font uppercase stroke-text hover:from-indigo-400 hover:to-indigo-900 transition-all">TypeScript</span>
          <span className="text-7xl md:text-8xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-neutral-700 to-neutral-900 tracking-tighter heading-font uppercase stroke-text hover:from-white hover:to-neutral-400 transition-all">React</span>
          <span className="text-7xl md:text-8xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-neutral-800 to-neutral-950 tracking-tighter heading-font uppercase stroke-text hover:from-cyan-400 hover:to-cyan-900 transition-all">Node.js</span>
          <span className="text-7xl md:text-8xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-neutral-700 to-neutral-900 tracking-tighter heading-font uppercase stroke-text hover:from-white hover:to-neutral-400 transition-all">PHP</span>
          <span className="text-7xl md:text-8xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-neutral-800 to-neutral-950 tracking-tighter heading-font uppercase stroke-text hover:from-emerald-400 hover:to-emerald-900 transition-all">Java</span>
          <span className="text-7xl md:text-8xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-neutral-700 to-neutral-900 tracking-tighter heading-font uppercase stroke-text hover:from-rose-400 hover:to-rose-900 transition-all">CSS</span>
        </div>
      </div>

      {/* Services Grid */}
      <section id="about" className="py-32 px-6 md:px-12 bg-[#030303] relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-20 items-end">
            <h2 className="text-4xl md:text-5xl font-medium heading-font tracking-tight text-white glow-text">Core Skills</h2>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-neutral-800"></div>
              <p className="text-sm font-mono text-neutral-500 uppercase mt-4 md:mt-0">[ 01 - 06 ]</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border-l border-neutral-800/50">
            {[
              { num: '01', title: 'Frontend Dev', desc: 'Building dynamic, responsive interfaces with JavaScript, TypeScript, and React.', color: 'indigo', icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></> },
              { num: '02', title: 'Backend Dev', desc: 'PHP, Java & Node.js backend logic — authentication, data management, and API integrations.', color: 'cyan', icon: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" x2="4" y1="22" y2="15" /></> },
              { num: '03', title: 'Full-Stack Apps', desc: 'End-to-end web solutions from concept to deployment — rapid prototyping to polished product.', color: 'emerald', icon: <><circle cx="12" cy="12" r="3" /><path d="M12 1v4" /><path d="M12 19v4" /><path d="m4.93 4.93 2.83 2.83" /><path d="m16.24 16.24 2.83 2.83" /><path d="M1 12h4" /><path d="M19 12h4" /><path d="m4.93 19.07 2.83-2.83" /><path d="m16.24 7.76 2.83-2.83" /></> },
              { num: '04', title: 'Database & Data', desc: 'MySQL and MongoDB for robust, scalable data layers with clear data models.', color: 'rose', icon: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /> },
              { num: '05', title: 'UI/UX Design', desc: 'Modern CSS, responsive layouts, and polished user experiences across all devices.', color: 'purple', icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /> },
              { num: '06', title: 'RESTful APIs', desc: 'Robust REST APIs with authentication, security best practices, and clear documentation.', color: 'orange', icon: <><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></> },
            ].map((s) => (
              <div key={s.num} className="grid-cell p-12 border-r border-b border-neutral-800/50 hover:bg-neutral-900/20 transition-colors group hover-trigger cursor-none relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br from-${s.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="mb-24 flex justify-between relative z-10">
                  <div className={`p-3 rounded-lg bg-neutral-900/50 border border-neutral-800 group-hover:border-${s.color}-500/50 group-hover:text-${s.color}-400 transition-all duration-300`}>
                    <svg className={`w-6 h-6 text-neutral-400 group-hover:text-${s.color}-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{s.icon}</svg>
                  </div>
                  <span className={`text-xs font-mono text-neutral-600 group-hover:text-${s.color}-400`}>{s.num}</span>
                </div>
                <h3 className="text-2xl font-medium text-white mb-4 heading-font group-hover:translate-x-2 transition-transform duration-300">{s.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed max-w-xs group-hover:text-neutral-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Bento Grid */}
      <section className="py-24 px-6 md:px-12 bg-[#030303] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-900/5 blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16">
            <h2 className="text-3xl font-medium heading-font tracking-tight text-white mb-2">System Capabilities</h2>
            <p className="text-sm text-neutral-500">Built for real-world solutions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
            <div className="md:col-span-2 md:row-span-2 rounded-3xl glass-card p-10 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
              <div className="absolute top-0 right-0 p-40 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/30 transition-all duration-500"></div>
              <div className="flex flex-col h-full justify-between relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-white/10 flex items-center justify-center mb-6 shadow-lg shadow-indigo-900/20">
                  <svg className="w-7 h-7 text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl text-white heading-font mb-3">Full-Stack Architecture</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed max-w-md">Modular, scalable app design with React frontends and Node.js/PHP backends. Building complete web solutions from database to UI with clean architecture and maintainable code.</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 rounded-3xl glass-card p-10 relative overflow-hidden group hover:border-white/20 transition-all duration-500 flex flex-col justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.05),transparent)]"></div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl text-white heading-font">Responsive Design</h3>
                <div className="p-2 rounded-lg bg-neutral-900/50 border border-white/5">
                  <svg className="w-5 h-5 text-neutral-400 group-hover:text-emerald-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21h5v-5" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-neutral-400 mt-4 group-hover:text-neutral-300 transition-colors">Cross-device responsive interfaces built with modern CSS, ensuring <span className="text-emerald-400">pixel-perfect</span> layouts on every screen size.</p>
            </div>
            <div className="md:col-span-1 rounded-3xl glass-card p-8 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-full h-full flex flex-col justify-between relative z-10">
                <svg className="w-8 h-8 text-neutral-500 group-hover:text-rose-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <h3 className="text-lg text-white heading-font">Auth &amp; Security</h3>
              </div>
            </div>
            <div className="md:col-span-1 rounded-3xl glass-card p-8 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-full h-full flex flex-col justify-between relative z-10">
                <svg className="w-8 h-8 text-neutral-500 group-hover:text-cyan-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <h3 className="text-lg text-white heading-font">Version Control</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-40 px-6 bg-[#030303] flex items-center justify-center border-t border-b border-neutral-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <p ref={manifestoRef} className="text-4xl md:text-6xl font-medium leading-[1.15] tracking-tight heading-font text-neutral-300">
            I don&apos;t just write code. I build complete web solutions — from intuitive frontends to robust backends. Every project is an opportunity to solve real problems and deliver experiences users actually enjoy.
          </p>
        </div>
      </section>

      {/* Horizontal Scroll Process */}
      <section id="process" className="process-wrapper overflow-hidden bg-[#030303] h-screen relative border-b border-neutral-900/50">
        <div className="process-container flex h-full w-[400vw]">
          <div className="w-screen h-full grid grid-cols-1 lg:grid-cols-2 border-r border-neutral-800/50 relative bg-[#030303]">
            <div className="flex flex-col justify-center px-12 md:px-24 relative z-10 pointer-events-none">
              <div className="absolute top-12 left-12 text-xs font-mono text-indigo-500 mb-2">PHASE_01</div>
              <h3 className="text-6xl md:text-8xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 mb-8 heading-font">Discovery</h3>
              <p className="text-xl md:text-2xl text-neutral-400 max-w-xl font-light leading-relaxed">Deep dive into business logic. Understanding goals, target audience, and defining technical constraints.</p>
            </div>
            <div className="hidden lg:flex items-center justify-center relative border-l border-neutral-800/50 overflow-hidden bg-neutral-900/20">
              <div className="relative p-12 border border-neutral-800/50 rounded-2xl bg-black/40 shadow-2xl">
                <div className="grid grid-cols-4 gap-6 opacity-40">
                  {Array(8).fill(0).map((_, i) => <div key={i} className="w-3 h-3 bg-neutral-600 rounded-full"></div>)}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent animate-scan border-b border-emerald-500/50"></div>
              </div>
            </div>
          </div>
          <div className="w-screen h-full grid grid-cols-1 lg:grid-cols-2 border-r border-neutral-800/50 relative bg-[#030303]">
            <div className="flex flex-col justify-center px-12 md:px-24 relative z-10 pointer-events-none">
              <div className="absolute top-12 left-12 text-xs font-mono text-cyan-500 mb-2">PHASE_02</div>
              <h3 className="text-6xl md:text-8xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 mb-8 heading-font">Architecture</h3>
              <p className="text-xl md:text-2xl text-neutral-400 max-w-xl font-light leading-relaxed">Blueprinting the system. Designing scalable schemas, API contracts, and choosing the right stack.</p>
            </div>
            <div className="hidden lg:flex items-center justify-center relative border-l border-neutral-800/50 overflow-hidden bg-neutral-900/20">
              <div className="relative w-96 h-96 flex items-center justify-center">
                <div className="absolute inset-0 border border-neutral-800 rounded-full animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute inset-12 border border-dashed border-neutral-700 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                <div className="w-24 h-24 bg-neutral-900 border border-cyan-500/30 rounded-xl flex items-center justify-center z-10 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="w-screen h-full grid grid-cols-1 lg:grid-cols-2 border-r border-neutral-800/50 relative bg-[#030303]">
            <div className="flex flex-col justify-center px-12 md:px-24 relative z-10 pointer-events-none">
              <div className="absolute top-12 left-12 text-xs font-mono text-purple-500 mb-2">PHASE_03</div>
              <h3 className="text-6xl md:text-8xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 mb-8 heading-font">Development</h3>
              <p className="text-xl md:text-2xl text-neutral-400 max-w-xl font-light leading-relaxed">Rigorous coding sprints. Continuous integration, automated testing, and pixel-perfect implementation.</p>
            </div>
            <div className="hidden lg:flex items-center justify-center relative border-l border-neutral-800/50 overflow-hidden bg-neutral-900/20">
              <div className="relative flex items-center gap-8">
                <div className="w-14 h-14 rounded-full border border-neutral-700 bg-neutral-900 flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                </div>
                <div className="w-32 h-[1px] bg-neutral-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent w-1/2 animate-data-flow"></div>
                </div>
                <div className="w-24 h-24 rounded-2xl border border-purple-500/30 bg-neutral-900 flex items-center justify-center relative shadow-[0_0_40px_-5px_rgba(168,85,247,0.3)] z-10">
                  <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div className="w-32 h-[1px] bg-neutral-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent w-1/2 animate-data-flow" style={{ animationDelay: '.5s' }}></div>
                </div>
                <div className="w-14 h-14 rounded-full border border-neutral-700 bg-neutral-900 flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-screen h-full flex items-center justify-center relative bg-white text-black">
            <div className="text-center relative z-10">
              <h3 className="text-8xl md:text-[10rem] font-semibold tracking-tighter mb-10 heading-font">Ready?</h3>
              <a href="#contact-section" className="px-10 py-5 bg-black text-white rounded-full text-sm font-mono uppercase tracking-widest hover:scale-105 transition-transform hover-trigger inline-block hover:shadow-2xl hover:shadow-black/20">Initialize Project</a>
            </div>
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>
        </div>
      </section>

      {/* Selected Work */}
      <section id="work" className="py-32 px-6 md:px-12 bg-[#030303] border-t border-neutral-900/50">
        <div className="max-w-7xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-medium heading-font tracking-tight text-white">Selected Output</h2>
        </div>
        <div className="max-w-5xl mx-auto relative space-y-40">
          {[
            { title: 'Budgetflow', desc: 'Personal finance app — track income & expenses with interactive charts and budget reports.', url: 'https://github.com/Obsann/Budgetflow', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2940&auto=format&fit=crop', tags: ['JAVASCRIPT', 'PHP', 'HTML/CSS'], color: 'indigo', top: 'top-24' },
            { title: 'Online Auction Platform', desc: 'Full-featured auction site — create listings, place bids, and manage sales in real time.', url: 'https://github.com/Obsann/Final-Online-Auction-Platform', img: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=2940&auto=format&fit=crop', tags: ['TYPESCRIPT', 'JAVASCRIPT', 'CSS'], color: 'cyan', top: 'top-32' },
            { title: 'RMS Kebele Management', desc: 'Resource management system for local admin units — registering, updating, and tracking resources.', url: 'https://github.com/Obsann/RMS-Kebele-Management-System', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2940&auto=format&fit=crop', tags: ['TYPESCRIPT', 'JAVASCRIPT', 'CSS'], color: 'purple', top: 'top-40' },
          ].map((p) => (
            <div key={p.title} className={`sticky ${p.top} work-card group hover-trigger cursor-none`}>
              <a href={p.url} target="_blank" rel="noreferrer">
                <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl overflow-hidden aspect-video relative shadow-2xl shadow-black">
                  <img src={p.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" alt={p.title} />
                  <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div className="flex justify-between items-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div>
                        <h3 className="text-3xl font-medium text-white mb-2 heading-font">{p.title}</h3>
                        <p className="text-sm text-neutral-400 mb-3 max-w-md">{p.desc}</p>
                        <div className={`flex gap-2 text-xs font-mono text-${p.color}-300`}>
                          {p.tags.map((t) => <span key={t} className={`bg-${p.color}-900/30 border border-${p.color}-500/30 px-2 py-1 rounded`}>{t}</span>)}
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-100">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Terminal */}
      <section className="py-32 px-6 md:px-12 bg-[#030303] flex justify-center">
        <div className="max-w-4xl w-full">
          <div className="rounded-xl border border-neutral-800 bg-[#0a0a0a] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-[#0f0f0f]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="ml-4 text-xs font-mono text-neutral-500 flex-1 text-center">obsann-dev — -zsh</span>
            </div>
            <div className="p-8 font-mono text-xs md:text-sm text-neutral-300 leading-relaxed min-h-[340px]">
              <div className="mb-4">
                <span className="text-emerald-500">➜</span> <span className="text-indigo-400">~</span> <span className="text-neutral-400">./deploy_portfolio.sh --production</span>
              </div>
              <div className="mb-2">
                <span className="text-neutral-600">[14:20:01]</span> <span className="text-white">Initializing core modules...</span>
              </div>
              <div className="mb-2 pl-4 border-l border-neutral-800">
                <span className="text-neutral-500">Loading:</span> <span className="text-yellow-500">JavaScript ES2024</span><br />
                <span className="text-neutral-500">Loading:</span> <span className="text-yellow-500">TypeScript v5.3</span><br />
                <span className="text-neutral-500">Loading:</span> <span className="text-yellow-500">React v18.2.0</span><br />
                <span className="text-neutral-500">Loading:</span> <span className="text-yellow-500">Node.js</span>
              </div>
              <div className="mb-2 mt-4">
                <span className="text-neutral-600">[14:20:04]</span> Connecting to GitHub... <span className="text-emerald-500">Connected</span>
              </div>
              <div className="mb-2">
                <span className="text-neutral-600">[14:20:05]</span> Optimizing assets &amp; chunks... <span className="text-emerald-500">Done (0.42s)</span>
              </div>
              <div className="mb-6 mt-4">
                <span className="text-neutral-600">[14:20:08]</span> <span className="text-indigo-400 bg-indigo-900/20 px-2 py-0.5 rounded">Portfolio ready for deployment.</span>
              </div>
              <div className="flex items-center">
                <span className="text-emerald-500 mr-2">➜</span> <span className="text-indigo-400 mr-2">~</span> <span className="animate-blink inline-block w-2.5 h-5 bg-neutral-400"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-32 px-6 md:px-12 bg-[#030303] border-t border-b border-neutral-900/50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest border border-indigo-900/30 px-3 py-1 rounded-full bg-indigo-900/10">Let&apos;s Work Together</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-medium heading-font tracking-tight text-white mb-6 glow-text">Get In Touch</h2>
          <p className="text-lg text-neutral-400 mb-12 max-w-xl mx-auto leading-relaxed">Have a project in mind, a question, or just want to say hello? I&apos;d love to hear from you.</p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16">
            <a href="mailto:obsanhabtamu0@gmail.com" className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white text-sm font-mono uppercase tracking-wider hover:scale-105 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all duration-300 hover-trigger">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              obsanhabtamu0@gmail.com
            </a>
            <a href="https://github.com/Obsann" target="_blank" rel="noreferrer" className="group flex items-center gap-3 px-8 py-4 border border-white/10 rounded-full text-neutral-300 text-sm font-mono uppercase tracking-wider hover:border-white/30 hover:text-white hover:scale-105 hover:bg-white/5 transition-all duration-300 hover-trigger">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View GitHub
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 justify-center text-sm font-mono text-neutral-500">
            <div className="flex items-center gap-2 justify-center">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for freelance &amp; full-time</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-4 h-4 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Typically responds within 24hrs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Zoom Mask */}
      <section className="zoom-wrapper h-[200vh] relative bg-[#030303]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <div className="zoom-circle w-1 h-1 rounded-full overflow-hidden relative z-10">
            <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg" alt="Footer Visual" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h3 className="text-white text-5xl md:text-7xl heading-font font-medium tracking-tight">Let&apos;s Connect</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="py-20 px-6 border-t border-white/10 text-center bg-[#030303] relative z-20">
        <a href="mailto:obsanhabtamu0@gmail.com" className="block text-[13vw] font-bold leading-none text-[#111] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-b hover:from-white hover:to-neutral-500 transition-all duration-700 cursor-pointer hover-trigger heading-font tracking-tight">
          OBSANN
        </a>
        <div className="flex flex-col md:flex-row justify-between max-w-7xl mx-auto mt-20 text-xs font-mono text-neutral-600 gap-6">
          <div className="flex gap-4">
            <span>© 2026 OBSAN HABTAMU</span>
            <span className="text-neutral-800">/</span>
            <span className="text-green-500">ALL SYSTEMS OPERATIONAL</span>
          </div>
          <div className="flex gap-8 justify-center md:justify-end">
            <a href="mailto:obsanhabtamu0@gmail.com" className="hover:text-white transition-colors">EMAIL</a>
            <a href="https://github.com/Obsann" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GITHUB</a>
            <a href="#" className="hover:text-white transition-colors">LINKEDIN</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
