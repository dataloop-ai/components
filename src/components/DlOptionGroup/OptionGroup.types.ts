export type SelectedValue = number | string | boolean | null

interface GenericOption {
    label: string
    value: SelectedValue
    disabled?: boolean
    color?: string
    tooltip?: string
}

export interface RadioOption extends GenericOption {
    tabindex?: number | string
}

export interface CheckboxOption extends GenericOption {
    tabindex?: number | string
    'toggle-indeterminate'?: boolean
    'true-value'?: any
    'false-value'?: any
}

export interface ToggleOption extends GenericOption {
    icon?: string
}

export type OptionGroupOptions = (RadioOption | CheckboxOption | ToggleOption)[]

export interface OptionProps
    extends Partial<RadioOption>,
        Partial<CheckboxOption>,
        Partial<ToggleOption> {
    value?: SelectedValue
    class?: string
    rightLabel?: string
    leftLabel?: string
}
