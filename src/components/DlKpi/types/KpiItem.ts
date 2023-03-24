export enum EFormat {
    long = 'long',
    short = 'short',
    hms = 'h:m:s',
    hm = 'h:m',
    ms = 'm:s',
    h = 'h',
    m = 'm',
    s = 's'
}

export type TCounter = {
    /* for string it should be have 0h:0m:0s format */
    value: number | string
    format: EFormat
}

export type KpiItem = {
    counter: TCounter
    title: string
    infoMessage?: string
    progress?: {
        value?: number
        text?: string
    }
}
