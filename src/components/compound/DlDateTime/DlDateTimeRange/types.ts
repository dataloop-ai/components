import { DateInterval } from '../DlDatePicker/types'

export const DAY_SIDEBAR_OPTION = {
    today: 'today',
    yesterday: 'yesterday',
    last_7_days: 'last_7_days',
    last_14_days: 'last_14_days',
    last_month: 'last_month',
    whole_period: 'whole_period',
    custom: 'custom',
    custom_by_month: 'custom_by_month'
} as const

export type DAY_SIDEBAR_OPTION =
    (typeof DAY_SIDEBAR_OPTION)[keyof typeof DAY_SIDEBAR_OPTION]

export const MONTH_SIDEBAR_OPTION = {
    this_month: 'this_month',
    last_month: 'last_month',
    last_3_months: 'last_3_months',
    last_6_months: 'last_6_months',
    last_12_months: 'last_12_months',
    custom: 'custom',
    custom_by_day: 'custom_by_day'
} as const

export type MONTH_SIDEBAR_OPTION =
    (typeof MONTH_SIDEBAR_OPTION)[keyof typeof MONTH_SIDEBAR_OPTION]

export type DayTypeOption = {
    title: string
    key: DAY_SIDEBAR_OPTION
    value?: DateInterval
    disabled?: boolean
}

export type MonthTypeOption = {
    title: string
    key: MONTH_SIDEBAR_OPTION
    value?: DateInterval
    disabled?: boolean
}

export enum DATETIME_RANGE_VIEW_MODE {
    input = 'input',
    inline = 'inline'
}
