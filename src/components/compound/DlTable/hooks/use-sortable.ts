import {
    Ref,
    ref,
    PropType,
    watch,
    onUnmounted,
    computed,
    useAttrs
} from 'vue-demi'
import Sortable, { SortableOptions } from 'sortablejs'
import type { AutoScrollOptions } from 'sortablejs/plugins'

type SortableOptionsProp = Omit<
    SortableOptions | AutoScrollOptions,
    | 'onUnchoose'
    | 'onChoose'
    | 'onStart'
    | 'onEnd'
    | 'onAdd'
    | 'onUpdate'
    | 'onSort'
    | 'onRemove'
    | 'onFilter'
    | 'onMove'
    | 'onClone'
    | 'onChange'
>

export const emits = [
    'unchoose',
    'choose',
    'start',
    'end',
    'add',
    'update',
    'sort',
    'remove',
    'filter',
    'move',
    'clone',
    'change'
]

type ExposedProps = {
    rootRef: Ref<HTMLDivElement | null>
    sortable: Ref<Sortable | null>
    isDragging: Ref<boolean>
}

const element = {
    table: 'DlTable'
}

export const useSortableProps = {
    props: {
        type: Object as PropType<Record<string, any>>,
        default: () => {}
    },
    /** All SortableJS options are supported; events are handled by the `defineEmits` below and should be used with v-on */
    options: {
        type: Object as PropType<SortableOptionsProp>,
        default: () => {}
    },
    /** Your list of items **/
    list: {
        type: [Array, Object],
        default: () => [] as any[]
    },
    /** The name of the key present in each item in the list that corresponds to a unique value. */
    itemKey: {
        type: [String, Function] as PropType<
            string | ((item: any) => string | number | Symbol)
        >,
        default: ''
    },
    /** The element type to render as. */
    tag: {
        type: String as PropType<string>,
        default: 'div'
    },
    isSortable: {
        type: Boolean,
        default: false
    },
    className: {
        type: String,
        default: ''
    }
}

export function useSortable(vm: Record<string, any>) {
    const { props, emit } = vm
    const isDragging = ref(false)
    const rootRef = ref<HTMLElement | null>(null)
    const sortable = ref<Sortable | null>(null)
    const getKey = computed(() => {
        if (typeof props.itemKey === 'string')
            return (item: any) => item[props.itemKey as string]
        return props.itemKey
    })

    watch(rootRef, (newRootRef) => {
        if (sortable.value) {
            sortable.value.destroy()
            sortable.value = null
        }

        if (newRootRef) {
            const DRAGGING_CLASS = 'dl-sortable--dragging'

            const hasDocument = () =>
                typeof document !== 'undefined' &&
                !!document.documentElement &&
                !!document.body

            const applyGlobalDraggingState = (active: boolean) => {
                if (!hasDocument()) return

                document.documentElement.classList.toggle(
                    DRAGGING_CLASS,
                    active
                )

                document.documentElement.style.cursor = active ? 'grabbing' : ''
                document.body.style.cursor = active ? 'grabbing' : ''
            }

            const stopDragging = () => {
                if (!isDragging.value) return
                isDragging.value = false
                didSyncCloneWidths = false
                applyGlobalDraggingState(false)
                removeHardStopListeners()
            }

            const hardStop = () => {
                stopDragging()
            }

            const onKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') hardStop()
            }

            const addHardStopListeners = () => {
                if (!hasDocument()) return
                window.addEventListener('mouseup', hardStop, true)
                window.addEventListener('pointerup', hardStop, true)
                window.addEventListener('touchend', hardStop, true)
                window.addEventListener('dragend', hardStop, true)
                window.addEventListener('drop', hardStop, true)
                window.addEventListener('keydown', onKeyDown, true)
            }

            const removeHardStopListeners = () => {
                if (!hasDocument()) return
                window.removeEventListener('mouseup', hardStop, true)
                window.removeEventListener('pointerup', hardStop, true)
                window.removeEventListener('touchend', hardStop, true)
                window.removeEventListener('dragend', hardStop, true)
                window.removeEventListener('drop', hardStop, true)
                window.removeEventListener('keydown', onKeyDown, true)
            }

            let didSyncCloneWidths = false

            const _syncDraggingElementColumnWidths = (event: any) => {
                if (didSyncCloneWidths) return
                if (!hasDocument()) return

                const pickRowEl = (
                    el: HTMLElement
                ): HTMLTableRowElement | null => {
                    if (el.tagName === 'TR') return el as HTMLTableRowElement
                    const tr = el.querySelector('tr')
                    return (tr as HTMLTableRowElement) || null
                }

                const itemEl = event?.item as HTMLElement | null
                const sourceRow = itemEl ? pickRowEl(itemEl) : null
                if (!sourceRow) return

                const sourceCells = Array.from(
                    sourceRow.querySelectorAll('th,td')
                ) as HTMLElement[]
                if (sourceCells.length === 0) return

                const sourceRowWidth = sourceRow.getBoundingClientRect().width
                const widths = sourceCells.map(
                    (cell) => cell.getBoundingClientRect().width
                )

                requestAnimationFrame(() => {
                    const dragEl = document.body.querySelector(
                        '.sortable-drag'
                    ) as HTMLElement | null
                    if (!dragEl) return

                    const dragRow = pickRowEl(dragEl)
                    if (!dragRow) return

                    const dragRows =
                        dragEl.tagName === 'TR'
                            ? ([dragEl] as HTMLElement[])
                            : (Array.from(
                                  dragEl.querySelectorAll('tr')
                              ) as HTMLElement[])
                    if (dragRows.length === 0) return

                    for (const row of dragRows) {
                        const cells = Array.from(
                            row.querySelectorAll('th,td')
                        ) as HTMLElement[]
                        if (cells.length === 0) continue

                        const len = Math.min(widths.length, cells.length)
                        for (let i = 0; i < len; i++) {
                            const w = widths[i]
                            const cell = cells[i]
                            if (!w || !cell) continue
                            const px = `${w}px`
                            cell.style.width = px
                            cell.style.minWidth = px
                            cell.style.maxWidth = px
                        }
                    }

                    const dragTable =
                        (dragEl.tagName === 'TABLE'
                            ? (dragEl as HTMLElement)
                            : (dragRow.closest(
                                  'table'
                              ) as HTMLElement | null)) ||
                        (dragEl.querySelector('table') as HTMLElement | null)
                    if (dragTable && sourceRowWidth) {
                        dragTable.style.width = `${sourceRowWidth}px`
                    }

                    if (dragEl.tagName === 'TR' && sourceRowWidth) {
                        dragEl.style.width = `${sourceRowWidth}px`
                        dragEl.style.minWidth = `${sourceRowWidth}px`
                        dragEl.style.maxWidth = `${sourceRowWidth}px`
                    }

                    didSyncCloneWidths = true
                })
            }

            sortable.value = new Sortable(newRootRef, {
                ...props.options,
                onChoose: (event) => emit('choose', event),
                onUnchoose: (event) => emit('unchoose', event),
                onStart: (event) => {
                    isDragging.value = true
                    applyGlobalDraggingState(true)
                    addHardStopListeners()
                    _syncDraggingElementColumnWidths(event)
                    emit('start', event)
                },
                onEnd: (event) => {
                    stopDragging()
                    emit('end', event)
                },
                onAdd: (event) => emit('add', event),
                onUpdate: (event) => emit('update', event),
                onSort: (event) => emit('sort', event),
                onRemove: (event) => emit('remove', event),
                onFilter: (event) => emit('filter', event),
                onClone: (event) => {
                    _syncDraggingElementColumnWidths(event)
                    emit('clone', event)
                },
                onChange: (event) => emit('change', event)
            })
        }
    })

    watch(
        () => props.options,
        (options: SortableOptionsProp) => {
            if (options && sortable?.value) {
                for (const property in options) {
                    sortable.value.option(
                        property as keyof SortableOptionsProp,
                        options[property as keyof SortableOptionsProp]
                    )
                }
            }
        }
    )

    onUnmounted(() => {
        if (sortable.value) {
            sortable.value.destroy()
            rootRef.value = null
            sortable.value = null
        }
    })

    return { rootRef, getKey, element }
}
