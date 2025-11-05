---
id: 23
title: 'Git 워크플로우: 협업을 위한 실전 가이드'
createdAt: 2025-07-30
tags: [git, workflow, 협업]
published: true
cover: https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=1000
---

# Git 워크플로우: 협업을 위한 실전 가이드

팀 프로젝트에서 사용하는 Git 워크플로우와 베스트 프랙티스를 공유합니다.

## Git 브랜치 전략

### Git Flow

대규모 프로젝트에 적합한 전략

```
main (production)
  ↑
develop (개발)
  ↑
feature/* (기능 개발)
release/* (배포 준비)
hotfix/* (긴급 수정)
```

#### 브랜치 설명

```bash
# main: 프로덕션 코드
# develop: 개발 중인 코드
# feature: 새로운 기능
# release: 배포 준비
# hotfix: 긴급 버그 수정
```

#### 작업 흐름

```bash
# 1. 기능 개발 시작
git checkout develop
git pull origin develop
git checkout -b feature/user-login

# 2. 개발 및 커밋
git add .
git commit -m "feat: 로그인 기능 구현"

# 3. develop에 머지
git checkout develop
git merge feature/user-login
git push origin develop

# 4. 배포 준비
git checkout -b release/v1.0.0
# 버그 수정, 버전 업데이트

# 5. main에 머지
git checkout main
git merge release/v1.0.0
git tag v1.0.0
git push origin main --tags

# 6. develop에도 머지
git checkout develop
git merge release/v1.0.0
```

### GitHub Flow

간단하고 빠른 배포에 적합

```
main
  ↑
feature/*
```

#### 작업 흐름

```bash
# 1. 브랜치 생성
git checkout -b feature/add-button

# 2. 개발 및 푸시
git add .
git commit -m "feat: 버튼 추가"
git push origin feature/add-button

# 3. Pull Request 생성
# GitHub에서 PR 생성

# 4. 코드 리뷰 및 머지
# 리뷰 완료 후 main에 머지

# 5. 배포
# main 브랜치 자동 배포
```

### Trunk Based Development

지속적 통합에 최적화

```
main
  ↑
short-lived branches (1-2일)
```

## 커밋 메시지 컨벤션

### Conventional Commits

```bash
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 종류

```bash
feat: 새로운 기능
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅 (동작 변경 없음)
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드, 설정 파일 수정
perf: 성능 개선
```

### 예시

```bash
# 기본
feat: 사용자 로그인 기능 추가

# Scope 포함
feat(auth): JWT 토큰 인증 구현

# Body 포함
feat: 사용자 검색 기능 추가

사용자 이름과 이메일로 검색 가능
페이지네이션 지원

# Footer 포함
fix: 로그인 버그 수정

비밀번호 검증 로직 수정

Closes #123
```

### 좋은 커밋 메시지

```bash
✅ 좋은 예:
feat: 사용자 프로필 이미지 업로드 기능 추가
fix: 로그인 시 세션 만료 버그 수정
refactor: 사용자 서비스 코드 정리

❌ 나쁜 예:
update
fix bug
수정
ㅁㄴㅇㄹ
```

## Pull Request 가이드

### PR 템플릿

```markdown
## 변경 사항
- 사용자 로그인 기능 구현
- JWT 토큰 인증 추가

## 변경 이유
- 사용자 인증 기능 필요
- 보안 강화

## 테스트
- [ ] 로그인 성공 케이스
- [ ] 로그인 실패 케이스
- [ ] 토큰 만료 케이스

## 스크린샷
![로그인 화면](...)

## 관련 이슈
Closes #123
```

### PR 크기

```
✅ 좋은 PR:
- 300줄 이하
- 하나의 기능/버그 수정
- 리뷰하기 쉬움

❌ 나쁜 PR:
- 1000줄 이상
- 여러 기능 동시에
- 리뷰 어려움
```

### 코드 리뷰

```markdown
# 리뷰어 체크리스트
- [ ] 코드가 요구사항을 만족하는가?
- [ ] 테스트가 충분한가?
- [ ] 성능 이슈는 없는가?
- [ ] 보안 문제는 없는가?
- [ ] 문서화가 필요한가?

# 리뷰 코멘트 예시
✅ 좋은 코멘트:
"이 부분은 `map` 대신 `filter`를 사용하면 더 명확할 것 같습니다."
"에러 처리를 추가하면 좋을 것 같습니다."

❌ 나쁜 코멘트:
"이상함"
"다시 해"
```

## 유용한 Git 명령어

### 기본 명령어

```bash
# 상태 확인
git status

# 변경사항 확인
git diff

# 커밋 히스토리
git log --oneline --graph

# 브랜치 목록
git branch -a

# 원격 저장소 확인
git remote -v
```

### 고급 명령어

```bash
# 특정 커밋 선택적으로 가져오기
git cherry-pick <commit-hash>

# 커밋 수정
git commit --amend

# 마지막 커밋 취소 (변경사항 유지)
git reset --soft HEAD~1

# 마지막 커밋 취소 (변경사항 삭제)
git reset --hard HEAD~1

# 특정 파일만 스테이징
git add -p

# 스태시 (임시 저장)
git stash
git stash pop

# 브랜치 이름 변경
git branch -m old-name new-name

# 원격 브랜치 삭제
git push origin --delete branch-name
```

### Rebase

```bash
# develop 최신 변경사항 가져오기
git checkout feature/my-feature
git rebase develop

# 충돌 해결 후
git add .
git rebase --continue

# Rebase 취소
git rebase --abort

# Interactive Rebase (커밋 정리)
git rebase -i HEAD~3
```

## 충돌 해결

### 충돌 발생 시

```bash
# 1. 충돌 파일 확인
git status

# 2. 파일 열어서 수정
# <<<<<<< HEAD
# 내 변경사항
# =======
# 다른 사람의 변경사항
# >>>>>>> branch-name

# 3. 충돌 해결 후
git add .
git commit -m "Merge conflict resolved"
```

### 충돌 최소화 팁

```bash
# 1. 자주 pull
git pull origin develop

# 2. 작은 단위로 커밋
git commit -m "feat: 기능 일부 구현"

# 3. 브랜치 수명 짧게
# 1-2일 내에 머지
```

## Git Hooks

### Pre-commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/sh

# 린트 체크
npm run lint

# 테스트 실행
npm test

# 실패 시 커밋 중단
if [ $? -ne 0 ]; then
  echo "Lint or test failed. Commit aborted."
  exit 1
fi
```

### Husky 사용

```bash
# 설치
npm install -D husky

# 초기화
npx husky install

# Pre-commit hook 추가
npx husky add .husky/pre-commit "npm test"
```

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 실전 시나리오

### 시나리오 1: 잘못된 브랜치에 커밋

```bash
# develop에 커밋했는데 feature 브랜치여야 함

# 1. 새 브랜치 생성 (커밋 유지)
git branch feature/my-feature

# 2. develop 되돌리기
git reset --hard origin/develop

# 3. 새 브랜치로 이동
git checkout feature/my-feature
```

### 시나리오 2: 커밋 메시지 수정

```bash
# 마지막 커밋 메시지 수정
git commit --amend -m "fix: 올바른 커밋 메시지"

# 이미 푸시한 경우 (주의!)
git push --force-with-lease
```

### 시나리오 3: 여러 커밋 하나로 합치기

```bash
# Interactive Rebase
git rebase -i HEAD~3

# 에디터에서:
# pick abc123 첫 번째 커밋
# squash def456 두 번째 커밋
# squash ghi789 세 번째 커밋

# 커밋 메시지 수정 후 저장
```

### 시나리오 4: 특정 파일 변경사항 취소

```bash
# 스테이징 취소
git reset HEAD file.js

# 변경사항 완전히 취소
git checkout -- file.js

# 또는
git restore file.js
```

## 베스트 프랙티스

### 1. 커밋

```
✅ Do:
- 작은 단위로 자주 커밋
- 의미 있는 커밋 메시지
- 하나의 커밋에 하나의 목적

❌ Don't:
- 여러 기능을 한 커밋에
- "수정", "ㅁㄴㅇㄹ" 같은 메시지
- 테스트 안 된 코드 커밋
```

### 2. 브랜치

```
✅ Do:
- 명확한 브랜치 이름
- 짧은 브랜치 수명 (1-2일)
- 정기적으로 main/develop과 동기화

❌ Don't:
- 오래된 브랜치 방치
- 브랜치 너무 많이 생성
- main에 직접 커밋
```

### 3. PR

```
✅ Do:
- 작은 PR (300줄 이하)
- 명확한 설명
- 테스트 포함

❌ Don't:
- 거대한 PR (1000줄 이상)
- 설명 없는 PR
- 리뷰 없이 머지
```

## 도구 추천

### GUI 도구
- **GitKraken**: 시각적인 Git 클라이언트
- **SourceTree**: 무료 Git GUI
- **GitHub Desktop**: 간단한 GitHub 연동

### VS Code 확장
- **GitLens**: Git 히스토리 확인
- **Git Graph**: 브랜치 시각화
- **Git History**: 파일 히스토리

### CLI 도구
- **tig**: 터미널 Git 뷰어
- **lazygit**: 터미널 Git UI
- **gh**: GitHub CLI

## 마치며

좋은 Git 워크플로우는 팀의 생산성을 크게 향상시킵니다. 팀에 맞는 전략을 선택하고, 일관되게 적용하세요! 🚀

