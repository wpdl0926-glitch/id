(() => {
  const card = document.querySelector('.floating-notice');
  if (!card) return;
  const items = [...card.querySelectorAll('.floating-notice-item')];
  const position = card.querySelector('.notice-position');
  let current = 0;
  card.querySelectorAll('[data-notice-step]').forEach(button => {
    button.addEventListener('click', () => {
      items[current].hidden = true;
      current = (current + Number(button.dataset.noticeStep) + items.length) % items.length;
      items[current].hidden = false;
      position.textContent = `${String(current+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
    });
  });
  card.querySelector('.notice-dismiss').addEventListener('click', () => {
    card.hidden = true;
    document.querySelector('.home-scroll-cue')?.focus({preventScroll:true});
  });
})();
