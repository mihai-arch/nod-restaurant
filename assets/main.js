// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

setInterval(() => {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top = fy + 'px';
}, 16);

document.querySelectorAll('button, a, .room-card, input, select').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// ===== PARTICLES =====
const pContainer = document.getElementById('particles');
if (pContainer) {
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (4 + Math.random() * 7) + 's';
    p.style.animationDelay = (Math.random() * 5) + 's';
    p.style.opacity = Math.random() * 0.5;
    pContainer.appendChild(p);
  }
}

// ===== INTRO =====
const intro = document.getElementById('intro');
const mainSite = document.getElementById('main-site');
const introCard = document.getElementById('intro-card');
let introDismissed = false;

if (introCard) {
  gsap.from(introCard, { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.4 });
}

function dismissIntro() {
  if (introDismissed) return;
  introDismissed = true;

  gsap.timeline()
    .to(introCard, { scale: 1.04, duration: 0.3, ease: 'power2.in' })
    .to(intro, { opacity: 0, duration: 0.8, ease: 'power2.inOut' })
    .to(mainSite, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .set(intro, { display: 'none' });

  setTimeout(() => {
    const els = [
      { id: 'h-tagline', delay: 0.2 },
      { id: 'h-name', delay: 0.5 },
      { id: 'h-sub', delay: 0.8 },
      { id: 'h-desc', delay: 1.0 },
      { id: 'h-btns', delay: 1.2 },
      { id: 'h-scroll', delay: 1.6 },
    ];
    els.forEach(({ id, delay }) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.transition = `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  }, 300);
}

window.addEventListener('scroll', dismissIntro, { once: true });
window.addEventListener('wheel', dismissIntro, { once: true });
window.addEventListener('touchmove', dismissIntro, { once: true });
setTimeout(() => { if (!introDismissed) dismissIntro(); }, 4500);

// ===== NAV + PROGRESS =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('solid', window.scrollY > 80);

  const winH = document.documentElement.scrollHeight - window.innerHeight;
  const bar = document.getElementById('progress');
  if (bar) bar.style.width = (window.scrollY / winH * 100) + '%';

  // Hero parallax
  if (introDismissed) {
    const heroBg = document.querySelector('.hero-video-bg');
    if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
  }
});

// ===== REVEAL ON SCROLL =====
const revealEls = document.querySelectorAll('.reveal-up');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// ===== ROOM TRANSITION =====
function enterRoom(name, dest) {
  const overlay = document.getElementById('room-transition');
  const txt = document.getElementById('transition-text');
  if (!overlay || !txt) return;

  txt.textContent = name;
  gsap.timeline()
    .to(overlay, { opacity: 1, duration: 0.4, ease: 'power2.in', pointerEvents: 'all' })
    .to(txt, { opacity: 1, duration: 0.3 }, '-=0.1')
    .to(txt, { opacity: 0, duration: 0.3, delay: 0.5 })
    .to(overlay, {
      opacity: 0, duration: 0.5, ease: 'power2.out', pointerEvents: 'none',
      onComplete: () => {
        if (dest && dest.startsWith('#')) {
          const target = document.querySelector(dest);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        } else if (dest) {
          window.location.href = dest;
        }
      }
    });
}

// ===== VIDEO FALLBACK =====
const vid = document.getElementById('hero-video');
const fallback = document.getElementById('hero-fallback');
if (vid && fallback) {
  vid.addEventListener('error', () => {
    vid.style.display = 'none';
    fallback.style.display = 'block';
  });
}

// ===== REZERVARE FORM =====
function submitRezervare(e) {
  e.preventDefault();
  const btn = document.getElementById('form-btn');
  const form = document.getElementById('rezervare-form');

  const data = {
    nume: form.nume.value,
    telefon: form.telefon.value,
    data: form.data.value,
    ora: form.ora.value,
    persoane: form.persoane.value,
    ocazie: form.ocazie.value,
    mentiuni: form.mentiuni.value,
    timestamp: new Date().toISOString()
  };

  // Send to Google Apps Script (replace URL with your deployed script URL)
  const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

  if (SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  btn.textContent = '✓ Rezervare confirmată — te contactăm în curând';
  btn.style.background = '#2a5e3f';
  btn.style.color = '#fff';
  btn.style.letterSpacing = '1px';
  btn.style.fontSize = '11px';
  btn.disabled = true;
}
