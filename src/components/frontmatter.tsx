import type { CollectionEntry } from 'astro:content'
import dayjs from 'dayjs'
import { Badge } from './ui/badge'
import { ClockIcon, TagIcon } from 'lucide-react'

type FrontmatterProps = CollectionEntry<'posts'>['data']

export function Frontmatter(frontmatter: FrontmatterProps) {
  return (
    <section className="border-y flex flex-col gap-3 px-2 py-4 text-muted-foreground">
      <TimeField label="생성일자" date={frontmatter.createdAt} />
      <TimeField label="수정일자" date={frontmatter.updatedAt ?? frontmatter.createdAt} />
      <TagField tags={frontmatter.tags} />
    </section>
  )
}

type TimeFieldProps = {
  label: string
  date: Date
}

function TimeField({ label, date }: TimeFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 w-20">
        <ClockIcon className="size-3" />
        <p className="text-sm">{label}</p>
      </span>
      <p className="text-sm">{dayjs(date).format('YYYY년 MM월 DD일')}</p>
    </div>
  )
}

type TagFieldProps = {
  tags: string[]
}

function TagField({ tags }: TagFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 w-20">
        <TagIcon className="size-3" />
        <p className="text-sm">태그</p>
      </span>
      <ul className="flex gap-1 flex-wrap p-0">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="rounded-md">
            {tag}
          </Badge>
        ))}
      </ul>
    </div>
  )
}
