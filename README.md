# Web Balatro Clone

## Project Introduction
이 프로젝트는 인기 로그라이크 카드 게임 Balatro의 클론 버전으로, Vue 3, Nuxt 3, TypeScript, Tailwind CSS를 사용하여 개발되었습니다. 포커 메커니즘과 덱 빌딩 전략을 결합한 게임으로, 플레이어는 전략적인 포커 핸드를 사용하여 점수를 얻고 블라인드를 격파해 나갑니다.

## Features
- 포커 핸드 평가 및 점수 계산 시스템
- 조커, 타로, 행성 카드 시스템
- 카드 강화 및 수정 시스템
- 런 진행 및 블라인드 도전 시스템
- 덱 빌딩 및 전략 수립 메커니즘

## Tech Stack
- **프론트엔드**: Vue 3, Nuxt 3, TypeScript
- **상태 관리**: Pinia
- **스타일링**: Tailwind CSS, PrimeIcons
- **빌드 도구**: Vite

## Installation and Run
```bash
# Install dependencies
yarn install

# Run development server
yarn dev
```

## Game Rules
Balatro는 포커 기반의 로그라이크 카드 게임으로, 각 라운드마다 8장의 카드를 받아 최적의 포커 핸드를 구성합니다. 다양한 조커 카드와 강화 시스템을 활용하여 점수를 최대화하고, 난이도가 점진적으로 증가하는 블라인드를 격파해 나가는 것이 목표입니다.

자세한 게임 규칙은 [SPEC.md](./SPEC.md) 파일을 참조하세요.

## LICENSE

Apache License 2.0

> This project is developed for learning and research purposes. The copyright of the original game belongs to the original developer.
