<template>
    <div
        :style="labelStyles"
        class="dl-chart-labels-container"
    >
        <div class="dl-chart-labels">
            <div
                v-for="(label, index) in labels"
                :key="index"
                class="dl-chart-labels--label"
            >
                <dl-tooltip v-if="isOverflowing[index]">
                    {{ label }}
                </dl-tooltip>
                <dl-typography
                    v-if="isVue2"
                    ref="textRef"
                    :size="fontSize"
                    :data-index="index"
                    :color="labelColor"
                >
                    {{ label }}
                </dl-typography>
                <dl-typography
                    v-else
                    :ref="(el) => forwardChildEl(el, index)"
                    :data-index="index"
                    :size="fontSize"
                    :color="labelColor"
                >
                    {{ label }}
                </dl-typography>
            </div>
        </div>
        <div
            v-if="title"
            class="dl-chart-labels-title"
        >
            <dl-typography
                :size="titleSize"
                :color="titleColor"
            >
                {{ title }}
            </dl-typography>
        </div>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, PropType, isVue2 } from 'vue-demi'
import { isEllipsisActive } from '../../utils/is-ellipsis-active'
import DlTypography from '../DlTypography.vue'
import DlTooltip from '../DlTooltip.vue'

export default defineComponent({
    name: 'DlChartLabels',
    components: {
        DlTooltip,
        DlTypography
    },
    props: {
        width: {
            type: String,
            default: '100%'
        },
        fontSize: {
            type: String,
            default: '12px'
        },
        title: {
            type: String,
            default: null
        },
        titleSize: {
            type: String,
            default: '12px'
        },
        titleColor: {
            type: String,
            default: '#000'
        },
        labelColor: {
            type: String,
            default: '#000'
        },
        labels: {
            type: Array as PropType<string[]>,
            default: () => [] as unknown as string[]
        }
    },
    data(): {
        uuid: string
        isOverflowing: boolean[]
        textRef: Element[]
        resizeObserver: ResizeObserver | null
    } {
        return {
            uuid: `dl-chart-legent-${v4()}`,
            isOverflowing: [],
            textRef: [],
            resizeObserver: null
        }
    },
    computed: {
        labelStyles(): Record<string, string> {
            return {
                '--dl-chart-labels-width': this.width
            }
        },
        isVue2(): boolean {
            return isVue2
        }
    },
    mounted() {
        this.resizeObserver = new ResizeObserver((entries) => {
            const tempArr = [...this.isOverflowing]

            for (const entry of entries) {
                const index = parseInt(
                    (entry.target as any).dataset.index ?? '0'
                )
                tempArr[index] = isEllipsisActive(entry.target)
            }

            this.isOverflowing = tempArr
        })

        const elements = isVue2
            ? ((this.$refs['textRef'] as any[]).map(
                  (ref: any) => ref.$el
              ) as Element[])
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
        forwardChildEl(el: { $el: Element }, index: number) {
            if (el?.$el) {
                this.textRef[index] = el.$el
            }
        }
    }
})
</script>

<style scoped lang="scss">
.dl-chart-labels-container {
    width: 100%;
    display: flex;
    flex-direction: column;

    .dl-chart-labels-title {
        width: 100%;
        display: flex;
        align-self: flex-end;
        justify-content: center;
        margin-top: 10px;
        max-width: var(--dl-chart-labels-width);
    }

    .dl-chart-labels {
        display: flex;
        align-self: flex-end;
        justify-content: space-between;
        max-width: var(--dl-chart-labels-width);
        width: 100%;

        &--label {
            display: flex;
            width: 100%;
            justify-content: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            & > .dl-typography {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>
