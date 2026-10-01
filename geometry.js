(() => {
  const svg = document.querySelector('.yid-geometry');
  if (!svg) return;
  const round = svg.querySelector('.yid-geometry__round');
  const square = svg.querySelector('.yid-geometry__square');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const minChange = 415.83 * 0.20; // 전체 너비의 20%를 최소 변화폭으로 설정
  const initialWidth = 265.19;
  // 마지막 → 처음을 포함해 모든 인접 비율이 최소 변화폭 이상 차이납니다.
  const widths = [initialWidth, initialWidth - minChange * 1.45,
    initialWidth + minChange * 0.90, initialWidth - minChange * 1.15];
  const hold = 3000;
  const transition = 1000;
  const interval = hold + transition;
  let frame, lastTime, clock = 0;
  let heroVisible = true;
  let slides = [], initialized = false, preparedStep = -1;
  const layers = [...document.querySelectorAll('.yid-photo-layer')];
  let activeLayer = 0;
  function loadSlide(config) {
    return new Promise(resolve => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      const timeout = setTimeout(() => { image.onload = image.onerror = null; resolve(null); }, 10000);
      image.onload = () => {
        clearTimeout(timeout);
        let palette;
        try { palette = YIDColors.analyzeImage(image, config.analysis); }
        catch (_) {
          const hex = config.fallback || '#929FAA';
          palette = {source:null, complement:hex, rgb:hex.match(/[0-9a-f]{2}/gi).map(n => parseInt(n,16)), fallback:true};
        }
        if (/^#[0-9a-f]{6}$/i.test(config.color || '')) {
          palette = {...palette, complement:config.color.toUpperCase(),
            rgb:config.color.slice(1).match(/.{2}/g).map(n => parseInt(n,16)), override:true};
        }
        resolve({...config, palette});
      };
      image.onerror = () => { clearTimeout(timeout); resolve(null); };
      image.src = config.src;
    });
  }
  function photoState(step, progress) {
    if (!slides.length || layers.length !== 2) return;
    const current = slides[step % slides.length];
    const next = slides[(step + 1) % slides.length];
    if (preparedStep !== step) {
      activeLayer = step % 2;
      layers[activeLayer].src = current.src;
      layers[activeLayer].style.objectPosition = 'center center';
      layers[1-activeLayer].src = next.src;
      layers[1-activeLayer].style.objectPosition = 'center center';
      preparedStep = step;
      // Expose the calculated palette for inspection without adding UI to the page.
      svg.dataset.photo = current.src;
      svg.dataset.sourceColor = current.palette.source || '';
      svg.dataset.complement = current.palette.complement;
    }
    // Keep the lower layer opaque to avoid a flash of the dark base mid-crossfade.
    layers[activeLayer].style.opacity = activeLayer === 0 ? '1' : String(1-progress);
    layers[1-activeLayer].style.opacity = activeLayer === 0 ? String(progress) : '1';
    const rgb = current.palette.rgb.map((c,j) => c + (next.palette.rgb[j]-c)*progress);
    svg.style.setProperty('--yid-photo-complement', YIDColors.hex(rgb));
  }
  const photosReady = Promise.all((window.YID_HOME_SLIDES || []).map(loadSlide)).then(results => {
    slides = results.filter(Boolean);
    initialized = true;
    window.YID_HOME_PALETTES = slides.map(({src,palette}) => ({src,...palette}));
    photoState(0,0);
    ready();
  });
  let currentWidth = initialWidth;
  function draw(width) {
    currentWidth = width;
    const header = document.querySelector('[data-elementor-type="header"]');
    const hero = svg.parentElement;
    if (header && !document.body.classList.contains('home-photo')) {
      const gap = svg.getBoundingClientRect().top - header.getBoundingClientRect().bottom;
      if (Math.abs(gap - 3) > 0.1) {
        const margin = parseFloat(getComputedStyle(hero).marginTop) || 0;
        hero.style.setProperty('margin-top', `${margin + 3 - gap}px`, 'important');
      }
    }
    const bounds = svg.getBoundingClientRect();
    const extent = bounds.height > 0 ? bounds.width / bounds.height * 204.09 : 415.83;
    svg.setAttribute('viewBox', `0 0 ${extent} 204.09`);
    width = width / 415.83 * extent;
    const radius = 102.045;
    const cap = width - radius;
    round.setAttribute('d', `M0,0H${cap}A${radius},${radius} 0 0 1 ${cap},204.09H0Z`);
    square.setAttribute('x', width + 19.89);
    square.setAttribute('width', extent - width - 19.89);
  }
  function tick(now) {
    if (lastTime !== undefined) clock += now - lastTime;
    lastTime = now;
    const step = Math.floor(clock / interval);
    const index = step % widths.length;
    const elapsed = clock % interval;
    const progress = Math.max(0, Math.min(1, (elapsed - hold) / transition));
    const eased = (1 - Math.cos(Math.PI * progress)) / 2;
    draw(widths[index] + (widths[(index + 1) % widths.length] - widths[index]) * eased);
    photoState(step, eased);
    frame = requestAnimationFrame(tick);
  }
  function play() {
    cancelAnimationFrame(frame);
    lastTime = undefined;
    if (motion.matches) { clock = 0; preparedStep = -1; draw(widths[0]); photoState(0,0); }
    else if (!document.hidden && heroVisible) frame = requestAnimationFrame(tick);
  }
  function ready() {
    if (!initialized || document.documentElement.classList.contains('intro-enabled')) return;
    observer.disconnect();
    play();
  }
  const observer = new MutationObserver(ready);
  observer.observe(document.documentElement, {attributes:true, attributeFilter:['class']});
  ready();
  const header = document.querySelector('[data-elementor-type="header"]');
  const resize = new ResizeObserver(() => {
    draw(currentWidth);
    document.body.style.setProperty('--home-header-height', `${header?.getBoundingClientRect().height || 0}px`);
  });
  resize.observe(svg);
  if (header) resize.observe(header);
  motion.addEventListener('change', play);
  // Preserve the visual sequence while pausing the brand motion outside the hero.
  const visibility = new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    if (initialized && !document.documentElement.classList.contains('intro-enabled')) play();
  });
  visibility.observe(svg.parentElement);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); lastTime = undefined; }
    else if (!document.documentElement.classList.contains('intro-enabled')) play();
  });
})();
