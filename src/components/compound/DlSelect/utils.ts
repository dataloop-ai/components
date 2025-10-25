import { TInputSizes } from '../../../utils/input-sizes'
import { DlSelectOptionType } from './types'

export const getLabel = (option: any) => {
    if (typeof option === 'object' && 'label' in option) {
        return String(option.label)
    }

    return String(option)
}

const ICON_SIZES = {
    s: '12px',
    m: '14px',
    l: '16px',
    small: '12px',
    medium: '14px',
    large: '16px'
}

const isValueSelected = (
    option: DlSelectOptionType,
    selected: string[] | string
) => {
    let isSelected = false
    if (!Array.isArray(selected)) {
        isSelected =
            selected === (typeof option === 'object' ? option.value : option)
    } else {
        selected.forEach((val) => {
            isSelected =
                val === (typeof option === 'object' ? option.value : option)
        })
    }
    return isSelected
}

export const getLabelOfSelectedOption = (
    selected: string[] | string,
    options: DlSelectOptionType[] | string[]
): string => {
    const selectedValue = Array.isArray(selected) ? selected[0] : selected

    const findLabel = (opts: DlSelectOptionType[]): string | undefined => {
        for (const opt of opts) {
            const optValue = typeof opt === 'object' ? opt.value : opt
            if (optValue === selectedValue) {
                return typeof opt === 'object' ? String(opt.label) : String(opt)
            }

            if (typeof opt === 'object' && opt?.children?.length) {
                const found = findLabel(opt.children as DlSelectOptionType[])
                if (found) return found
            }
        }
        return undefined
    }

    return findLabel(options as DlSelectOptionType[]) ?? '1 Option Selected'
}

export const getIconSize = (size: TInputSizes) => ICON_SIZES[size] ?? '14px'

export const optionsValidator = (opts: DlSelectOptionType[]) => {
    return opts.every((opt: string | any) => {
        if (typeof opt === 'string' || typeof opt === 'number') {
            return true
        }
        const keys = Object.keys(opt)
        return keys.includes('value') && keys.includes('label')
    })
}

export const getCaseInsensitiveInput = (label: string, input: string) => {
    const inputRegexp = new RegExp(input, 'gi')
    const position = label.search(inputRegexp)
    return label.slice(position, position + input.length)
}
