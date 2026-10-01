(() => {
  const overlay = document.querySelector('.yid-intro');
  if (!overlay) return;
  if (!document.documentElement.classList.contains('intro-enabled')) {
    overlay.remove();
    return;
  }
  const content = [...document.body.children].filter(el => el !== overlay && !['SCRIPT', 'STYLE', 'LINK'].includes(el.tagName));
  const previous = content.map(el => [el, el.inert]);
  previous.forEach(([el]) => { el.inert = true; });
  const finish = () => {
    document.documentElement.classList.remove('intro-enabled');
    previous.forEach(([el, inert]) => { el.inert = inert; });
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  };
  const onKey = event => { if (event.key === 'Escape') finish(); };
  document.addEventListener('keydown', onKey);
  overlay.addEventListener('animationend', event => {
    if (event.target === overlay && event.animationName === 'yid-intro-reveal') finish();
  });
  // 복원된 탭이나 애니메이션 이벤트가 누락된 경우에도 메인 화면을 엽니다.
  setTimeout(finish, 3300);
  window.addEventListener('pageshow', event => { if (event.persisted) finish(); });
})();
