export interface DlSelectOption {
    label: string
    value: any
    key?: string
    expanded?: boolean
    children?: DlSelectOption[]
    readonly?: boolean
    disableRow?: boolean
    tooltip?: string
}

export type DlSelectOptionType = string | number | DlSelectOption
