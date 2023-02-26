export const KEY_CODE = {
    PGDOWN: 34,
    LEFT: 37,
    DOWN: 40,
    PGUP: 33,
    RIGHT: 39,
    UP: 38
} as const

export type KEY_CODE = typeof KEY_CODE[keyof typeof KEY_CODE]

export const keyCodes = Object.values(KEY_CODE)
