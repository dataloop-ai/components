export type KpiItem = {
    title: number | Date
    subtitle: string
    infoMessage: string
    hasPercentage?: boolean
    hasSummary?: boolean
    progress?: {
        value: number
        text: string
    }
}
