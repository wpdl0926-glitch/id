(() => {
  const image = document.querySelector('#academics_under img[src*="undergraduate-diagram.svg"]');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!image || reduceMotion.matches || !('IntersectionObserver' in window)) return;
  const ns = 'http://www.w3.org/2000/svg';
  const make = (tag, attributes) => {
    const node = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
    return node;
  };
  async function prepare() {
    const response = await fetch(image.src);
    if (!response.ok) return;
    const doc = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
    if (doc.querySelector('parsererror')) return;
    const svg = document.importNode(doc.documentElement, true);
    svg.classList.add('education-curriculum-svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', image.alt);
    svg.style.cssText = 'display:block;width:100%;height:auto;overflow:visible';
    // Scope the Illustrator classes so other inline graphics remain independent.
    svg.querySelector('style').textContent = svg.querySelector('style').textContent.replace(/\.cls-/g, '.education-curriculum-svg .cls-');
    // Reveal at full opacity with a crisp moving edge.
    const clip = make('clipPath', {
      id:'education-flow-clip', clipPathUnits:'userSpaceOnUse'
    });
    const revealRect = make('rect', {x:61, y:0, width:0, height:264});
    clip.append(revealRect);
    svg.querySelector('defs').append(clip);
    const shapes = svg.querySelectorAll('[data-flow]');
    shapes.forEach(node => node.setAttribute('clip-path', 'url(#education-flow-clip)'));
    const duration = 3000;
    const labelDuration = 700;
    // Group each label without changing the source lettering or transforms.
    // Identical year positions produce identical reveal times.
    const labels = [...svg.querySelectorAll('[data-label-x]')].map(source => {
      const x = Number(source.getAttribute('data-label-x'));
      const target = Math.max(0, Math.min(1, (x - 61) / 507));
      let low = 0, high = 1;
      for (let i = 0; i < 24; i++) {
        const t = (low + high) / 2;
        if (t * t * (3 - 2 * t) < target) low = t;
        else high = t;
      }
      const node = make('g', {opacity:0, transform:'translate(0 6)'});
      source.before(node);
      node.append(source);
      return {node, revealAt:(low + high) / 2 * duration};
    });
    image.replaceWith(svg);
    let frame;
    let started = false;
    function finish() {
      cancelAnimationFrame(frame);
      shapes.forEach(node => node.removeAttribute('clip-path'));
      labels.forEach(({node}) => {
        node.removeAttribute('opacity');
        node.removeAttribute('transform');
      });
    }
    const observer = new IntersectionObserver(entries => {
      if (started || !entries.some(entry => entry.isIntersecting)) return;
      started = true;
      observer.disconnect();
      let start;
      function draw(time) {
        if (reduceMotion.matches) return finish();
        if (start === undefined) start = time;
        const progress = Math.min((time - start) / duration, 1);
        // Smoothstep: gentle acceleration and deceleration, no abrupt stop.
        const eased = progress * progress * (3 - 2 * progress);
        const edge = 61 + 507 * eased;
        revealRect.setAttribute('width', edge - 61);
        labels.forEach(({node, revealAt}) => {
          const t = Math.max(0, Math.min(1, (time - start - revealAt) / labelDuration));
          const lift = t * t * t * (t * (t * 6 - 15) + 10);
          node.setAttribute('opacity', lift);
          node.setAttribute('transform', `translate(0 ${6 * (1 - lift)})`);
        });
        if (progress < 1) frame = requestAnimationFrame(draw);
        else finish();
      }
      frame = requestAnimationFrame(draw);
    }, {threshold:0.3});
    observer.observe(svg);
    reduceMotion.addEventListener('change', event => {
      if (event.matches) { observer.disconnect(); finish(); }
    });
  }
  // Keep the original static image if loading or SVG enhancement fails.
  prepare().catch(() => {});
})();
