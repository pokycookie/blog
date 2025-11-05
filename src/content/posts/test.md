---
id: 6
title: 'Markdown 기능 완벽 테스트: 블로그에서 쓸 수 있는 모든 마크다운 예시'
createdAt: 2024-06-12
tags: [markdown, 예시, 가이드, 테스트]
published: true
cover: https://images.unsplash.com/photo-1760729814064-0389b03c909d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=988
---

안녕하세요!  
이번 포스트에서는 **Markdown**의 거의 모든 기능을 예시와 함께 소개하려고 합니다. 실제로 블로그에서 쓸 수 있는 형태로, _현실적인 내용_ 과 함께 살펴볼게요.  
마크다운을 처음 접하셨거나, 다양한 기능을 한 번에 복습하고 싶다면 이 글이 도움이 될 것입니다.

---

## 목차

- [H1 헤딩 (가장 큰 제목)](#h1-헤딩-가장-큰-제목)
  - [H2 헤딩](#h2-헤딩)
    - [H3 헤딩](#h3-헤딩)
      - [H4 헤딩](#h4-헤딩)
        - [H5 헤딩](#h5-헤딩)
          - [H6 헤딩](#h6-헤딩)
  - [텍스트 강조](#텍스트-강조)
  - [링크와 이미지](#링크와-이미지)
  - [리스트(List)](#리스트list)
    - [순서 없는 리스트](#순서-없는-리스트)
    - [순서 있는 리스트](#순서-있는-리스트)
  - [코드(Code)](#코드code)
    - [인라인 코드](#인라인-코드)
    - [코드 블록](#코드-블록)
  - [인용문(Blockquote)](#인용문blockquote)
  - [테이블(Table)](#테이블table)
  - [수평선(Horizontal Rule)](#수평선horizontal-rule)
  - [체크박스(Task List)](#체크박스task-list)
  - [기타(Misc.)](#기타misc)
    - [HTML 섞어 쓰기](#html-섞어-쓰기)
    - [이모지](#이모지)
  - [결론](#결론)

---

## 헤딩(Heading)

헤딩은 콘텐츠의 구조를 나누는 데 사용합니다.

# H1 헤딩 (가장 큰 제목)

## H2 헤딩

### H3 헤딩

#### H4 헤딩

##### H5 헤딩

###### H6 헤딩

---

## 텍스트 강조

- **굵게**: `**굵게**`
- _이탤릭_: `_이탤릭_`
- ~~취소선~~: `~~취소선~~`
- `인라인 코드`: `` `인라인 코드` ``
- <u>밑줄(HTML)</u>: `<u>밑줄</u>`
- <mark>하이라이트(HTML)</mark>: `<mark>하이라이트</mark>`

_예시 문장:_

> 마크다운은 **굵게**, _이탤릭_, 그리고 ~~취소선~~ 등을 손쉽게 구현할 수 있어서 편리합니다.

---

## 링크와 이미지

- [네이버](https://www.naver.com)로 이동
- [이메일 보내기](mailto:someone@example.com)

이미지 예시:  
![마크다운 로고](https://images.unsplash.com/photo-1760729814064-0389b03c909d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=988 'Markdown')

잘못된 이미지:
![잘못된 이미지](https://images.wrong.com/image.png 'Markdown')

---

## 리스트(List)

### 순서 없는 리스트

- 사과
  - 빨간 사과
  - 초록 사과
- 바나나
  - 노란 바나나
- 오렌지

### 순서 있는 리스트

1. 첫 번째 단계
2. 두 번째 단계
   1. 두 번째의 하위 단계
   2. 또 다른 하위 단계
3. 세 번째 단계

---

## 코드(Code)

### 인라인 코드

Markdown에서는 `console.log('Hello, Markdown!')`처럼 표현할 수 있습니다.

### 코드 블록

\```js
function hello(name) {
  console.log(`Hello, ${name}!`)
}
hello("Markdown")
\```

```python
def hello(name):
    print(f"Hello, {name}!")
hello("Markdown")
```

---

## 인용문(Blockquote)

> 이것은 인용문입니다.  
> 여러 줄도 작성할 수 있습니다.

> **TIP:** 인용문 안에
>
> - 리스트나
> - `코드`  
>   등 다양한 것도 넣을 수 있습니다.

---

## 테이블(Table)

| 이름   | 이메일            | 가입일     |
| ------ | ----------------- | ---------- |
| 홍길동 | hong@example.com  | 2024-05-05 |
| 김영희 | young@example.com | 2024-06-01 |

---

## 수평선(Horizontal Rule)

---

아래처럼 구분선으로 콘텐츠를 분리할 수 있습니다.

---

---

---

## 체크박스(Task List)

블로그 작성 체크리스트:

- [x] 주제 선정
- [x] 개요 작성
- [x] 본문 작성
- [ ] 이미지 추가
- [ ] 최종 교정

---

## 기타(Misc.)

### HTML 섞어 쓰기

<p style="color: teal; font-weight: bold;">
  Markdown 문서에도 이런 식으로 <strong>HTML 태그</strong>를 사용할 수 있습니다!
</p>

### 이모지

🎉 😃 👍 🚀

---

## 결론

마크다운은 간단하면서도 강력한 문서 작성 도구입니다. 다양한 기능을 적절히 활용하여 읽기 쉽고 보기 좋은 블로그를 작성해보세요!

궁금한 점이나, 추가로 테스트해보고 싶은 기능이 있다면 댓글로 남겨주세요 😄
