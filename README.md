# Astro Simple Blog

## 📝 Posts

모든 포스트는 `src/content/posts` 디렉토리 내부에 마크다운 파일로 작성합니다.

디렉토리 구조가 곧 카테고리가 되므로 자유롭게 구성할 수 있으며, 별도의 설정이 필요하지 않습니다. 중첩 구조를 사용 시 최상위 디렉토리를 기준으로 카테고리가 관리됩니다.

```
src/content/posts/
├── tech/
│   ├── docker-basics.md
│   ├── git-workflow.md
│   ├── javascript/
│   │   ├── closure.md
│   │   └── event-loop.md
│   └── react/
│       └── react-query-guide.md
├── career/
│   ├── developer-interview.md
│   └── first-job.md
├── design/
│   ├── color-theory.md
│   └── figma-tips.md
└── life/
    ├── jeju-travel.md
    └── minimalism.md
```

위 구조에서 `tech`, `career`, `design`, `life`가 각각 카테고리로 인식됩니다.

`tech/javascript/closure.md` 파일의 경우 카테고리는 `tech`로 분류되지만, 포스트 상세 페이지에서는 `블로그 > tech > javascript` 형태로 상세 디렉터리 경로가 표시됩니다.

## Frontmatter

마크다운 파일 최상단에 `---`로 감싸진 프론트매터 영역을 만들어 메타데이터를 작성할 수 있습니다. 이 영역에 포스트의 제목, 발행일, 태그, 공개 여부 등을 정의할 수 있습니다.

```yml
---
title: '프론트매터 사용법'
createdAt: 2025-11-25
tags: ['intro', 'blog']
---
```

프론트매터에 사용할 수 있는 필드의 정보는 다음과 같습니다.

| Field        | Type       | Required | Default | Description                      |
| ------------ | ---------- | -------- | ------- | -------------------------------- |
| `id`         | `number`   | Auto     | -       | 포스트 고유 식별자 (자동 할당됨) |
| `title`      | `string`   | ✅       | -       | 글 제목                          |
| `createdAt`  | `date`     | ✅       | -       | 발행일 (YYYY-MM-DD 형식)         |
| `updatedAt`  | `date`     | ❌       | -       | 수정일 (YYYY-MM-DD 형식)         |
| `tags`       | `string[]` | ❌       | `[]`    | 태그 목록                        |
| `published`  | `boolean`  | ❌       | `true`  | 공개 여부                        |
| `deprecated` | `boolean`  | ❌       | `false` | Depreacated 여부                 |
| `isNotice`   | `boolean`  | ❌       | `false` | 공지사항 여부                    |
| `cover`      | `string`   | ❌       | -       | 커버 이미지 URL                  |

## 🔢 Automatic ID Management

모든 포스트의 프론트매터에는 고유한 `id` 값이 필요하며, 이 값은 절대 중복되어서는 안 됩니다. 수동으로 ID를 관리하는 것은 번거롭기 때문에 자동 할당 스크립트를 제공합니다.

아래의 명령어를 실행하면 모든 포스트의 `id` 값이 자동으로 할당됩니다. 이때 이미 id가 할당된 포스트는 제외됩니다.

```bash
pnpm assign
```

이 스크립트는 `pnpm dev` 및 `pnpm build` 실행 시 자동으로 동작하며, GitHub에 푸시하여 자동 빌드가 진행될 때도 실행됩니다. 따라서 ID 관리는 전혀 신경 쓰지 않아도 됩니다.
