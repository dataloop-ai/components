export type KpiItem = {
    title: {
        value: number | string
        isAbbreviated: boolean
    }
    subtitle: string
    hasPercentage?: boolean
    progress?: {
        value?: number
        text?: string
    }
}
