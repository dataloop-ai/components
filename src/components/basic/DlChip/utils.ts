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

export const setBorder = ({ disabled, color = '' }: Partial<DlChipProps>) => {
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
