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
        }
    },
    emits: ['update:model-value', 'layout-changed'],
    computed: {
        gridStyles(): object {
            return {
                '--row-gap': this.rowGap,
                '--column-gap': this.columnGap,
                '--element-per-row': this.maxElementsPerRow
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
                // this.$nextTick(() => {
                //     if (val) {
                //         this.applyGridElementStyles()
                //     }
                // })
            },
            immediate: true
        }
    },
    mounted() {
        this.applyGridElementStyles()
    },
    methods: {
        applyGridElementStyles() {
            if (!this.modelValue) return
            const gridElements = Array.from(
                (this.$refs.grid as HTMLElement).children
            )
            const gridTemplate = getGridTemplate(
                this.modelValue.flat(1),
                this.maxElementsPerRow
            )
            if (gridElements.length > gridTemplate.flat(1).length) return

            const order = this.modelValue.flat()
            gridElements.forEach((element: Element, index: number) => {
                const htmlElement = element as HTMLElement
                htmlElement.style.order = `${index}`
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
            const sourceEl = getElementAbove(e.detail.source, className)
            const targetEl = getElementAbove(e.detail.target, className)

            const gridElements = Array.from(
                (this.$refs.grid as HTMLElement).children
            )
            const newLayout = swapElemensInMatrix(
                this.modelValue,
                sourceEl,
                targetEl,
                side,
                this.maxElementsPerRow,
                gridElements // YonDo: should this method from here?
            )
            // Update modelValue is required to trigger visualization of the changes
            this.$emit('update:model-value', newLayout)
            this.$forceUpdate()
            if (e.detail.endDragging) {
                this.layoutChanged()
            }
        },
        layoutChanged() {
            this.$emit('layout-changed', this.modelValue)
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
        flex-wrap: wrap;
    }
}
</style>
