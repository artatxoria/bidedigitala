// public/assets/js/script.js

// — Funciones auxiliares —
// Estas pueden quedar fuera del DOMContentLoaded
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    z-index: 1001;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    font-family: 'Open Sans', sans-serif;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.style.transform = 'translateX(0)', 100);
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 5000);
}

function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 150) {
      el.classList.add('active');
    }
  });
}

function initTooltips() {
  document.querySelectorAll('[data-tooltip]').forEach(trigger => {
    trigger.addEventListener('mouseenter', () => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = trigger.dataset.tooltip;
      tooltip.style.cssText = `
        position: absolute;
        background: #1f2937;
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(tooltip);
      const rect = trigger.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
      tooltip.style.top  = `${rect.top - tooltip.offsetHeight - 10}px`;
      setTimeout(() => tooltip.style.opacity = '1', 100);
      trigger.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        setTimeout(() => document.body.removeChild(tooltip), 300);
      }, { once: true });
    });
  });
}


// Typing Animation
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const text = typingElement.textContent;
    typingElement.textContent = '';
    
    let index = 0;
    const speed = 50; // milliseconds per character

    function typeWriter() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        } else {
            // Add blinking cursor effect
            typingElement.style.borderRight = '3px solid #1e3a8a';
            typingElement.style.animation = 'blink 1s infinite';
        }
    }

    // Start typing animation after a short delay
    setTimeout(typeWriter, 1000);
}


// Mobile Navigation
function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}













// — Único listener de DOMContentLoaded —  
document.addEventListener('DOMContentLoaded', () => {

      // Mobile Navigation
    initMobileNavigation();
  
  // Typing Animation
    initTypingAnimation();


  // 1) Toggle menú móvil
  /* const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('primary-navigation');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  } */

  // 2) Navegación suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = target.offsetTop - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  // 3) Parallax y header scroll
  const header = document.querySelector('.header');
  const parallaxImg = document.querySelector('.hero-bg-image');
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (parallaxImg) {
      parallaxImg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    if (header) {
      if (scrolled > 100) {
        header.style.background = 'rgba(255,255,255,0.98)';
        header.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
      } else {
        header.style.background = 'rgba(255,255,255,0.95)';
        header.style.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.05)';
      }
    }
    // RevealOnScroll dentro del mismo scroll
    revealOnScroll();
  });

  // 4) IntersectionObserver para animaciones
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll(
    '.problem-card, .value-card, .service-card, .benefit-item, .process-step'
  ).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // 5) Lazy loading de imágenes
  const images = document.querySelectorAll('img[data-src]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imgObserver.unobserve(img);
      }
    });
  });
  images.forEach(img => imgObserver.observe(img));

  // 6) Formulario de contacto
  const contactForm = document.getElementById('formulario-contacto');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const data = new FormData(this);
      const name    = data.get('name');
      const email   = data.get('email');
      const message = data.get('message');
      if (!name || !email || !message) {
        showNotification('Mesedez, bete beharrezko eremuak.', 'error');
        return;
      }
      if (!isValidEmail(email)) {
        showNotification('Mesedez, sartu baliozko email helbide bat.', 'error');
        return;
      }
      showNotification('Zure mezua bidali da! Laster harremanetan jarriko gara zurekin.', 'success');
      this.reset();
    });
  }

  // 7) Tooltips
  initTooltips();

  // 8) Cerrar menú al cambiar a escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menu) {
      menu.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
});
