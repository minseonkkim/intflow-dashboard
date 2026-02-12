# intflow-dashboard

실시간 축사 대시보드 프론트엔드입니다.

## 1) 프로젝트 설치 및 실행 방법

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

- 기본적으로 Vite 개발 서버가 실행됩니다.
- 브라우저에서 표시되는 로컬 주소(예: `http://localhost:5173`)로 접속합니다.

## 2) 환경변수(.env) 설정 가이드

프로젝트 루트에 `.env` 파일을 생성하세요.

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_API_BASE_URL=ws://localhost:8000/ws
```

### 변수 설명

- `VITE_API_BASE_URL`
  - REST API 기본 URL
  - 사용 위치: `src/api/axios.ts`, `src/api/auth.ts`, `src/hooks/usePenDetail.ts`

- `VITE_WS_API_BASE_URL`
  - WebSocket 기본 URL
  - 사용 위치: `src/hooks/useRealtimeFarms.ts`, `src/hooks/usePenRealtime.ts`

## 3) 구현 설명

### 상태 관리 전략

- 서버 상태: `@tanstack/react-query` 사용
  - 목록 조회: `usePens`
  - 상세 조회: `usePenDetail`
  - 재시도(backoff), 로딩/에러 상태 관리를 쿼리 계층에서 처리

- 클라이언트 상태: React 훅(`useState`, `useMemo`, `useEffect`) 중심
  - UI 상태(선택된 농장, 열림/닫힘 등)는 컴포넌트 로컬 상태로 관리
  - 인증 토큰/언어 설정은 `localStorage` 사용

- 공통 Provider
  - `src/app/providers.tsx`에서 `QueryClientProvider` 주입

### WS 처리 방식

- 농장 실시간 갱신: `useRealtimeFarms`
  - 초기 REST 데이터를 기준으로 화면 렌더링
  - WS 메시지 수신 시 기존 상태와 병합 갱신
  - 비정상 종료 시 지수 백오프 재연결
  - 언마운트 시 타이머/소켓 정리로 누수 방지

- 축사 상세 실시간 갱신: `usePenRealtime` + `ResilientWebSocket`
  - 특정 pen 채널로 연결 후 실시간 데이터 반영
  - 재연결 시도 횟수/지연시간 관리
  - `close()` 호출 시 재연결 타이머 정리

### i18n 설계

- 라이브러리: `i18next`, `react-i18next`
- 번역 리소스: `src/i18n/ko.json`, `src/i18n/en.json`
- 초기 언어 결정: `localStorage.getItem("lang")` 우선, 없으면 `ko`
- 런타임 언어 전환: `LanguageSwitcher`에서 `i18n.changeLanguage` 호출 후 `localStorage` 저장

### 라우팅/인증 흐름

- 라우팅: `react-router-dom`
  - `/login`: 로그인 페이지
  - `/`: 대시보드(보호 라우트)
  - `/pen/:penId`: 축사 상세(보호 라우트)

- 인증 가드: `AuthGuard`
  - `accessToken`이 없으면 로그인 페이지로 리다이렉트

- API 인터셉터
  - 요청 시 `Authorization: Bearer <token>` 헤더 주입
  - 401 수신 시 토큰 제거 후 로그인 페이지 이동

## 4) 디렉토리 개요

```text
src/
  api/            # axios 클라이언트 및 API 함수
  app/            # router/provider
  component/      # 공통/대시보드/상세 UI 컴포넌트
  hooks/          # 데이터 조회/실시간 처리 훅
  i18n/           # 번역 리소스 및 i18n 초기화
  pages/          # 라우트 페이지
  routes/         # AuthGuard
  types/          # 공통 타입 정의
  utils/          # ResilientWebSocket 유틸
```
