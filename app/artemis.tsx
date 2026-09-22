'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import artemis from '@/public/artemis.png'
import { useVideo } from './video'

// Where the photo is anchored when object-fit: cover crops it (x, y as 0–1).
// x is nudged left of centre so both eyes stay on screen on portrait phones.
const POSITION = { x: 0.45, y: 0.45 }

// Eye centres as fractions of the photo's width and height.
const EYES = [
  { x: 0.27, y: 0.475 },
  { x: 0.672, y: 0.47 },
]

// Hit radius as a fraction of the rendered photo width. The iris is ~0.083;
// the extra room lets a thumb land a little off-centre and still count.
const EYE_RADIUS = 0.12

type Circle = { x: number; y: number; r: number }

// Map the eyes from photo coordinates to viewport coordinates, replicating
// how object-fit: cover scales and crops the image inside `rect`.
function eyeCircles(rect: DOMRect): Circle[] {
  const scale = Math.max(rect.width / artemis.width, rect.height / artemis.height)
  const w = artemis.width * scale
  const h = artemis.height * scale
  const left = rect.left + (rect.width - w) * POSITION.x
  const top = rect.top + (rect.height - h) * POSITION.y
  return EYES.map((eye) => ({ x: left + eye.x * w, y: top + eye.y * h, r: EYE_RADIUS * w }))
}

function touching(touch: Touch, eye: Circle): boolean {
  return Math.hypot(touch.clientX - eye.x, touch.clientY - eye.y) <= eye.r
}

// True when two different fingers are on the screen, one on each eye.
function thumbsOnBothEyes(touches: TouchList, rect: DOMRect): boolean {
  const [a, b] = eyeCircles(rect)
  for (let i = 0; i < touches.length; i++) {
    for (let j = 0; j < touches.length; j++) {
      if (i !== j && touching(touches[i], a) && touching(touches[j], b)) return true
    }
  }
  return false
}

export default function Artemis() {
  const ref = useRef<HTMLElement>(null)
  const [debugEyes, setDebugEyes] = useState<Circle[] | null>(null)
  const video = useVideo()

  function activate() {
    video.play()
  }

  const activateRef = useRef(activate)
  activateRef.current = activate

  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(pointer: coarse)').matches) return

    let active = false
    function check(event: TouchEvent) {
      event.preventDefault()
      const both = thumbsOnBothEyes(event.touches, el!.getBoundingClientRect())
      if (both && !active) activateRef.current()
      active = both
    }

    const events = ['touchstart', 'touchmove', 'touchend', 'touchcancel'] as const
    events.forEach((type) => el.addEventListener(type, check, { passive: false }))
    return () => events.forEach((type) => el.removeEventListener(type, check))
  }, [])

  // Visit /?eyes to see the hit areas while tuning them.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('eyes')) return
    const update = () => setDebugEyes(eyeCircles(ref.current!.getBoundingClientRect()))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <main ref={ref}>
      <Image
        src={artemis}
        alt="Artemis the cat"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        draggable={false}
        style={{ objectFit: 'cover', objectPosition: `${POSITION.x * 100}% ${POSITION.y * 100}%` }}
      />
      {debugEyes?.map((eye, i) => (
        <div
          key={i}
          className="eye-debug"
          style={{ left: eye.x - eye.r, top: eye.y - eye.r, width: eye.r * 2, height: eye.r * 2 }}
        />
      ))}
      <div ref={video.mountRef} className={video.visible ? 'video on' : 'video'} />
    </main>
  )
}
