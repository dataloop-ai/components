<template>
    <div
        ref="grid"
        :style="gridStyles"
        :class="gridClass"
    >
        <slot />
    </div>
</template>

<script lang="ts">
import { Dictionary } from 'lodash'
import { defineComponent, PropType } from 'vue-demi'
import { getGridTemplate, swapElementsInMatrix } from './utils'
import { isCustomEvent, getElementAbove } from '../utils'
import { DlGridMode } from './types'

export default defineComponent({
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            type: Array as PropType<string[][]>,
            default: null
        },
        rowGap: {
            type: String,
            default: '30px'
        },
        columnGap: {
            type: String,
            default: '30px'
        },
        maxElementsPerRow: {
            type: Number,
            default: 3
        },
        mode: {
            type: String as PropType<DlGridMode>,
            default: DlGridMode.LAYOUT
        }
    },
    emits: ['update:model-value', 'layout-changed'],
    computed: {
        gridStyles(): Record<string, string | number> {
            const gridStyles: Dictionary<string | number> = {
                '--row-gap': this.rowGap,
                '--column-gap': this.columnGap
            }

            if (!this.isGridMode) {
                gridStyles['--element-per-row'] = this.maxElementsPerRow
            }

            return gridStyles
        },
        gridClass(): string {
            return this.modelValue
                ? 'dl-grid-wrapper__grid'
                : 'dl-grid-wrapper__flex'
        },
        isLayoutMode(): boolean {
            return this.mode === DlGridMode.LAYOUT
        },
        isGridMode(): boolean {
            return this.mode === DlGridMode.GRID
        },
        isFlexMode(): boolean {
            return this.mode === DlGridMode.FLEX
        }
    },
    watch: {
        modelValue: {
            handler(val, oldVal) {
                this.$nextTick(() => {
                    if (val) {
                        if (val.flat().length !== oldVal?.flat().length) {
                            this.applyIndexesForChildren()
                        }
                        this.applyGridElementStyles()
                    }
                })
            },
            immediate: true
        }
    },
    mounted() {
        this.applyIndexesForChildren()
    },
    methods: {
        applyGridElementStyles() {
            const childrenElements = Array.from(
                (this.$refs.grid as HTMLElement).children
            )
            const layoutOrder = this.modelValue?.flat() ?? []

            // The check is needed to avoid errors and incorrect behavior
            if (
                !this.modelValue ||
                childrenElements.length > layoutOrder.flat().length ||
                this.isFlexMode
            ) {
                for (const element of childrenElements) {
                    const htmlElement = element as HTMLElement
                    htmlElement.style.flexGrow = '1'
                }
                return
            }

            let gridTemplate: string[]
            if (this.isGridMode) {
                gridTemplate = getGridTemplate(this.modelValue)
            }
            for (const element of childrenElements) {
                const htmlElement = element as HTMLElement
                const orderIndex: number = layoutOrder
                    .flat()
                    .findIndex((w) => w === htmlElement.dataset.id)
                if (this.isGridMode) {
                    htmlElement.style.gridColumn = gridTemplate[orderIndex]
                }
                htmlElement.style.order = `${orderIndex}`
                htmlElement.addEventListener('position-changing', (e) => {
                    if (!isCustomEvent(e)) return
                    this.changePosition(e)
                })
                htmlElement.addEventListener(
                    'position-changed',
                    this.layoutChanged.bind(this)
                )
            }
        },
        changePosition(e: CustomEvent) {
            if (!this.modelValue) {
                return
            }
            const className = (this.$refs.grid as HTMLElement).children[0]
                .classList[0]
            const sourceEl = getElementAbove(e.detail.source, className)
            const targetEl = getElementAbove(e.detail.target, className)

            const newLayout: string[][] = swapElementsInMatrix(
                this.modelValue,
                sourceEl,
                targetEl
            )
            // Update modelValue is required to trigger visualization of the changes
            this.$emit('update:model-value', newLayout)

            // Force update is required to trigger the re-render of the grid
            this.$forceUpdate()
            if (e.detail.endDragging) {
                this.layoutChanged()
            }
        },
        layoutChanged() {
            this.$emit('layout-changed', this.modelValue)
        },
        applyIndexesForChildren() {
            if (!this.modelValue) {
                return
            }
            Array.from((this.$refs.grid as HTMLElement).children).forEach(
                (element: Element, index: number) => {
                    const el = element as HTMLElement
                    el.dataset.id = this.modelValue.flat()[index]
                }
            )
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-grid-wrapper {
    &__grid {
        display: grid;
        row-gap: var(--row-gap);
        column-gap: var(--column-gap);
        grid-template-columns: repeat(var(--element-per-row), 1fr);
    }
    &__flex {
        display: flex;
        gap: var(--row-gap);
        flex-wrap: wrap;
    }
}
</style>
