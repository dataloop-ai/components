import { TDoughnutChartOptions } from './TDoughnutChartOptions'
import { TDoughnutChartData } from './TDoughnutChartData'

export type TDoughnutProps = TDoughnutChartOptions & {
    data: TDoughnutChartData
    isSmall: boolean
    hasSummary: boolean
}
