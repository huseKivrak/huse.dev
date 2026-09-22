'use client'

import { useEffect, useRef, useState } from 'react'

// The slice of the YouTube IFrame Player API used here.
type Player = {
  playVideo(): void
  pauseVideo(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  mute(): void
  unMute(): void
  setVolume(volume: number): void
  getPlayerState(): number
}

type PlayerEvent = { target: Player; data: number }

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, options: object) => Player
      PlayerState: { PLAYING: number; PAUSED: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

// Shared by every player on the page so the API script loads only once.
let api: Promise<void> | null = null

function loadApi(): Promise<void> {
  api ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve()
    window.onYouTubeIframeAPIReady = resolve
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })
  return api
}

// A full-screen YouTube player that loads under the photo as soon as the page opens
// on a touch device, so play() starts the video with no loading delay.
export function useVideo(videoId: string) {
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
    // not, so the video starts muted and unmutes when a thumb lifts. iOS may
    // still refuse sound and pause instead; if so, keep playing muted.
    window.addEventListener(
      'touchend',
      () => {
        p.unMute()
        p.setVolume(100)
        setTimeout(() => {
          if (p.getPlayerState() === window.YT!.PlayerState.PAUSED) {
            p.mute()
            p.playVideo()
          }
        }, 300)
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
        videoId,
        width: '100%',
        height: '100%',
        playerVars: { playsinline: 1, rel: 0, mute: 1 },
        events: {
          onReady: ({ target }: PlayerEvent) => {
            player.current = target
            target.mute()
            if (wanted.current) start()
            // Briefly play muted under the photo so the opening is buffered.
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
  }, [videoId])

  return { mountRef, visible, play }
}
