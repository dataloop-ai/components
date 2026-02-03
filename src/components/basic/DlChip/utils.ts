import { getColor } from '../../../utils'

export interface DlChipProps {
    hasIcon: boolean
    hasLabel: boolean
    removable: boolean
    disabled: boolean
    outlined: boolean
    filled: boolean
    color: string
    textColor: string
    noBorder: boolean
}

export interface ChipColorMapping {
    bg: string
    text: string
    border: string
}

const COLOR_MAPPINGS: Record<string, ChipColorMapping> = {
    '#f3d9d9': {
        bg: 'var(--dell-red-500)',
        text: 'var(--dell-white)',
        border: 'var(--dell-red-500)'
    },
    '#fff7d9': {
        bg: 'var(--dell-yellow-500)',
        text: 'var(--dell-yellow-800)',
        border: 'var(--dell-yellow-500)'
    },
    '#757575': {
        bg: 'var(--dell-white)',
        text: 'var(--dell-gray-500)',
        border: 'var(--dell-gray-500)'
    },
    '#ddedd9': {
        bg: 'var(--dell-white)',
        text: 'var(--dell-gray-500)',
        border: 'var(--dell-gray-500)'
    },
    '#1b8500': {
        bg: 'var(--dell-green-500)',
        text: 'var(--dell-white)',
        border: 'var(--dell-green-500)'
    },
    '#ffc700': {
        bg: 'var(--dell-yellow-500)',
        text: 'var(--dell-yellow-800)',
        border: 'var(--dell-yellow-500)'
    },
    '#af0000': {
        bg: 'var(--dell-red-500)',
        text: 'var(--dell-white)',
        border: 'var(--dell-red-500)'
    },
    '#bebc5d': {
        bg: 'var(--dell-white)',
        text: 'var(--dell-gray-500)',
        border: 'var(--dell-gray-500)'
    },
    '#32766e': {
        bg: 'var(--dell-green-100)',
        text: 'var(--dell-gray-800)',
        border: 'var(--dell-green-500)'
    },
    '#c5c5c5': {
        bg: 'var(--dell-gray-500)',
        text: 'var(--dell-gray-700)',
        border: 'var(--dell-gray-500)'
    },
    '#0076ce': {
        bg: 'var(--dell-blue-500)',
        text: 'var(--dell-white)',
        border: 'var(--dell-blue-500)'
    },
    transparent: {
        bg: 'var(--dell-white)',
        text: 'var(--dell-gray-700)',
        border: 'var(--dell-gray-500)'
    },
    '#00000000': {
        bg: 'var(--dell-white)',
        text: 'var(--dell-gray-700)',
        border: 'var(--dell-gray-500)'
    },
    '#f4f4f4': {
        bg: 'var(--dell-white)',
        text: 'var(--dell-gray-700)',
        border: 'var(--dell-gray-500)'
    }
}

export const getColorMapping = (bgColor: string): ChipColorMapping | null => {
    const normalizedColor = bgColor.toLowerCase().trim()
    return COLOR_MAPPINGS[normalizedColor] || null
}

export const setTextColor = ({
    disabled,
    outlined,
    filled,
    textColor = ''
}: Partial<DlChipProps>): string => {
    if (disabled) {
        return getColor('', 'dl-color-disabled')
    }
    if (outlined) {
        return getColor(textColor, 'dl-color-secondary')
    }
    if (filled) {
        return getColor(textColor, 'dl-color-text-buttons')
    }

    return getColor(textColor, 'dl-color-text-buttons')
}

export const setBgColor = ({
    disabled,
    outlined,
    color = ''
}: Partial<DlChipProps>) => {
    if (disabled || outlined) {
        return 'transparent'
    }

    return getColor(color, 'dl-color-secondary')
}

export const setBorder = ({
    noBorder,
    disabled,
    color = ''
}: Partial<DlChipProps>) => {
    if (noBorder) {
        return 'none'
    }
    if (disabled) {
        return `1px solid var(--dl-color-disabled)`
    }

    return `1px solid ${getColor(color, 'dl-color-secondary')}`
}

export const setPadding = ({
    hasLabel,
    removable,
    hasIcon
}: Partial<DlChipProps>) => {
    const left = hasIcon ? 20 : 5
    const right = removable ? 20 : 5

    if (hasLabel && (removable || hasIcon)) {
        return `3px ${right}px 3px ${left}px`
    }

    if (!hasLabel && hasIcon && removable) {
        return `3px ${right}px 3px 0`
    }
    if (removable || hasIcon) {
        return '3px 0'
    }

    return '3px 5px'
}

export const setRemoveIconWidth = ({
    hasLabel,
    removable,
    hasIcon
}: Partial<DlChipProps>) => {
    const iconWidth = (hasLabel || hasIcon) && removable ? 14 : 18

    return `${iconWidth}px`
}

export const setMaxWidth = (maxWidth: string | number) => {
    if (maxWidth) {
        if (typeof maxWidth === 'string') {
            return maxWidth
        }
        return `${maxWidth}px`
    }

    return '100px'
}

export const setLeftIconColor = ({
    color = '',
    disabled
}: Partial<DlChipProps>) =>
    getColor(disabled ? 'dl-color-disabled' : color, 'dl-color-secondary')
