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
