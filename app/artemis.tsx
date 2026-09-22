'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import artemis from '@/public/artemis.png'
import { ScratchDetector } from './scratch'
import { useVideo } from './video'

// Where the photo is anchored when object-fit: cover crops it (x, y as 0–1).
// x is nudged left of centre so both eyes stay on screen on portrait phones.
const POSITION = { x: 0.45, y: 0.45 }

type Point = { x: number; y: number }

// Eye centres as fractions of the photo's width and height.
const EYES: Point[] = [
  { x: 0.27, y: 0.475 },
  { x: 0.672, y: 0.47 },
]

// Hit radius as a fraction of the rendered photo width. The iris is ~0.083;
// the extra room lets a thumb land a little off-centre and still count.
const EYE_RADIUS = 0.12

// The nose, including the bridge between the eyes: a capsule (a line with
// rounded ends) from between the eyes down to the bottom of the nose pad.
// The radius is a fraction of the rendered photo width.
const NOSE = { from: { x: 0.466, y: 0.42 }, to: { x: 0.456, y: 0.7 }, r: 0.08 }

type Circle = Point & { r: number }
type Capsule = { from: Point; to: Point; r: number }

// Where the photo's regions are on screen. Replicates how object-fit: cover
// scales and crops the image inside `rect`; `width` is the photo's rendered
// width in pixels.
function layout(rect: DOMRect) {
  const scale = Math.max(rect.width / artemis.width, rect.height / artemis.height)
  const w = artemis.width * scale
  const h = artemis.height * scale
  const left = rect.left + (rect.width - w) * POSITION.x
  const top = rect.top + (rect.height - h) * POSITION.y
  const point = (p: Point): Point => ({ x: left + p.x * w, y: top + p.y * h })
  return {
    width: w,
    eyes: EYES.map((eye): Circle => ({ ...point(eye), r: EYE_RADIUS * w })),
    nose: { from: point(NOSE.from), to: point(NOSE.to), r: NOSE.r * w } as Capsule,
  }
}

function inCircle(touch: Touch, circle: Circle): boolean {
  return Math.hypot(touch.clientX - circle.x, touch.clientY - circle.y) <= circle.r
}

function inCapsule(touch: Touch, { from, to, r }: Capsule): boolean {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const along = ((touch.clientX - from.x) * dx + (touch.clientY - from.y) * dy) / (dx * dx + dy * dy)
  const t = Math.min(1, Math.max(0, along))
  return Math.hypot(touch.clientX - (from.x + t * dx), touch.clientY - (from.y + t * dy)) <= r
}

// True when two different fingers are on the screen, one on each eye.
function thumbsOnBothEyes(touches: TouchList, [a, b]: Circle[]): boolean {
  for (let i = 0; i < touches.length; i++) {
    for (let j = 0; j < touches.length; j++) {
      if (i !== j && inCircle(touches[i], a) && inCircle(touches[j], b)) return true
    }
  }
  return false
}

export default function Artemis() {
  const ref = useRef<HTMLElement>(null)
  const [debug, setDebug] = useState<ReturnType<typeof layout> | null>(null)
  const rickroll = useVideo('dQw4w9WgXcQ') // Rick Astley, Never Gonna Give You Up
  const knicks = useVideo('YgevWWlg5LI') // Golden Hoops, Knicks 2026 championship mini-movie

  const actions = {
    // Both thumbs on her eyes.
    eyes() {
      rickroll.play()
    },
    // Her nose scratched enough.
    nose() {
      knicks.play()
    },
  }
  const actionsRef = useRef(actions)
  actionsRef.current = actions

  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(pointer: coarse)').matches) return

    let eyesHeld = false
    const scratch = new ScratchDetector()

    function check(event: TouchEvent) {
      event.preventDefault()
      const regions = layout(el!.getBoundingClientRect())

      const both = thumbsOnBothEyes(event.touches, regions.eyes)
      if (both && !eyesHeld) actionsRef.current.eyes()
      eyesHeld = both

      for (const touch of Array.from(event.changedTouches)) {
        if (event.type === 'touchend' || event.type === 'touchcancel') {
          scratch.end(touch.identifier)
          continue
        }
        const at = { x: touch.clientX, y: touch.clientY }
        const inside = inCapsule(touch, regions.nose)
        if (scratch.move(touch.identifier, at, inside, regions.width, event.timeStamp)) {
          actionsRef.current.nose()
        }
      }
    }

    const events = ['touchstart', 'touchmove', 'touchend', 'touchcancel'] as const
    events.forEach((type) => el.addEventListener(type, check, { passive: false }))
    return () => events.forEach((type) => el.removeEventListener(type, check))
  }, [])

  // Visit /?eyes to see the hit areas while tuning them.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('eyes')) return
    const update = () => setDebug(layout(ref.current!.getBoundingClientRect()))
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
        style={{
          objectFit: 'cover',
          objectPosition: `${POSITION.x * 100}% ${POSITION.y * 100}%`,
          zIndex: 1,
        }}
      />
      {debug?.eyes.map((eye, i) => (
        <div
          key={i}
          className="hit-debug"
          style={{ left: eye.x - eye.r, top: eye.y - eye.r, width: eye.r * 2, height: eye.r * 2 }}
        />
      ))}
      {debug && <CapsuleOutline {...debug.nose} />}
      {[rickroll, knicks].map((video, i) => (
        <div key={i} ref={video.mountRef} className={video.visible ? 'video on' : 'video'} />
      ))}
    </main>
  )
}

function CapsuleOutline({ from, to, r }: Capsule) {
  const length = Math.hypot(to.x - from.x, to.y - from.y)
  const angle = Math.atan2(to.y - from.y, to.x - from.x) - Math.PI / 2
  return (
    <div
      className="hit-debug"
      style={{
        left: (from.x + to.x) / 2 - r,
        top: (from.y + to.y) / 2 - length / 2 - r,
        width: r * 2,
        height: length + r * 2,
        borderRadius: r,
        transform: `rotate(${angle}rad)`,
      }}
    />
  )
}
