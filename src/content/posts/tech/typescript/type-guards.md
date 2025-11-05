---
id: 11
title: 'TypeScript Type Guards 완벽 가이드'
createdAt: 2025-10-28
tags: [typescript, type-guards, 타입안정성]
published: true
cover: https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=1000
---

# TypeScript Type Guards 완벽 가이드

TypeScript에서 런타임에 타입을 좁혀나가는 Type Guards에 대해 알아봅니다.

## Type Guards란?

Type Guards는 런타임에 특정 스코프 내에서 타입을 보장하는 표현식입니다.

## 기본 Type Guards

### 1. typeof

```typescript
function printValue(value: string | number) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase()) // string으로 타입이 좁혀짐
  } else {
    console.log(value.toFixed(2)) // number로 타입이 좁혀짐
  }
}
```

### 2. instanceof

```typescript
class Dog {
  bark() {
    console.log('Woof!')
  }
}

class Cat {
  meow() {
    console.log('Meow!')
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark()
  } else {
    animal.meow()
  }
}
```

### 3. in 연산자

```typescript
interface Bird {
  fly(): void
  layEggs(): void
}

interface Fish {
  swim(): void
  layEggs(): void
}

function move(pet: Bird | Fish) {
  if ('fly' in pet) {
    pet.fly()
  } else {
    pet.swim()
  }
}
```

## 사용자 정의 Type Guards

### is 키워드 사용

```typescript
interface User {
  name: string
  email: string
}

interface Admin extends User {
  role: 'admin'
  permissions: string[]
}

// Type Guard 함수
function isAdmin(user: User | Admin): user is Admin {
  return 'role' in user && user.role === 'admin'
}

function handleUser(user: User | Admin) {
  if (isAdmin(user)) {
    console.log(user.permissions) // Admin 타입으로 좁혀짐
  } else {
    console.log(user.email) // User 타입
  }
}
```

## 실전 예제

### API 응답 타입 체크

```typescript
interface SuccessResponse {
  status: 'success'
  data: any
}

interface ErrorResponse {
  status: 'error'
  message: string
}

type ApiResponse = SuccessResponse | ErrorResponse

function isSuccessResponse(
  response: ApiResponse
): response is SuccessResponse {
  return response.status === 'success'
}

async function fetchData() {
  const response: ApiResponse = await fetch('/api/data').then(r => r.json())
  
  if (isSuccessResponse(response)) {
    console.log(response.data)
  } else {
    console.error(response.message)
  }
}
```

### Null/Undefined 체크

```typescript
function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

const values = [1, 2, undefined, 3, null, 4]
const definedValues = values.filter(isDefined) // number[]
```

## 주의사항

1. **Type Guard는 런타임 체크**: 컴파일 타임이 아닌 런타임에 실행됩니다
2. **정확한 체크 로직**: Type Guard 함수의 로직이 정확해야 타입 안정성이 보장됩니다
3. **성능 고려**: 복잡한 Type Guard는 성능에 영향을 줄 수 있습니다

## 마치며

Type Guards를 잘 활용하면 TypeScript의 타입 안정성을 극대화할 수 있습니다. 특히 외부 API나 사용자 입력을 다룰 때 필수적입니다! 🎯

