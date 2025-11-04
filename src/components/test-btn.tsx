import { useState } from 'react'
import { Button } from './ui/button'

export function TestBtn() {
  const [count, setCount] = useState(0)

  return <Button onClick={() => setCount(count + 1)}>Click me {count}</Button>
}
