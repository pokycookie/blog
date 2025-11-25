---
id: 12
title: 'React Query로 서버 상태 관리하기'
createdAt: 2025-10-05
tags: [react, react-query, 상태관리]
published: true
cover: https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000
---

# React Query로 서버 상태 관리하기

React Query(TanStack Query)를 사용한 효율적인 서버 상태 관리 방법을 알아봅니다.

## React Query가 필요한 이유

전통적인 방식의 문제점:

```typescript
// 기존 방식
function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [])

  // 캐싱, 리페칭, 에러 핸들링 등을 모두 직접 구현해야 함
}
```

## React Query로 개선하기

### 기본 사용법

```typescript
import { useQuery } from '@tanstack/react-query'

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json())
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Mutation 사용하기

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

function CreateUser() {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: (newUser) => {
      return fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser)
      })
    },
    onSuccess: () => {
      // 성공 시 users 쿼리 무효화하여 리페치
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  return (
    <button onClick={() => mutation.mutate({ name: 'New User' })}>
      Create User
    </button>
  )
}
```

## 고급 기능

### 1. Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newUser) => {
    // 진행 중인 리페치 취소
    await queryClient.cancelQueries({ queryKey: ['users'] })
    
    // 이전 값 저장
    const previousUsers = queryClient.getQueryData(['users'])
    
    // 낙관적 업데이트
    queryClient.setQueryData(['users'], (old) => 
      old.map(user => user.id === newUser.id ? newUser : user)
    )
    
    return { previousUsers }
  },
  onError: (err, newUser, context) => {
    // 에러 시 롤백
    queryClient.setQueryData(['users'], context.previousUsers)
  }
})
```

### 2. Infinite Queries

```typescript
function Posts() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => 
      fetch(`/api/posts?page=${pageParam}`).then(res => res.json()),
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor
  })

  return (
    <>
      {data.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      ))}
      <button 
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        Load More
      </button>
    </>
  )
}
```

### 3. Prefetching

```typescript
function PostList() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  })

  return (
    <div>
      {data.map(post => (
        <div
          key={post.id}
          onMouseEnter={() => {
            // 마우스 호버 시 미리 데이터 로드
            queryClient.prefetchQuery({
              queryKey: ['post', post.id],
              queryFn: () => fetchPost(post.id)
            })
          }}
        >
          {post.title}
        </div>
      ))}
    </div>
  )
}
```

## 설정 최적화

```typescript
// QueryClient 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      cacheTime: 1000 * 60 * 10, // 10분
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
})
```

## 장점 정리

1. **자동 캐싱**: 중복 요청 방지
2. **백그라운드 업데이트**: 자동 리페칭
3. **Optimistic Updates**: 빠른 UI 반응
4. **DevTools**: 강력한 디버깅 도구
5. **타입 안정성**: TypeScript 완벽 지원

## 마치며

React Query는 서버 상태 관리의 복잡성을 크게 줄여줍니다. 특히 대규모 애플리케이션에서 그 진가를 발휘합니다! 🚀

