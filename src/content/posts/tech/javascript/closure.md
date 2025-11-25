---
id: 21
title: 'JavaScript 클로저(Closure) 완벽 이해하기'
createdAt: 2025-09-20
tags: [javascript, closure, 개념]
published: true
cover: https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=1000
---

# JavaScript 클로저(Closure) 완벽 이해하기

많은 개발자들이 어려워하는 클로저 개념을 쉽게 풀어봅니다.

## 클로저란?

> 함수와 그 함수가 선언된 렉시컬 환경의 조합

쉽게 말하면, **함수가 생성될 때의 환경을 기억하는 것**입니다.

## 기본 예제

```javascript
function outer() {
  const name = 'JavaScript'
  
  function inner() {
    console.log(name) // outer의 변수에 접근
  }
  
  return inner
}

const myFunc = outer()
myFunc() // 'JavaScript' 출력
```

`inner` 함수는 `outer` 함수의 `name` 변수를 기억하고 있습니다. 이것이 클로저입니다!

## 왜 클로저가 필요한가?

### 1. 데이터 은닉 (Private 변수)

```javascript
function createCounter() {
  let count = 0 // private 변수
  
  return {
    increment() {
      count++
      return count
    },
    decrement() {
      count--
      return count
    },
    getCount() {
      return count
    }
  }
}

const counter = createCounter()
console.log(counter.increment()) // 1
console.log(counter.increment()) // 2
console.log(counter.getCount())  // 2

// count 변수에 직접 접근 불가
console.log(counter.count) // undefined
```

### 2. 함수 팩토리

```javascript
function makeMultiplier(x) {
  return function(y) {
    return x * y
  }
}

const multiplyBy2 = makeMultiplier(2)
const multiplyBy5 = makeMultiplier(5)

console.log(multiplyBy2(3)) // 6
console.log(multiplyBy5(3)) // 15
```

### 3. 이벤트 핸들러

```javascript
function setupButtons() {
  const buttons = document.querySelectorAll('button')
  
  buttons.forEach((button, index) => {
    button.addEventListener('click', function() {
      console.log(`Button ${index} clicked`)
      // index를 클로저로 기억
    })
  })
}
```

## 실전 예제

### 1. 디바운스 (Debounce)

```javascript
function debounce(func, delay) {
  let timeoutId
  
  return function(...args) {
    clearTimeout(timeoutId)
    
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 사용 예시
const handleSearch = debounce((query) => {
  console.log('Searching:', query)
}, 300)

// 300ms 내에 여러 번 호출해도 마지막 한 번만 실행
handleSearch('a')
handleSearch('ab')
handleSearch('abc') // 이것만 실행됨
```

### 2. 메모이제이션 (Memoization)

```javascript
function memoize(fn) {
  const cache = {}
  
  return function(...args) {
    const key = JSON.stringify(args)
    
    if (key in cache) {
      console.log('From cache')
      return cache[key]
    }
    
    console.log('Computing...')
    const result = fn.apply(this, args)
    cache[key] = result
    return result
  }
}

// 사용 예시
const fibonacci = memoize(function(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
})

console.log(fibonacci(10)) // Computing...
console.log(fibonacci(10)) // From cache
```

### 3. 모듈 패턴

```javascript
const UserModule = (function() {
  // Private 변수
  const users = []
  let nextId = 1
  
  // Private 함수
  function generateId() {
    return nextId++
  }
  
  // Public API
  return {
    addUser(name) {
      const user = {
        id: generateId(),
        name: name
      }
      users.push(user)
      return user
    },
    
    getUser(id) {
      return users.find(u => u.id === id)
    },
    
    getAllUsers() {
      return [...users] // 복사본 반환
    }
  }
})()

UserModule.addUser('Alice')
UserModule.addUser('Bob')
console.log(UserModule.getAllUsers())
// users 배열에 직접 접근 불가
```

## 주의사항

### 1. 루프에서의 클로저

```javascript
// ❌ 잘못된 예
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i) // 3, 3, 3
  }, 1000)
}

// ✅ 해결 방법 1: let 사용
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i) // 0, 1, 2
  }, 1000)
}

// ✅ 해결 방법 2: IIFE
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j) // 0, 1, 2
    }, 1000)
  })(i)
}

// ✅ 해결 방법 3: forEach
[0, 1, 2].forEach(i => {
  setTimeout(function() {
    console.log(i) // 0, 1, 2
  }, 1000)
})
```

### 2. 메모리 누수

```javascript
// ❌ 메모리 누수 가능성
function createHeavyObject() {
  const heavyData = new Array(1000000).fill('data')
  
  return function() {
    // heavyData를 사용하지 않아도 메모리에 유지됨
    console.log('Hello')
  }
}

// ✅ 개선
function createHeavyObject() {
  const heavyData = new Array(1000000).fill('data')
  const result = processData(heavyData)
  
  return function() {
    console.log(result) // 필요한 것만 클로저에 포함
  }
}
```

## React에서의 클로저

### useState Hook

```javascript
function useState(initialValue) {
  let value = initialValue
  
  function setState(newValue) {
    value = newValue
    render() // 리렌더링
  }
  
  return [value, setState]
}

// 사용
function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### useEffect Hook

```javascript
function useEffect(callback, deps) {
  const prevDeps = getPrevDeps()
  
  if (depsChanged(prevDeps, deps)) {
    callback() // callback은 클로저로 외부 변수 접근
  }
  
  saveDeps(deps)
}
```

### 클로저 함정

```javascript
function Counter() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      // ❌ 항상 초기 count(0)를 참조
      console.log(count)
    }, 1000)
    
    return () => clearInterval(timer)
  }, []) // 빈 의존성 배열
  
  // ✅ 해결 방법 1: 의존성 추가
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [count])
  
  // ✅ 해결 방법 2: 함수형 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
}
```

## 성능 고려사항

### 불필요한 클로저 생성 피하기

```javascript
// ❌ 매번 새로운 함수 생성
function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  )
}

// ✅ useCallback으로 최적화
function List({ items }) {
  const handleClick = useCallback((id) => {
    console.log('Clicked:', id)
  }, [])
  
  return (
    <ul>
      {items.map(item => (
        <ListItem 
          key={item.id} 
          item={item} 
          onClick={handleClick}
        />
      ))}
    </ul>
  )
}
```

## 면접 질문

### Q1: 클로저란 무엇인가요?

```
A: 함수가 선언될 때의 렉시컬 환경을 기억하는 것입니다.
내부 함수가 외부 함수의 변수에 접근할 수 있고,
외부 함수가 종료된 후에도 그 변수를 참조할 수 있습니다.
```

### Q2: 클로저의 활용 사례는?

```
A: 
1. 데이터 은닉 (private 변수)
2. 함수 팩토리
3. 이벤트 핸들러
4. 디바운스/스로틀
5. 메모이제이션
6. 모듈 패턴
```

### Q3: 클로저의 단점은?

```
A:
1. 메모리 사용: 외부 변수를 계속 참조
2. 메모리 누수 가능성
3. 디버깅 어려움

해결: 필요한 변수만 클로저에 포함,
     불필요한 참조 제거
```

## 연습 문제

### 문제 1: 카운터 만들기

```javascript
// 다음 기능을 가진 카운터를 만드세요
// - increment(): 1 증가
// - decrement(): 1 감소
// - reset(): 0으로 초기화
// - count 변수는 외부에서 접근 불가

function createCounter() {
  // 여기에 구현
}

const counter = createCounter()
counter.increment()
counter.increment()
console.log(counter.getCount()) // 2
```

### 문제 2: 한 번만 실행되는 함수

```javascript
// 함수를 한 번만 실행하도록 만드세요

function once(fn) {
  // 여기에 구현
}

const initialize = once(() => {
  console.log('Initialized')
})

initialize() // 'Initialized'
initialize() // 아무것도 출력 안 됨
```

## 마치며

클로저는 JavaScript의 핵심 개념입니다. 처음엔 어렵지만, 이해하고 나면 강력한 도구가 됩니다. 실제 코드에서 많이 사용해보며 익숙해지세요! 🎯

