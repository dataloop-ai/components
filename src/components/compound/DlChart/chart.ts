import {
    defineComponent,
    shallowRef,
    ref,
    onMounted,
    onBeforeUnmount,
    toRaw,
    watch,
    getCurrentInstance
} from 'vue-demi'
import { Chart as ChartJS } from 'chart.js'
import type { ChartComponent } from './types'
import { Props } from './props'
import {
    cloneData,
    setLabels,
    setDatasets,
    setOptions,
    toRawIfProxy,
    cloneProxy
} from './utils'

export const Chart = defineComponent({
    props: Props,
    setup(props) {
        const canvasRef = ref<HTMLCanvasElement | null>(null)
        const chartRef = shallowRef<ChartJS | null>(null)

        const vm = getCurrentInstance()

        Object.assign(vm.parent.proxy, { chart: chartRef })

        const renderChart = () => {
            if (!canvasRef.value) return

            const { type, data, options, plugins, datasetIdKey } = props
            const clonedData = cloneData(data, datasetIdKey)
            const proxiedData = cloneProxy(clonedData, data)

            chartRef.value = new ChartJS(canvasRef.value, {
                type,
                data: proxiedData,
                options: { ...options },
                plugins
            })
        }

        const destroyChart = () => {
            const chart = toRaw(chartRef.value)

            if (chart) {
                chart.destroy()
                chartRef.value = null
            }
        }

        const update = (chart: ChartJS) => {
            chart.update(props.updateMode)
        }

        onMounted(renderChart)

        onBeforeUnmount(destroyChart)

        watch(
            [() => props.options, () => props.data],
            (
                [nextOptionsProxy, nextDataProxy],
                [prevOptionsProxy, prevDataProxy]
            ) => {
                const chart = toRaw(chartRef.value)

                if (!chart) {
                    return
                }

                let shouldUpdate = false

                if (nextOptionsProxy) {
                    const nextOptions = toRawIfProxy(nextOptionsProxy)
                    const prevOptions = toRawIfProxy(prevOptionsProxy)

                    if (nextOptions && nextOptions !== prevOptions) {
                        setOptions(chart, nextOptions)
                        shouldUpdate = true
                    }
                }

                if (nextDataProxy) {
                    const nextLabels = toRawIfProxy(nextDataProxy.labels)
                    const prevLabels = toRawIfProxy(prevDataProxy.labels)
                    const nextDatasets = toRawIfProxy(nextDataProxy.datasets)
                    const prevDatasets = toRawIfProxy(prevDataProxy.datasets)

                    if (nextLabels !== prevLabels) {
                        setLabels(chart.config.data, nextLabels)
                        shouldUpdate = true
                    }

                    if (nextDatasets && nextDatasets !== prevDatasets) {
                        setDatasets(
                            chart.config.data,
                            nextDatasets,
                            props.datasetIdKey
                        )
                        shouldUpdate = true
                    }
                }

                if (shouldUpdate) {
                    update(chart)
                }
            },
            { deep: true }
        )

        return {
            canvasRef
        }
    },
    template: `<canvas ref="canvasRef" />`
}) as unknown as ChartComponent
