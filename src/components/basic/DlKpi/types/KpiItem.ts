export enum DlCounterFormat {
    long = 'long',
    short = 'short',
    hms = 'h:m:s',
    hm = 'h:m',
    ms = 'm:s',
    h = 'h',
    m = 'm',
    s = 's'
}

export type DlCounterType = {
    /* for string it should be have 0h:0m:0s format */
    value: number | string
    format: DlCounterFormat
}

export type DlKpiItem = {
    counter: DlCounterType
    title: string
    infoMessage?: string
    progress?: {
        value?: number
        text?: string
    }
}
