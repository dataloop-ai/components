<template>
    <div :id="uuid" ref="rootRef" class="dl-pagination">
        <div class="dl-pagination--container">
            <rows-selector
                v-if="withRowsPerPage && rowsPerPageState"
                ref="leftSideRef"
                v-model="rowsPerPageState"
                class="dl-pagination--sides dl-pagination--sides--left"
                :options="rowsPerPageOptions"
                :items-name="itemsName"
                :disabled="disabled"
            />
            <div
                v-else-if="withLegend"
                ref="leftSideRef"
                class="dl-pagination--sides dl-pagination--sides--left"
            />

            <div
                v-if="rowsPerPageState"
                class="dl-pagination--navigation dl-pagination--navigation-legend"
                :class="
                    withLegend || (withRowsPerPage && rowsPerPageState)
                        ? ''
                        : 'dl-pagination--navigation--maximized'
                "
            >
                <div class="dl-pagination--page-navigation-wrapper">
                    <page-navigation
                        :model-value="value"
                        :min="min"
                        :max="max"
                        :max-display-range="effectiveMaxDisplayRange"
                        :disabled="disabled"
                        :boundary-numbers="boundaryNumbers"
                        :boundary-links="boundaryLinks"
                        :direction-links="directionLinks"
                        :color="color"
                        :active-color="activeColor"
                        :text-color="textColor"
                        :active-text-color="activeTextColor"
                        @update:model-value="setValue"
                    />
                </div>
                <quick-navigation
                    v-if="withQuickNavigation"
                    ref="quickNavRef"
                    class="dl-pagination--quick-navigation"
                    :model-value="value"
                    :max="max"
                    :min="min"
                    :disabled="disabled"
                    @update:model-value="setValue"
                />
            </div>
            <pagination-legend
                v-if="withLegend"
                ref="rightSideRef"
                :from="rowFrom"
                :to="rowTo"
                :total="totalItems"
                :items-name="itemsName"
                class="dl-pagination--sides dl-pagination--sides--right"
            />
            <div
                v-else-if="withRowsPerPage && rowsPerPageState"
                ref="rightSideRef"
                class="dl-pagination--sides dl-pagination--sides--right"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import RowsSelector from './components/RowsSelector.vue'
import PageNavigation from './components/PageNavigation.vue'
import QuickNavigation from './components/QuickNavigation.vue'
import PaginationLegend from './components/PaginationLegend.vue'
import { v4 } from 'uuid'

const PAGE_BUTTON_AVG_WIDTH_PX = 16
const NAV_HORIZONTAL_PADDING_PX = 52
const REDUCED_DISPLAY_RANGE = 5

export default defineComponent({
    name: 'DlPagination',
    components: {
        RowsSelector,
        PageNavigation,
        QuickNavigation,
        PaginationLegend
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            type: Number,
            default: 1
        },
        min: {
            type: Number,
            default: 1
        },
        maxDisplayRange: {
            type: Number,
            default: 7,
            validator: (v: number) => v >= 0
        },
        rowsPerPage: {
            type: Number,
            default: 10
        },
        rowsPerPageOptions: {
            type: Array as PropType<number[]>,
            default: () => [10, 25, 50, 75, 100]
        },
        disabled: Boolean,
        boundaryNumbers: Boolean,
        boundaryLinks: Boolean,
        directionLinks: Boolean,
        color: {
            type: String,
            default: 'dl-color-transparent'
        },
        textColor: {
            type: String,
            default: 'dell-gray-800'
        },
        activeColor: {
            type: String,
            default: 'dell-blue-500'
        },
        activeTextColor: {
            type: String,
            default: 'dell-white'
        },
        totalItems: {
            type: Number,
            required: true
        },
        itemsName: {
            type: String,
            default: 'rows'
        },
        withQuickNavigation: Boolean,
        withRowsPerPage: Boolean,
        withLegend: Boolean
    },
    emits: ['update:model-value', 'update:rowsPerPage'],
    data() {
        return {
            uuid: `dl-pagination-${v4()}`,
            value: this.modelValue,
            rowsPerPageState: this.rowsPerPage,
            rootWidth: 0,
            leftSideWidth: 0,
            rightSideWidth: 0,
            quickNavWidth: 0,
            resizeObserver: null as ResizeObserver | null
        }
    },
    computed: {
        navNaturalWidth(): number {
            let buttonCount = this.maxDisplayRange + 1
            if (this.boundaryNumbers) buttonCount += 2
            if (this.directionLinks) buttonCount += 2
            if (this.boundaryLinks) buttonCount += 2
            return (
                buttonCount * PAGE_BUTTON_AVG_WIDTH_PX +
                NAV_HORIZONTAL_PADDING_PX
            )
        },
        effectiveMaxDisplayRange(): number {
            if (this.rootWidth === 0) return this.maxDisplayRange
            const available =
                this.rootWidth -
                this.leftSideWidth -
                this.rightSideWidth -
                this.quickNavWidth
            if (available < this.navNaturalWidth) {
                return Math.min(this.maxDisplayRange, REDUCED_DISPLAY_RANGE)
            }
            return this.maxDisplayRange
        },
        rowFrom(): number {
            return 1 + this.rowsPerPageState * (this.value - 1)
        },
        rowTo(): number {
            const to = this.rowsPerPageState * this.value

            if (to === 0) {
                return this.totalItems
            }

            return to > this.totalItems ? this.totalItems : to
        },
        max(): number {
            return this.rowsPerPageState === 0 || this.totalItems === 0
                ? 1
                : Math.ceil(this.totalItems / this.rowsPerPageState)
        }
    },
    watch: {
        modelValue(val: number) {
            this.value = this.modelValue
        },
        rowsPerPageState(newVal: number) {
            this.setValue(this.min)
            this.$emit('update:rowsPerPage', newVal)
        },
        rowsPerPage(newVal: number) {
            this.rowsPerPageState = newVal
        }
    },

    mounted() {
        this.setupResizeObserver()
    },
    beforeUnmount() {
        this.teardownResizeObserver()
    },
    beforeDestroy() {
        this.teardownResizeObserver()
    },
    methods: {
        setValue(value: number) {
            this.value = value
            this.$emit('update:model-value', value)
        },
        setupResizeObserver() {
            const resolveEl = (ref: unknown): Element | null => {
                const el = (ref as { $el?: unknown })?.$el ?? ref
                return el instanceof Element ? el : null
            }

            const targets: [Element | null, (w: number) => void][] = [
                [resolveEl(this.$refs.rootRef), (w) => (this.rootWidth = w)],
                [
                    resolveEl(this.$refs.leftSideRef),
                    (w) => (this.leftSideWidth = w)
                ],
                [
                    resolveEl(this.$refs.rightSideRef),
                    (w) => (this.rightSideWidth = w)
                ],
                [
                    resolveEl(this.$refs.quickNavRef),
                    (w) => (this.quickNavWidth = w)
                ]
            ]

            this.resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const match = targets.find(([el]) => el === entry.target)
                    if (match) {
                        match[1](entry.contentRect.width)
                    }
                }
            })

            for (const [el] of targets) {
                if (el) this.resizeObserver.observe(el)
            }
        },
        teardownResizeObserver() {
            this.resizeObserver?.disconnect()
            this.resizeObserver = null
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-pagination {
    width: 100%;
    height: 40px;
    font-family: var(--dl-typography-body-body3-font-family);
    font-size: var(--dl-typography-body-body3-font-size);
    line-height: var(--dl-typography-body-body3-line-height);
    font-weight: var(--dl-typography-body-body3-font-weight);

    &--container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &--navigation {
        display: flex;
        flex: 1 1 auto;
        min-width: 0;
        justify-content: center;
        align-items: center;
        &--maximized {
            width: 100%;
        }
    }

    &--page-navigation-wrapper {
        flex: 0 1 auto;
        min-width: 0;
        display: flex;
        justify-content: center;
        overflow: hidden;
    }

    &--sides {
        flex: 1 1 0;
        min-width: max-content;
    }

    &--quick-navigation {
        flex: 0 0 auto;
    }
}
</style>
