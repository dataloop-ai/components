import { getColor } from '../../../utils'
import { getLighterGradient } from '../../../utils/getLighterGradient'

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

export interface DlButtonProps {
    disabled: boolean
    outlined: boolean
    flat: boolean
    filled: boolean
    shaded: boolean
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
    shaded,
    textColor
}: DlButtonProps): string => {
    if (disabled) {
        return getColor('', 'dl-color-disabled')
    }
    if (shaded && outlined) {
        return getColor(textColor, 'dl-color-text-darker-buttons')
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
    if (shaded) {
        return getColor(textColor, 'dl-color-darker')
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
    shaded,
    color = ''
}: Partial<DlButtonProps>) => {
    if (disabled || flat || outlined) {
        return 'var(--dl-color-transparent)'
    }
    if (shaded) {
        return 'var(--dl-color-fill)'
    }

    return getColor(color, 'dl-color-secondary')
}

export const setBorder = ({
    disabled,
    flat,
    color = '',
    shaded,
    outlined
}: Partial<DlButtonProps>) => {
    if (disabled) {
        return flat
            ? 'var(--dl-color-transparent)'
            : 'var(--dl-color-separator)'
    }
    if (shaded && outlined) {
        return 'var(--dl-color-separator)'
    }
    if (flat || shaded) {
        return 'var(--dl-color-transparent)'
    }

    return getColor(color, 'dl-color-secondary')
}

export const setColorOnHover = ({
    disabled,
    flat,
    outlined,
    color
}: Partial<DlButtonProps>) => {
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
}: Partial<DlButtonProps>) => {
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
}: Partial<DlButtonProps>) => {
    if (color) return getLighterGradient(color)

    if (disabled || flat || outlined) {
        return 'var(--dl-color-transparent)'
    }
    if (filled) {
        return 'var(--dl-color-hover)'
    }

    return 'var(--dl-color-panel-background)'
}

export const setBgOnPressed = ({
    shaded,
    outlined
}: Partial<DlButtonProps>) => {
    if (shaded && outlined) {
        return 'var(--dl-color-text-buttons)'
    }
    if (shaded) {
        return 'var(--dl-color-secondary)'
    }
    return 'var(--dl-button-bg)'
}

export const setTextOnPressed = ({
    shaded,
    outlined
}: Partial<DlButtonProps>) => {
    if (shaded && outlined) {
        return 'var(--dl-color-secondary)'
    }
    if (shaded) {
        return 'var(--dl-color-text-buttons)'
    }
    return 'var(--dl-button-text-color)'
}

export const setBorderOnPressed = ({
    shaded,
    outlined
}: Partial<DlButtonProps>) => {
    if (shaded && outlined) {
        return 'var(--dl-color-secondary)'
    }
    return 'var(--dl-button-border)'
}
