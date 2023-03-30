import { TInputSizes } from '../../../utils/input-sizes'

export type SelectOptionType = string | number | Record<string, any>

export const getLabel = (option: any) => {
    if (typeof option === 'object' && 'label' in option) {
        return option.label
    }

    return option
}

const ICON_SIZES = {
    s: '12px',
    m: '14px',
    l: '16px'
}

export const getLabelOfSelectedOption = (
    valueToSearch: string,
    options: SelectOptionType[]
) => {
    if (options.length === 0) return ''

    if (typeof options[0] === 'string') {
        return options.find((opt) => opt === valueToSearch)
    }

    return (options.find((opt: any) => opt.value === valueToSearch) as any)
        .label
}

export const getIconSize = (size: TInputSizes) => ICON_SIZES[size] ?? '14px'

export const optionsValidator = (opts: SelectOptionType[]) => {
    return opts.every((opt: string | any) => {
        if (typeof opt === 'string' || typeof opt === 'number') {
            return true
        }
        const keys = Object.keys(opt)
        return keys.includes('value') && keys.includes('label')
    })
}
