import dayjs from 'dayjs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb'
import { DotIcon } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import { Badge } from './ui/badge'

type PostCardProps = {
  id: number
  title: string
  createdAt: Date
  tags: string[]
  isNotice: boolean
  cover?: string
  category: string
}

export function PostCard({ id, title, createdAt, tags, isNotice, cover, category }: PostCardProps) {
  return (
    <li className="group cursor-pointer w-full px-2 py-4">
      <a href={`/posts/${id}`} className="flex gap-8">
        <section className="flex flex-col flex-1 gap-2 justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold group-hover:text-blue-500 transition-colors">
              {title}
            </h2>
            <ul className="flex gap-1 flex-wrap">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-md">
                  {tag}
                </Badge>
              ))}
            </ul>
          </div>
          <div className="flex items-center">
            <p className="text-xs text-muted-foreground">
              {dayjs(createdAt).format('YYYY년 MM월 DD일')}
            </p>
            <DotIcon className="size-4 text-muted-foreground" />
            <CategoryBreadcrumb slug={category} />
          </div>
        </section>
        <PostCover cover={cover} />
      </a>
    </li>
  )
}

type CategoryBreadcrumbProps = {
  slug: string
}

function CategoryBreadcrumb({ slug }: CategoryBreadcrumbProps) {
  const category = slug.split('/').slice(0, -1)

  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-1 sm:gap-1">
        {category.map((item, i) => (
          <Fragment key={i}>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-muted-foreground">{item}</BreadcrumbPage>
            </BreadcrumbItem>
            {i !== category.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
        {category.length === 0 && (
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground">전체</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

type PostCoverProps = {
  cover?: string
}

function PostCover({ cover }: PostCoverProps) {
  return (
    <div className="h-24 aspect-3/2 rounded-lg overflow-hidden">
      {cover ? (
        <img src={cover} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-muted" />
      )}
    </div>
  )
}
