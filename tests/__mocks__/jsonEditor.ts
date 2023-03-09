import { vi } from 'vitest'

export const jsonEditor = vi.fn()
const mock = vi.fn().mockImplementation(() => {
    return {
        get: vi.fn(),
        set: vi.fn()
    }
})

export default mock
