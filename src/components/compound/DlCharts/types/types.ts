import type {
    Chart as ChartJS,
    ChartType,
    ChartData,
    ChartOptions,
    DefaultDataPoint,
    Plugin,
    UpdateMode
} from 'chart.js'

export interface DlChartProps<
    TType extends ChartType = ChartType,
    TData = DefaultDataPoint<TType>,
    TLabel = unknown
> {
    /**
     * Chart.js chart type
     */
    type: TType
    /**
     * The data object that is passed into the Chart.js chart
     * @see https://www.chartjs.org/docs/latest/getting-started/
     */
    data: ChartData<TType, TData, TLabel>
    /**
     * The options object that is passed into the Chart.js chart
     * @see https://www.chartjs.org/docs/latest/general/options.html
     * @default {}
     */
    options?: ChartOptions<TType>
    /**
     * The plugins array that is passed into the Chart.js chart
     * @see https://www.chartjs.org/docs/latest/developers/plugins.html
     * @default []
     */
    plugins?: Plugin<TType>[]
    /**
     * Key name to identificate dataset
     * @default 'label'
     */
    datasetIdKey?: string
    /**
     * A mode string to indicate transition configuration should be used.
     * @see https://www.chartjs.org/docs/latest/developers/api.html#update-mode
     */
    updateMode?: UpdateMode
}

export interface DlChartComponentRef<
    TType extends ChartType = ChartType,
    TData = DefaultDataPoint<TType>,
    TLabel = unknown
> {
    chart: ChartJS<TType, TData, TLabel> | null
}

export type DlChartComponent = any

export type DlTypedChartComponent<
    TType extends ChartType,
    TData = DefaultDataPoint<TType>,
    TLabel = unknown
> = any
