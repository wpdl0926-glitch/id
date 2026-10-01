/* 로컬 사본에서 WordPress 서버 요청과 폼 제출을 차단합니다. */
(() => {
  const blocked = url => /wp-admin|rest_route|wp-json/.test(String(url));
  const originalFetch = window.fetch;
  window.fetch = function (input, options) {
    const url = input instanceof Request ? input.url : input;
    if (blocked(url)) return Promise.resolve(new Response('{}', {headers: {'Content-Type': 'application/json'}}));
    return originalFetch.call(this, input, options);
  };
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    return open.call(this, method, blocked(url) ? './offline.json' : url, ...rest);
  };
  document.addEventListener('submit', event => {
    event.preventDefault();
    alert('로컬 사본에서는 검색·폼 제출을 지원하지 않습니다. 원본 홈페이지에서 이용해 주세요.');
  }, true);
})();
