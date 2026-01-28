import { getColor } from '../../../utils'
import { getLighterGradient } from '../../../utils/getLighterGradient'

export enum ButtonSizes {
    xs = 'xs',
    s = 's',
    m = 'm',
    l = 'l',
    xl = 'xl'
}

const paddings: { [key: string]: string } = {
    s: '7px 16px',
    m: '9px 16px',
    l: '10px 16px',
    xl: '12px 16px'
}

const iconPaddings: { [key: string]: string } = {
    s: '6px',
    m: '8px',
    l: '10px',
    xl: '12px'
}

const iconSizes: { [key: string]: string } = {
    xs: '7px',
    s: '12px',
    m: '16px',
    l: '18px',
    xl: '20px'
}

const maxHeights: { [key: string]: string } = {
    s: '28px',
    m: '34px',
    l: 'auto',
    xl: 'auto'
}

const fontSizes: { [key: string]: string } = {
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

export const setIconSize = (size: ButtonSizes | string): string =>
    iconSizes[size] || size

export const setPadding = (size: ButtonSizes | string): string | undefined =>
    paddings[size]

export const setIconPadding = (
    size: ButtonSizes | string
): string | undefined => iconPaddings[size]

export const setFontSize = (size: ButtonSizes | string): string | undefined =>
    fontSizes[size]

export const setMaxHeight = (size: ButtonSizes | string): string | undefined =>
    maxHeights[size]

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
        return getColor('', 'dell-gray-500')
    }
    if (shaded && outlined) {
        return getColor(textColor, 'dell-gray-800')
    }
    if (outlined) {
        return getColor(textColor, 'dell-blue-500')
    }
    if (flat) {
        if (color === 'secondary') {
            return getColor(textColor, 'dell-gray-800')
        }

        return getColor(textColor, 'dell-blue-500')
    }
    if (shaded) {
        return getColor(textColor, 'dell-gray-800')
    }
    if (filled) {
        return getColor(textColor, 'dell-white')
    }

    return getColor(textColor, 'dell-white')
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

    return getColor(color, 'dell-blue-500')
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

    return getColor(color, 'dell-blue-500')
}

export const setColorOnHover = ({
    disabled,
    flat,
    outlined,
    color
}: Partial<DlButtonProps>) => {
    if (disabled) {
        return flat ? 'var(--dl-color-transparent)' : 'var(--dl-color-disabled)'
    }
    if (outlined) {
        return getColor(color || '', 'dell-blue-500')
    }
    if (color) return getLighterGradient(color)
    if (flat) {
        return 'var(--dl-color-hover)'
    }

    return 'var(--dl-color-white)'
}

export const setBorderOnHover = ({
    disabled,
    flat,
    color,
    shaded,
    outlined
}: Partial<DlButtonProps>) => {
    if (disabled) {
        return 'var(--dl-color-separator)'
    }
    if (flat || shaded) {
        return 'var(--dl-color-transparent)'
    }
    if (outlined) {
        return getColor(color || '', 'dell-blue-500')
    }
    if (color) {
        return getLighterGradient(color)
    }
    return 'var(--dell-blue-600)'
}

export const setBgOnHover = ({
    disabled,
    flat,
    shaded,
    outlined,
    filled,
    color
}: Partial<DlButtonProps>) => {
    if (shaded) {
        return 'var(--dl-color-fill)'
    }

    if (outlined && !disabled) {
        return 'var(--dell-blue-100)'
    }

    if (disabled || flat || outlined) {
        return 'var(--dl-color-transparent)'
    }

    if (color) return getLighterGradient(color)

    if (filled) {
        return 'var(--dell-blue-600)'
    }

    return 'var(--dl-color-panel-background)'
}

export const setBgOnPressed = ({
    disabled,
    flat,
    shaded,
    outlined,
    filled,
    color
}: Partial<DlButtonProps>) => {
    if (shaded) {
        return 'var(--dl-color-fill-hover)'
    }

    if (disabled) {
        return 'var(--dl-button-bg)'
    }

    if (outlined && !flat) {
        return 'var(--dell-blue-200)'
    }

    if (filled && !flat && !outlined && !color) {
        return 'var(--dell-blue-700)'
    }

    return 'var(--dl-button-bg)'
}

export const setTextOnPressed = ({
    disabled,
    flat,
    textColor
}: Partial<DlButtonProps>) => {
    if (textColor) return getColor(textColor, 'dl-color-secondary')
    if (disabled) return getColor('', 'dl-color-disabled')
    if (!flat) return 'var(--dl-button-text-color)'
    return 'var(--dl-color-secondary)'
}

export const setBorderOnPressed = ({
    disabled,
    flat,
    shaded,
    outlined,
    filled,
    color
}: Partial<DlButtonProps>) => {
    if (disabled) {
        return 'var(--dl-color-separator)'
    }
    if (flat || shaded) {
        return 'var(--dl-color-transparent)'
    }
    if (outlined) {
        return getColor(color || '', 'dell-blue-500')
    }
    if (color) return getLighterGradient(color)
    const isFilled = filled !== false
    if (isFilled && !color) {
        return 'var(--dell-blue-700, var(--dl-button-border))'
    }
    return 'var(--dl-button-border)'
}
