import { ChartData } from 'chart.js'

export type TDoughnutWithOriginalColor = ChartData<'doughnut'> & {
    datasets: [
        {
            data: any[]
            label?: string
            originalBackgroundColor?: string[]
            backgroundColor?: string[]
            lightColor?: string[]
        }
    ]
}
