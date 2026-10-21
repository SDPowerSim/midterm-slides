(function () {
  'use strict';

  const deck = document.getElementById('deck');
  const slides = Array.from(deck.querySelectorAll('.deck-slide'));
  const progress = document.querySelector('.deck-progress span');
  const previous = document.querySelector('.deck-nav.prev');
  const next = document.querySelector('.deck-nav.next');
  let current = Math.min(slides.length - 1, Math.max(0, Number(location.hash.slice(1) || 1) - 1));

  function resize() {
    const scale = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    deck.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  function tellSlide(slide, active) {
    try { slide.contentWindow.postMessage({ type: 'specwatt:visibility', active }, '*'); }
    catch (error) { /* A static server keeps all pages on the same origin. */ }
  }

  function showSlide(index, updateHash = true) {
    const target = Math.min(slides.length - 1, Math.max(0, index));
    slides.forEach(function (slide, slideIndex) {
      const active = slideIndex === target;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
      tellSlide(slide, active);
    });
    current = target;
    progress.style.width = `${(current + 1) / slides.length * 100}%`;
    deck.setAttribute('aria-label', `P11 slide ${current + 1} of ${slides.length}`);
    if (updateHash) history.replaceState(null, '', `#${current + 1}`);
    window.focus();
  }

  function move(delta) { showSlide(current + delta); }

  function onKeyDown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') move(1);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') move(-1);
    else if (event.key === 'Home') showSlide(0);
    else if (event.key === 'End') showSlide(slides.length - 1);
    else return;
    event.preventDefault();
  }

  slides.forEach(function (slide, index) {
    slide.addEventListener('load', function () { tellSlide(slide, index === current); });
  });
  previous.addEventListener('click', function () { move(-1); });
  next.addEventListener('click', function () { move(1); });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', resize);
  window.addEventListener('hashchange', function () {
    const value = Number(location.hash.slice(1));
    if (Number.isFinite(value)) showSlide(value - 1, false);
  });
  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'specwatt:navigate') return;
    if (event.data.action === 'next') move(1);
    else if (event.data.action === 'previous') move(-1);
    else if (event.data.action === 'first') showSlide(0);
    else if (event.data.action === 'last') showSlide(slides.length - 1);
  });

  resize();
  showSlide(current, false);
})();
