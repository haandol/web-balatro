# Contributing Guide

이 문서는 web-balatro 프로젝트에 기여할 때 따라야 하는 규칙을 정의합니다.

## 목차

- [커밋 메시지 규칙](#커밋-메시지-규칙)
- [브랜치 전략](#브랜치-전략)
- [코드 스타일](#코드-스타일)
- [Pull Request](#pull-request)

---

## 커밋 메시지 규칙

[Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) 스펙을 따릅니다.

### 형식

```
<type>(<scope>): <subject>

[body]

[footer(s)]
```

### Type (필수)

| Type       | 용도                                      | SemVer 영향 |
| ---------- | ----------------------------------------- | ----------- |
| `feat`     | 새로운 기능 추가                          | MINOR       |
| `fix`      | 버그 수정                                 | PATCH       |
| `refactor` | 기능 변경 없는 코드 리팩토링              | -           |
| `docs`     | 문서 변경                                 | -           |
| `test`     | 테스트 추가/수정                          | -           |
| `chore`    | 빌드 설정, 의존성 업데이트 등 유지보수    | -           |
| `style`    | 코드 포매팅, 세미콜론 등 (로직 변경 없음) | -           |
| `perf`     | 성능 개선                                 | -           |

### Scope (선택)

변경 대상 모듈을 괄호 안에 명시합니다. 이 프로젝트의 주요 scope:

| Scope      | 대상                                     |
| ---------- | ---------------------------------------- |
| `game`     | 게임 핵심 로직 (stores, utils)           |
| `ui`       | UI 컴포넌트, 레이아웃                    |
| `poker`    | 포커 핸드 평가, 점수 계산                |
| `joker`    | 조커 시스템                              |
| `shop`     | 상점 시스템                              |
| `blind`    | 블라인드/앤티 시스템                     |
| `deck`     | 덱 관리                                  |
| `deps`     | 의존성 관리                              |

### Subject (필수)

- 영문 소문자로 시작
- 명령형(imperative mood) 사용: "add", "fix", "change" (O) / "added", "fixes", "changed" (X)
- 마침표 생략
- 50자 이내 권장 (72자 이내 필수)

### Body (선택)

- subject에서 설명이 부족할 때 **왜(why)** 변경했는지 작성
- 빈 줄로 subject와 구분
- 한 줄 72자 이내로 줄바꿈

### Footer (선택)

- `BREAKING CHANGE: <설명>` — 하위 호환성 깨지는 변경 (SemVer MAJOR)
- `Refs: #<이슈번호>` — 관련 이슈 참조
- `Co-Authored-By: Name <email>` — 공동 작성자

### 좋은 예시

```
feat(poker): add flush evaluation logic
```

```
fix(game): correct score calculation order for xMult jokers
```

```
refactor(ui): extract card selection into composable
```

```
chore(deps): bump nuxt to 3.x
```

### 나쁜 예시

```
# type 없음
Update poker hand logic

# 과거형 사용
feat: Added joker system

# 너무 모호함
update stuff

# 여러 변경을 한 커밋에 섞음
feat(game): add shop and fix scoring and refactor blind logic
```

### 원자적 커밋 (Atomic Commits)

하나의 커밋에는 하나의 논리적 변경만 포함합니다:

- 기능 추가와 버그 수정을 같은 커밋에 넣지 않습니다
- 리팩토링과 기능 변경을 같은 커밋에 넣지 않습니다
- 변경이 크면 여러 커밋으로 나눕니다

---

## 브랜치 전략

### 브랜치 명명 규칙

```
<type>/<short-description>
```

| 접두사      | 용도             | 예시                          |
| ----------- | ---------------- | ----------------------------- |
| `feat/`     | 새 기능 개발     | `feat/joker-system`           |
| `fix/`      | 버그 수정        | `fix/score-calculation`       |
| `refactor/` | 리팩토링         | `refactor/game-state`         |
| `docs/`     | 문서 작업        | `docs/contributing-guide`     |
| `chore/`    | 유지보수         | `chore/update-dependencies`   |

### 워크플로우

1. `main`에서 새 브랜치 생성
2. 작업 후 커밋 (위 커밋 규칙 준수)
3. Pull Request 생성
4. 리뷰 후 `main`에 머지

```bash
git checkout main
git pull origin main
git checkout -b feat/my-feature
# ... 작업 ...
git add <files>
git commit -m "feat(scope): add my feature"
git push -u origin feat/my-feature
```

---

## 코드 스타일

### Lint & Format

```bash
pnpm lint          # ESLint 검사
pnpm lint:fix      # ESLint 자동 수정
pnpm format        # Prettier 포매팅
```

- ESLint: `eslint.config.mjs` (flat config)
- Prettier: `.prettierrc`
- 세미콜론 없음, 싱글 쿼트, 120자 줄 길이

### TypeScript & Vue

- **프레임워크**: Nuxt 3 (SPA, CSR only)
- **스타일링**: TailwindCSS
- **상태 관리**: Pinia (Composition API setup store)
- **컴포넌트**: Vue 3 Composition API (`<script setup lang="ts">`)
- **네이밍**:
  - 컴포넌트: PascalCase
  - 변수/함수: camelCase
  - Composables: `use[Name]`

---

## Pull Request

### PR 제목

커밋 메시지와 동일한 Conventional Commits 형식을 사용합니다:

```
feat(poker): add full house evaluation
```

### PR 본문 템플릿

```markdown
## Summary

변경 사항을 1~3개 bullet point로 요약합니다.

## Motivation

왜 이 변경이 필요한지 설명합니다.

## Changes

- 주요 변경 사항 상세 목록

## Test Plan

- [ ] 빌드 성공 확인 (`pnpm build`)
- [ ] lint 통과 확인 (`pnpm lint`)
- [ ] 수동 테스트 시나리오 설명
```

### 머지 규칙

- Squash merge를 기본으로 사용합니다
- 머지 커밋 메시지는 Conventional Commits 형식을 따릅니다
- `main` 브랜치에 직접 push하지 않습니다
