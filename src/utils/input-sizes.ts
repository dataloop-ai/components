export const InputSizes = {
    l: 'l',
    m: 'm',
    s: 's',
    large: 'large',
    medium: 'medium',
    small: 'small'
} as const

export type TInputSizes = (typeof InputSizes)[keyof typeof InputSizes]
