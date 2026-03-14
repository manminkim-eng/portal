# NFTC 소방시설 통합 계산 포털 PWA
**Engineer Kim Manmin · manminkim-eng · Ver 2.1**

---

## 📁 파일 구성 (19개)

```
📁 portal/
├── index.html                ← 포털 메인 (React + iframe + PWA 완전 통합)
├── manifest.json             ← PWA 앱 정보
├── sw.js                     ← Service Worker (오프라인·캐싱)
├── favicon.ico               ← 브라우저 탭 아이콘
├── README.md
│
└── 📁 icons/ (14개)
    ├── icon-192.png          ← Android 홈화면
    ├── icon-512.png          ← 스플래시 화면
    ├── apple-touch-icon.png  ← iOS 홈화면
    └── ...
```

---

## ✅ 연동 확정 URL

| 계산기 | 레포 | URL |
|--------|------|-----|
| 옥내소화전 | fire-hydrant-calc | https://manminkim-eng.github.io/fire-hydrant-calc/ |
| 옥외소화전 | outdoor-hydrant-calc | https://manminkim-eng.github.io/outdoor-hydrant-calc/ |
| 스프링클러 | fire-sprinkler-calc | https://manminkim-eng.github.io/fire-sprinkler-calc/ |
| 간이스프링클러 | simple-sprinkler-calc | https://manminkim-eng.github.io/simple-sprinkler-calc/ |
| 겸용 옥내+스프링 | combo-pump-calc | https://manminkim-eng.github.io/combo-pump-calc/ |
| 겸용 간이+옥내 | combo-easy-fire-calc | https://manminkim-eng.github.io/combo-easy-fire-calc/ |
| 겸용 옥내+옥외 | combo-indoor-outdoor-calc | https://manminkim-eng.github.io/combo-indoor-outdoor-calc/ |

---

## 🚀 portal 레포 업데이트 방법

portal 레포가 이미 있으므로 **파일만 교체**하면 됩니다.

### STEP 1 — 기존 파일 삭제 (필요시)
```
https://github.com/manminkim-eng/portal 접속
→ 기존 index.html 있으면 삭제
  (파일 클릭 → 우측 상단 삭제 버튼)
```

### STEP 2 — 새 파일 전체 업로드
```
portal 레포 → [Add file] → [Upload files]
→ portal 폴더 안 파일 전체 드래그:
  ✅ index.html
  ✅ manifest.json
  ✅ sw.js
  ✅ favicon.ico
  ✅ icons/ 폴더 전체  ← 반드시 폴더째로

→ [Commit changes] 클릭
```

### STEP 3 — Pages 확인
```
Settings → Pages → main/(root) → Save
→ 기존 설정 그대로면 변경 불필요
```

### STEP 4 — 캐시 초기화 후 접속
```
브라우저에서:
Ctrl+Shift+R (PC) 또는 강제 새로고침

https://manminkim-eng.github.io/portal/

✅ 포털 홈 화면
✅ 상단 네비게이션 7개 버튼
✅ 버튼 클릭 → iframe으로 계산기 로드
✅ 모바일 설치 배너
```

---

## ⚡ PWA 기능

| 기능 | 내용 |
|------|------|
| React 포털 홈 | 카드형 시스템 선택 화면 |
| iframe 계산기 | 상단 네비게이션으로 전환 |
| 뒤로가기 지원 | 브라우저 뒤로가기 정상 작동 |
| URL 직접 진입 | /portal/?app=sprinkler 형식 지원 |
| 오프라인 | 홈화면은 인터넷 없이 작동 |
| 홈화면 설치 | Android·iOS·PC 설치 가능 |
| 자동 업데이트 | 새 버전 배포 시 알림 |
| iOS Safe Area | 노치·홈바 자동 대응 |

---

## ❓ 문제 해결

| 증상 | 해결 |
|------|------|
| 404 오류 | Settings→Pages→Save, 2~3분 대기 |
| 계산기 안 열림 | 해당 레포 Public 설정 확인 |
| 아이콘 없음 | icons 폴더 통째로 재업로드 |
| 구버전 표시 | Ctrl+Shift+R 강제 새로고침 |
