export enum DlKpiCounterFormat {
    long = 'long',
    short = 'short',
    hms = 'h:m:s',
    hm = 'h:m',
    ms = 'm:s',
    h = 'h',
    m = 'm',
    s = 's'
}

export type DlKpiCounterType = {
    /* for string it should be have 0h:0m:0s format */
    value: number | string
    format?: DlKpiCounterFormat
    unit?: string
}

export type DlKpiProgressType = {
    value?: number
    text?: string
}

export type DlKpiItem = {
    counter: DlKpiCounterType | number
    title: string
    infoMessage?: string
    progress?: DlKpiProgressType
}
