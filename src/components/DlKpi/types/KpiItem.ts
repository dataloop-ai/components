export type KpiItem = {
    title: {
        value: number | string
        isAbbreviated: boolean
    }
    subtitle: string
    progress?: {
        value?: number
        text?: string
    }
}
