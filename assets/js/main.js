// NTK Digitals — shared site behaviour

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- mobile nav ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const mobilePanel = document.getElementById('mobilePanel');
  if (menuBtn && mobilePanel) {
    menuBtn.addEventListener('click', () => {
      const open = mobilePanel.classList.toggle('open');
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- theme toggle (persists for the session via localStorage-free approach) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  function applyThemeLabel() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (themeToggle) themeToggle.textContent = isDark ? '☀' : '☾';
    if (themeToggle) themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  applyThemeLabel();
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      applyThemeLabel();
    });
  }

  /* ---------- one orchestrated hero reveal ---------- */
  document.querySelectorAll('.reveal-in').forEach((el, i) => {
    setTimeout(() => el.classList.add('ready'), 80 + i * 90);
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.setAttribute('role', 'button');
    q.setAttribute('tabindex', '0');
    q.setAttribute('aria-expanded', 'false');
    function toggle() {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        a.style.maxHeight = null;
        q.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    }
    q.addEventListener('click', toggle);
    q.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  /* ---------- contact form -> Web3Forms (forwards straight to Gmail) ----------
     Requires a free access key from https://web3forms.com pasted into the
     hidden "access_key" input in contact.html. Until that's set, submissions
     will fail with a clear message instead of pretending to succeed. */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('formMsg');
      const submitBtn = form.querySelector('button[type="submit"]');
      const accessKey = form.querySelector('input[name="access_key"]').value;

      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        if (msg) {
          msg.style.display = 'block';
          msg.style.color = '#b3462c';
          msg.textContent = 'Form isn\u2019t connected yet - add a Web3Forms access key in contact.html.';
        }
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const result = await res.json();
        if (msg) {
          msg.style.display = 'block';
          if (result.success) {
            msg.style.color = '';
            msg.textContent = "Thanks, that's been sent. We'll reply within one business day.";
            form.reset();
          } else {
            msg.style.color = '#b3462c';
            msg.textContent = 'Something went wrong sending that - please try again or email directly.';
          }
        }
      } catch (err) {
        if (msg) {
          msg.style.display = 'block';
          msg.style.color = '#b3462c';
          msg.textContent = 'Something went wrong sending that - please try again or email directly.';
        }
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send message'; }
      }
    });
  }

});
