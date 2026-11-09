(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.education-language-toggle');
  if (!toggle) return;

  const localizedAttributes = ['aria-label', 'alt'].flatMap(attribute =>
    [...document.querySelectorAll(`[data-ed-${attribute}-en]`)].map(element => ({
      element,
      attribute,
      ko: element.getAttribute(attribute),
      en: element.getAttribute(`data-ed-${attribute}-en`)
    }))
  );
  const koreanTitle = document.title;

  toggle.addEventListener('click', () => {
    const english = root.dataset.educationLanguage !== 'en';
    const language = english ? 'en' : 'ko';
    document.querySelectorAll('.education-course-popup:popover-open').forEach(popup => popup.hidePopover());
    root.dataset.educationLanguage = language;
    root.lang = english ? 'en' : 'ko-KR';
    toggle.setAttribute('aria-pressed', String(english));
    toggle.title = english ? '한국어로 보기' : 'View in English';
    document.title = english ? 'Education – Yonsei University Department of Integrated Design' : koreanTitle;
    localizedAttributes.forEach(({element, attribute, ko, en}) => {
      element.setAttribute(attribute, english ? en : ko);
    });
  });
  toggle.title = 'View in English';
  toggle.hidden = false;
})();
