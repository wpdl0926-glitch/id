(() => {
  const input = document.querySelector('#notice-filter');
  if (!input) return;
  const rows = [...document.querySelectorAll('#notice_latest .notice-list li')];
  const empty = document.querySelector('.notice-empty');
  input.addEventListener('input', () => {
    const query = input.value.trim().toLocaleLowerCase();
    rows.forEach(row => { row.hidden = !row.textContent.toLocaleLowerCase().includes(query); });
    empty.hidden = rows.some(row => !row.hidden);
  });
})();
