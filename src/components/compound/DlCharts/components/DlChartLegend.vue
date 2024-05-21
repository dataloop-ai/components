<template>
    <div :style="legendStyles" class="dl-chart-legend">
        <div
            v-for="(item, index) in datasets"
            :key="index"
            class="dl-chart-legend--item"
            :style="{
                '--dl-chart-badge-color': getColor(item)
            }"
            @click="hideData($event, item, index)"
            @mouseenter="onMouseEnter(item, index)"
            @mouseleave="onMouseLeave(item, index)"
        >
            <dl-badge
                :color="
                    item.hidden ? 'var(--dl-color-disabled)' : getColor(item)
                "
            />
            <dl-typography
                size="small"
                :color="item.hidden ? 'dl-color-disabled' : 'dl-color-darker'"
            >
                {{ item.label }}
            </dl-typography>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import type { ChartDataset } from 'chart.js'
import { getColor } from '../../../../utils'
import { DlBadge, DlTypography } from '../../../essential'

const positions = {
    left: 'flex-start',
    right: 'flex-end',
    center: 'center'
}

export default defineComponent({
    name: 'DlChartLegend',
    components: {
        DlBadge,
        DlTypography
    },
    props: {
        width: {
            type: String,
            default: '100%'
        },
        datasets: {
            type: Array as PropType<ChartDataset[]>,
            default: () => [] as any as ChartDataset[]
        },
        alignItems: {
            type: String as PropType<'left' | 'right' | 'center'>,
            default: 'center'
        }
    },
    emits: ['hide', 'on-hover', 'on-leave'],
    computed: {
        legendStyles(): Record<string, string> {
            return {
                '--dl-chart-legend-width': this.width,
                '--dl-chart-legend-position': positions[this.alignItems]
            }
        }
    },
    methods: {
        onMouseEnter(item: ChartDataset, index: number) {
            if (!item.hidden) {
                this.$emit('on-hover', item, index)
            }
        },
        onMouseLeave(item: ChartDataset, index: number) {
            if (!item.hidden) {
                this.$emit('on-leave', item, index)
            }
        },
        hideData(event: Event, item: ChartDataset, index: number) {
            this.$emit(
                'hide',
                {
                    ...item,
                    hidden: !item.hidden
                },
                index
            )
        },
        getColor: (item: ChartDataset) => {
            if ((item.backgroundColor as any)?.replace) {
                return getColor((item.backgroundColor as any).replace('--', ''))
            }
        }
    }
})
</script>

<style scoped lang="scss">
.dl-chart-legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: var(--dl-chart-legend-position);
    max-width: var(--dl-chart-legend-width);
    width: 100%;
    gap: 10px;

    &--item {
        display: flex;
        gap: 5px;
        align-items: center;
        cursor: pointer;
        user-select: none;

        .dl-badge {
            font-size: 8px;
            line-height: 8px;
            min-height: 8px;
        }

        .dl-typography--small:hover {
            color: var(--dl-color-darker) !important;
        }

        &:hover {
            .dl-badge {
                background-color: var(--dl-chart-badge-color) !important;
            }

            .dl-typography--small {
                color: var(--dl-color-darker) !important;
            }
        }
    }
}
</style>
