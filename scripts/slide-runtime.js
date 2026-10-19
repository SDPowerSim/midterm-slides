(function () {
  'use strict';

  const stage = document.querySelector('.stage');
  const standalone = window.top === window.self;

  function resize() {
    if (!standalone || !stage) return;
    const scale = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  function setActive(active) {
    document.body.classList.remove('is-active');
    if (active) {
      void document.body.offsetWidth;
      document.body.classList.add('is-active');
    }
    window.dispatchEvent(new CustomEvent(active ? 'slideactive' : 'slideinactive'));
  }

  function navigate(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let action = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') action = 'next';
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') action = 'previous';
    else if (event.key === 'Home') action = 'first';
    else if (event.key === 'End') action = 'last';
    if (!action) return;
    event.preventDefault();
    if (!standalone) window.parent.postMessage({ type: 'specwatt:navigate', action }, '*');
  }

  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'specwatt:visibility') setActive(Boolean(event.data.active));
  });
  window.addEventListener('keydown', navigate);
  window.addEventListener('resize', resize);
  resize();
  setActive(standalone);
})();
