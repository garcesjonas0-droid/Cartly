const API = 'http://localhost:5000/api';

/* ── AUTH HELPERS ── */
const getToken = () => localStorage.getItem('cartly_token');
const getUser = () => JSON.parse(localStorage.getItem('cartly_user') || 'null');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

/* ── CART HELPERS ── */
const getCart = () => JSON.parse(localStorage.getItem('cartly_cart') || '[]');
const setCart = (cart) => {
  localStorage.setItem('cartly_cart', JSON.stringify(cart));
  updateCartBadge();
};

function updateCartBadge() {
  const count = getCart().reduce((s, i) => s + i.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ── WISHLIST HELPERS ── */
const getWishlist = () => JSON.parse(localStorage.getItem('cartly_wishlist') || '[]');
const setWishlist = (list) => {
  localStorage.setItem('cartly_wishlist', JSON.stringify(list));
  updateWishlistBadge();
};

function updateWishlistBadge() {
  const count = getWishlist().length;
  document.querySelectorAll('.wishlist-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function isWishlisted(id) {
  return getWishlist().some(item => item.id === id);
}

function toggleWishlist(btn, id, name, price, image, category) {
  if (!getToken()) {
    toast('Please login to use wishlist 🔐', 'info');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }
  let wishlist = getWishlist();
  const exists = wishlist.findIndex(item => item.id === id);

  if (exists > -1) {
    wishlist.splice(exists, 1);
    if (btn) { btn.classList.remove('active'); btn.textContent = '♡'; }
    toast('Removed from wishlist', 'info');
  } else {
    wishlist.push({ id, name, price, image: image || '', category: category || '' });
    if (btn) { btn.classList.add('active'); btn.textContent = '♥'; }
    toast('Added to wishlist ♥', 'success');
  }
  setWishlist(wishlist);
}

function removeFromWishlist(id) {
  let wishlist = getWishlist().filter(item => item.id !== id);
  setWishlist(wishlist);
}

/* ── TOAST ── */
function toast(msg, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 300);
  }, duration);
}

/* ── PAGE TRANSITIONS ── */
function navigateTo(url) {
  document.body.classList.add('page-exit');
  setTimeout(() => { window.location.href = url; }, 350);
}

function initPageTransition() {
  document.body.classList.add('page-enter');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add('page-enter-active');
    });
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('http') &&
      !href.startsWith('#') &&
      !href.startsWith('mailto') &&
      !href.startsWith('javascript') &&
      href.endsWith('.html')
    ) {
      e.preventDefault();
      navigateTo(href);
    }
  });
}

/* ── SCROLL ANIMATIONS ── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.feature-card, .product-card, .order-card, .profile-card, ' +
    '.cart-item, .hero-content, .hero-stats, .section-title, ' +
    '.section-label, .section-sub, .page-header, .cart-summary, ' +
    '.auth-form-side, .marquee-section, .wishlist-card'
  ).forEach((el, i) => {
    el.classList.add('anim-hidden');
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.4)}s`;
    observer.observe(el);
  });
}

/* ── SCROLL SPY ── */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], [id="about"]');
  if (sections.length === 0) return;

  const navLinks = document.querySelectorAll('.nav-links a[href]');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const isMatch =
          href === `#${id}` ||
          href === `index.html#${id}` ||
          (id === 'home' && (href === 'index.html' || href === '#'));
        link.classList.remove('active');
        if (isMatch) link.classList.add('active');
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(section => spyObserver.observe(section));
}

/* ── SMOOTH SCROLL ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── NAVBAR ── */
function initNavbar() {
  const user = getUser();
  const authEl = document.getElementById('nav-auth');
  if (authEl) {
    if (user) {
      authEl.innerHTML = `
        <a class="nav-link" href="profile.html" style="color:var(--primary)">${user.name.split(' ')[0]}</a>
        <a class="nav-link" href="#" onclick="logout()">Logout</a>`;
    } else {
      authEl.innerHTML = `<a class="nav-link" href="login.html">Login</a>`;
    }
  }
  updateCartBadge();
  updateWishlistBadge();

  window.addEventListener('scroll', () => {
    document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 20);
  });

  document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('open');
  });
}

function logout() {
  localStorage.removeItem('cartly_token');
  localStorage.removeItem('cartly_user');
  localStorage.removeItem('cartly_cart');
  toast('Logged out. See you soon! 👋', 'info');
  setTimeout(() => navigateTo('login.html'), 1000);
}

/* ── FORMAT ── */
const fmt = (n) => `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
const fmtDate = (d) => new Date(d).toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' });

/* ── EMPTY STATE ── */
function emptyState(icon, title, desc, btnText, btnHref) {
  return `
    <div class="empty-state anim-hidden anim-visible">
      <div class="empty-state-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${desc}</p>
      ${btnHref ? `<a href="${btnHref}" class="btn-primary" style="display:inline-flex">${btnText}</a>` : ''}
    </div>`;
}

/* ── STATUS ── */
function statusChip(status) {
  const emojis = { pending:'⏳', processing:'🔄', shipped:'🚚', delivered:'✅', cancelled:'❌' };
  return `<span class="status-chip status-${status}">${emojis[status]||'📦'} ${status.toUpperCase()}</span>`;
}

/* ── INIT ── */
window.addEventListener('DOMContentLoaded', () => {
  initPageTransition();
  initNavbar();
  initSmoothScroll();
  initScrollSpy();
  setTimeout(initScrollAnimations, 100);
});
