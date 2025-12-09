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
            sortable.value = new Sortable(newRootRef, {
                ...props.options,
                onChoose: (event) => emit('choose', event),
                onUnchoose: (event) => emit('unchoose', event),
                onStart: (event) => {
                    isDragging.value = true
                    emit('start', event)
                },
                onEnd: (event) => {
                    setTimeout(() => {
                        isDragging.value = false
                        emit('end', event)
                    })
                },
                onAdd: (event) => emit('add', event),
                onUpdate: (event) => emit('update', event),
                onSort: (event) => emit('sort', event),
                onRemove: (event) => emit('remove', event),
                onFilter: (event) => emit('filter', event),
                onClone: (event) => emit('clone', event),
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
