type Dictionary = { [key: string]: any }
export interface DlSelectOption extends Dictionary {
    label: string
    value: any
    key?: string
    expanded?: boolean
    children?: DlSelectOption[]
    readonly?: boolean
}

export type DlSelectOptionType = string | number | DlSelectOption
