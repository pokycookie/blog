import { useState } from 'react'

export function TestBtn() {
  const [count, setCount] = useState(0)

  return (
    <button
      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 border"
      onClick={() => setCount(count + 1)}
    >
      Click me {count}
    </button>
  )
}
