import type { PropType } from 'vue-demi'
import type {
    ChartType,
    ChartData,
    ChartOptions,
    Plugin,
    UpdateMode,
    DatasetChartOptions
} from 'chart.js'
import { TDoughnutProps } from '../charts/DlDoughnutChart/types/TDoughnutChartProps'
import { TDoughnutChartData } from '../charts/DlDoughnutChart/types/TDoughnutChartData'

export const CommonProps = {
    data: {
        type: Object as PropType<ChartData>,
        required: true
    },
    options: {
        type: Object as PropType<ChartOptions>,
        default: () => ({})
    },
    plugins: {
        type: Array as PropType<Plugin[]>,
        default: () => [] as Plugin[]
    },
    datasetIdKey: {
        type: String,
        default: 'label'
    },
    updateMode: {
        type: String as PropType<UpdateMode>,
        default: undefined as UpdateMode
    }
} as const

export const Props = {
    type: {
        type: String as PropType<ChartType>,
        required: true
    },
    ...CommonProps
} as const

export const ColumnChartProps = {
    displayBrush: {
        type: Boolean,
        default: true
    },
    displayLabels: {
        type: Boolean,
        default: true
    },
    displayLegend: {
        type: Boolean,
        default: true
    },
    rootClass: {
        type: String,
        default: ''
    },
    chartClass: {
        type: String,
        default: ''
    },
    chartStyles: {
        type: String,
        default: ''
    },
    brushClass: {
        type: String,
        default: ''
    },
    wrapperHeight: {
        type: String,
        default: '400px'
    },
    brushProps: {
        type: Object,
        default: () => ({
            width: '100%',
            min: 0,
            max: 100,
            thumbSize: '20px',
            trackSize: '18px',
            step: 1,
            dragRange: true
        })
    },
    legendClass: {
        type: String,
        default: ''
    },
    legendProps: {
        type: Object,
        default: () => ({
            datasets: [] as unknown as DatasetChartOptions,
            width: '100%',
            alignItems: 'center'
        })
    }
}

export const defaultColumnChartProps = {
    brushProps: {
        width: '100%',
        thumbSize: '20px',
        trackSize: '18px',
        step: 1,
        dragRange: true
    },
    legendProps: {
        alignItems: 'center'
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 100,
            easing: 'linear'
        },
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                suggestedMin: 0,
                title: {
                    color: '--dl-color-medium',
                    display: true,
                    font: {
                        size: 12
                    },
                    text: 'Axis Y (sec)'
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '--dl-color-darker'
                },
                grid: {
                    color: '--dl-color-separator'
                }
            },
            x: {
                title: {
                    font: {
                        size: 12
                    },
                    color: '--dl-color-medium',
                    display: false,
                    text: 'Axis X'
                },
                min: 0,
                ticks: {
                    font: {
                        size: 12
                    },
                    display: false,
                    color: '--dl-color-darker'
                },
                grid: {
                    color: '--dl-color-separator'
                }
            }
        }
    }
}

export const defaultBarChartProps = {
    legendProps: {
        alignItems: 'center'
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                title: {
                    color: '--dl-color-medium',
                    display: true,
                    text: 'Axis Y (sec)'
                },
                ticks: {
                    color: '--dl-color-darker'
                },
                grid: {
                    color: '--dl-color-separator'
                },
                min: 0
            },
            x: {
                title: {
                    color: '--dl-color-medium',
                    display: true,
                    text: 'Axis X'
                },
                min: 0,
                ticks: {
                    display: true,
                    color: '--dl-color-darker'
                },
                grid: {
                    color: '--dl-color-separator'
                }
            }
        }
    }
}

export const BarChartProps = {
    rootClass: {
        type: String,
        default: ''
    },
    chartClass: {
        type: String,
        default: ''
    },
    chartStyles: {
        type: String,
        default: ''
    },
    wrapperHeight: {
        type: String,
        default: '600px'
    },
    legendClass: {
        type: String,
        default: ''
    },
    legendProps: {
        type: Object,
        default: () => ({
            datasets: [] as unknown as DatasetChartOptions,
            width: '100%',
            alignItems: 'center'
        })
    }
}

export const defaultLineChartProps = {
    brushProps: {
        width: '100%',
        thumbSize: '20px',
        trackSize: '18px',
        step: 1,
        dragRange: true
    },
    legendProps: {
        alignItems: 'center'
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 100,
            easing: 'linear'
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    beforeTitle(context: any) {
                        const label =
                            context[0]?.chart?.data?.labels[
                                context[0]?.dataIndex
                            ] || context[0].label
                        if (typeof label === 'string') {
                            context[0].label = label
                        } else {
                            context[0].label = Object.values(label)
                                .filter((item) => !!item)
                                .join(' | ')
                        }
                    }
                }
            }
        },
        scales: {
            y: {
                title: {
                    color: '--dl-color-medium',
                    display: true,
                    font: {
                        size: 12
                    },
                    text: 'Axis Y (sec)'
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '--dl-color-darker'
                },
                grid: {
                    color: '--dl-color-separator'
                }
            },
            x: {
                title: {
                    font: {
                        size: 12
                    },
                    color: '--dl-color-medium',
                    display: false,
                    text: 'Axis X'
                },
                min: 0,
                ticks: {
                    font: {
                        size: 12
                    },
                    display: false,
                    color: '--dl-color-darker'
                },
                grid: {
                    display: false,
                    color: '--dl-color-separator'
                }
            }
        }
    }
}

export const defaultDoughnutChartProps: TDoughnutProps = {
    data: <TDoughnutChartData>{},
    isSmall: false,
    hasSummary: false,
    options: {
        responsive: true,
        cutout: undefined,
        circumference: 360,
        animation: {
            animateRotate: true,
            animateScale: false
        }
    }
}
