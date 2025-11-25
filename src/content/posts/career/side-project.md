---
id: 20
title: '사이드 프로젝트로 배우는 것들'
createdAt: 2025-08-15
tags: [career, side-project, 개발]
published: true
cover: https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000
---

# 사이드 프로젝트로 배우는 것들

사이드 프로젝트를 통해 얻은 경험과 교훈을 공유합니다.

## 왜 사이드 프로젝트를 하나?

### 실무와의 차이

**실무:**
- 정해진 기술 스택
- 레거시 코드
- 비즈니스 요구사항 우선

**사이드 프로젝트:**
- 자유로운 기술 선택
- 처음부터 설계
- 배움이 우선

## 프로젝트 아이디어 찾기

### 좋은 아이디어의 조건

1. **내가 필요한 것**: 동기부여 유지
2. **적당한 규모**: 완성 가능한 크기
3. **배울 게 있는 것**: 새로운 기술 시도

### 아이디어 예시

```
✅ 좋은 예:
- 개인 블로그 (Next.js 학습)
- 할 일 관리 앱 (상태관리 학습)
- 날씨 알림 봇 (API 연동 학습)

❌ 나쁜 예:
- 페이스북 클론 (너무 큼)
- 이미 완벽한 서비스 (동기부여 X)
```

## 프로젝트 진행 과정

### 1단계: 기획

```markdown
# 프로젝트명: 독서 기록 앱

## 목표
- 읽은 책 기록
- 독서 통계 확인
- 독서 목표 설정

## 주요 기능
1. 책 검색 (외부 API)
2. 독서 기록 CRUD
3. 통계 대시보드

## 기술 스택
- Frontend: React, TypeScript
- Backend: Node.js, Express
- Database: PostgreSQL
- Deployment: Vercel, Railway

## 일정
- Week 1-2: 기본 CRUD
- Week 3: API 연동
- Week 4: 통계 기능
```

### 2단계: 설계

```
데이터베이스 설계:

users
- id
- email
- name

books
- id
- title
- author
- isbn

reading_records
- id
- user_id
- book_id
- status (reading/completed)
- started_at
- finished_at
- rating
- review
```

### 3단계: 개발

#### 작은 단위로 쪼개기

```
✅ 좋은 접근:
1. 로그인 없이 로컬 저장소로 시작
2. 기본 CRUD 완성
3. 백엔드 추가
4. 인증 추가
5. 고급 기능 추가

❌ 나쁜 접근:
1. 완벽한 아키텍처 설계
2. 모든 기능 한 번에
3. 완성도 100% 추구
```

#### MVP (Minimum Viable Product)

```javascript
// MVP 버전
function BookList() {
  const [books, setBooks] = useState([])
  
  return (
    <div>
      {books.map(book => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  )
}

// 나중에 개선
function BookList() {
  const { data, isLoading, error } = useQuery('books', fetchBooks)
  
  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage />
  
  return (
    <VirtualList>
      {data.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </VirtualList>
  )
}
```

### 4단계: 배포

```bash
# Frontend (Vercel)
vercel deploy

# Backend (Railway)
railway up

# Database (Supabase)
# 웹 UI에서 설정
```

## 배운 기술들

### 1. 새로운 프레임워크

```typescript
// Next.js App Router
// app/books/page.tsx
export default async function BooksPage() {
  const books = await fetchBooks()
  
  return (
    <div>
      {books.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
```

**배운 점:**
- Server Components 이해
- 데이터 페칭 패턴
- 라우팅 시스템

### 2. 상태 관리

```typescript
// Zustand로 간단하게
import create from 'zustand'

interface BookStore {
  books: Book[]
  addBook: (book: Book) => void
  removeBook: (id: string) => void
}

const useBookStore = create<BookStore>((set) => ({
  books: [],
  addBook: (book) => set((state) => ({ 
    books: [...state.books, book] 
  })),
  removeBook: (id) => set((state) => ({ 
    books: state.books.filter(b => b.id !== id) 
  })),
}))
```

**배운 점:**
- Redux보다 간단한 대안
- 전역 상태 관리
- 성능 최적화

### 3. API 설계

```typescript
// RESTful API
GET    /api/books          // 목록
GET    /api/books/:id      // 상세
POST   /api/books          // 생성
PUT    /api/books/:id      // 수정
DELETE /api/books/:id      // 삭제

// 구현
app.get('/api/books', async (req, res) => {
  const { page = 1, limit = 10 } = req.query
  
  const books = await db.books.findMany({
    skip: (page - 1) * limit,
    take: limit,
  })
  
  res.json({
    data: books,
    pagination: {
      page,
      limit,
      total: await db.books.count()
    }
  })
})
```

**배운 점:**
- RESTful 설계 원칙
- 페이지네이션
- 에러 처리

### 4. 배포 자동화

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: vercel/action@v2
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

**배운 점:**
- CI/CD 파이프라인
- GitHub Actions
- 자동 배포

## 어려웠던 점과 해결

### 1. 동기부여 유지

**문제:**
- 처음엔 열정적
- 시간 지나면 흥미 감소

**해결:**
```
1. 작은 목표 설정
   - 주간 목표: 로그인 기능 완성
   - 일일 목표: API 1개 구현

2. 진행 상황 공유
   - 블로그에 기록
   - SNS에 공유
   - 친구에게 보여주기

3. 완성 우선
   - 완벽보다 완성
   - MVP부터 만들기
```

### 2. 기술 선택

**문제:**
- 너무 많은 선택지
- 최신 기술 vs 익숙한 기술

**해결:**
```
기준 설정:
1. 배우고 싶은 기술 1-2개만
2. 나머지는 익숙한 것
3. 프로젝트 목적에 맞게

예시:
- 배우고 싶음: Next.js (새로운 것)
- 익숙함: React, TypeScript
- 간단함: Vercel (배포)
```

### 3. 범위 조절

**문제:**
- 기능 계속 추가
- 완성하지 못함

**해결:**
```
Phase 1 (MVP):
- 핵심 기능만
- 1-2주 안에 완성

Phase 2:
- 사용자 피드백
- 개선 사항 반영

Phase 3:
- 추가 기능
```

## 실제 프로젝트 사례

### 프로젝트: 개발자 북마크 관리

#### 기술 스택
```
Frontend:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query

Backend:
- tRPC
- Prisma
- PostgreSQL

Deployment:
- Vercel
```

#### 배운 것
1. **tRPC**: 타입 안전한 API
2. **Prisma**: 타입 안전한 ORM
3. **Next.js 14**: Server Actions

#### 성과
- GitHub 스타 50개
- 실제 사용자 100명
- 포트폴리오 추가

## 사이드 프로젝트 팁

### 1. 시작하기

```
✅ Do:
- 작게 시작
- 일단 만들기
- 공개하기

❌ Don't:
- 완벽주의
- 혼자 끙끙
- 숨기기
```

### 2. 진행하기

```
주간 루틴:
- 월: 이번 주 목표 설정
- 화-목: 개발
- 금: 배포 및 테스트
- 주말: 회고 및 계획
```

### 3. 마무리하기

```
완성 기준:
1. 핵심 기능 동작
2. 배포 완료
3. README 작성
4. 블로그 포스팅

완벽하지 않아도 OK!
```

## 포트폴리오 활용

### README 작성

```markdown
# 프로젝트명

## 소개
독서 기록을 관리하는 웹 애플리케이션

## 주요 기능
- 책 검색 및 등록
- 독서 진행 상황 추적
- 독서 통계 시각화

## 기술 스택
- Frontend: Next.js, TypeScript, Tailwind
- Backend: tRPC, Prisma
- Database: PostgreSQL

## 배운 점
- Next.js App Router 활용
- tRPC로 타입 안전한 API 구현
- Prisma로 데이터베이스 관리

## 링크
- [Demo](https://...)
- [GitHub](https://...)
```

### 면접에서 활용

```
Q: 프로젝트 소개해주세요

A: 
"독서 기록 앱을 만들었습니다.

[문제]
독서 습관을 만들고 싶었지만
기록 방법이 마땅치 않았습니다.

[해결]
간단하게 책을 검색하고
독서 진행 상황을 기록할 수 있는
웹 앱을 만들었습니다.

[기술]
Next.js와 tRPC를 사용해
타입 안전한 풀스택 앱을 구현했습니다.

[성과]
실제로 3개월간 사용 중이고,
독서량이 2배 증가했습니다."
```

## 추천 프로젝트 아이디어

### 초급
- Todo 앱 (상태관리 학습)
- 날씨 앱 (API 연동)
- 포트폴리오 사이트

### 중급
- 블로그 (CMS 구현)
- 채팅 앱 (실시간 통신)
- 대시보드 (데이터 시각화)

### 고급
- SNS (복잡한 관계)
- 협업 도구 (동시성 처리)
- 이커머스 (결제 연동)

## 마치며

사이드 프로젝트는 가장 좋은 학습 방법입니다. 실무에서 시도하기 어려운 기술을 자유롭게 경험할 수 있고, 포트폴리오도 만들 수 있습니다.

완벽하지 않아도 괜찮습니다. 일단 시작하세요! 🚀

