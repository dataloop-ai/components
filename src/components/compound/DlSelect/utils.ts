import { TInputSizes } from '../../../utils/input-sizes'
import { DlSelectOption } from './types'

export type DlSelectOptionType = string | number | Record<string, any>

export const getLabel = (option: any) => {
    if (typeof option === 'object' && 'label' in option) {
        return option.label
    }

    return option
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
    option: DlSelectOption,
    selected: string[] | string
) => {
    let isSelected = false
    if (!Array.isArray(selected)) {
        return selected === option.value
    } else {
        selected.forEach((val) => {
            isSelected = val === option.value
        })
    }

    return isSelected
}

export const getLabelOfSelectedOption = (
    selected: string[] | string,
    options: DlSelectOption[] | string[]
): string | undefined => {
    for (const option of options) {
        if (typeof option === 'string' && typeof selected === 'string') {
            return option
        } else if (
            typeof option === 'object' &&
            isValueSelected(option, selected)
        ) {
            return option.label
        }
    }
    return '1 Option Selected'
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
