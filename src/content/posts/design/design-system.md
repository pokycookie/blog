---
id: 16
title: '디자인 시스템 구축하기: 0에서 1까지'
createdAt: 2025-09-10
tags: [design-system, ui-ux, design]
published: true
cover: https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000
---

# 디자인 시스템 구축하기: 0에서 1까지

실제 프로젝트에서 디자인 시스템을 구축한 경험을 공유합니다.

## 디자인 시스템이란?

재사용 가능한 컴포넌트와 명확한 가이드라인의 집합입니다.

### 왜 필요한가?

1. **일관성**: 모든 제품에서 동일한 경험
2. **효율성**: 바퀴를 재발명하지 않음
3. **확장성**: 새로운 기능 빠르게 추가
4. **협업**: 디자이너-개발자 간 소통 개선

## 구축 단계

### 1단계: 리서치

#### 현재 상태 파악

- 기존 UI 컴포넌트 수집
- 불일치 요소 찾기
- 사용 빈도 분석

#### 벤치마킹

참고할 만한 디자인 시스템:
- Material Design (Google)
- Human Interface Guidelines (Apple)
- Polaris (Shopify)
- Ant Design
- Chakra UI

### 2단계: Foundation 정의

#### Color System

```
Primary Colors
├─ Primary 50-900 (10단계)
├─ Secondary 50-900
└─ Tertiary 50-900

Semantic Colors
├─ Success (Green)
├─ Warning (Yellow)
├─ Error (Red)
└─ Info (Blue)

Neutral Colors
└─ Gray 50-900

Text Colors
├─ Primary (Gray 900)
├─ Secondary (Gray 700)
└─ Disabled (Gray 400)
```

#### Typography Scale

```css
/* Heading */
h1: 48px / 56px (3rem / 3.5rem)
h2: 40px / 48px (2.5rem / 3rem)
h3: 32px / 40px (2rem / 2.5rem)
h4: 24px / 32px (1.5rem / 2rem)
h5: 20px / 28px (1.25rem / 1.75rem)
h6: 16px / 24px (1rem / 1.5rem)

/* Body */
Large: 18px / 28px
Medium: 16px / 24px
Small: 14px / 20px
XSmall: 12px / 16px
```

#### Spacing System

```
4px 기반 시스템
├─ 4px (0.25rem) - xs
├─ 8px (0.5rem) - sm
├─ 12px (0.75rem) - md
├─ 16px (1rem) - lg
├─ 24px (1.5rem) - xl
├─ 32px (2rem) - 2xl
├─ 48px (3rem) - 3xl
└─ 64px (4rem) - 4xl
```

### 3단계: Components 구축

#### Atomic Design 적용

```
Atoms (원자)
├─ Button
├─ Input
├─ Icon
└─ Badge

Molecules (분자)
├─ Input with Label
├─ Search Bar
└─ Card Header

Organisms (유기체)
├─ Navigation Bar
├─ Card
└─ Form

Templates (템플릿)
├─ Dashboard Layout
└─ Article Layout

Pages (페이지)
└─ 실제 콘텐츠가 들어간 페이지
```

#### 컴포넌트 예시: Button

```typescript
// Props 정의
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

// Variants
Primary: 주요 액션 (로그인, 제출)
Secondary: 보조 액션 (취소, 뒤로가기)
Tertiary: 텍스트 버튼 (더보기, 링크)

// Sizes
Small: 32px height
Medium: 40px height
Large: 48px height

// States
Default, Hover, Active, Focus, Disabled, Loading
```

### 4단계: 문서화

#### 컴포넌트 문서 구조

```markdown
# Button

## 개요
사용자 액션을 트리거하는 컴포넌트

## 사용 시기
- 폼 제출
- 모달 액션
- 페이지 이동

## Variants

### Primary
주요 액션에 사용

### Secondary
보조 액션에 사용

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'primary' | 버튼 스타일 |
| size | string | 'md' | 버튼 크기 |

## 예시

[코드 예시]

## Do's and Don'ts

✅ Do
- 명확한 액션 동사 사용
- 한 화면에 Primary 버튼은 하나만

❌ Don't
- 모호한 텍스트 (예: "확인", "OK")
- 너무 많은 버튼
```

### 5단계: 구현

#### Figma에서 구현

```
1. Foundation 설정
   - Color Styles 생성
   - Text Styles 생성
   - Effect Styles 생성

2. Components 생성
   - Base Component 만들기
   - Variants 추가
   - Auto Layout 적용

3. Library 발행
   - 팀과 공유
   - 버전 관리
```

#### 코드로 구현

```typescript
// Design Tokens (tokens.ts)
export const colors = {
  primary: {
    50: '#EFF6FF',
    500: '#3B82F6',
    900: '#1E3A8A',
  },
}

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
}

// Component (Button.tsx)
import { colors, spacing } from './tokens'

export const Button = styled.button<ButtonProps>`
  padding: ${spacing.md} ${spacing.lg};
  background: ${colors.primary[500]};
  color: white;
  border-radius: 8px;
  
  &:hover {
    background: ${colors.primary[600]};
  }
`
```

### 6단계: 유지보수

#### 버전 관리

```
v1.0.0 - Initial Release
v1.1.0 - Added new components
v1.1.1 - Bug fixes
v2.0.0 - Breaking changes
```

#### 업데이트 프로세스

1. **제안**: 새로운 컴포넌트/변경 제안
2. **리뷰**: 디자인 팀 검토
3. **구현**: Figma + 코드
4. **문서화**: 가이드 업데이트
5. **배포**: 버전 업데이트
6. **공지**: 팀에 알림

## 실전 팁

### 1. 작게 시작하기

처음부터 완벽할 필요 없습니다. 핵심 컴포넌트부터:
- Button
- Input
- Card
- Typography

### 2. 팀과 함께

- 정기적인 리뷰 미팅
- 피드백 수집
- 사용 사례 공유

### 3. 측정하기

- 컴포넌트 재사용률
- 디자인-개발 시간 단축
- 일관성 점수

### 4. 지속적 개선

- 사용자 피드백 반영
- 새로운 패턴 추가
- 불필요한 것 제거

## 도구 추천

### 디자인
- Figma: 디자인 & 프로토타입
- Storybook: 컴포넌트 카탈로그
- Zeroheight: 문서화

### 개발
- Styled Components / Emotion
- Tailwind CSS
- CSS Variables

### 협업
- Notion: 문서 관리
- Slack: 소통
- GitHub: 버전 관리

## 성공 사례

### Before
- 디자인 일관성 부족
- 중복 컴포넌트 다수
- 디자인-개발 간 불일치

### After
- 일관된 사용자 경험
- 개발 속도 40% 향상
- 디자인 QA 시간 60% 감소

## 참고 자료

- [Design Systems Repo](https://designsystemsrepo.com/)
- [Adele - Design Systems](https://adele.uxpin.com/)
- [Design Systems Handbook](https://www.designbetter.co/design-systems-handbook)

## 마치며

디자인 시스템은 단순히 컴포넌트 라이브러리가 아닙니다. 팀의 협업 방식과 제품의 일관성을 만드는 기반입니다. 작게 시작해서 점진적으로 발전시켜 나가세요! 🎨

