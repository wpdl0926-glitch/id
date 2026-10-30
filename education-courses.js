(() => {
  for (const sectionId of ['under_courses', 'grad_courses']) {
    const section = document.getElementById(sectionId);
    const grid = section?.querySelector('.education-under-grid, .education-course-grid');
    if (!grid) continue;
    const courses = [...grid.querySelectorAll('.education-course')];
    if (!courses.length) continue;
    const popup = document.createElement('div');
    popup.className = 'education-course-popup';
    popup.id = `${sectionId}-course-description`;
    popup.setAttribute('popover', 'auto');
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-labelledby', `${sectionId}-popup-title`);
    section.append(popup);
    let selected;
    popup.addEventListener('toggle', event => {
      if (event.newState === 'closed') {
        selected?.setAttribute('aria-expanded', 'false');
        selected?.setAttribute('aria-pressed', 'false');
      }
    });
    window.addEventListener('resize', () => popup.hidePopover());
    document.addEventListener('scroll', event => {
      if (!popup.contains(event.target)) popup.hidePopover();
    }, {capture:true, passive:true});
    courses.forEach((course, index) => {
      const heading = course.querySelector('summary');
      const name = (heading || course).textContent.trim();
      const description = course.querySelector('.education-course-description');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'education-course-choice';
      button.id = `${sectionId}-course-${index + 1}`;
      const lineBreaks = {
        '커뮤니케이션디자인기초':['커뮤니케이션','디자인기초'],
        '패션이미지와일러스트레이션':['패션이미지와','일러스트레이션'],
        '패션디자인과크리에이티브리서치':['패션디자인과','크리에이티브리서치'],
        '데이터기반통합디자인리서치':['데이터기반','통합디자인리서치'],
        '인터렉티브미디어디자인':['인터렉티브','미디어디자인'],
        '시스템사고와통합디자인':['시스템사고와','통합디자인'],
        '사용자경험과인터페이스디자인':['사용자경험과','인터페이스디자인'],
        '디지털패션커뮤니케이션':['디지털패션','커뮤니케이션'],
        '디지털커뮤니케이션디자인':['디지털커뮤니케이션','디자인'],
        '패션디자인과비즈니스':['패션디자인과','비즈니스'],
        '제품디자인프로세스':['제품디자인','프로세스'],
        '제품디자인스튜디오':['제품디자인','스튜디오'],
        '커뮤니케이션디자인스튜디오':['커뮤니케이션디자인','스튜디오'],
        '스펙큘레이티브디자인':['스펙큘레이티브','디자인'],
        '프로페셔널프랙티스':['프로페셔널','프랙티스'],
        '통합디자인기획과프로젝트':['통합디자인기획과','프로젝트'],
        '비주얼머천다이징특론':['비주얼머천다이징','특론'],
        '사회적디자인과인턴쉽':['사회적디자인과','인턴쉽'],
        '커뮤니케이션디자인연구':['커뮤니케이션','디자인연구'],
        '아이덴티티디자인연구':['아이덴티티','디자인연구'],
        '전시커뮤니케이션디자인':['전시커뮤니케이션','디자인'],
        '패션디자인비교분석연구':['패션디자인','비교분석연구'],
        '패션디자인프로세스특수과제':['패션디자인프로세스','특수과제'],
        '패션일러스트레이션연구':['패션일러스트레이션','연구'],
        '사회혁신을위한디자인연구':['사회혁신을위한','디자인연구'],
        '제품과서비스기반디자인연구':['제품과서비스기반','디자인연구'],
        '디지털패브리케이션디자인':['디지털패브리케이션','디자인'],
        '사용자인터페이스디자인연구':['사용자인터페이스','디자인연구'],
        '가족문제와사회적디자인1,3':['가족문제와','사회적디자인1,3'],
        '아동가족문제와 사회적디자인2,4':['아동가족문제와','사회적디자인2,4']
      };
      const lines = lineBreaks[name];
      if (lines) {
        button.setAttribute('aria-label', name);
        lines.forEach(text => {
          const line = document.createElement('span');
          line.className = 'education-course-name-line';
          line.textContent = text;
          button.append(line);
        });
      } else button.textContent = name;
      button.setAttribute('aria-controls', popup.id);
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        if (selected === button && popup.matches(':popover-open')) {
          popup.hidePopover();
          return;
        }
        selected?.setAttribute('aria-expanded', 'false');
        selected?.setAttribute('aria-pressed', 'false');
        selected = button;
        const title = document.createElement('h3');
        title.id = `${sectionId}-popup-title`;
        title.textContent = name;
        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'education-course-popup-close';
        close.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        close.setAttribute('aria-label', '닫기');
        close.addEventListener('click', () => {
          popup.hidePopover();
          button.setAttribute('aria-expanded', 'false');
          button.setAttribute('aria-pressed', 'false');
          button.focus({preventScroll:true});
        });
        const header = document.createElement('div');
        header.className = 'education-course-popup-header';
        header.append(title, close);
        const body = document.createElement('div');
        body.className = 'education-course-popup-body';
        if (description) body.append(description.cloneNode(true));
        else {
          const empty = document.createElement('p');
          empty.textContent = '상세 설명은 준비 중입니다.';
          body.append(empty);
        }
        popup.replaceChildren(header, body);
        popup.showPopover();
        popup.scrollTop = 0;
        const anchor = button.getBoundingClientRect();
        const box = popup.getBoundingClientRect();
        const left = Math.max(12, Math.min(anchor.left, innerWidth - box.width - 12));
        const top = anchor.bottom + 8 + box.height <= innerHeight - 12
          ? anchor.bottom + 8 : Math.max(12, anchor.top - box.height - 8);
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
        close.focus({preventScroll:true});
        button.setAttribute('aria-expanded', 'true');
        button.setAttribute('aria-pressed', 'true');
      });
      course.replaceWith(button);
    });
    // Keep each integrated column independent of the neighbouring label height.
    grid.querySelectorAll('.is-integrated > .education-course-items').forEach(items => {
      const buttons = [...items.querySelectorAll(':scope > .education-course-choice')];
      const columns = [document.createElement('div'), document.createElement('div')];
      columns.forEach(column => column.className = 'education-course-column');
      buttons.forEach((button, index) => columns[index % 2].append(button));
      items.replaceChildren(...columns);
    });
    grid.querySelectorAll('.education-grad-integrated .education-course-items').forEach(items => {
      const buttons = [...items.querySelectorAll(':scope > .education-course-choice')];
      const columns = Array.from({length:4}, () => {
        const column = document.createElement('div');
        column.className = 'education-course-column';
        return column;
      });
      buttons.forEach((button, index) => columns[index % 4].append(button));
      items.replaceChildren(...columns);
    });
    section.classList.add('education-courses-enhanced');
  }
})();
