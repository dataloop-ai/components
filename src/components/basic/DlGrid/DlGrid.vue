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
import { defineComponent, PropType } from 'vue-demi'
import {
    getGridTemplate,
    getElementAbove,
    findIndexInMatrix,
    swapElemensInMatrix,
    isCustomEvent
} from '../DlWidget/utils'

export default defineComponent({
    model: {
        prop: 'model-value',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            type: Array as PropType<number[][]>,
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
        }
    },
    emits: ['update:model-value', 'layout-changed'],
    computed: {
        gridStyles(): object {
            return {
                '--row-gap': this.rowGap,
                '--column-gap': this.columnGap
            }
        },
        gridClass(): string {
            return this.modelValue
                ? 'dl-grid-wrapper__grid'
                : 'dl-grid-wrapper__flex'
        }
    },
    watch: {
        modelValue: {
            handler(val, oldVal) {
                this.$nextTick(() => {
                    if (val) {
                        if (val.length !== oldVal?.length) {
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
            if (!this.modelValue) return
            const gridElements = Array.from(
                (this.$refs.grid as HTMLElement).children
            )
            const gridTemplate = getGridTemplate(this.modelValue)
            if (gridElements.length > gridTemplate.length) return

            const order = this.modelValue.flat()
            gridElements.forEach((element: Element, index: number) => {
                const orderIndex =
                    order.findIndex((nr: number) => nr === index + 1) + 1
                const htmlElement = element as HTMLElement
                htmlElement.style.order = `${orderIndex}`
                htmlElement.style.gridColumn = gridTemplate[orderIndex - 1]
                htmlElement.addEventListener('position-changing', (e) => {
                    if (!isCustomEvent(e)) return
                    this.changePosition(e)
                })
                htmlElement.addEventListener(
                    'position-changed',
                    this.layoutChanged.bind(this)
                )
            })
        },
        changePosition(e: CustomEvent) {
            if (!this.modelValue) return
            const side = e.detail.side
            const className = (this.$refs.grid as HTMLElement).children[0]
                .classList[0]
            const sourceIndex =
                parseInt(
                    getElementAbove(e.detail.source, className).dataset.index
                ) + 1
            const targetIndex =
                parseInt(
                    getElementAbove(e.detail.target, className).dataset.index
                ) + 1
            const sourceMatrixIndex = findIndexInMatrix(
                this.modelValue,
                sourceIndex
            )
            const targetMatrixIndex = findIndexInMatrix(
                this.modelValue,
                targetIndex
            )

            const newLayout = swapElemensInMatrix(
                this.modelValue,
                sourceMatrixIndex,
                targetMatrixIndex,
                side,
                this.maxElementsPerRow
            )
            // Update modelValue is required to trigger visualization of the changes
            this.$emit('update:model-value', newLayout)
            if (e.detail.endDragging) {
                this.layoutChanged()
            }
        },
        layoutChanged() {
            this.$emit('layout-changed', this.modelValue)
        },
        applyIndexesForChildren() {
            Array.from((this.$refs.grid as HTMLElement).children).forEach(
                (element: Element, index: number) => {
                    (element as HTMLElement).dataset.index = `${index}`
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
    }
    &__flex {
        display: flex;
        flex-wrap: wrap;
    }
}
</style>
