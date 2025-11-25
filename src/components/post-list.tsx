import type { CollectionEntry } from 'astro:content'
import { CategorySelector } from './category-selector'
import { PostCard } from './post-card'
import { Pagination } from './pagination'

type PostListProps = {
  currentPage: number
  lastPage: number
  posts: CollectionEntry<'posts'>[]
  categories: string[]
  currentCategory: string | null
  baseUrl: string
}

export function PostList({
  currentPage,
  lastPage,
  posts,
  categories,
  currentCategory,
  baseUrl,
}: PostListProps) {
  return (
    <main className="flex flex-col items-center w-full gap-8">
      <CategorySelector
        currentCategory={currentCategory}
        categories={categories}
        className="max-w-2xl sticky top-0"
      />
      <section className="w-full flex flex-col items-center">
        <ul className="flex flex-col gap-2 max-w-2xl w-full">
          {posts.map((post, i) => (
            <PostCard
              key={i}
              id={post.data.id}
              title={post.data.title}
              createdAt={post.data.createdAt}
              tags={post.data.tags}
              isNotice={post.data.isNotice}
              cover={post.data.cover}
              category={post.slug}
            />
          ))}
        </ul>
      </section>
      <Pagination currentPage={currentPage} lastPage={lastPage} baseUrl={baseUrl} />
    </main>
  )
}
