export enum EFormat {
    short = 'short',
    hms = 'h:m:s',
    hm = 'h:m',
    ms = 'm:s',
    h = 'h',
    m = 'm',
    s = 's'
}

export type TCounter = {
    value: number | string
    format?: EFormat
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
