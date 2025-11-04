import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const POSTS_DIR = 'src/content/posts'
const AUTO_INCREMENT_DIR = 'src/content'
const AUTO_INCREMENT_FILE = 'auto-increment.json'

const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---/
const ID_REGEX = /^id:\s*(\d+)\s*$/m

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const postsDir = path.join(rootDir, POSTS_DIR)
const autoIncrementPath = path.join(rootDir, AUTO_INCREMENT_DIR, AUTO_INCREMENT_FILE)

function getLastId() {
  if (!fs.existsSync(autoIncrementPath)) {
    return 0
  }

  const content = fs.readFileSync(autoIncrementPath, 'utf-8')
  const { lastId } = JSON.parse(content)

  return lastId
}

function updateLastId(lastId) {
  const content = JSON.stringify({ lastId }, null, 2)
  fs.writeFileSync(autoIncrementPath, content)
}

function getPostId(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')

  // extract frontmatter
  const match = content.match(FRONTMATTER_REGEX)
  if (!match) return null

  const frontmatter = match[1]
  const idMatch = frontmatter.match(ID_REGEX)

  if (!idMatch) return null
  return parseInt(idMatch[1])
}

function updatePostId(filePath, id) {
  let content = fs.readFileSync(filePath, 'utf-8')

  const frontmatterMatch = content.match(FRONTMATTER_REGEX)
  if (!frontmatterMatch) {
    content = `---\nid: ${id}\n---\n\n${content}`
    fs.writeFileSync(filePath, content)
    return
  }

  const [fullMatch, frontmatter] = frontmatterMatch
  if (frontmatter.match(ID_REGEX)) return

  const newFrontmatter = `---\nid: ${id}\n${frontmatter}\n---`
  content = content.replace(fullMatch, newFrontmatter)

  fs.writeFileSync(filePath, content)
}

function getAllPosts(startDir) {
  const files = []

  function scan(dir) {
    if (!fs.existsSync(dir)) return

    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) scan(fullPath)
      if (entry.isFile() && entry.name.endsWith('.md')) files.push(fullPath)
    })
  }

  scan(startDir)
  return files
}

function main() {
  console.log('================================\n')
  console.log('🔍 Scanning for posts...\n')

  const posts = getAllPosts(postsDir)
  console.log(`📝 Found ${posts.length} posts\n`)

  let lastId = getLastId()
  let assignedCount = 0

  posts.forEach((filePath) => {
    const relativePath = path.relative(postsDir, filePath)
    const existingId = getPostId(filePath)

    if (existingId !== null && existingId > lastId) lastId = existingId
    if (existingId === null) {
      updatePostId(filePath, ++lastId)
      assignedCount++
      console.log(`✅ [ID: ${lastId}] assigned to [${relativePath}]`)
    }
  })
  updateLastId(lastId)

  console.log(`\n✨ Completed! ${assignedCount} posts assigned!`)
  console.log('\n================================\n')
}

main()
