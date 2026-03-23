# 🔥 소방 펌프 계산서 통합 포털 PWA
### ENGINEER KIM MANMIN · MANMIN-Ver3.1

> **Developer MANMIN** | 대성건축사사무소  
> Blueprint Engineering Theme · Dark Green Edition

## 📦 파일 구성

```
total-portal-pwa/
├── index.html          ← 메인 포털 앱 (Ver 3.1)
├── manifest.json       ← PWA 매니페스트
├── sw.js               ← 서비스 워커 (오프라인 지원 + 업데이트 감지)
├── README.md
└── icons/              ← 아이콘 13종 (통합토탈 이미지 기반)
    ├── favicon.ico
    ├── favicon-16.png
    ├── favicon-32.png
    ├── apple-touch-icon.png
    ├── icon-72 ~ 384.png
    └── icon-512.png     ← 마스커블 / 스플래시
```

## 🚀 GitHub Pages 배포 방법

1. 이 폴더 전체를 GitHub 저장소 루트에 업로드
2. `Settings` → `Pages` → `Source: main branch / (root)` 선택
3. 배포된 **HTTPS URL** 로 접속 *(HTTP에서는 PWA 설치 불가)*
4. 우하단 **📲 앱 설치** FAB 버튼 클릭 → 즉시 설치

## 📱 PWA 설치 지원 환경

| 환경 | 설치 방법 |
|------|----------|
| Android Chrome / Edge | 📲 앱 설치 FAB 버튼 또는 하단 배너 |
| Windows Chrome / Edge | 주소창 우측 설치 아이콘 ⊕ |
| macOS Chrome | 주소창 우측 설치 아이콘 ⊕ |
| iOS Safari | 공유 버튼 → "홈 화면에 추가" *(FAB 미지원)* |

## 🆕 Ver 3.1 변경사항

| 항목 | 내용 |
|------|------|
| **📲 설치 FAB 버튼** | 우하단 앰버/갈색 고정 버튼, 팝-인 애니메이션 |
| **🟢 NEW 뱃지** | 그린 색 펄싱 뱃지 (앱 테마와 통일) |
| **배너 닫기 후 FAB 유지** | 배너를 닫아도 FAB 버튼은 우하단에 계속 표시 |
| **sw.js 전면 업그레이드** | 단순 1줄 등록 → Network-First + 업데이트 감지 배너 |
| **업데이트 배너** | 다크 그린 테마 배너 (그린 업데이트 버튼) |
| **버전 스탬프** | MANMIN-Ver3.0 → Ver3.1 |

## 🎯 이 앱의 특징

이 앱은 개별 계산서 앱들의 **통합 포털**로, React 없이 순수 HTML/CSS/JS로 구현되어 있어 가장 빠른 로딩 속도를 자랑합니다.

## 🎨 MANMIN 시리즈 FAB 색상 가이드

| 앱 | 설치 FAB 색상 |
|----|-------------|
| 옥외소화전 | 🔵 파랑 `#1d4ed8` |
| 스프링클러 | 🔵 파랑 `#1d4ed8` |
| 간이스프링클러 | 🔵 파랑 `#1d4ed8` |
| 겸용[옥내+스프] | 🟣 퍼플 `#7c3aed` |
| 겸용[옥내+간이] | 🟢 틸 `#0d9488` |
| 겸용[옥내+옥외] | 🌸 로즈 `#be185d` |
| **통합 포털** | **🟤 앰버 `#b45309`** |

---
*MANMIN · Blueprint Engineering Theme · Ver 3.1*
