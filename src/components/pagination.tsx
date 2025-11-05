import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import _ from 'lodash'

const VISIBLE_PAGES = 5

type PaginationProps = {
  currentPage: number
  lastPage: number
  baseUrl: string
}

export function Pagination({ currentPage, lastPage, baseUrl }: PaginationProps) {
  const start = Math.max(currentPage - Math.floor(VISIBLE_PAGES / 2), 1)
  const end = Math.min(start + VISIBLE_PAGES - 1, lastPage)
  const pages = _.range(Math.max(1, Math.min(start, lastPage - VISIBLE_PAGES + 1)), end + 1)

  return (
    <PaginationComponent>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? `${baseUrl}/${currentPage - 1}` : undefined}
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem>
            <PaginationLink href={`${baseUrl}/${page}`} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={currentPage < lastPage ? `${baseUrl}/${currentPage + 1}` : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationComponent>
  )
}
