export interface DlSelectOption {
    label: string
    value: any
    expanded?: boolean
    children?: DlSelectOption[]
    readonly?: boolean
}
