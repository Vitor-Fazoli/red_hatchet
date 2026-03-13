# 🪓 Red Hatchet

**Red Hatchet** is a lightweight TypeScript library for creating **persistent state objects backed by localStorage**.

The idea is simple: create a state object and **any change to it is automatically persisted**.

No reducers.
No boilerplate.
No complex state management.

Just a plain object that saves itself.

---

# Installation

```bash
npm install red-hatchet
```

or

```bash
yarn add red-hatchet
```

---

# Basic Usage

```ts
import { hatchet } from "red-hatchet"

const player = hatchet("player", {
  hp: 100,
  mana: 50
})

player.hp -= 10
```

Any modification to the object is **automatically saved to localStorage**.

---

# How It Works

When you create a store:

```ts
const player = hatchet("player", {
  hp: 100,
  mana: 50
})
```

Red Hatchet will:

1. Check if data exists in `localStorage`
2. Load it if available
3. Otherwise use the initial state
4. Persist any change automatically

---

# Example

```ts
import { hatchet } from "red-hatchet"

const player = hatchet("player", {
  hp: 100,
  mana: 50,
  level: 1
})

player.hp = 80
player.level += 1
```

Stored in `localStorage`:

```json
{
  "hp": 80,
  "mana": 50,
  "level": 2
}
```

---

# Reset State

```ts
player.$reset()
```

This restores the initial state.

---

# Subscribe to Changes

```ts
player.$subscribe((state) => {
  console.log("state updated:", state)
})
```

---

# TypeScript Support

Types are inferred automatically.

```ts
const player = hatchet("player", {
  hp: 100,
  mana: 50
})

player.hp   // number
player.mana // number
```

No manual typing required.

---

# React Integration

You can use Red Hatchet directly, but for automatic re-renders you can use a small hook.

```ts
import { useHatchet } from "red-hatchet/react"

const player = useHatchet(
  hatchet("player", {
    hp: 100
  })
)
```

Now changes trigger component updates.

---

# Why Red Hatchet?

* 🪶 Lightweight
* ⚡ Extremely simple API
* 🔒 Fully typed with TypeScript
* 💾 Automatic persistence
* 🧠 No reducers or actions
* 🔧 Works with any framework

---

# Roadmap

Planned features:

* Cross-tab synchronization
* sessionStorage support
* Plugin system
* TTL (state expiration)
* Schema validation
* Storage adapters

---

# Future API Example

```ts
const settings = hatchet("settings", {
  darkMode: false
})

settings.darkMode = true
```

---

# License

MIT

---

# Author

Created to simplify persistent state management with TypeScript.