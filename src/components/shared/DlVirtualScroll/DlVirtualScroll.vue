<script lang="ts">
import {
    computed,
    defineComponent,
    onActivated,
    onBeforeMount,
    onBeforeUnmount,
    onDeactivated,
    onMounted,
    Ref,
    ref,
    watch,
    isVue2,
    h,
    onUnmounted,
    toRefs,
    PropType
} from 'vue-demi'
import getTableMiddle from '../../compound/DlTable/utils/getTableMiddle'
import { listenOpts, mergeSlot } from '../../../utils'
import { getScrollTarget } from '../../../utils/scroll'
import { DlList } from '../../essential/DlList'
import { DlMarkupTable } from '../../basic/DlMarkupTable'
import { useVirtualScroll, GridStyles } from './useVirtualScroll'
import { stateManager } from '../../../StateManager'

const comps = {
    list: DlList,
    table: DlMarkupTable
}

const virtualScrollRootTag = {
    list: 'div',
    table: 'tbody',
    __dltable: 'tbody'
}

const typeOptions = ['list', 'table', '__dltable']

export default defineComponent({
    name: 'DllVirtualScroll',
    props: {
        virtualScrollSliceSize: {
            type: [Number, String],
            default: null as number
        },

        virtualScrollSliceRatioBefore: {
            type: [Number, String],
            required: false,
            default: 1
        },

        virtualScrollSliceRatioAfter: {
            type: [Number, String],
            required: false,
            default: 1
        },

        virtualScrollItemSize: {
            type: Number,
            required: false,
            default: 0
        },

        virtualScrollStickySizeStart: {
            type: [Number, String],
            required: false,
            default: 0
        },

        virtualScrollStickySizeEnd: {
            type: [Number, String],
            required: false,
            default: 0
        },
        tableColspan: { type: [Number, String], required: false, default: 100 },
        virtualScrollHorizontal: {
            type: Boolean,
            required: false,
            default: false
        },
        items: {
            type: Array,
            default: () => [] as Record<string, any>[]
        },

        type: {
            type: String,
            default: 'list',
            validator: (v: (typeof typeOptions)[number]) =>
                typeOptions.includes(v)
        },

        styles: {
            type: Object as PropType<GridStyles>,
            default: null
        },

        itemsFn: { type: Function, default: null },
        itemsSize: { type: Number, default: 0 },

        scrollTarget: {
            type: [String, Object],
            default: null
        },
        scrollDebounce: {
            type: Number,
            default: 100
        }
    },
    emits: ['virtual-scroll'],
    setup(props, { slots, attrs }) {
        const {
            itemsSize,
            itemsFn,
            items,
            virtualScrollItemSize,
            scrollDebounce,
            virtualScrollHorizontal,
            scrollTarget,
            type
        } = toRefs(props)

        let localScrollTarget: HTMLElement | undefined
        const rootRef: Ref<HTMLElement | null> = ref(null)
        const scrollSizeItem: Ref<number> = ref(
            virtualScrollItemSize.value || 40
        )

        const isDefined = (v: any) => v !== undefined && v !== null

        const virtualScrollLength = computed(() => {
            return itemsSize.value >= 0 && isDefined(itemsFn.value)
                ? parseInt(itemsSize.value as unknown as string, 10)
                : Array.isArray(items.value)
                ? items.value.length
                : 0
        })

        const setItemSize = () => {
            scrollSizeItem.value = virtualScrollItemSize.value
                ? virtualScrollItemSize.value
                : typeof rootRef.value?.getElementsByClassName === 'function'
                ? rootRef.value?.getElementsByClassName(
                      'dl-virtual-scroll__content'
                  )[0]?.children[0]?.clientHeight ?? 40
                : 40
        }

        watch(
            props,
            () => {
                setItemSize()
            },
            { deep: true }
        )

        const virtualScrollItemSizeComputed = computed(() => {
            return scrollSizeItem.value
        })

        const {
            virtualScrollSliceRange,
            localResetVirtualScroll,
            padVirtualScroll,
            onVirtualScrollEvt
        } = useVirtualScroll({
            virtualScrollLength,
            getVirtualScrollTarget,
            getVirtualScrollEl,
            virtualScrollItemSizeComputed,
            debounceValue: scrollDebounce.value
        })

        const virtualScrollScope = computed(() => {
            if (virtualScrollLength.value === 0) {
                return []
            }

            const mapFn = (item: any, i: number) => ({
                index: virtualScrollSliceRange.value.from + i,
                item
            })

            const func = itemsFn.value as Function

            return isDefined(func)
                ? func(
                      virtualScrollSliceRange.value.from,
                      virtualScrollSliceRange.value.to -
                          virtualScrollSliceRange.value.from
                  ).map(mapFn)
                : items.value
                      .slice(
                          virtualScrollSliceRange.value.from,
                          virtualScrollSliceRange.value.to
                      )
                      .map(mapFn)
        })

        const classes = computed(
            () =>
                `dl-virtual-scroll dl-virtual-scroll` +
                (virtualScrollHorizontal.value === true
                    ? '--horizontal'
                    : '--vertical') +
                (isDefined(scrollTarget.value) ? '' : ' scroll')
        )

        const attributes = computed(() =>
            isDefined(scrollTarget.value) ? {} : { tabindex: 0 }
        )

        watch(virtualScrollLength, () => {
            localResetVirtualScroll()
        })

        watch(scrollTarget, () => {
            unconfigureScrollTarget()
            configureScrollTarget()
        })

        function getVirtualScrollEl() {
            return (rootRef.value as any)?.$el || rootRef.value
        }

        function getVirtualScrollTarget() {
            return localScrollTarget
        }

        function configureScrollTarget() {
            localScrollTarget = getScrollTarget(
                getVirtualScrollEl(),
                scrollTarget.value as any
            )

            localScrollTarget!.addEventListener(
                'scroll',
                onVirtualScrollEvt,
                listenOpts.passive
            )
        }

        function unconfigureScrollTarget() {
            if (isDefined(localScrollTarget)) {
                localScrollTarget.removeEventListener(
                    'scroll',
                    onVirtualScrollEvt,
                    listenOpts.passive
                )
                localScrollTarget = null
            }
        }

        function __getVirtualChildren(create: Function) {
            let child = padVirtualScroll(
                virtualScrollRootTag[
                    type.value as 'list' | 'table' | '__dltable'
                ] || 'div',
                virtualScrollScope.value.map(slots.default),
                create,
                props.styles
            )

            if (isDefined(slots.before)) {
                const before = slots.before()
                child = before ? before.concat(child) : child
            }

            return mergeSlot(slots.after, child)
        }

        onBeforeMount(() => {
            localResetVirtualScroll()
        })

        onMounted(() => {
            configureScrollTarget()
            window.addEventListener('load', setItemSize)
        })

        onUnmounted(() => window.removeEventListener('load', () => {}))

        onActivated(() => {
            configureScrollTarget()
        })

        onDeactivated(() => {
            unconfigureScrollTarget()
        })

        onBeforeUnmount(() => {
            unconfigureScrollTarget()
        })

        const hasDefaultSlot = computed(() => {
            return !!slots.default
        })

        return {
            hasDefaultSlot,
            getVirtualChildren: __getVirtualChildren,
            tag: (comps as Record<string, any>)[type.value] || type.value,
            attrs,
            rootRef,
            classes,
            attributes
        }
    },
    render(createElement: Function) {
        /**
         * Had to do some general Typescript hackery here to get this to work in webpack based builder project.
         * The original code is written in Vue 2, but this project is using Vue 3.
         * Some of the types are not compatible, so I had to cast some of the types to any.
         */

        const renderFn = isVue2 ? createElement : h
        const renderSlot = (fn: Function) => (isVue2 ? fn() : () => fn())

        if (!this.hasDefaultSlot) {
            stateManager.logger.error(
                'DlVirtualScroll: default scoped slot is required for rendering'
            )
            return
        }

        const isDlTable = (this.$props as any).type === '__dltable'
        const getVirtualChildren = (this as any).getVirtualChildren as Function

        if (isDlTable) {
            return getTableMiddle(
                {
                    ref: 'rootRef',
                    class: 'dl-table__middle ' + this.classes
                },
                getVirtualChildren(renderFn),
                renderFn
            )
        }

        const attrs = this.attrs as Record<string, any>
        const attributes = this.attributes as Record<string, any>
        const classes = this.classes as string // todo: does this have to be casted to an object?
        const attributeClasses = attrs.class as Record<string, any>
        const tag = this.tag as string

        return renderFn(
            tag,
            {
                ...attrs,
                ref: 'rootRef',
                class: [attributeClasses, classes],
                ...attributes
            },
            renderSlot(() => getVirtualChildren(renderFn))
        )
    }
})
</script>
<style scoped lang="scss">
@import './styles/dl-virtual-scroll-styles.scss';
@import '../../compound/DlTable/styles/dl-table-styles.scss';
</style>
