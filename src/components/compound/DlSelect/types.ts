export interface DlSelectOption {
    label: string
    value: any
    isExpanded?: boolean
    children?: DlSelectOption[]
}
