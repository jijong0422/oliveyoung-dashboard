# ZenRows 2단계 크레딧 절약 호출 및 DB 스냅샷 자동 정리(Pruning) 고도화

국내몰 SSR 특성을 활용한 2단계 경량 프록시 우선 호출로 ZenRows API 크레딧 소모를 최대 80% 절감하고, 로컬 DB 및 Firestore에 누적되는 오래된 스냅샷·알림·이미지 캐시를 자동 정리하여 장기간 운영 시에도 일정한 응답 속도와 저장 용량을 유지합니다.

## User Review & Critical Decisions

> [!IMPORTANT]
> 사용자 질의응답을 통해 확정된 아래 2가지 핵심 운영 기준을 바탕으로 구현을 진행합니다.

- **Confirmed Decision 1 (DB 스냅샷 및 로그 보관 한도)**: 수집 이력(`scrape_runs`)은 **최근 25회차 스냅샷**, 트리거된 알림(`triggered_alerts`)은 **최근 100건**, AI 인사이트 리포트(`md_insights`)는 **최근 30건**, 이미지 캐시는 **최대 1,000건**까지만 유지하고 초과분은 로컬 스토리지와 Firestore에서 자동 삭제합니다.
- **Confirmed Decision 2 (24시간 백그라운드 자동 수집 범위)**: 24시간 주기 자동 수집(AutoCron) 실행 시 크레딧 효율과 한·글로벌 비교 완결성을 모두 확보하기 위해 **국내몰 종합(`all`)과 글로벌몰 종합(`all`) 2개 핵심 랭킹을 함께 수집**하며, 나머지 서브카테고리는 직전 회차의 실데이터를 안전하게 승계합니다.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **국내몰 2단계 크레딧 절약 스크래퍼**: 처음부터 고비용 `js_render=true`를 호출하지 않고, 1차로 경량 프록시(`premium_proxy=true`)만으로 호출하여 `.prd_info` 블록 파싱을 시도합니다. 봇 차단 등으로 수집된 상품이 10개 미만일 때만 2차로 `js_render=true&wait_for=.prd_info` 폴백을 실행합니다.
  2. **자동 가비지 컬렉터 (`pruneOldDatabaseRecords`)**: 수동/자동 수집 직후 실행되어 최근 25회차 이후의 만료된 수집 이력과 연결된 랭킹 문서(`rankings`), 100건을 초과한 알림 내역, 30건을 초과한 리포트, 1,000건을 초과한 이미지 캐시를 로컬 메모리·디스크 및 Firestore 배치 삭제(`executeFirestoreBatch`)로 정리합니다.
  3. **24시간 주기 국내·글로벌 종합(`all`) 경량 AutoCron**: 하루 1회 백그라운드에서 국내몰 종합(`all`)과 글로벌몰 종합(`all`) 2건만 ZenRows로 수집하고 자동 DB 정리를 수행합니다.
- **Target Audience / Persona**: 제한된 ZenRows API 크레딧 예산 안에서 매일 끊김 없이 국내외 올리브영 베스트셀러 추이를 모니터링해야 하는 뷰티 MD 및 운영팀.
- **Key Value**: 평소 국내몰 수집 크레딧을 1/5 수준으로 절감하면서도 Cloudflare 챌린지 발생 시 100% 자동 복구되며, DB 용량 비대화로 인한 서버 지연이나 쿼터 초과를 예방합니다.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. 사용자가 대시보드에서 **`[지금 랭킹 수집]`**을 클릭하면 백엔드에서 국내몰은 경량 모드로 빠르게 응답을 받아오고, 수집 완료와 동시에 백그라운드에서 만료된 구버전 스냅샷(25회차 초과분)을 자동 정리합니다.
  2. 시계열 차트 및 수집 히스토리 드롭다운에는 항상 가장 최신의 25개 스냅샷이 깔끔하게 유지되어 빠른 조회 속도를 보장합니다.
  3. 별도의 수동 조작 없이도 24시간마다 국내몰 종합(`all`)과 글로벌몰 종합(`all`) 실데이터가 최신화됩니다.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: 기존 엔터프라이즈 커머스 인텔리전스 대시보드의 레이아웃과 시각 체계를 그대로 유지하며, 백엔드 파이프라인의 속도와 안정성을 뒷받침합니다.
  - *Typography & Hierarchy*: 수집 소요 시간, 스냅샷 카운트, 가격 및 순위 지표에 고정폭 숫자(`tabular-nums`)를 유지합니다.
- **Interactive Feedback & Motion**:
  - 경량 프록시(1단계) 적중 시 기존 JS 렌더링 대비 2~3초 이상 빨라진 수집 완료 피드백을 체감할 수 있습니다.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: 국내몰 2단계(Light -> Heavy) 순차 폴백 전략**
  - *Chosen Approach*: `LIGHT (Credit-Saver)` 모드(`premium_proxy=true`)를 먼저 호출해 10개 이상의 SKU가 파싱되면 즉시 반환하고, 미달 시에만 `HEAVY (JS-Render Fallback)` 모드(`js_render=true&wait_for=.prd_info`)를 호출합니다.
  - *Why*: 올리브영 국내몰 베스트 페이지(`getBestList.do`)는 SSR 기반이므로 대부분 1차 경량 호출만으로 즉시 파싱이 가능해 크레딧을 80% 절약하고 응답 속도도 단축됩니다.
- **Decision 2: 최근 25회차 스냅샷 기준 동기화 가비지 컬렉션**
  - *Chosen Approach*: `scrape_runs`를 최신순 정렬 후 상위 25개 타임스탬프만 유효 집합(`validTimestamps`)으로 지정하고, 이에 속하지 않는 `rankings` 키를 로컬 객체와 Firestore 양쪽에서 삭제합니다.
  - *Why*: 카테고리 10개 × 몰 2개 = 1회 수집당 20개 문서가 생성되므로, 25회차(총 500개 랭킹 문서)로 상한선을 두면 시계열 추이 분석에는 충분한 히스토리를 제공하면서 파일 크기는 수 MB 이내로 일정하게 유지됩니다.
- **Decision 3: 24시간 AutoCron 시 국내몰 `all` + 글로벌몰 `all` 동시 수집 및 서브카테고리 실데이터 승계**
  - *Chosen Approach*: AutoCron 실행 시 국내몰 `all`과 글로벌몰 `all`을 각각 1회씩 총 2회만 호출하여 최신 스냅샷을 생성하되, 글로벌 서브카테고리에는 신규 글로벌 실데이터를 공유하고 국내 서브카테고리에는 직전 회차의 데이터를 승계합니다.
  - *Why*: AutoCron이 새로운 최신 타임스탬프(`runs[0]`)를 생성할 때 서브카테고리 문서가 비어 있으면 다른 탭 클릭 시 시뮬레이션 초기값으로 돌아가는 문제를 방지합니다.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                   Scrape Trigger (Manual API / 24h AutoCron)               │
└───────────────────┬────────────────────────────────────┬───────────────────┘
                    │ Domestic Mall                      │ Global Mall
                    ▼                                    ▼
┌───────────────────────────────────────┐  ┌─────────────────────────────────┐
│   fetchRealOliveYoungRankings         │  │ fetchRealGlobalOliveYoung       │
│  ┌─────────────────────────────────┐  │  │ (US Proxy + wait=4000, 1 Call)  │
│  │ Stage 1: LIGHT (premium_proxy)  │  │  │  ├─ Inline JSON / Anchor Window │
│  └────────────────┬────────────────┘  │  │  └─ Gemini 3 Flash HTML Fallback│
│                   │ If < 10 SKUs      │  └─────────────────┬───────────────┘
│                   ▼                   │                    │
│  ┌─────────────────────────────────┐  │                    │
│  │ Stage 2: HEAVY (+js_render)     │  │                    │
│  └────────────────┬────────────────┘  │                    │
└───────────────────┼───────────────────┘                    │
                    └───────────────────┬────────────────────┘
                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                saveLocalData() & executeFirestoreBatch()                   │
└───────────────────────────────────────┬────────────────────────────────────┘
                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                      pruneOldDatabaseRecords()                             │
│  ├─ Keep Top 25 scrape_runs & matching timestamp rankings                  │
│  ├─ Cap triggered_alerts <= 100 & md_insights <= 30                        │
│  ├─ Trim imageCache when keys > 1,000                                      │
│  └─ Batch Delete expired scrape_runs & rankings from Firestore             │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - `MAX_HISTORY_RUNS = 25`: 최신 25개 `ScrapeRun`의 `timestamp`만 유효 스냅샷으로 보존합니다.
  - `MAX_TRIGGERED_ALERTS = 100`, `MAX_MD_INSIGHTS = 30`: 메모리 및 JSON 직렬화 부하를 방지합니다.
- **Interactive Component & State Mapping**:
  - **수동 수집 (`POST /api/scrape`)**: 국내·글로벌 수집 및 배치 저장 완료 직후 `await pruneOldDatabaseRecords()`를 호출하여 즉시 정리합니다.
  - **24시간 자동 수집 (`AutoCron`)**: 24시간 주기로 국내몰 `all` 및 글로벌몰 `all` 실데이터를 수집·저장하고 `await pruneOldDatabaseRecords()`를 실행해 무인 운영 시에도 스토리지 상태를 최적화합니다.
