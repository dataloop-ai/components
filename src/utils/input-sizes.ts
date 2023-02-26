export const InputSizes = {
    l: 'l',
    m: 'm',
    s: 's'
} as const

export type TInputSizes = typeof InputSizes[keyof typeof InputSizes]
