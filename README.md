# 연세대학교 통합디자인학과 홈페이지

2026년 10월 2일 최신 수정본을 GitHub 업로드용으로 정리한 정적 사이트입니다.
Node.js 설치나 빌드 작업 없이 HTML·CSS·JavaScript 파일로 실행합니다.

## GitHub에 업로드

ZIP을 풀고 `integrated-design-github` 폴더 **안의 내용 전체**를 저장소 최상위에 올리세요.
저장소 최상위에 `index.html`, `assets/`, `.nojekyll`이 있어야 합니다.
ZIP 파일 자체만 업로드하면 홈페이지가 게시되지 않습니다.
파일이 많으므로 Git 또는 GitHub Desktop으로 폴더 전체를 커밋하면 편리합니다.
로컬 작업용 스크린샷, 이전 수정본, Git 설정과 개발용 재생성 스크립트는 포함하지 않았습니다.

## GitHub Pages 게시

저장소에서 **Settings → Pages → Build and deployment**로 들어갑니다.
Source는 **Deploy from a branch**, Branch는 **main**, 폴더는 **/(root)**로 선택하고 저장합니다.
`.nojekyll`을 함께 올려야 별도 Jekyll 처리 없이 정적 파일을 게시합니다.
사이트 내부 경로는 상대경로이므로 `https://사용자.github.io/저장소명/`에서도 동작합니다.
공식 안내: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 로컬 확인

이 폴더에서 아래 명령을 실행하고 http://127.0.0.1:8767/ 을 엽니다.

```sh
python3 -m http.server 8767 --bind 127.0.0.1
```

HTML을 더블 클릭하는 방식보다 위 HTTP 미리보기를 사용하세요.
사진 색상 분석과 스크립트 로딩을 실제 게시 환경과 같은 방식으로 확인할 수 있습니다.

## 주요 파일

- `index.html`: 메인, 작은 우측 하단 플로팅 공지, 스크롤로 이어지는 ABOUT
- `about.html`, `education.html`, `works.html`, `people.html`, `board.html`: 주요 하위 페이지
- `post-*.html`: 공지 본문 및 이전 URL 호환 페이지
- `assets/`: 로고, 사진, 폰트, 공지 이미지와 첨부파일, 기존 정적 라이브러리
- `home-slides.js`: 메인 사진 목록
- `home-flow.css`, `home-header.js`: 메인 배너와 상단 메뉴
- `education-editorial.css`, `interior-editorial.css`: 하위 페이지 레이아웃
- `ASSET_MANIFEST.json`: 포함 파일의 크기 및 SHA-256 체크섬

## 동작 범위와 폰트

메인 애니메이션, 공지 넘기기·닫기, 카테고리 메뉴, 교육과목 펼치기,
최근 공지 10건의 제목 검색은 정적 사이트에서 동작합니다.
학과의 외부 전시 사이트, 교수 프로필, 입학처 및 영문 원본은 외부 링크로 유지합니다.
WordPress 관리자·서버 검색·게시물 작성 기능은 포함하지 않습니다.
공지 이미지와 PDF/HWP 첨부파일은 패키지에 포함했습니다.

Pretendard 폰트와 해당 라이선스는 `assets/fonts/pretendard/`에 있습니다.
Avant Garde는 기존 CSS의 로컬 설치 폰트 지정으로 유지합니다.
설치되지 않은 환경에서는 함께 포함한 Pretendard로 표시됩니다.
배포 가능한 Avant Garde 웹폰트 파일은 제공된 사이트에 없어 포함하지 않았습니다.
기존 이미지·로고·첨부파일과 라이브러리의 저작권 표시는 해당 권리자에게 있습니다.
