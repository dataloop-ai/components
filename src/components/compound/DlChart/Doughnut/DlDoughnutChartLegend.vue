<template>
    <div
        ref="dlDoughnutChartLegendMainRef"
        :class="legendMainClass"
    >
        <div
            v-if="itemsCount"
            class="wrapper__legend"
        >
            <div
                v-for="(item, index) in data.datasets[0].data"
                :key="index"
                class="wrapper__legend__item"
                @click="hideData({ index })"
                @mouseenter="emitMouseOverLegend(index)"
                @mouseleave="emitMouseLeaveLegend(index)"
            >
                <dl-tooltip
                    self="top middle"
                    anchor="top middle"
                >
                    {{ data.labels[index] }}
                </dl-tooltip>
                <div class="wrapper__legend__item__label">
                    <div>
                        <div
                            class="wrapper__legend__item__label__circle"
                            :style="{ backgroundColor: getColor(index, badge) }"
                        />
                    </div>
                    <dl-typography>
                        <div
                            :class="legendLabelClass"
                            :style="{ color: getColor(index, text) }"
                        >
                            {{ data.labels[index] }}
                        </div>
                    </dl-typography>
                </div>
                <div
                    class="wrapper__legend__item__counter truncate"
                    :style="{ color: getColor(index, text) }"
                >
                    {{ data.datasets[0].data[index] }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlTypography, DlTooltip } from '../../../essential'
import { TDoughnutChartData } from './types/TDoughnutChartData'

enum EBadgeText {
    badge = 'badge',
    text = 'text'
}
type TBadgeText = EBadgeText.badge | EBadgeText.text

export default defineComponent({
    name: 'DlDoughnutChartLegend',
    components: {
        DlTypography,
        DlTooltip
    },
    props: {
        data: {
            type: Object,
            default: () => Object as PropType<TDoughnutChartData>
        },
        isSmall: {
            type: Boolean,
            default: false
        },
        hiddenIndexes: {
            type: Array,
            default: () => [] as number[]
        }
    },
    emits: ['hide', 'mouseOverLegend', 'mouseLeaveLegend'],
    data() {
        return {
            grayColor: 'var(--dl-color-disabled)',
            hoveredIndex: [],
            paddingBody: '',
            badge: EBadgeText.badge,
            text: EBadgeText.text
        }
    },
    computed: {
        legendMainClass(): string[] {
            return [
                this.isSmall
                    ? 'wrapper__height__sm wrapper__margin__sm wrapper__width__sm'
                    : 'wrapper__height__lg wrapper__height__lg',
                this.paddingBody,
                'wrapper'
            ]
        },
        legendLabelClass(): string[] {
            return [
                this.isSmall
                    ? 'wrapper__legend__item__label__width__sm'
                    : 'wrapper__legend__item__label__width__lg',
                'wrapper__legend__item__label__truncate'
            ]
        },
        itemsCount(): number | undefined {
            return this.data?.datasets[0]?.data?.length
        }
    },
    mounted(): void {
        this.setBodyPadding()
    },
    methods: {
        setBodyPadding() {
            const clientHeight =
                (this.$refs.dlDoughnutChartLegendMainRef as any)
                    ?.clientHeight || 0
            const scrollHeight =
                (this.$refs.dlDoughnutChartLegendMainRef as any)
                    ?.scrollHeight || 0

            const hasScroll = clientHeight < scrollHeight
            /**
             * - if it is small and has scroll then should be have spaces on top and on the side
             * - if it is small and hasn't scroll then should be have spaces only on the side
             */
            if (this.isSmall) {
                this.paddingBody = hasScroll
                    ? 'wrapper__margin__scrollbar__with'
                    : 'wrapper__margin__scrollbar__without'
                return
            }

            this.paddingBody = 'wrapper__margin__lg'
        },
        hideData(item: { index: number }) {
            /**
             * this should be check if this item index contains in hiddenIndexes
             * if it is containing then should emit hidden: false
             * overwise it is emitting hidden: true
             * */

            this.$emit('hide', {
                ...item,
                hidden: !this.hiddenIndexes.includes(item.index)
            })
        },
        emitMouseOverLegend(backgroundColorIndex: number) {
            this.hoveredIndex.push(backgroundColorIndex)
            this.$emit('mouseOverLegend', backgroundColorIndex)
        },
        emitMouseLeaveLegend(index: number) {
            this.hoveredIndex.splice(
                this.hoveredIndex.findIndex((element) => element === index),
                1
            )
            this.$emit('mouseLeaveLegend')
        },
        getColor(index: number, element: TBadgeText) {
            const originalColor =
                element === EBadgeText.badge
                    ? this.data.datasets[0].backgroundColor[index]
                    : 'var(--dl-color-darker)'
            /**
             * if it is hidden then should be gray
             * if it is hidden, on hover the color should be default
             * otherwise is default color
             * */
            return this.hiddenIndexes.includes(index) &&
                !this.hoveredIndex.includes(index)
                ? this.grayColor
                : originalColor
        }
    }
})
</script>

<style scoped lang="scss">
.wrapper {
    overflow-y: scroll;
    scrollbar-width: auto;
    scrollbar-color: #e4e4e4;
    scroll-padding: 4px;

    &__height {
        &__lg {
            max-height: 480px;
        }
        &__sm {
            max-height: 265px;
        }
    }

    &__width {
        &__lg {
            max-width: 500px;
        }
        &__sm {
            max-width: 273px;
        }
    }

    &__margin {
        &__sm {
            margin: 0 19px 0 19px;
        }
        &__lg {
            margin-left: 0;
        }

        &__scrollbar {
            &__with {
                margin: 0 19px 0 19px;
            }
            &__without {
                margin: 0 26px 0 26px;
            }
        }
    }

    &__legend {
        display: flex;
        flex-wrap: wrap;
        justify-content: initial;
        gap: 0 5px;

        &__item {
            font-size: var(--dl-font-size-body);
            display: flex;
            width: 100%;
            gap: 0 5px;
            align-items: center;
            cursor: pointer;
            user-select: none;
            line-height: 14px;
            padding: 7px 8px 7px 8px;

            &__label {
                display: flex;
                gap: 0 8px;
                align-items: center;

                &__width {
                    &__lg {
                        max-width: 242px;
                    }
                    &__sm {
                        max-width: 202px;
                    }
                }

                &__truncate {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                &__circle {
                    height: 8px;
                    width: 8px;
                    border-radius: 50%;
                }
            }

            &__counter {
                display: flex;
                width: 100%;
                text-align: flex-end;
                justify-content: flex-end;
                color: var(--dl-color-darker);
            }
        }
    }
}
</style>
