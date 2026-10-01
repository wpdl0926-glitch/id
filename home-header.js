(() => {
  const old = document.querySelector('.home-photo .elementor-location-header');
  if (!old) return;
  const logo = old.querySelector('.yid-brand-logo')?.closest('a');
  const navigation = old.querySelector('.elementor-nav-menu--main');
  if (!logo || !navigation) return;
  const hero = document.querySelector('.yid-geometry-hero');
  const brand = logo.cloneNode(true);
  brand.className = 'home-hero-brand';
  hero?.append(brand);
  const header = document.createElement('header');
  header.className = 'elementor home-scroll-header';
  logo.classList.add('home-scroll-logo');
  navigation.classList.add('home-scroll-navigation');
  header.append(logo, navigation);
  old.replaceWith(header);
  // The new header is outside Elementor's widget lifecycle; own its submenus.
  const menuItems = [...navigation.querySelectorAll(':scope > ul > .menu-item-has-children')];
  menuItems.forEach((item, index) => {
    const submenu = item.querySelector(':scope > ul');
    const pageLink = item.querySelector(':scope > a');
    if (!submenu || !pageLink) return;
    submenu.id = `home-submenu-${index}`;
    const toggle = document.createElement('button');
    toggle.className = 'home-submenu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', `${pageLink.textContent.trim()} 하위 메뉴`);
    toggle.setAttribute('aria-controls', submenu.id);
    toggle.setAttribute('aria-expanded', 'false');
    pageLink.after(toggle);
    function setOpen(open) {
      item.classList.toggle('is-submenu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }
    item.addEventListener('mouseenter', () => {
      if (matchMedia('(hover: hover)').matches) setOpen(true);
    });
    item.addEventListener('mouseleave', () => {
      if (!item.contains(document.activeElement)) setOpen(false);
    });
    toggle.addEventListener('click', () => setOpen(!item.classList.contains('is-submenu-open')));
    item.addEventListener('focusout', event => {
      if (!item.contains(event.relatedTarget)) setOpen(false);
    });
    item.addEventListener('keydown', event => {
      if (event.key === 'Escape') { setOpen(false); toggle.focus(); }
      if (event.key === 'ArrowDown' && (event.target === pageLink || event.target === toggle)) {
        event.preventDefault(); setOpen(true); submenu.querySelector('a')?.focus();
      }
    });
    submenu.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  });
  document.addEventListener('pointerdown', event => {
    menuItems.forEach(item => {
      if (!item.contains(event.target)) {
        item.classList.remove('is-submenu-open');
        item.querySelector('.home-submenu-toggle')?.setAttribute('aria-expanded','false');
      }
    });
  });
  let queued = false;
  function update() {
    const edge = hero?.getBoundingClientRect().bottom ?? 0;
    header.classList.toggle('is-compact', edge < 120);
    header.classList.toggle('is-about', edge < 80);
    queued = false;
  }
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, {passive:true});
  window.addEventListener('pageshow', update);
  window.addEventListener('resize', update);
  update();
})();
/* Record responsive base sizes before applying the compact scale. */
(() => {
  const header = document.querySelector('.home-scroll-header');
  if (!header) return;
  function measure() {
    const compact = header.classList.contains('is-compact');
    header.classList.remove('is-compact');
    header.querySelectorAll('.home-scroll-navigation > ul > li > a').forEach(link => {
      link.style.setProperty('--category-base-size', getComputedStyle(link).fontSize);
    });
    header.classList.toggle('is-compact', compact);
  }
  window.addEventListener('resize', measure);
  measure();
})();
