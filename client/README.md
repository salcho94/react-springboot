# 🚀 React Tailwind Project  (김지섭 개발)

이 프로젝트는 **React**와 **TailwindCSS**를 활용한 모던 웹 애플리케이션입니다. `Recoil`을 통한 상태 관리, `React Router`를 이용한 라우팅, 그리고 `Axios`를 활용한 API 통신을 구현하고 있습니다.

## 📂 프로젝트 구조

```plaintext
react-tailwind-project/
├── node_modules/          # 설치된 npm 패키지
├── public/                # 정적 파일 디렉터리
│   ├── data.json         # 샘플 JSON 데이터
│   ├── favicon.ico       # 파비콘
│   ├── index.html        # 메인 HTML 파일
│   ├── logo192.png       # 애플리케이션 로고 (192px)
│   ├── logo512.png       # 애플리케이션 로고 (512px)
│   ├── manifest.json     # PWA 설정 파일
│   ├── menu.json         # 메뉴 데이터 파일
│   └── robots.txt        # 검색 엔진 크롤러 설정
│
├── src/                  # 애플리케이션 소스 코드
│   ├── assets/          # 정적 리소스 (이미지, 아이콘 등)
│   ├── components/      # 재사용 가능한 React 컴포넌트
│   ├── hooks/           # 사용자 정의 React 훅
│   ├── pages/           # 페이지별 React 컴포넌트
│   ├── recoil/          # Recoil 상태 관리 관련 코드
│   ├── routes/          # 라우팅 설정 파일
│   ├── services/        # API 호출 등의 서비스 코드
│   ├── utils/           # 유틸리티 함수 모음
│   ├── App.css          # 전역 CSS 스타일 파일
│   ├── App.jsx           # 메인 React 컴포넌트
│   ├── App.test.jsx      # 테스트 파일
│   ├── index.css        # TailwindCSS 스타일 설정
│   ├── index.jsx         # 애플리케이션 진입점
│   ├── logo.svg         # React 기본 로고
│   ├── reportWebVitals.js # 웹 성능 측정 코드
│   └── setupTests.js    # 테스트 설정 파일
│
├── .env.*               # 환경 변수 파일
├── package.json         # 프로젝트 종속성과 스크립트 설정
└── README.md            # 프로젝트 설명 파일
```

## 🛠️ 사용 기술

### 핵심 기술
- **React**: UI 빌드를 위한 JavaScript 라이브러리
- **TailwindCSS**: 유틸리티 기반 CSS 프레임워크
- **Recoil**: React 상태 관리 라이브러리
- **React Router**: SPA 라우팅 기능 제공
- **Axios**: API 호출을 위한 HTTP 클라이언트
- **CRACO**: React 앱 구성 재정의를 위한 도구

## 🚀 시작하기

### 1. 설치
```bash
# 프로젝트 클론
git clone <repository-url>

# 디렉토리 이동
cd react-tailwind-project

# 종속성 설치
npm install
```

### 2. 실행 스크립트

```bash
# 로컬 개발 서버 실행
npm run start:local

# 개발 환경 서버 실행
npm run start:dev

# 프로덕션 환경 서버 실행
npm run start:prod

# 프로덕션 빌드
npm run build:prod

# 개발 서버 실행 (기본)
npm run start

# 테스트 실행
npm run test
```

## 📦 주요 종속성

### 프로덕션 종속성
- **React 핵심**
    - `react`
    - `react-dom`
- **라우팅**
    - `react-router-dom`
- **상태 관리**
    - `recoil`
    - `recoil-persist`
- **HTTP 통신**
    - `axios`
- **오류 처리**
    - `react-error-boundary`

### 개발 종속성
- **스타일링**
    - `tailwindcss`
    - `postcss`
    - `autoprefixer`
- **코드 품질**
    - `babel-eslint`

## 🤝 기여하기

1. 프로젝트를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.