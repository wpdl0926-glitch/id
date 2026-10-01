(() => {
  const titles = [...document.querySelectorAll('.yid-notice-card h3')];
  if (!titles.length) return;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  function fit() {
    for (const title of titles) {
      const base = 16.61 / (parseFloat(getComputedStyle(title.closest('.yid-notices')).zoom) || 1); // HUSS 공지 제목의 표시 크기를 공통 기본값으로 사용
      const available = title.parentElement.clientWidth / 1.025;
      const style = getComputedStyle(title);
      let low = 1, high = base;
      // 확대되는 호버 상태에서도 줄바꿈이나 잘림 없이 제목 전체 표시.
      for (let i = 0; i < 18; i++) {
        const size = (low + high) / 2;
        context.font = `700 ${size}px Pretendard`;
        const width = context.measureText(title.textContent.trim()).width
          + Math.max(0, title.textContent.trim().length - 1) * size * -.02;
        if (width <= available) low = size;
        else high = size;
      }
      title.style.fontSize = `${base}px`;
    }
  }
  const observer = new ResizeObserver(fit);
  titles.forEach(title => observer.observe(title.parentElement));
  document.fonts.ready.then(fit);
  window.addEventListener('resize', fit);
  fit();
})();
