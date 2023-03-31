export type DlSelectedValueType = number | string | boolean | null

interface DlGenericOption {
    label: string
    value: DlSelectedValueType
    disabled?: boolean
    color?: string
    tooltip?: string
}

export interface DlRadioOption extends DlGenericOption {
    tabindex?: number | string
}

export interface DlCheckboxOption extends DlGenericOption {
    tabindex?: number | string
    'toggle-indeterminate'?: boolean
    'true-value'?: any
    'false-value'?: any
}

export interface DlToggleOption extends DlGenericOption {
    icon?: string
}

export type DlOptionGroupOptions = (
    | DlRadioOption
    | DlCheckboxOption
    | DlToggleOption
)[]

export interface DlOptionProps
    extends Partial<DlRadioOption>,
        Partial<DlCheckboxOption>,
        Partial<DlToggleOption> {
    value?: DlSelectedValueType
    class?: string
    rightLabel?: string
    leftLabel?: string
}
