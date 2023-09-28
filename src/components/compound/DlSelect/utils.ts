import { TInputSizes } from '../../../utils/input-sizes'

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

export const getLabelOfSelectedOption = (
    valueToSearch: string,
    options: DlSelectOptionType[]
) => {
    if (options.length === 0) return ''

    if (typeof options[0] === 'string') {
        return options.find((opt) => opt === valueToSearch)
    }

    return (options.find((opt: any) => opt.value === valueToSearch) as any)
        .label
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
