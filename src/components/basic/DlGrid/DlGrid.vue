<template>
    <div v-if="infiniteScroll">
        <dl-infinite-scroll
            :page-size="15"
            :items="items"
            style="height: var(--dl-virtual-scroll-height, 500px)"
            @scroll-to-top="$emit('scroll-to-top')"
            @scroll-to-bottom="$emit('scroll-to-bottom')"
        >
            <template #content="{ items }">
                <div
                    ref="grid"
                    :style="gridStyles"
                    :class="gridClass"
                >
                    <div
                        v-for="item in items"
                        :key="item.id"
                        class="item-wrapper"
                    >
                        <slot
                            name="item-slot"
                            v-bind="{ item }"
                        />
                    </div>
                </div>
            </template>
        </dl-infinite-scroll>
    </div>
    <div
        v-else-if="!hasItems"
        ref="grid"
        :style="gridStyles"
        :class="gridClass"
    >
        <slot />
    </div>
    <div
        v-else
        ref="grid"
        :style="gridStyles"
        :class="gridClass"
    >
        <div
            v-for="item in items"
            :key="item.id"
            class="item-wrapper"
        >
            <slot
                name="item-slot"
                v-bind="{ item }"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Dictionary } from 'lodash'
import {
    computed,
    defineComponent,
    getCurrentInstance,
    nextTick,
    onMounted,
    PropType,
    ref,
    toRefs,
    watch
} from 'vue-demi'
import { getGridTemplate, swapElementsInMatrix } from './utils'
import { isCustomEvent } from '../utils'
import { getElementAbove } from '../../../utils'
import { DlGridMode, GridItem } from './types'
import { DlInfiniteScroll } from '../../shared'

export default defineComponent({
    components: {
        DlInfiniteScroll
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            type: Array as PropType<(string | number)[][]>,
            default: null
        },
        items: {
            type: Array as PropType<GridItem[]>,
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
        },
        infiniteScroll: {
            type: Boolean,
            default: false
        }
    },
    emits: [
        'update:model-value',
        'layout-changed',
        'scroll-to-top',
        'scroll-to-bottom'
    ],
    setup(props, { emit }) {
        const vm = getCurrentInstance()
        const grid = ref<HTMLElement | null>(null)
        const {
            modelValue,
            mode,
            rowGap,
            columnGap,
            maxElementsPerRow,
            items
        } = toRefs(props)

        const isLayoutMode = computed(() => mode.value == DlGridMode.LAYOUT)
        const isGridMode = computed(() => mode.value == DlGridMode.GRID)
        const isFlexMode = computed(() => mode.value == DlGridMode.FLEX)

        const gridClass = computed(() =>
            modelValue.value || !isFlexMode.value
                ? 'dl-grid-wrapper__grid'
                : 'dl-grid-wrapper__flex'
        )

        const gridStyles = computed(() => {
            const gridStyles: Dictionary<string | number> = {
                '--row-gap': rowGap.value,
                '--column-gap': columnGap.value,
                display: 'grid',
                rowGap: 'var(--row-gap)',
                columnGap: 'var(--column-gap)',
                gridTemplateColumns: 'repeat(var(--element-per-row), 1fr)'
            }

            if (!isGridMode.value) {
                gridStyles['--element-per-row'] = maxElementsPerRow.value
            }

            return gridStyles
        })

        const layoutChanged = () => {
            emit('layout-changed', modelValue.value)
        }

        const changePosition = (e: CustomEvent) => {
            if (!modelValue.value) {
                return
            }
            const className = grid.value.children[0].classList[0]
            const sourceEl = getElementAbove(e.detail.source, className)
            const targetEl = getElementAbove(e.detail.target, className)

            const newLayout: (string | number)[][] = swapElementsInMatrix(
                modelValue.value,
                sourceEl,
                targetEl
            )
            // Update modelValue is required to trigger visualization of the changes
            emit('update:model-value', newLayout)

            // Force update is required to trigger the re-render of the grid
            vm?.proxy?.$forceUpdate()

            if (e.detail.endDragging) {
                layoutChanged()
            }
        }

        const applyGridElementStyles = () => {
            const childrenElements = Array.from(grid.value?.children || [])
            const layoutOrder = modelValue.value?.flat() ?? []

            // The check is needed to avoid errors and incorrect behavior
            if (
                !modelValue.value ||
                childrenElements.length > layoutOrder.flat().length ||
                isFlexMode.value
            ) {
                for (const element of childrenElements) {
                    const htmlElement = element as HTMLElement
                    htmlElement.style.flexGrow = '1'
                }
                return
            }

            let gridTemplate: string[]
            if (isGridMode.value) {
                gridTemplate = getGridTemplate(modelValue.value)
            }
            for (const element of childrenElements) {
                const htmlElement = element as HTMLElement
                const orderIndex: number = layoutOrder
                    .flat()
                    .findIndex((w) => w === htmlElement.dataset.id)
                if (isGridMode.value) {
                    htmlElement.style.gridColumn = gridTemplate[orderIndex]
                }
                htmlElement.style.order = `${orderIndex}`
                htmlElement.addEventListener('position-changing', (e) => {
                    if (!isCustomEvent(e)) return
                    changePosition(e)
                })
                htmlElement.addEventListener('position-changed', layoutChanged)
            }
        }

        const applyIndexesForChildren = () => {
            if (!modelValue.value) {
                return
            }
            Array.from(grid.value.children).forEach(
                (element: Element, index: number) => {
                    const el = element as HTMLElement
                    el.dataset.id = `${modelValue.value.flat()[index]}`
                }
            )
        }

        watch(
            modelValue,
            (val, old) => {
                nextTick(() => {
                    if (val) {
                        if (val.flat().length !== old?.flat().length) {
                            applyIndexesForChildren()
                        }
                        applyGridElementStyles()
                    }
                })
            },
            { immediate: true }
        )

        onMounted(() => {
            applyGridElementStyles()
        })

        const hasItems = computed(() => !!items.value?.length)

        return {
            isLayoutMode,
            isGridMode,
            isFlexMode,
            gridClass,
            gridStyles,
            grid,
            hasItems
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-grid-wrapper {
    &__flex {
        display: flex;
        gap: var(--row-gap);
        flex-wrap: wrap;
    }
}
</style>
