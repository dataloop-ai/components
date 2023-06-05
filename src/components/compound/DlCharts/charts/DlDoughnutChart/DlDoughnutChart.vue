<template>
    <div
        ref="dlDoughnutChartWidgetRef"
        class="dl_doughnut"
    >
        <dl-empty-state
            v-if="isEmpty"
            v-bind="emptyStateProps"
        >
            <template
                v-for="(_, slot) in $slots"
                #[slot]="props"
            >
                <slot
                    :name="slot"
                    v-bind="props"
                />
            </template>
        </dl-empty-state>
        <div
            v-if="itemsCount && !isEmpty"
            class="dl_doughnut__wrapper"
            :class="classFlexLg"
        >
            <div
                v-if="doughnutData"
                class="dl_doughnut__wrapper__container"
                :class="classFlexDirection"
            >
                <div
                    class="dl_doughnut__wrapper__container__chart"
                    :style="styleDoughnutWidth"
                    @mouseover="setHoverLight"
                    @mouseleave="resetColors"
                >
                    <Doughnut
                        ref="doughnutChartRef"
                        :data="doughnutData"
                        :options="doughnutOptions"
                        :plugins="doughnutPlugins"
                    />
                    <div
                        v-if="hasSummaryProp"
                        ref="dlDoughnutChartSummaryRef"
                        class="dl_doughnut__wrapper__container__chart__summary text-center"
                    >
                        <div :class="classSummaryLabel">
                            Total items
                        </div>
                        <div :class="classSummaryCount">
                            {{ itemsCount }}
                        </div>
                    </div>
                </div>
                <div class="dl_doughnut__wrapper__legend">
                    <div class="dl_doughnut__wrapper__legend__row">
                        <dl-doughnut-chart-legend
                            :data="doughnutData"
                            :hidden-indexes="hiddenIndexes"
                            :is-small="isSmall"
                            @hide="hideData"
                            @mouseOverLegend="darkHighlight"
                            @mouseLeaveLegend="resetColors"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="!itemsCount && !isEmpty">
            No data
        </div>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    ref,
    reactive,
    PropType,
    onMounted,
    watch
} from 'vue-demi'

import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    DoughnutController,
    ArcElement,
    ChartData,
    DoughnutControllerChartOptions
} from 'chart.js'

ChartJS.register(Tooltip, Legend, DoughnutController, ArcElement)

import { cloneDeep, merge } from 'lodash'
import { Doughnut } from '../../types/typedCharts'
import { useThemeVariables } from '../../../../../hooks/use-theme'
import { updateNestedArrayValues } from '../../../../../utils/update-key'
import DlDoughnutChartLegend from './components/DlDoughnutChartLegend.vue'
import { defaultDoughnutChartProps } from '../../types/props'
import { TDoughnutWithOriginalColor } from './types/TDoughnutWithOriginalColor'
import DlEmptyState from '../../../../basic/DlEmptyState/DlEmptyState.vue'
import { Props } from '../../../../basic/DlEmptyState/types'

export default defineComponent({
    name: 'DlDoughnutChart',
    components: {
        Doughnut,
        DlDoughnutChartLegend,
        DlEmptyState
    },
    props: {
        data: {
            type: Object as PropType<ChartData<'doughnut'>>,
            required: true
        },
        isSmall: {
            type: Boolean,
            default: false
        },
        hasSummary: {
            type: Boolean,
            default: false
        },
        animation: {
            type: Object as PropType<
                DoughnutControllerChartOptions['animation']
            >,
            required: false
        },
        isEmpty: Boolean,
        emptyStateProps: {
            type: Object as PropType<Props>,
            default: () => {}
        }
    },
    setup(props) {
        /** Data */
        const doughnutChartRef = ref(null)
        const dlDoughnutChartWidgetRef = ref(null)
        const doughnutChartWidgetWidth = ref()
        const doughnutChartWidgetHeight = ref()
        const dlDoughnutChartSummaryRef = ref<HTMLDivElement>(null)
        const defaultOptions = cloneDeep(defaultDoughnutChartProps.options)

        const sizePercents = 70

        const chartRefValue = computed(() => {
            return doughnutChartRef.value?.chart?.value || {}
        })
        const hasSummaryProp = computed(() => props.hasSummary)

        watch(hasSummaryProp, () => {
            chartRefValue.value.update()
        })

        const hiddenIndexes = ref([])

        const { variables } = useThemeVariables()
        const replaceColor = (key: keyof typeof variables) =>
            variables[key] || key

        const setDoughnutData = () => {
            let dumpPropsData: TDoughnutWithOriginalColor =
                {} as TDoughnutWithOriginalColor

            if (
                props.data?.datasets?.length &&
                (props.data.datasets[0]?.backgroundColor as any)?.length
            ) {
                dumpPropsData = cloneDeep(
                    props.data
                ) as TDoughnutWithOriginalColor
                dumpPropsData.datasets[0] = updateNestedArrayValues(
                    cloneDeep(props.data.datasets[0]),
                    ['backgroundColor', 'hoverBackgroundColor', 'lightColor'],
                    replaceColor
                )

                dumpPropsData.datasets[0].originalBackgroundColor = cloneDeep(
                    dumpPropsData?.datasets[0]?.backgroundColor
                )
            }

            return dumpPropsData
        }

        const doughnutData = ref(setDoughnutData())

        const doughnutPlugins = reactive([
            {
                id: 'centerSummary',
                afterDraw(chart: any, args: any, options: any) {
                    const {
                        ctx,
                        chartArea: { top, width, height }
                    } = chart
                    ctx.save()

                    const slotDiv: HTMLDivElement =
                        dlDoughnutChartSummaryRef.value

                    if (!slotDiv) {
                        return
                    }
                    const summaryHeight = height / 2
                    const divHeight = summaryHeight / 8
                    const summaryTop = (summaryHeight + divHeight) * -1

                    slotDiv.style.position = 'relative'
                    slotDiv.style.top = `${summaryTop}px`
                    slotDiv.style.textAlign = 'center'

                    ctx.restore()
                }
            }
        ])
        /** Computed */
        const itemsCount = computed(() =>
            props.data?.datasets?.length &&
            props.data?.datasets[0]?.data?.length
                ? props.data?.datasets[0]?.data?.length
                : 0
        )

        onMounted(() => {
            const resizeObserver = new ResizeObserver(getDimensions)
            resizeObserver.observe(dlDoughnutChartWidgetRef.value)
            getDimensions()
        })
        const classFlexLg = computed(() => (props.isSmall ? 'flex' : ''))
        const classFlexDirection = computed(() =>
            props.isSmall
                ? 'flex-column dl_doughnut__wrapper__container__gap__sm'
                : 'flex-row dl_doughnut__wrapper__container__gap__lg'
        )
        const styleDoughnutWidth = computed(() =>
            props.isSmall
                ? {
                      'justify-content': 'end',
                      width: getPixelsFromPercents(
                          doughnutChartWidgetHeight.value,
                          sizePercents / 1.8,
                          'px'
                      ),
                      height: getPixelsFromPercents(
                          doughnutChartWidgetHeight.value,
                          sizePercents / 1.8,
                          'px'
                      )
                  }
                : {
                      height: getPixelsFromPercents(
                          doughnutChartWidgetHeight.value,
                          sizePercents,
                          'px'
                      ),
                      width: getPixelsFromPercents(
                          doughnutChartWidgetHeight.value,
                          sizePercents,
                          'px'
                      )
                  }
        )

        const classSummaryLabel = computed(
            () =>
                `dl_doughnut__wrapper__container__chart__summary__label_${
                    props.isSmall ? 'sm' : 'lg'
                }`
        )

        const classSummaryCount = computed(
            () =>
                `dl_doughnut__wrapper__container__chart__summary__count__${
                    props.isSmall ? 'sm' : 'lg'
                }`
        )

        const mergedAnimation = computed(() =>
            merge(defaultOptions.animation, props.animation)
        )
        defaultOptions.animation = mergedAnimation.value

        const doughnutOptions = computed(() =>
            merge(
                {
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            yAlign: 'none',
                            callbacks: {
                                labelColor(
                                    tooltipItem: { dataIndex: string | number },
                                    chart: any
                                ) {
                                    return {
                                        backgroundColor:
                                            chartRefValue.value.data.datasets[0]
                                                .hoverBackgroundColor[
                                                tooltipItem.dataIndex
                                            ]
                                    }
                                }
                            }
                        }
                    }
                },
                defaultOptions
            )
        )

        /** Methods */
        const hideData = (item: { index: number; hidden: boolean }) => {
            chartRefValue.value._metasets[0].data[item.index].hidden =
                item.hidden
            chartRefValue.value.update()

            if (item.hidden) {
                hiddenIndexes.value.push(item.index)
                return
            }

            const indexOfItem = hiddenIndexes.value.indexOf(item.index)
            if (indexOfItem > -1) {
                hiddenIndexes.value.splice(indexOfItem, 1)
            }
        }

        const setHoverLight = () => {
            chartRefValue.value.data.datasets[0].backgroundColor = cloneDeep(
                (doughnutData.value.datasets[0] as any)?.lightColor
            )
            chartRefValue.value.update()
        }

        const resetColors = () => {
            const originalBackgroundColor = (
                doughnutData.value.datasets[0] as any
            )?.originalBackgroundColor
            chartRefValue.value.data.datasets[0].backgroundColor = cloneDeep(
                originalBackgroundColor
            )
            chartRefValue.value.update()
        }

        const darkHighlight = (backgroundColorIndex: number): void => {
            resetColors()
            setHoverLight()
            chartRefValue.value.data.datasets[0].backgroundColor[
                backgroundColorIndex
            ] = cloneDeep(
                (doughnutData.value?.datasets[0] as any)?.hoverBackgroundColor[
                    backgroundColorIndex
                ]
            )
            chartRefValue.value.update()
        }

        const getDimensions = () => {
            doughnutChartWidgetWidth.value =
                dlDoughnutChartWidgetRef.value?.clientWidth
            doughnutChartWidgetHeight.value =
                dlDoughnutChartWidgetRef.value?.clientHeight
        }

        const getPixelsFromPercents = (
            totalPixels: number,
            percents: number,
            unit: string
        ): string => {
            if (!totalPixels || !percents) {
                return
            }
            const result = (percents / 100) * totalPixels
            return `${result.toFixed(0)}${unit}`
        }

        return {
            doughnutChartRef,
            dlDoughnutChartWidgetRef,
            doughnutChartWidgetWidth,
            doughnutChartWidgetHeight,
            doughnutData,
            doughnutOptions,
            dlDoughnutChartSummaryRef,
            itemsCount,
            hiddenIndexes,
            classFlexLg,
            classFlexDirection,
            styleDoughnutWidth,
            classSummaryLabel,
            classSummaryCount,
            hideData,
            darkHighlight,
            resetColors,
            setHoverLight,
            doughnutPlugins,
            hasSummaryProp
        }
    }
})
</script>

<style scoped lang="scss">
.dl_doughnut {
    border: 1px solid #cccccc;
    border-radius: 3px;
    text-align: center;
    align-items: center;
    padding: 25px;

    &__wrapper {
        display: flex;
        height: 510px;
        text-align: center;
        justify-content: center;
        overflow: hidden;

        &__container {
            display: flex;
            text-align: center;
            align-items: center;
            justify-content: center;

            &__gap {
                &__lg {
                    gap: 0 70px;
                }

                &__sm {
                    gap: 25px 0;
                }
            }

            &__chart {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative;
                text-align: center;

                &__summary {
                    height: 1px;

                    &__label_lg {
                        font-weight: normal;
                        color: var(--dl-color-medium);
                        font-size: var(--dl-font-size-h3);
                        line-height: 18.75px;
                    }

                    &__label_sm {
                        font-weight: normal;
                        color: var(--dl-color-medium);
                        font-size: var(--dl-font-size-small);
                        line-height: 12px;
                    }

                    &__count {
                        font-weight: normal;
                        color: var(--dl-color-darker);

                        &__lg {
                            font-size: var(--dl-font-size-h1);
                            line-height: 35px;
                        }

                        &__sm {
                            font-size: var(--dl-font-size-h4);
                            line-height: 16px;
                        }
                    }
                }
            }
        }

        &__legend {
            text-align: initial;

            &__row {
                display: flex;
                max-width: 350px;
            }
        }
    }
}
</style>
