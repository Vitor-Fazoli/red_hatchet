type Subscriber<T> = (state: T) => void

// ─── Storage (coleção) ────────────────────────────────────────────────────────

export type Collection<T extends Record<string, any>> = {
    add(item: T): void
    list(): T[]
    update(item: T): void
    remove(id: unknown): void
    $subscribe(fn: Subscriber<T[]>): void
    $clear(): void
}

export function storage<T extends Record<string, any>>(
    key: string,
    schema: T
): Collection<T> {
    const idKey = Object.keys(schema)[0] as keyof T
    const subs: Subscriber<T[]>[] = []

    function read(): T[] {
        const raw = localStorage.getItem(key)
        if (!raw) return []
        try { return JSON.parse(raw) } catch { return [] }
    }

    function write(data: T[]) {
        localStorage.setItem(key, JSON.stringify(data))
        subs.forEach(fn => fn(data))
    }

    return {
        add(item: T) {
            const data = read()
            data.push(item)
            write(data)
        },

        list(): T[] {
            return read()
        },

        update(item: T) {
            const data = read()
            const index = data.findIndex(i => i[idKey] === item[idKey])
            if (index === -1) throw new Error(
                `[red-hatchet] Item with ${String(idKey)}="${item[idKey]}" not found.`
            )
            data[index] = item
            write(data)
        },

        remove(id: unknown) {
            write(read().filter(i => i[idKey] !== id))
        },

        $subscribe(fn: Subscriber<T[]>) {
            subs.push(fn)
        },

        $clear() {
            write([])
        }
    }
}

// ─── State (estado simples) ───────────────────────────────────────────────────

export type State<T extends Record<string, any>> = T & {
    $subscribe(fn: Subscriber<T>): void
    $reset(): void
}

export function state<T extends Record<string, any>>(
    key: string,
    initial: T
): State<T> {
    const subs: Subscriber<T>[] = []

    function read(): T {
        const raw = localStorage.getItem(key)
        if (!raw) return structuredClone(initial)
        try { return JSON.parse(raw) } catch { return structuredClone(initial) }
    }

    function write(data: T) {
        localStorage.setItem(key, JSON.stringify(data))
        subs.forEach(fn => fn(data))
    }

    const proxy = new Proxy(read(), {
        set(target, prop, value) {
            target[prop as keyof T] = value
            write(target)
            return true
        }
    })

    Object.defineProperties(proxy, {
        $subscribe: {
            value(fn: Subscriber<T>) { subs.push(fn) }
        },
        $reset: {
            value() { write(structuredClone(initial)) }
        }
    })

    return proxy as State<T>
}

export const hatchet = { storage, state }