(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.querySelector('.about-editorial');
  if (!root || !('IntersectionObserver' in window)) return;
  const sections = [...root.querySelectorAll('.about-sections section')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  sections.forEach(section => {
    if (section.getBoundingClientRect().top >= innerHeight) {
      section.classList.add('about-reveal');
      observer.observe(section);
    }
  });
})();
