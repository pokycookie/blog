import { Fragment } from 'react/jsx-runtime'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb'

type CategoryBreadcrumbProps = {
  slug: string
}

export function PostBreadcrumb({ slug }: CategoryBreadcrumbProps) {
  const categories = slug.split('/').slice(0, -1)

  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-1 sm:gap-1">
        <BreadcrumbItem>
          <BreadcrumbLink href="/1">블로그</BreadcrumbLink>
        </BreadcrumbItem>
        {categories.map((category, i) => (
          <Fragment key={i}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {i == 0 ? (
                <BreadcrumbLink href={`/${category}/1`}>{category}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{category}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
