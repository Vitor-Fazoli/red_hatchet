type Subscriber<T> = (state: T) => void

export function hatchet<T extends Record<string, any>>(
    key: string,
    initial: T
): T & {
    $reset(): void
    $subscribe(fn: Subscriber<T>): void
} {
    const subs: Subscriber<T>[] = []

    function read(): T {
        const raw = localStorage.getItem(key)

        if (!raw) return structuredClone(initial)

        try {
            return JSON.parse(raw)
        } catch {
            return structuredClone(initial)
        }
    }

    function write(state: T) {
        localStorage.setItem(key, JSON.stringify(state))
        subs.forEach((fn) => fn(state))
    }

    const state = read()

    const proxy = new Proxy(state, {
        set(target, prop, value) {
            target[prop as keyof T] = value
            write(target)
            return true
        }
    })

    Object.defineProperties(proxy, {
        $reset: {
            value() {
                write(structuredClone(initial))
            }
        },

        $subscribe: {
            value(fn: Subscriber<T>) {
                subs.push(fn)
            }
        }
    })

    return proxy as any
}