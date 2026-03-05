export interface StepState {
    value: string
    title: string
    subtitle?: string
    subtitleTooltip?: string
    icon?: string
    active?: boolean
    completed?: boolean
    optional?: boolean
    error?: string
    warning?: string
    disabled?: boolean
    disabledTooltip?: string
}
