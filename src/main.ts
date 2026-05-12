import './style.css'
import topic from './topic.json'

const app = document.querySelector<HTMLDivElement>('#app')!
const h1 = document.createElement('h1')
h1.textContent = topic.topic
app.replaceChildren(h1)
