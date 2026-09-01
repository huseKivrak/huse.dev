import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

async function render(): Promise<void> {
  try {
    const res = await fetch(`/api/msg?t=${Date.now()}`, { cache: 'no-store' })
    const { message } = await res.json()
    app.textContent = message || ''
  } catch {
    // stay black
  }
}

render()
setInterval(render, 3000)

// --- PR wire lower-third ---

interface TickerItem {
  t?: string
  headline?: string
  quip?: string
}

const bar = document.createElement('div')
bar.className = 'lower-third'
bar.innerHTML =
  '<div class="lt-badge"><span class="top">PR WIRE</span><span class="main">ALL TIME</span></div>' +
  '<div class="lt-viewport"><div class="lt-crawl"></div></div>'
document.body.appendChild(bar)
const crawl = bar.querySelector<HTMLDivElement>('.lt-crawl')!
let lastJson = ''

function esc(s: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return s.replace(/[&<>"']/g, (c) => map[c])
}

function fmtTime(t: string): string {
  const d = new Date(t)
  return isNaN(d.getTime())
    ? ''
    : d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function renderTicker(items: TickerItem[]): void {
  if (!items.length) {
    bar.classList.remove('on')
    return
  }
  const one = items
    .map((it) => {
      const time = it.t ? `<span class="time">${fmtTime(it.t)}</span>` : ''
      const quip = it.quip ? `<span class="quip">${esc(it.quip)}</span>` : ''
      return `<span class="lt-item">${time}<span class="headline">${esc(it.headline ?? '')}</span>${quip}</span><span class="lt-sep"></span>`
    })
    .join('')
  crawl.innerHTML = one + one // duplicate for seamless -50% loop
  bar.classList.add('on')
  crawl.style.animation = 'none'
  void crawl.offsetWidth
  const dur = Math.max(30, crawl.scrollWidth / 2 / 90) // ~90px/s
  crawl.style.setProperty('--dur', `${dur}s`)
  crawl.style.animation = ''
}

async function pollTicker(): Promise<void> {
  try {
    const res = await fetch(`/api/ticker?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return
    const { items } = await res.json()
    const json = JSON.stringify(items)
    if (json !== lastJson) {
      lastJson = json
      renderTicker(Array.isArray(items) ? items : [])
    }
  } catch {
    // keep last crawl
  }
}

pollTicker()
setInterval(pollTicker, 30000)
