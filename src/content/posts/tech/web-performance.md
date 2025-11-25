---
id: 13
title: '웹 성능 최적화: 실전 가이드'
createdAt: 2025-09-15
tags: [web, performance, optimization]
published: true
cover: https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000
---

# 웹 성능 최적화: 실전 가이드

실제 프로젝트에 적용한 웹 성능 최적화 기법들을 공유합니다.

## 성능 측정부터

최적화 전에 먼저 측정이 필요합니다.

### 측정 도구

1. **Lighthouse**: Chrome DevTools에 내장
2. **WebPageTest**: 다양한 환경에서 테스트
3. **Core Web Vitals**: 구글의 핵심 지표

### 주요 지표

- **LCP (Largest Contentful Paint)**: 2.5초 이하
- **FID (First Input Delay)**: 100ms 이하
- **CLS (Cumulative Layout Shift)**: 0.1 이하

## 이미지 최적화

### 1. 적절한 포맷 선택

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Description">
</picture>
```

### 2. Lazy Loading

```html
<img src="image.jpg" loading="lazy" alt="Description">
```

### 3. 반응형 이미지

```html
<img 
  srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
  src="medium.jpg"
  alt="Description"
>
```

## JavaScript 최적화

### 1. Code Splitting

```typescript
// React lazy loading
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### 2. Tree Shaking

```typescript
// ❌ 나쁜 예
import _ from 'lodash'

// ✅ 좋은 예
import debounce from 'lodash/debounce'
```

### 3. 번들 크기 분석

```bash
# Webpack Bundle Analyzer
npm install --save-dev webpack-bundle-analyzer

# Vite Bundle Visualizer
npm install --save-dev rollup-plugin-visualizer
```

## CSS 최적화

### 1. Critical CSS

```html
<head>
  <style>
    /* 초기 렌더링에 필요한 CSS만 인라인으로 */
    body { margin: 0; }
    .header { background: #000; }
  </style>
  <link rel="stylesheet" href="main.css" media="print" onload="this.media='all'">
</head>
```

### 2. CSS-in-JS 최적화

```typescript
// Emotion의 경우
import { css } from '@emotion/react'

// 동적 스타일은 최소화
const staticStyle = css`
  color: blue;
  font-size: 16px;
`
```

## 네트워크 최적화

### 1. HTTP/2 활용

```nginx
# Nginx 설정
http2_push /css/main.css;
http2_push /js/main.js;
```

### 2. CDN 사용

```html
<link rel="preconnect" href="https://cdn.example.com">
<link rel="dns-prefetch" href="https://cdn.example.com">
```

### 3. 리소스 힌트

```html
<!-- 다음 페이지 미리 로드 -->
<link rel="prefetch" href="/next-page.html">

<!-- 중요한 리소스 우선 로드 -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```

## 캐싱 전략

### 1. Service Worker

```javascript
// service-worker.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
```

### 2. HTTP 캐시 헤더

```nginx
# Nginx 설정
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

## 렌더링 최적화

### 1. Virtual Scrolling

```typescript
import { FixedSizeList } from 'react-window'

function LargeList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{items[index]}</div>
      )}
    </FixedSizeList>
  )
}
```

### 2. Debounce & Throttle

```typescript
import { debounce } from 'lodash'

const handleSearch = debounce((query) => {
  // API 호출
}, 300)
```

## 실제 개선 사례

### Before
- LCP: 4.2s
- FID: 250ms
- 번들 크기: 2.5MB

### After
- LCP: 1.8s ⬇️ 57% 개선
- FID: 80ms ⬇️ 68% 개선
- 번들 크기: 800KB ⬇️ 68% 감소

### 적용한 기법
1. 이미지 WebP 변환 + Lazy Loading
2. Code Splitting (Route 기반)
3. Tree Shaking
4. CDN 도입
5. Service Worker 캐싱

## 체크리스트

- [ ] 이미지 최적화 (포맷, 크기, lazy loading)
- [ ] JavaScript 번들 크기 최적화
- [ ] CSS 최적화 (Critical CSS, 불필요한 CSS 제거)
- [ ] 폰트 최적화 (subset, preload)
- [ ] 캐싱 전략 수립
- [ ] CDN 사용
- [ ] HTTP/2 적용
- [ ] Lighthouse 점수 90점 이상

## 마치며

성능 최적화는 한 번에 끝나는 작업이 아닙니다. 지속적인 모니터링과 개선이 필요합니다. 작은 개선들이 모여 큰 차이를 만듭니다! ⚡

