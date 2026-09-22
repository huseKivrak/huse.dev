// Detects "scratching": quick back-and-forth rubbing, as opposed to a single
// swipe or a finger resting in place. All distances are in photo widths so
// the feel is the same on every screen size.

// How far back in time scratching is judged over.
const WINDOW_MS = 2000
// Within that window, the finger must change direction this many times...
const STROKES = 8
// ...and travel at least this far in total.
const DISTANCE = 0.3
// Movement smaller than this is ignored as jitter when judging direction.
const MIN_STEP = 0.006

type Point = { x: number; y: number }
type Sample = { t: number; distance: number; reversal: boolean }

export class ScratchDetector {
  private fingers = new Map<number, { at: Point; direction: Point | null }>()
  private samples: Sample[] = []

  // Record a finger's position. `inside` says whether it's on the scratch
  // area and `unit` is the photo's rendered width in pixels. Returns true
  // once the scratching has been sufficient, then starts counting afresh.
  move(id: number, at: Point, inside: boolean, unit: number, t: number): boolean {
    if (!inside) {
      this.fingers.delete(id)
      return false
    }
    const finger = this.fingers.get(id)
    if (!finger) {
      this.fingers.set(id, { at, direction: null })
      return false
    }

    const step = { x: at.x - finger.at.x, y: at.y - finger.at.y }
    const distance = Math.hypot(step.x, step.y) / unit
    if (distance < MIN_STEP) return false

    const reversal =
      finger.direction !== null && step.x * finger.direction.x + step.y * finger.direction.y < 0
    this.fingers.set(id, { at, direction: step })
    this.samples.push({ t, distance, reversal })
    this.samples = this.samples.filter((s) => t - s.t <= WINDOW_MS)

    const travelled = this.samples.reduce((sum, s) => sum + s.distance, 0)
    const strokes = this.samples.filter((s) => s.reversal).length
    if (travelled >= DISTANCE && strokes >= STROKES) {
      this.samples = []
      return true
    }
    return false
  }

  end(id: number) {
    this.fingers.delete(id)
  }
}
