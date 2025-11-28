---
id: 1
title: JWT 재발급 방식에 대한 고민과 RTR 방식
createdAt: 2025-11-25
tags: ['jwt', 'rtr', '인증', '보안']
cover: https://seeklogo.com/images/J/json-web-tokens-jwt-io-logo-C003DEC47A-seeklogo.com.png
---

일반적으로 웹 애플리케이션에서 사용자 인증을 위해 사용되는 방식은 크게 두 가지가 있습니다. 전통적인 세션방식과 jwt를 사용한 방식이 있는데요. 저희 gomo팀은 jwt를 이용하는 방식을 선택했습니다.

하지만 단순히 jwt를 사용하기만 하면 되는것에서 끝나지 않고, 각 토큰을 재발급하고 관리하는 정책을 고민해야 했는데, 해당 과정을 정리해보고자 합니다.

## JWT

가장 먼저 jwt가 무엇인지에 대해 간단하게 살펴보겠습니다.

> **JWT(JSON Web Token)**<br>
> JSON 객체를 사용하여 양 당사자 간 정보를 안전하게 전달하기 위한 개방형 표준(RFC 7519)

jwt는 json web token의 약자로, 웹 애플리케이션에서 사용되는 토큰 방식 중 하나입니다. 어떤 정보든 json 형태로 담아 전달할 수 있고, 디지털 서명을 통해 내용의 무결성과 진위 여부를 검증할 수 있습니다.

```
HEADER.PAYLOAD.SIGNATURE
```

jwt는 `HEADER`, `PAYLOAD`, `SIGNATURE` 3가지 부분으로 구성되어 있습니다. 각 부분은 `.`으로 구분되어 있으며, 각각 Base64Url로 인코딩되어 있습니다.

이때 각 영역은 다음을 나타냅니다.

- `HEADER` : 토큰의 타입과 해시 알고리즘 정보
- `PAYLOAD` : 토큰에 담길 정보
- `SIGNATURE` : 토큰의 서명

![jwt](/public/assets/20251125223301.png)

이처럼 jwt라는 것은 아래와 같은 단순 문자열에 불과합니다.

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
```

## JWT를 사용한 인증 방식

이러한 jwt를 사용해 `PAYLOAD` 영역에 사용자 정보를 담아 적절히 사용하면, 아래와 같이 서버와 클라이언트 간의 인증을 구현할 수도 있습니다.

1. 사용자가 로그인에 성공하면, 서버는 사용자의 정보(`id`, `email` 등)를 `PAYLOAD` 영역에 담아 jwt를 생성하고 클라이언트에 반환
2. 클라이언트는 발급받은 jwt를 가지고 있다가, 서버에 요청을 보낼때마다 이를 함께 전송
3. 서버는 요청에 포함된 jwt의 서명을 검증하여 위조되지 않았는지 여부를 판단하고, `PAYLOAD` 영역에 담긴 정보를 확인하여 사용자를 인증

```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant Server as 서버

    Note over Client,Server: 1. 로그인 과정
    Client->>Server: 로그인 요청
    Server->>Server: 인증 정보 검증
    Server->>Server: JWT 생성
    Server-->>Client: JWT 발급
    Client->>Client: JWT 저장

    Note over Client,Server: 2. 인증이 필요한 요청
    Client->>Server: JWT를 포함한 API 요청
    Server->>Server: JWT 서명 검증
    Server->>Server: PAYLOAD에서 사용자 정보 추출
    Server-->>Client: 응답
```

전통적인 세션 방식과 달리 jwt 방식은 서버가 별도로 로그인 상태를 관리하고 저장하지 않습니다. 토큰 자체에 사용자 정보가 담겨있고, 서명 검증만으로 인증이 가능하기 때문입니다. 덕분에 서버의 부담을 줄이고 확장성을 높일 수 있다는 장점이 있습니다.

하지만 이러한 jwt 방식에도 문제가 존재합니다. 바로 한번 발급된 토큰은 서버가 제어할 수 없다는 점입니다. 그렇기에 아래와 같은 문제가 발생할 수 있습니다.

- 사용자가 로그아웃을 하더라도 토큰 자체는 여전히 유효하기에 완전한 로그아웃 처리가 어려움
- 토큰의 유효기간이 만료되면 사용자는 다시 로그인해야함
- 토큰이 탈취될 경우 유효기간이 끝날때까지 공격자가 사용자 권한을 탈취할 수 있음

이러한 보안 문제를 해결하기 위해 두 개의 토큰을 사용하는 방식이 고안되었는데, 이것이 바로 Access Token과 Refresh Token입니다.

## Access Token과 Refresh Token

Access Token(AT)과 Refresh Token(RT) 둘 다 앞서 살펴본 jwt와 동일합니다. 단지 하나의 jwt 대신 두 개의 jwt를 사용하며, 각각 다른 역할과 유효기간을 부여하는 방식입니다.

### Access Token

> **Access Token**<br>
> 실제 서비스에 접근하는데 사용되는 토큰으로, 짧은 유효기간을 가짐

Access Token은 이전에 하나의 jwt만 사용하여 인증을 구현할때의 토큰과 동일합니다. 사용자가 로그인에 성공하면 서버가 사용자의 정보를 `PAYLOAD` 영역에 담아 jwt를 생성하여 반환하고, 클라이언트가 이후 요청에 이를 함께 전송하여 서버가 사용자를 인증하는 방식입니다.

대신 이전과 달라진점이 있다면 짧은 유효기간을 가진다는 점입니다. 보통 30분 정도의 시간으로 설정하는데, 이를 통해 토큰이 탈취되더라도 공격자가 사용할 수 있는 시간을 제한할 수 있습니다.

### Refresh Token

> **Refresh Token**<br>
> Access Token을 재발급받기 위한 토큰으로, 긴 유효기간을 가짐

Access Token의 유효기간이 짧은 경우 사용자는 수시로 재로그인을 해야하는 불편함을 겪게 됩니다. 이를 해결하기 위해 Refresh Token이 등장하게 되었습니다.

Refresh Token은 최초 로그인 시 Access Token과 함께 발급되는 또 하나의 jwt로, 오직 새로운 Access Token을 재발급받기 위해서만 사용됩니다. 유효기간은 1주일에서 한 달, 또는 그 이상의 시간으로 길게 설정하여 사용자가 수시로 로그인을 해야하는 불편함을 줄입니다.

### Refresh Token의 저장 방식

Refresh Token은 유효기간이 길기 때문에 탈취되는 경우 보안상 큰 문제가 될 수 있습니다. 따라서 아래와 같이 특별한 방법으로 취급하는 경우가 일반적입니다.

- 서버에서는 Refresh Token을 데이터베이스나 캐시 서버에 저장하고 관리합니다. 혹시나 탈취되더라도 서버에서 이를 삭제하여 무효화할 수 있습니다.
- 서버에서 Refresh Token을 클라이언트에 발급할 때, `HttpOnly`, `Secure`, `SameSite` 옵션을 사용한 쿠키의 형태로 발급합니다.

### 동작

사용자가 로그인에 성공하면, 서버는 Access Token과 Refresh Token을 함께 발급합니다. 클라이언트는 평소에는 Access Token을 사용해 API 요청을 보내다가, Access Token이 만료되면 Refresh Token을 사용해 새로운 Access Token을 발급받습니다.

```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant Server as 서버
    participant DB as DB/Redis

    Note over Client,Server: 1. 로그인 과정
    Client->>Server: 로그인 요청
    Server->>Server: 인증 정보 검증
    Server->>Server: Access Token 생성
    Server->>Server: Refresh Token 생성
    Server->>DB: Refresh Token 저장
    Server-->>Client: AT + RT 발급
    Client->>Client: 토큰 저장

    Note over Client,Server: 2. 일반적인 API 요청 (AT 유효)
    Client->>Server: API 요청
    Server->>Server: AT 서명 검증
    Server-->>Client: 응답 데이터

    Note over Client,Server: 3. AT 만료 후 재발급
    Client->>Server: API 요청
    Server->>Server: AT 검증 실패 (만료된 AT)
    Server-->>Client: 401 Unauthorized

    Client->>Server: RT를 사용하여 AT 재발급 요청
    Server->>Server: RT 서명 검증
    Server->>DB: RT 유효성 확인
    DB-->>Server: RT 유효함
    Server->>Server: 새로운 AT 생성
    Server-->>Client: 새로운 AT 발급
    Client->>Client: 새 AT로 교체

    Client->>Server: 새 AT를 사용하여 API 요청
    Server-->>Client: 응답
```

### 정리

1. 기존 jwt의 보안 문제를 해결하기 위해 유효기간을 짧게 설정한 것이 Access Token
2. 짧은 유효기간을 가진 Access Token으로 인한 불편함을 해결하기 위한 것이 Refresh Token

## JWT 재발급 방식에 대한 고민

지금까지 jwt를 사용하여 서버와 클라이언트 간 사용자 인증 방식을 살펴보았습니다. 처음엔 단순히 기술적으로 원리를 이해하고 구현하기만 하면 된다고 생각했지만, 실제 서비스에 적용하기 위해서는 더 많은 고민이 필요했습니다.

바로 Access Token과 Refresh Token의 유효기간과 재발급 방식에 대한 고민입니다. 이는 서비스의 성격에 따라 달라지기 때문에, 과연 우리 서비스에는 어떤 방식이 가장 적합할지 고민해야 했습니다.

### 가장 보편적인 방식

가장 일반적으로 사용되는 방식은 Access Token의 유효기간을 30분 정도로 짧게 설정하고, Refresh Token의 유효기간을 한 달 정도로 넉넉하게 설정하는 방식입니다. 이는 지금까지 jwt 인증의 기본 개념을 살펴보며 이해한 방식과 동일합니다.

가장 간단하면서도 적당한 보안과 접근성을 모두 충족하는 방식이지만, 그럼에도 한 가지 문제가 있습니다. 바로 Refresh Token의 유효기간이 한 달이기 때문에, 결국 사용자는 한 달마다 다시 로그인을 해야한다는 점입니다.

> 매일 로그인이 풀리는것도 아니고, 한 달에 한번만 로그인하면 되는 정도면 충분히 괜찮지 않나?

처음에는 당연히 사용자 인증이 최대한 오래 유지될 수 있으면 사용자 편의성이 올라가기만 한다고 생각했습니다. 하지만 오히려 이러한 방식이 더 나쁜 사용자 경험을 만들 수 있다는, UX 관련 글을 찾아볼 수 있었습니다.

> 한 달에 한 번 로그인하는 것이, 매일 로그인하는 것보다 더 불쾌할 수 있다. 한 달이라는 기간은 비밀번호를 잊어버리기 딱 좋은 기간이다.

정말 생각해보지도 못했던 관점이었습니다. 생각해보면 저 역시 오랫동안 자동로그인이 되어 있던 서비스에서 갑자기 로그아웃이 되어 있는 경우, 일단 기억에 나는 비밀번호를 몇 개 넣어보다가 결국 아이디/비밀번호 찾기를 진행해야만 했던 경우가 많았습니다.

그러니 사용자의 편의성이 중요하다고 생각한 저희 서비스에서는 다른 방식을 더 고민해야 했습니다.

### 보안이 중요한 서비스에서의 방식

보안이 매우 중요한 서비스에서는 아예 Refresh Token을 사용하지 않을 수도 있습니다.

대표적으로 은행 앱과 같은 금융 서비스를 예시로 들어보겠습니다. 이런 서비스들은 한 번 로그인 시 10분 정도만 유효하고, 그 이후에는 자동으로 로그아웃 됩니다. 사용자가 직접 '로그인 연장'이라는 버튼을 눌러야만 유효시간이 다시 10분으로 리셋되는 방식입니다.

![은행 앱](/public/assets/20251126161601.png)

실제 은행과 같은 금융 서비스에서 jwt를 이용한 인증을 사용하는지는 알 수 없지만, jwt 인증 방식에서 Refresh Token을 제거하고 짧은 유효기간의 Access Token만 사용한다면, 아마 이와 유사하게 동작할 것입니다.

이러한 접근 방식 또한 흥미롭기는 하지만, 보안을 생각한다면 jwt보다는 전통적인 세션 방식이 더 유리하다고 생각합니다. 저희 서비스 역시 지나친 보안으로 인해 사용자의 편의성을 크게 저하시키는 것은 좋지 않다고 생각했기에, 이런 방식도 있을 수 있겠다 정도로만 생각하고 넘어갔습니다.

### 접근성이 중요한 서비스에서의 방식

반대로 사용자 편의성이 가장 중요한 SNS나 커뮤니티와 같은 서비스의 경우 Refresh Token의 유효기간을 매우 길게 6개월 또는 아예 무제한으로 설정하기도 합니다. 따라서 한 번 로그인하면 사용자가 직접 로그아웃하지 않는 이상 계속 로그인 상태가 유지됩니다.

대신 이 방식은 사용자의 편의성을 높인만큼, 그에 대한 트레이드 오프로 Refresh Token이 탈취되었을 때 보안에 더 큰 문제가 발생할 수 있습니다. 따라서 이런 서비스에서는 보통 서버 측에서 다양한 방법으로 이상 징후를 감지합니다. 평소와 다른 IP에서 접속하거나, 비정상적인 API 호출 패턴이 감지되면, 추가 인증을 요구하거나 계정을 일시적으로 잠그는 방식으로 보안을 유지합니다.

사용자의 편의성을 최우선으로 생각한다는 점은 분명 저희 서비스에 맞는 방향이었지만, 그럼에도 보안 문제를 방지하기 위한 이상 징후 감지가 제대로 마련되지 않은 상태에서, Refresh Token을 무제한으로 설정하기에는 보안적인 측면에서 너무 큰 위험이 있다고 생각했습니다.

## Refresh Token Rotation 방식

Access Token과 Refresh Token을 관리하는 여러 방식 중 저희 서비스에 가장 적합한 방식이 무엇일지를 고민하다가, 문득 이런 생각이 들었습니다.

> Refresh Token으로 Access Token을 재발급할 때, Refresh Token도 함께 재발급해주면 어떨까?

사용자가 서비스를 계속 사용하기만 한다면 Refresh Token의 유효기간이 계속 연장되어, 사용자가 재로그인 없이 서비스를 이용할 수 있다고 생각했습니다. 또한 매번 새로운 Refresh Token이 발급되어 기존 Refresh Token이 만료되기 때문에, 토큰 탈취로 인한 보안적인 문제도 함께 해결할 수 있었습니다.

이런 방식이 정말 유효할지에 대해 고민하고 자료를 찾아본 결과, 이미 이런 방식을 **RTR(Refresh Token Rotation)** 방식이라고 부른다는 것을 알게 되었습니다.

> **RTR(Refresh Token Rotation)**<br>
> Refresh Token을 이용해 Access Token을 재발급할 때, 기존과 달리 Refresh Token도 함께 재발급하는 방식

이러한 RTR 방식을 사용하면 매번 새로운 Refresh Token을 발급받아 유효기간이 계속 연장되기에, Refresh Token의 유효기간(gomo의 경우 30일)내에 한번이라도 접속하기만 했다면 계속 로그인 상태를 유지할 수 있습니다.

하지만 과연 토큰이 탈취되는 경우에도, RTR 방식이 다른 방식에 비해 보안적으로 우수하다고 할 수 있을까요? 무한히 새로운 Refresh Token을 발급받는다는 것은 결국 Refresh Token의 유효기간이 무제한이라는 것과 다르진 않을까요?

다음의 시나리오를 통해 알아봅시다.

### Refresh Token이 탈취된 경우

Refresh Token이 어떠한 이유로 탈취가 되었다고 가정해봅시다.

이 경우 공격자는 탈취한 Refresh Token을 이용해 새로운 Access Token을 발급받아 사용자의 계정에 접근할 수 있습니다. 게다가 Refresh Token으로 매번 새로운 Refresh Token도 함께 재발급받을 수 있기 때문에, 공격자는 사실상 무한히 Access Token을 재발급 받을 수 있습니다.

따라서 단순히 유효기간이 무한인 Refresh Token이 탈취된 경우와 같다고 볼 수 있지 않을까요?

RTR 방식에서는 새로운 Refresh Token이 재발급될 때마다, 기존의 Refresh Token을 무효화한다는 차이가 있습니다. 따라서 공격자가 Refresh Token을 탈취하더라도 다음과 같은 일이 발생합니다.

1. 사용자는 자신의 Refresh Token이 탈취되었다는 사실을 알지 못한채 서비스를 계속 이용합니다.
2. 공격자가 탈취한 Refresh Token을 사용하기 전, 사용자 측에서 먼저 새로운 Refresh Token을 발급받습니다.
3. 이미 사용자가 새로운 Refresh Token을 발급받았기 때문에, 공격자가 탈취한 Refresh Token은 만료되어 사용하지 못합니다.

그렇다면 만약 Refresh Token을 탈취한 공격자가 사용자보다 먼저 새로운 Refresh Token을 발급받았다면 어떻게 될까요?

1. 공격자가 탈취한 Refresh Token을 사용하여, 사용자보다 먼저 Access Token과 Refresh Token을 재발급받습니다.
2. 사용자의 Refresh Token은 만료되어 사용하지 못하는 상태이기에, 자동으로 로그아웃 처리 됩니다.
3. 사용자가 다시 로그인하여 새로운 Refresh Token을 발급받는 순간, 탈취된 Refresh Token은 만료되어 사용하지 못합니다.

이처럼 RTR 방식을 사용하면 Refresh Token이 탈취되더라도, 탈취된 Refresh Token을 무효화하고 새로운 Refresh Token을 발급받는 과정을 통해, 공격자의 지속적인 공격을 방지할 수 있습니다.

### RTR의 탈취 감지 메커니즘

RTR 방식의 또 다른 장점으로는 탈취된 Refresh Token을 감지하고 무효화할 수 있는 강력한 보안 메커니즘을 적용할 수 있다는 점입니다.

해당 탈취 감지 방식을 위해 서버에서는 단순히 새로운 Refresh Token을 재발급하고 끝내는 것이 아닌, 무효화된 기존 Refresh Token에 대한 정보를 기억하고 관리합니다. 이렇게 하면 이미 만료된 Refresh Token을 사용하려는 시도를 감지하고 대응할 수 있습니다.

이전의 예시 시나리오와 같이 공격자가 Refresh Token을 탈취하여 사용한다고 가정해봅시다.

> **사용자가 먼저 Refresh Token을 재발급받은 경우**
>
> 1. 공격자가 탈취한 Refresh Token을 사용하려 시도합니다.
> 2. 서버에서 해당 토큰이 이미 무효화된 Refresh Token임을 인지하고 탈취를 감지합니다.
> 3. 즉시 모든 토큰을 무효화하여 공격자의 접근을 차단합니다.

> **공격자가 먼저 Refresh Token을 재발급받은 경우**
>
> 1. 사용자가 자신의 Refresh Token을 사용하려 합니다. (공격자가 이미 새 Refresh Token을 재발급받았기 때문에, 사용자의 Refresh Token은 만료된 상태입니다.)
> 2. 서버에서 사용자의 토큰이 이미 무효화된 Refresh Token임을 인지하고 탈취를 감지합니다.
> 3. 즉시 모든 토큰을 무효화하여 공격자의 접근을 차단합니다.

이렇듯 기존에 사용하던 Refresh Token을 저장해두고 관리하기 때문에, 탈취된 Refresh Token을 감지하고 무효화할 수 있는 강력한 보안 메커니즘을 적용할 수 있습니다.

물론 탈취 감지 메커니즘을 적용해두지 않더라도, RTR의 기본적인 동작 원리만으로 이미 만료된 Refresh Token의 사용을 방지할 수 있습니다. 하지만 무효화된 Refresh Token을 저장하고 관리함으로써 아래와 같이 더욱 강력한 보안 대응이 가능합니다.

- 잘못된 Refresh Token의 사용이 탈취된 토큰을 사용한 명백한 공격인지를 판단할 수 있습니다.
- 사용자가 다시 로그인하여 Refresh Token을 재발급받지 않더라도, 서비스에 접근하는 즉시 모든 토큰을 무효화하여 공격자의 접근을 차단할 수 있습니다.
- 명백한 공격임을 인지한 순간부터는 모든 세션 종료, 토큰 무효화, 강제 비밀번호 재설정, 계정 일시 잠금, 보안 팀 경고 등 서비스의 보안 정책에 따른 적절한 조치를 취할 수 있습니다.

## 마무리

서비스에 jwt를 사용한 인증 방식을 채택했을 때, 처음에는 단순히 일반적인 Access Token과 Refresh Token을 사용하여 구현하기만 하면 되겠다라고 생각하고 쉽게 접근했었습니다. 기술적으로 jwt의 원리를 이해하고, Access Token과 Refresh Token을 발급하고 검증하는 로직만 개발하면 끝이라고 생각했습니다.

하지만 실제로 서비스에 적용하려고 하니, 기술적인 구현보다도 토큰의 유효기간이나 재발급 방식과 같은 정책적인 부분에 대해 더욱 고민해야 했습니다. 이는 단순히 코드로 구현하는 문제가 아닌, 서비스의 성격과 사용자 경험, 그리고 보안 요구사항을 모두 고려해야 하는 문제였습니다.

이러한 고민 과정에서 단순한 기술적인 측면을 넘어, 사용자 경험의 측면에서도 인증 방식을 새롭게 바라볼 수 있었습니다.

> 한 달 마다 로그인하는 것이 정말 좋은 경험일까?

> 사용자에게 명확한 보안 경고를 제공하는 것이 얼마나 효과가 있을까?

팀원들과 여러 방향으로 질문을 던져보며, 기술과 사용자 경험 사이의 균형을 맞추는 방법을 고민할 수 있었습니다. 더 나은 사용자 경험을 추구하는 과정에서 RTR과 같은 보다 더 전문적인 인증 방식에 대해서도 새롭게 공부할 수 있는 좋은 경험이었습니다.
