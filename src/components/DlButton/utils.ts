import { getColor } from '../../utils'
import { getLighterGradient } from '../../utils/getLighterGradient'

export type ButtonSizes = 's' | 'm' | 'l' | 'xl'

const paddings = {
    s: '7px 16px',
    m: '9px 16px',
    l: '10px 16px',
    xl: '12px 16px'
}

const iconPaddings = {
    s: '6px',
    m: '8px',
    l: '10px',
    xl: '12px'
}

const iconSizes = {
    s: '12px',
    m: '16px',
    l: '18px',
    xl: '20px'
}

const maxHeights = {
    s: '28px',
    m: '34px',
    l: 'auto',
    xl: 'auto'
}

const fontSizes = {
    s: '12px',
    m: '14px',
    l: '16px',
    xl: '18px'
}

interface ButtonProps {
    disabled: boolean
    outlined: boolean
    flat: boolean
    filled: boolean
    color: string
    textColor: string
}

export const setIconSize = (size: ButtonSizes) => iconSizes[size] || size

export const setPadding = (size: ButtonSizes) => paddings[size]

export const setIconPadding = (size: ButtonSizes) => iconPaddings[size]

export const setFontSize = (size: ButtonSizes) => fontSizes[size]

export const setMaxHeight = (size: ButtonSizes) => maxHeights[size]

export const setTextColor = ({
    disabled,
    outlined,
    flat,
    color,
    filled,
    textColor
}: ButtonProps): string => {
    if (disabled) {
        return getColor('', 'dl-color-disabled')
    }
    if (outlined) {
        return getColor(textColor, 'dl-color-secondary')
    }
    if (flat) {
        if (color === 'secondary') {
            return getColor(textColor, 'dl-color-darker')
        }

        return getColor(textColor, 'dl-color-secondary')
    }
    if (filled) {
        return getColor(textColor, 'dl-color-text-buttons')
    }

    return getColor(textColor, 'dl-color-text-buttons')
}

export const setBgColor = ({
    disabled,
    flat,
    outlined,
    color = ''
}: Partial<ButtonProps>) => {
    if (disabled || flat || outlined) {
        return 'var(--dl-color-transparent)'
    }

    return getColor(color, 'dl-color-secondary')
}

export const setBorder = ({
    disabled,
    flat,
    color = ''
}: Partial<ButtonProps>) => {
    if (disabled) {
        return flat
            ? 'var(--dl-color-transparent)'
            : 'var(--dl-color-separator)'
    }
    if (flat) {
        return 'var(--dl-color-transparent)'
    }

    return getColor(color, 'dl-color-secondary')
}

export const setColorOnHover = ({
    disabled,
    flat,
    outlined,
    color
}: Partial<ButtonProps>) => {
    if (color) return getLighterGradient(color)
    if (disabled) {
        return flat ? 'var(--dl-color-transparent)' : 'var(--dl-color-disabled)'
    }
    if (outlined || flat) {
        return 'var(--dl-color-hover)'
    }

    return 'var(--dl-color-white)'
}

export const setBorderOnHover = ({
    disabled,
    flat,
    color
}: Partial<ButtonProps>) => {
    if (disabled) {
        return 'var(--dl-color-separator)'
    }
    if (flat) {
        return 'var(--dl-color-transparent)'
    }
    if (color) {
        return getLighterGradient(color)
    }
    return 'var(--dl-color-hover)'
}

export const setBgOnHover = ({
    disabled,
    flat,
    outlined,
    filled,
    color
}: Partial<ButtonProps>) => {
    if (color) return getLighterGradient(color)

    if (disabled || flat || outlined) {
        return 'var(--dl-color-transparent)'
    }
    if (filled) {
        return 'var(--dl-color-hover)'
    }

    return 'var(--dl-color-panel-background)'
}
