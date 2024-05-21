<template>
    <div :id="uuid" ref="rootRef" class="root" :style="rootStyle">
        <div class="progress-bar">
            <div
                v-for="item in progressBarItems"
                :key="item.index"
                :style="getBarItemStyles(item)"
            >
                <dl-tooltip anchor="center middle" self="bottom middle">
                    {{ item.tooltipText }}
                </dl-tooltip>
            </div>
        </div>
        <div class="legend">
            <div
                v-for="item in progressBarItems"
                :key="item.index"
                class="item"
                :style="legendItemStyle"
            >
                <dl-tooltip v-if="isOverflowing[item.index]">
                    {{ item.name }}
                </dl-tooltip>
                <span class="circle" :style="{ backgroundColor: item.color }" />
                <div
                    v-if="isVue2"
                    ref="textRef"
                    :data-index="item.index"
                    class="text"
                    :class="{ ellipsis: isOverflowing[item.index] }"
                >
                    {{ item.name }}
                </div>
                <div
                    v-else
                    :ref="
                        (el) => {
                            setTextRef(item.index, el)
                        }
                    "
                    :data-index="item.index"
                    class="text"
                    :class="{ ellipsis: isOverflowing[item.index] }"
                >
                    {{ item.name }}
                </div>
                <span :style="counterStyle">
                    <dl-link
                        v-if="item.link"
                        open-in-new-tab
                        :href="item.link"
                        :size="12"
                        color="color"
                        data-test="counter-link"
                    >({{ item.value }})</dl-link
                    ><span v-else data-test="counter-text"
                    >({{ item.value }})</span
                    >
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, isVue2 } from 'vue-demi'
import { getColor } from '../../../utils'
import { isEllipsisActive } from '../../../utils/is-ellipsis-active'
import { DlLink } from '../../essential'
import { DlTooltip } from '../../shared'

type ProgressChartOption = {
    name: string
    value: number
    color: string
    link?: string
}

function getPercentage(value: number, total: number): number {
    return (value * 100) / total
}

export default defineComponent({
    name: 'DlProgressChart',
    components: { DlLink, DlTooltip },
    props: {
        options: {
            type: Array,
            default: null,
            required: true,
            validator: (val: ProgressChartOption[]) =>
                Array.isArray(val) &&
                val.every(
                    (el) =>
                        typeof el === 'object' &&
                        el !== null &&
                        !Array.isArray(el) &&
                        typeof el.name === 'string' &&
                        typeof el.value === 'number' &&
                        typeof el.color === 'string'
                )
        },
        width: {
            type: String,
            default: '100%'
        },
        textColor: {
            type: String,
            default: 'dl-color-darker'
        },
        counterColor: {
            type: String,
            default: 'dl-color-secondary'
        }
    },
    data(): {
        uuid: string
        isOverflowing: boolean[]
        textRef: HTMLDivElement[]
        resizeObserver: ResizeObserver | null
    } {
        return {
            uuid: `dl-progress-chart-${v4()}`,
            isOverflowing: [],
            textRef: [],
            resizeObserver: null
        }
    },
    computed: {
        progressBarItems() {
            const options = this.options as ProgressChartOption[]
            const total = options.reduce(
                (sum, option) => (sum += option.value),
                0
            )

            return options.map((option, index) => {
                const percentage = getPercentage(option.value, total).toFixed(2)

                return {
                    ...option,
                    index,
                    percentage,
                    tooltipText: `${option.name}\n${percentage}% (${option.value}/${total})`
                }
            })
        },
        rootStyle(): Record<string, any> {
            return {
                width: this.width
            }
        },
        counterStyle(): Record<string, any> {
            const color = getColor(this.counterColor, 'dl-color-secondary')

            return {
                '--color': color,
                color,
                paddingLeft: '5px'
            }
        },
        isVue2(): boolean {
            return isVue2
        },
        legendItemWidth(): number {
            const width =
                (this.$refs['rootRef'] as HTMLDivElement)?.offsetWidth ?? 0
            const length = this.progressBarItems.length ?? 0
            return width / length
        },
        legendItemStyle(): Record<string, any> {
            return {
                width: `calc(${this.legendItemWidth} - 10px)`, // padding-right: 10px
                color: getColor(this.textColor, 'dl-color-darker')
            }
        }
    },
    mounted() {
        this.resizeObserver = new ResizeObserver((entries) => {
            const tempArr = [...this.isOverflowing]

            for (const entry of entries) {
                const index = parseInt(
                    (entry.target as HTMLDivElement).dataset.index ?? '0'
                )
                tempArr[index] = isEllipsisActive(entry.target)
            }

            this.isOverflowing = tempArr
        })

        const elements = isVue2
            ? (this.$refs['textRef'] as HTMLDivElement[])
            : this.textRef

        for (const el of elements) {
            this.resizeObserver.observe(el)
        }
    },
    beforeUnmount() {
        this.resizeObserver.disconnect()
        this.resizeObserver = null
    },
    methods: {
        getBarItemStyles(item: any): any {
            return {
                flexGrow: item.percentage,
                flexShrink: item.percentage,
                backgroundColor: item.color
            }
        },
        setTextRef(index: number, el: any) {
            this.textRef[index] = el as any
        }
    },

    template: 'dl-progress-chart'
})
</script>

<style scoped lang="scss">
.root {
    display: flex;
    flex-direction: column;
    margin: 20px 0;

    & > div {
        display: flex;
        flex-direction: row;
    }

    .progress-bar {
        height: 10px;
        width: 100%;

        :first-child {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
        }

        :last-child {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
        }
    }

    .legend {
        margin: 10px 0 20px 0;
        font-size: var(--dl-font-size-body);
        justify-content: space-evenly;

        & .item {
            display: flex;
            align-items: center;
            padding-right: 10px;
            justify-content: center;

            .circle {
                min-width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 5px;
                box-sizing: border-box;
            }

            .text {
                overflow: hidden;
                white-space: nowrap;
            }

            .ellipsis {
                text-overflow: ellipsis;
            }

            .text::first-letter {
                text-transform: capitalize;
            }
        }
    }
}

.item {
    @for $n from 1 through 100 {
        &:first-child:nth-last-child(#{$n}),
        &:first-child:nth-last-child(#{$n}) ~ & {
            width: calc(100% / #{$n} - 10px);
        }
    }
}
</style>
