// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Lenis smooth scroll — integrated with GSAP ticker
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: true,
  wheelMultiplier: 0.8,
  touchMultiplier: 2,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// Shutter animation on load
setTimeout(() => { document.body.classList.add('loaded'); }, 100);

// Custom cursor
const cursor = document.getElementById('cursor');
const hoverTriggers = document.querySelectorAll('.hover-trigger');

document.addEventListener('mousemove', (e) => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
});

hoverTriggers.forEach((el) => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// Bento hover glows
document.querySelectorAll('.bento-sm').forEach((card) => {
  const glow = card.querySelector('.hover-glow');
  if (glow) {
    card.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
    card.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  }
  const svg = card.querySelector('svg');
  if (svg) {
    const isAuth = card.id === 'auth-card';
    card.addEventListener('mouseenter', () => { svg.style.color = isAuth ? '#fb7185' : '#22d3ee'; });
    card.addEventListener('mouseleave', () => { svg.style.color = '#737373'; });
  }
});

// Grid drawing
document.querySelectorAll('.grid-cell').forEach((cell) => {
  ScrollTrigger.create({
    trigger: cell,
    start: 'top 85%',
    onEnter: () => cell.classList.add('active'),
  });
});

// Marquee scroll
gsap.to('.marquee-content', {
  xPercent: -20,
  ease: 'none',
  scrollTrigger: { trigger: '.marquee-container', scrub: 1.5 },
});

// Manifesto text highlight
const manifesto = document.getElementById('manifesto');
if (manifesto) {
  const text = manifesto.innerText;
  manifesto.innerHTML = '';
  text.split(' ').forEach((word) => {
    const span = document.createElement('span');
    span.innerText = word + ' ';
    span.style.opacity = '0.1';
    span.style.transition = 'opacity 0.3s ease';
    manifesto.appendChild(span);
  });

  gsap.to(manifesto.querySelectorAll('span'), {
    opacity: 1,
    color: '#ffffff',
    stagger: 0.05,
    scrollTrigger: { trigger: manifesto, start: 'top 80%', end: 'bottom 50%', scrub: 1 },
  });
}

// Horizontal scroll process
const processSection = document.querySelector('.process-wrapper');
const processContainer = document.querySelector('.process-container');

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
  });
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
});

// Spin animation (for architecture visual)
const style = document.createElement('style');
style.textContent = `@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;
document.head.appendChild(style);
