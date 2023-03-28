export enum EKpiCounterFormat {
    long = 'long',
    short = 'short',
    hms = 'h:m:s',
    hm = 'h:m',
    ms = 'm:s',
    h = 'h',
    m = 'm',
    s = 's'
}

export type TKpiCounter = {
    /* for string it should be have 0h:0m:0s format */
    value: number | string
    format: EKpiCounterFormat
}

export type TKpiProgress = {
    value?: number
    text?: string
}

export type KpiItem = {
    counter: TKpiCounter | number
    title: string
    infoMessage?: string
    progress?: TKpiProgress
}
