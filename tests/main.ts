import { hatchet } from 'red-hatchet'

// Coleção — primeiro campo (id) vira a chave
const users = hatchet.storage('users', { id: 0, name: '' })

users.$subscribe(list => console.log('users updated:', list))

users.add({ id: 1, name: 'Vitor' })
users.add({ id: 2, name: 'Ana' })
users.update({ id: 1, name: 'Vitor F.' })
users.remove(2)
console.log(users.list())

// Estado simples — reativo via Proxy
const theme = hatchet.state('theme', { value: 'dark' })

theme.$subscribe(s => console.log('theme changed:', s))

theme.value = 'light' // salva automaticamente no localStorage