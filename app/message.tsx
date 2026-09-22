'use client'

import { useEffect, useState } from 'react'

export default function Message() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function render() {
      try {
        const res = await fetch(`/api/msg?t=${Date.now()}`, { cache: 'no-store' })
        const data = await res.json()
        setMessage(data.message || '')
      } catch {
        // stay black
      }
    }
    render()
    const id = setInterval(render, 3000)
    return () => clearInterval(id)
  }, [])

  return <main id="app">{message}</main>
}
