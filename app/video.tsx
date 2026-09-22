'use client'

import { useEffect, useRef, useState } from 'react'

const VIDEO_ID = 'dQw4w9WgXcQ'

// The slice of the YouTube IFrame Player API used here.
type Player = {
  playVideo(): void
  pauseVideo(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  mute(): void
  unMute(): void
  setVolume(volume: number): void
}

type PlayerEvent = { target: Player; data: number }

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, options: object) => Player
      PlayerState: { PLAYING: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

function loadApi(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT?.Player) return resolve()
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve()
    }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })
}

// A full-screen YouTube player that loads hidden as soon as the page opens
// on a touch device, so play() starts the video with no loading delay.
export function useVideo() {
  const mountRef = useRef<HTMLDivElement>(null)
  const player = useRef<Player | null>(null)
  const wanted = useRef(false)
  const [visible, setVisible] = useState(false)

  function start() {
    const p = player.current
    if (!p) return
    p.seekTo(0, true)
    p.playVideo()
    // Phones only allow sound after a user activation, which touchstart is
    // not, so the video starts muted and unmutes when a thumb lifts.
    window.addEventListener(
      'touchend',
      () => {
        p.unMute()
        p.setVolume(100)
      },
      { once: true }
    )
  }

  function play() {
    if (wanted.current) return
    wanted.current = true
    setVisible(true)
    start()
  }

  useEffect(() => {
    if (!window.matchMedia('(pointer: coarse)').matches) return
    let cancelled = false
    let primed = false

    loadApi().then(() => {
      if (cancelled || !mountRef.current) return
      // The API replaces this element with its iframe, so keep it out of React.
      const el = document.createElement('div')
      mountRef.current.appendChild(el)
      new window.YT!.Player(el, {
        videoId: VIDEO_ID,
        width: '100%',
        height: '100%',
        playerVars: { playsinline: 1, rel: 0, mute: 1 },
        events: {
          onReady: ({ target }: PlayerEvent) => {
            player.current = target
            target.mute()
            if (wanted.current) start()
            // Briefly play muted while hidden so the opening is buffered.
            else target.playVideo()
          },
          onStateChange: ({ target, data }: PlayerEvent) => {
            if (primed || data !== window.YT!.PlayerState.PLAYING) return
            primed = true
            if (!wanted.current) {
              target.pauseVideo()
              target.seekTo(0, true)
            }
          },
        },
      })
    })

    return () => {
      cancelled = true
    }
  }, [])

  return { mountRef, visible, play }
}
