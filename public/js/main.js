/* ===== Aegean Marine Club — Scripts ===== */
(function () {
  'use strict';

  /* Mobile menu toggle */
  function initMenu() {
    var toggle = document.querySelector('.nav__toggle');
    var links = document.querySelector('.nav__links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }

  /* Hero carousel (5 photos) */
  function initCarousel() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero__slide'));
    var dotsWrap = document.querySelector('.hero__dots');
    if (slides.length === 0 || !dotsWrap) return;

    var current = 0;
    var timer = null;

    // build dots
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Φωτογραφία ' + (i + 1));
      dot.addEventListener('click', function () {
        go(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function go(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function next() { go(current + 1); }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, 5000);
    }

    go(0);
    restart();
  }

  /* Contact form — real submission via Web3Forms */
  function initForm() {
    var form = document.querySelector('.form');
    if (!form) return;

    // Only intercept Web3Forms-powered forms
    var isWeb3 = /api\.web3forms\.com/.test(form.getAttribute('action') || '');
    if (!isWeb3) return;

    var success = form.querySelector('.form__success');
    var submitBtn = form.querySelector('[type="submit"]');
    var defaultBtnText = submitBtn ? submitBtn.textContent : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Αποστολή...'; }

      var data = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (success) {
            success.classList.add('show');
            if (json.success) {
              success.textContent = 'Ευχαριστούμε! Το μήνυμά σου στάλθηκε με επιτυχία.';
              form.reset();
            } else {
              success.textContent = 'Κάτι πήγε στραβά: ' + (json.message || 'Δοκίμασε ξανά.');
            }
          } else if (json.success) {
            form.reset();
          }
        })
        .catch(function () {
          if (success) {
            success.classList.add('show');
            success.textContent = 'Σφάλμα σύνδεσης. Δοκίμασε ξανά αργότερα.';
          }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = defaultBtnText; }
          if (success) {
            setTimeout(function () { success.classList.remove('show'); }, 6000);
          }
        });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initCarousel();
    initForm();
  });
})();
