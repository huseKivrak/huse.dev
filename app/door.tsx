'use client'

import { useEffect, useRef, useState } from 'react'
import { open } from './gift'

type Gift = { name: string; url: string }

// A quiet riddle low on the screen. The right answer downloads what's behind it;
// a wrong one shakes and clears. Escape, or a tap anywhere else, closes it.
export default function Door({ onClose }: { onClose(): void }) {
  const [answer, setAnswer] = useState('')
  const [state, setState] = useState<'asking' | 'wrong' | 'opening' | 'open'>('asking')
  const [gift, setGift] = useState<Gift | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    input.current?.focus()
    const close = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (state !== 'asking') return
    setState('opening')
    const opened = await open(answer).catch(() => null)
    if (!opened) {
      setState('wrong')
      setAnswer('')
      setTimeout(() => {
        setState('asking')
        input.current?.focus()
      }, 400)
      return
    }
    const found = { name: opened.name, url: URL.createObjectURL(opened.blob) }
    setGift(found)
    setState('open')
    const link = document.createElement('a')
    link.href = found.url
    link.download = found.name
    link.click()
  }

  return (
    <div className="door" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      {gift ? (
        <p className="riddle">
          <a href={gift.url} download={gift.name}>
            for you
          </a>
        </p>
      ) : (
        <form className={`riddle ${state}`} onSubmit={submit}>
          <label>
            things that make you go
            <input
              ref={input}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              aria-label="answer"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
            />
          </label>
        </form>
      )}
    </div>
  )
}
