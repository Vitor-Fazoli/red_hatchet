import { hatchet } from 'red-hatchet'

const store = hatchet('counter', { count: 0 })

const el = document.getElementById('count') as HTMLSpanElement

function render(state: typeof store) {
    el.textContent = String(state.count)
}

store.$subscribe(render)
render(store)

document.getElementById('inc')!.onclick = () => store.count++
document.getElementById('reset')!.onclick = () => store.$reset()