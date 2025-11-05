---
id: 14
title: 'Docker 입문: 개발자를 위한 컨테이너 가이드'
createdAt: 2025-08-30
tags: [docker, devops, container]
published: true
cover: https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&q=80&w=1000
---

# Docker 입문: 개발자를 위한 컨테이너 가이드

Docker를 처음 접하는 개발자를 위한 실용적인 가이드입니다.

## Docker란?

애플리케이션을 컨테이너라는 격리된 환경에서 실행할 수 있게 해주는 플랫폼입니다.

### 왜 Docker를 사용하나?

1. **환경 일관성**: "내 컴퓨터에서는 되는데..." 문제 해결
2. **빠른 배포**: 이미지 하나로 어디서든 실행
3. **리소스 효율**: VM보다 가볍고 빠름
4. **마이크로서비스**: 서비스별 독립적 관리

## 핵심 개념

### 이미지 (Image)
애플리케이션 실행에 필요한 모든 것이 담긴 템플릿

### 컨테이너 (Container)
이미지를 실행한 인스턴스

### Dockerfile
이미지를 만들기 위한 설명서

## 기본 명령어

### 이미지 관련

```bash
# 이미지 다운로드
docker pull nginx

# 이미지 목록
docker images

# 이미지 삭제
docker rmi nginx
```

### 컨테이너 관련

```bash
# 컨테이너 실행
docker run -d -p 8080:80 --name my-nginx nginx

# 실행 중인 컨테이너 확인
docker ps

# 모든 컨테이너 확인
docker ps -a

# 컨테이너 중지
docker stop my-nginx

# 컨테이너 삭제
docker rm my-nginx

# 컨테이너 로그 확인
docker logs my-nginx

# 컨테이너 내부 접속
docker exec -it my-nginx bash
```

## Dockerfile 작성하기

### Node.js 애플리케이션 예제

```dockerfile
# 베이스 이미지
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 빌드 (필요한 경우)
RUN npm run build

# 포트 노출
EXPOSE 3000

# 실행 명령
CMD ["node", "dist/index.js"]
```

### 최적화된 Dockerfile

```dockerfile
# 멀티 스테이지 빌드
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 프로덕션 이미지
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## Docker Compose

여러 컨테이너를 한 번에 관리하기

### docker-compose.yml

```yaml
version: '3.8'

services:
  # 웹 애플리케이션
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
    depends_on:
      - db
      - redis
    volumes:
      - ./src:/app/src

  # PostgreSQL
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres-data:
```

### Docker Compose 명령어

```bash
# 시작
docker-compose up -d

# 중지
docker-compose down

# 로그 확인
docker-compose logs -f

# 특정 서비스만 재시작
docker-compose restart web
```

## 실전 팁

### 1. .dockerignore 활용

```
node_modules
npm-debug.log
.git
.env
dist
coverage
```

### 2. 레이어 캐싱 활용

```dockerfile
# ✅ 좋은 예: 자주 변경되지 않는 것부터
COPY package*.json ./
RUN npm ci
COPY . .

# ❌ 나쁜 예: 소스가 변경될 때마다 npm ci 실행
COPY . .
RUN npm ci
```

### 3. 보안

```dockerfile
# root 사용자 대신 일반 사용자 사용
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs
```

### 4. 헬스체크

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js
```

## 디버깅 팁

### 컨테이너 내부 확인

```bash
# 실행 중인 컨테이너 접속
docker exec -it container-name sh

# 파일 시스템 확인
docker exec container-name ls -la

# 환경 변수 확인
docker exec container-name env
```

### 로그 확인

```bash
# 실시간 로그
docker logs -f container-name

# 마지막 100줄
docker logs --tail 100 container-name
```

## 자주 하는 실수

1. **이미지 크기 무시**: 멀티 스테이지 빌드 활용
2. **레이어 캐싱 무시**: 변경 빈도 고려한 순서
3. **볼륨 미사용**: 데이터 영속성 고려
4. **네트워크 이해 부족**: 컨테이너 간 통신 학습

## 다음 단계

- Kubernetes 학습
- CI/CD 파이프라인 구축
- Docker 보안 강화
- 모니터링 도구 활용

## 마치며

Docker는 현대 개발 환경의 필수 도구입니다. 처음엔 어렵지만 익숙해지면 개발 생산성이 크게 향상됩니다! 🐳

