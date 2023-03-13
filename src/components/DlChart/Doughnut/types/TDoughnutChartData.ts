type TDoughnutChartDataset = {
    label: string
    data: number[]
    backgroundColor: string[]
    hoverBackgroundColor?: string[]
    backgroundColorOrignal?: string[]
    lightColor: string[]
    hoverOffset?: number
    borderWidth: number
    cutout?: string
}

export type TDoughnutChartData = {
    labels: string[]
    datasets: TDoughnutChartDataset[]
}
