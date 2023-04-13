<template>
    <div
        ref="grid"
        :style="gridStyles"
        class="dl-grid-wrapper"
    >
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import {
    leastCommonMultiple,
    getGridTemplate,
    getElementAbove,
    findIndexInMatrix,
    swapElemensInMatrix
} from './utils'

export default defineComponent({
    props: {
        layout: {
            type: Array as PropType<number[]>,
            default: null
        },
        rowGap: {
            type: String,
            default: '10px'
        },
        columnGap: {
            type: String,
            default: '10px'
        }
    },
    emits: ['update-layout'],
    computed: {
        order() {
            return this.layout.flatMap((val: number) => val)
        },
        gridStyles() {
            return {
                '--grid-rows': this.layout?.length,
                '--grid-columns': leastCommonMultiple(this.layout),
                '--row-gap': this.rowGap,
                '--column-gap': this.columnGap
            }
        }
    },
    watch: {
        layout: {
            handler() {
                this.$nextTick(() => {
                    this.applyGridElementStyles()
                })
            },
            immediate: true
        }
    },
    methods: {
        applyGridElementStyles() {
            if (!this.layout) return
            const gridElements = Array.from(
                (this.$refs.grid as HTMLElement).children
            )
            const gridTemplate = getGridTemplate(this.layout)
            if (gridElements.length !== gridTemplate.length) return

            gridElements.forEach((element: HTMLElement, index: number) => {
                element.style.order = this.order[index]
                element.style.gridColumn = gridTemplate[this.order[index] - 1]
                element.addEventListener('change-position', this.changePosition)
            })
        },
        changePosition(e: CustomEvent) {
            const side = e.detail.side
            const className = this.$refs.grid.children[0].classList[0]
            const sourceIndex = parseInt(
                getElementAbove(e.detail.source, className).style.order
            )
            const targetIndex = parseInt(
                getElementAbove(e.detail.target, className).style.order
            )
            const sourceMatrixIndex = findIndexInMatrix(
                this.layout,
                sourceIndex
            )
            const targetMatrixIndex = findIndexInMatrix(
                this.layout,
                targetIndex
            )

            if (side === 'left') {
            } else if (side === 'right') {
            } else {
                const newLayout = swapElemensInMatrix(
                    this.layout,
                    sourceMatrixIndex,
                    targetMatrixIndex
                )
                this.$emit('update-layout', newLayout)
            }
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-grid-wrapper {
    display: grid;
    row-gap: var(--row-gap);
    column-gap: var(--column-gap);
    grid-template-columns: var(--grid-columns);
    grid-template-rows: var(--grid-rows);
}
</style>
