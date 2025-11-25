---
id: 22
title: 'JavaScript 이벤트 루프 완벽 이해하기'
createdAt: 2025-08-25
tags: [javascript, event-loop, 비동기]
published: true
cover: https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000
---

# JavaScript 이벤트 루프 완벽 이해하기

JavaScript의 비동기 처리 메커니즘인 이벤트 루프를 깊이 있게 알아봅니다.

## JavaScript는 싱글 스레드

JavaScript는 한 번에 하나의 작업만 처리할 수 있습니다. 그런데 어떻게 비동기 처리가 가능할까요?

```javascript
console.log('1')

setTimeout(() => {
  console.log('2')
}, 0)

console.log('3')

// 출력: 1, 3, 2
```

## 이벤트 루프의 구성 요소

### 1. Call Stack (호출 스택)

실행 중인 함수들이 쌓이는 곳

```javascript
function first() {
  console.log('first')
  second()
}

function second() {
  console.log('second')
  third()
}

function third() {
  console.log('third')
}

first()

// Call Stack 변화:
// 1. first()
// 2. first() -> second()
// 3. first() -> second() -> third()
// 4. first() -> second()
// 5. first()
// 6. (empty)
```

### 2. Web APIs

브라우저가 제공하는 비동기 API들

```javascript
// Web APIs:
- setTimeout
- setInterval
- fetch
- DOM Events
- etc.
```

### 3. Callback Queue (Task Queue)

비동기 작업이 완료되면 콜백이 대기하는 곳

```javascript
setTimeout(() => {
  console.log('Callback')
}, 1000)

// 1초 후 콜백이 Callback Queue에 들어감
```

### 4. Microtask Queue

Promise 등의 콜백이 대기하는 곳 (우선순위 높음)

```javascript
Promise.resolve().then(() => {
  console.log('Microtask')
})

// Microtask Queue에 들어감
```

## 이벤트 루프 동작 과정

```javascript
console.log('1')

setTimeout(() => {
  console.log('2')
}, 0)

Promise.resolve().then(() => {
  console.log('3')
})

console.log('4')

// 출력: 1, 4, 3, 2
```

### 단계별 설명

```
1. console.log('1') 실행 → '1' 출력
   Call Stack: [console.log]
   
2. setTimeout 등록 → Web API로 이동
   Call Stack: [setTimeout]
   Web APIs: [setTimeout callback]
   
3. Promise 등록 → Microtask Queue로 이동
   Call Stack: [Promise]
   Microtask Queue: [Promise callback]
   
4. console.log('4') 실행 → '4' 출력
   Call Stack: [console.log]
   
5. Call Stack 비움
   
6. Microtask Queue 확인 → Promise 콜백 실행
   → '3' 출력
   
7. Callback Queue 확인 → setTimeout 콜백 실행
   → '2' 출력
```

## 우선순위

```
1. Call Stack (동기 코드)
2. Microtask Queue (Promise, queueMicrotask)
3. Callback Queue (setTimeout, setInterval, I/O)
```

### 예제

```javascript
console.log('Start')

setTimeout(() => {
  console.log('Timeout 1')
}, 0)

Promise.resolve().then(() => {
  console.log('Promise 1')
}).then(() => {
  console.log('Promise 2')
})

setTimeout(() => {
  console.log('Timeout 2')
}, 0)

console.log('End')

// 출력:
// Start
// End
// Promise 1
// Promise 2
// Timeout 1
// Timeout 2
```

## 복잡한 예제

### 예제 1: 중첩된 비동기

```javascript
console.log('1')

setTimeout(() => {
  console.log('2')
  Promise.resolve().then(() => {
    console.log('3')
  })
}, 0)

Promise.resolve().then(() => {
  console.log('4')
  setTimeout(() => {
    console.log('5')
  }, 0)
})

console.log('6')

// 출력: 1, 6, 4, 2, 3, 5
```

### 예제 2: async/await

```javascript
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(() => {
  console.log('setTimeout')
}, 0)

async1()

new Promise(resolve => {
  console.log('promise1')
  resolve()
}).then(() => {
  console.log('promise2')
})

console.log('script end')

// 출력:
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```

## 실전 예제

### 1. 순차 실행

```javascript
// ❌ 병렬 실행 (느림)
async function fetchData() {
  const user = await fetchUser()      // 1초
  const posts = await fetchPosts()    // 1초
  const comments = await fetchComments() // 1초
  // 총 3초
}

// ✅ 병렬 실행 (빠름)
async function fetchData() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ])
  // 총 1초
}
```

### 2. 에러 처리

```javascript
async function handleData() {
  try {
    const data = await fetchData()
    console.log(data)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Promise 체이닝
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))
```

### 3. 타임아웃 구현

```javascript
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout'))
    }, ms)
  })
}

async function fetchWithTimeout(url, ms) {
  try {
    const result = await Promise.race([
      fetch(url),
      timeout(ms)
    ])
    return result
  } catch (error) {
    console.error('Request timeout or failed:', error)
  }
}

// 사용
fetchWithTimeout('/api/data', 3000)
```

## 주의사항

### 1. 무한 루프

```javascript
// ❌ Call Stack을 막음
while (true) {
  // 브라우저 멈춤
}

// ✅ 이벤트 루프를 활용
function processChunk() {
  // 작업 일부 처리
  
  setTimeout(processChunk, 0) // 다음 틱에 실행
}
```

### 2. Promise 체이닝

```javascript
// ❌ 중첩된 Promise
fetchUser()
  .then(user => {
    fetchPosts(user.id)
      .then(posts => {
        fetchComments(posts[0].id)
          .then(comments => {
            console.log(comments)
          })
      })
  })

// ✅ 평탄한 체이닝
fetchUser()
  .then(user => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(error => console.error(error))
```

### 3. Microtask 폭탄

```javascript
// ❌ Microtask Queue를 막음
function recursiveMicrotask() {
  Promise.resolve().then(recursiveMicrotask)
}
recursiveMicrotask()
// Callback Queue의 작업이 실행되지 않음

// ✅ setTimeout 사용
function recursiveTask() {
  setTimeout(recursiveTask, 0)
}
recursiveTask()
// 다른 작업도 실행 가능
```

## 성능 최적화

### 1. 배치 처리

```javascript
// ❌ 매번 DOM 업데이트
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div')
  document.body.appendChild(div)
}

// ✅ 한 번에 업데이트
const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div')
  fragment.appendChild(div)
}
document.body.appendChild(fragment)
```

### 2. requestAnimationFrame

```javascript
// ❌ setTimeout으로 애니메이션
function animate() {
  // 애니메이션 로직
  setTimeout(animate, 16) // ~60fps
}

// ✅ requestAnimationFrame
function animate() {
  // 애니메이션 로직
  requestAnimationFrame(animate)
}
```

### 3. Web Workers

```javascript
// 메인 스레드를 막지 않고 무거운 작업 처리
const worker = new Worker('worker.js')

worker.postMessage({ data: heavyData })

worker.onmessage = (event) => {
  console.log('Result:', event.data)
}

// worker.js
self.onmessage = (event) => {
  const result = processHeavyData(event.data)
  self.postMessage(result)
}
```

## 디버깅 팁

### 1. 실행 순서 추적

```javascript
console.log('1: Sync')

setTimeout(() => {
  console.log('2: Macro task')
}, 0)

Promise.resolve().then(() => {
  console.log('3: Micro task')
})

queueMicrotask(() => {
  console.log('4: Micro task')
})

console.log('5: Sync')
```

### 2. Chrome DevTools

```
1. Performance 탭
   - Call Tree 확인
   - 병목 지점 찾기

2. Console 탭
   - console.trace() 사용
   - 호출 스택 확인

3. Sources 탭
   - Breakpoint 설정
   - 단계별 실행
```

## 면접 질문

### Q1: 이벤트 루프란?

```
A: JavaScript의 비동기 처리 메커니즘입니다.
Call Stack이 비어있을 때,
Microtask Queue와 Callback Queue의 작업을
순서대로 실행합니다.
```

### Q2: Microtask와 Macrotask의 차이는?

```
A: 
Microtask (우선순위 높음):
- Promise.then/catch/finally
- queueMicrotask
- MutationObserver

Macrotask:
- setTimeout/setInterval
- I/O
- UI 렌더링
```

### Q3: 다음 코드의 출력 순서는?

```javascript
console.log('A')

setTimeout(() => console.log('B'), 0)

Promise.resolve().then(() => console.log('C'))

console.log('D')

// A, D, C, B
```

## 마치며

이벤트 루프는 JavaScript 비동기 처리의 핵심입니다. 제대로 이해하면 복잡한 비동기 코드도 쉽게 다룰 수 있습니다! 🔄

