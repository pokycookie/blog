import { cn, url } from '@/lib/utils'
import { Button } from './ui/button'
import type { ReactNode } from 'react'

type CategorySelectorProps = {
  currentCategory: string | null
  categories: string[]
  className?: string
}

export function CategorySelector({
  currentCategory,
  categories,
  className,
}: CategorySelectorProps) {
  return (
    <div className={cn('flex gap-2 w-full bg-background p-4 border-b border-muted', className)}>
      <CategoryButton isActive={currentCategory === null} href={url('/1')}>
        전체
      </CategoryButton>
      {categories.map((category) => (
        <CategoryButton
          key={category}
          isActive={category === currentCategory}
          href={`/${category}/1`}
        >
          {category.toUpperCase()}
        </CategoryButton>
      ))}
    </div>
  )
}

type CategoryButtonProps = {
  children: ReactNode
  isActive: boolean
  href: string
}

function CategoryButton({ children, isActive, href }: CategoryButtonProps) {
  return (
    <a href={url(href)}>
      <Button variant="ghost" className={cn(isActive && 'bg-accent', 'cursor-pointer')}>
        {children}
      </Button>
    </a>
  )
}
