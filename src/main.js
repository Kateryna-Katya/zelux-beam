/**
 * Project: Zelux Beam IT School
 * Final Integrated Script 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 0. Plugin Registration ---
  if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
  }

  // --- 1. Smooth Scroll (Lenis) ---
  const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
  });

  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // --- 2. Mobile Menu (Fixed Closing Logic) ---
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (burgerBtn && mobileMenu) {
      const toggleMenu = () => {
          const isOpen = mobileMenu.classList.toggle('is-active');
          burgerBtn.classList.toggle('is-active');
          document.body.style.overflow = isOpen ? 'hidden' : '';
      };

      const closeMenu = () => {
          burgerBtn.classList.remove('is-active');
          mobileMenu.classList.remove('is-active');
          document.body.style.overflow = '';
      };

      burgerBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleMenu();
      });

      // Close menu when clicking on any link
      mobileLinks.forEach(link => {
          link.addEventListener('click', closeMenu);
      });

      // Close when clicking outside the menu
      document.addEventListener('click', (e) => {
          if (mobileMenu.classList.contains('is-active') &&
              !mobileMenu.contains(e.target) &&
              e.target !== burgerBtn) {
              closeMenu();
          }
      });
  }

  // --- 3. Global Animations (Loader + Hero) ---
  const tl = gsap.timeline();

  if (document.querySelector('.loader-overlay')) {
      tl.to('.loader-overlay', {
          scaleY: 0,
          duration: 1.2,
          ease: "expo.inOut"
      });
  }

  if (document.querySelector('.hero')) {
      tl.from('.hero__badge', { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from('.hero__title', { y: 40, opacity: 0, duration: 0.8, ease: "power4.out" }, "-=0.3")
        .from('.hero__subtitle', { y: 20, opacity: 0, duration: 0.6 }, "-=0.5")
        .from('.hero__actions .btn', { x: -20, opacity: 0, stagger: 0.2, duration: 0.6 }, "-=0.4")
        .from('.hero__circle', { scale: 0, opacity: 0, stagger: 0.3, duration: 1.5, ease: "elastic.out(1, 0.5)" }, "-=1");

      // Parallax circles effect
      window.addEventListener('mousemove', (e) => {
          const { clientX, clientY } = e;
          const xPos = (clientX / window.innerWidth - 0.5) * 40;
          const yPos = (clientY / window.innerHeight - 0.5) * 40;
          gsap.to('.hero__circle--1', { x: xPos, y: yPos, duration: 2, ease: "power2.out" });
          gsap.to('.hero__circle--2', { x: -xPos, y: -yPos, duration: 2, ease: "power2.out" });
      });
  }

  // --- 4. Scroll Reveal Animations ---
  const fadeElements = document.querySelectorAll('.fade-up');
  fadeElements.forEach(el => {
      gsap.from(el, {
          scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none"
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
      });
  });

  // --- 5. Header Effects on Scroll ---
  const header = document.querySelector('.header');
  if (header) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 50) {
              header.style.padding = '12px 0';
              header.style.background = 'rgba(5, 10, 21, 0.95)';
          } else {
              header.style.padding = '20px 0';
              header.style.background = 'rgba(5, 10, 21, 0.8)';
          }
      });
  }

  // --- 6. Captcha and Form Validation ---
  const form = document.getElementById('mainForm');
  const captchaLabel = document.getElementById('captchaLabel');
  const captchaInput = document.getElementById('captchaInput');
  const phoneInput = document.getElementById('phoneInput');
  const status = document.getElementById('formStatus');

  if (form) {
      // Generate Captcha
      let n1 = Math.floor(Math.random() * 10);
      let n2 = Math.floor(Math.random() * 10);
      if (captchaLabel) captchaLabel.innerText = `${n1} + ${n2} = ?`;

      // Digits only for phone input
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/\D/g, '');
      });

      form.addEventListener('submit', (e) => {
          e.preventDefault();

          // Captcha Verification
          if (parseInt(captchaInput.value) !== (n1 + n2)) {
              alert('Error: Incorrect captcha result!');
              return;
          }

          // Simulate Form Submission
          status.innerText = "Sending message...";
          status.className = "form-status success";
          status.style.display = "block";

          setTimeout(() => {
              status.innerText = "Success! We will contact you shortly.";
              form.reset();
              // Refresh Captcha
              n1 = Math.floor(Math.random() * 10);
              n2 = Math.floor(Math.random() * 10);
              captchaLabel.innerText = `${n1} + ${n2} = ?`;
          }, 2000);
      });
  }

  // --- 7. Cookie Popup Logic ---
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptCookies = document.getElementById('acceptCookies');

  if (cookiePopup && acceptCookies) {
      // Brand-specific storage key
      if (!localStorage.getItem('zelux_cookies_accepted')) {
          setTimeout(() => {
              cookiePopup.classList.add('is-show');
          }, 3000);
      }

      acceptCookies.addEventListener('click', () => {
          cookiePopup.classList.remove('is-show');
          localStorage.setItem('zelux_cookies_accepted', 'true');
      });
  }

  // --- 8. Anchor Navigation (Smooth) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;

          const target = document.querySelector(targetId);
          if (target) {
              lenis.scrollTo(target, { offset: -80 });
          }
      });
  });
});