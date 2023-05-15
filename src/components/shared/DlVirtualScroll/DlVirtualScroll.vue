<script lang="ts">
import {
    computed,
    defineComponent,
    getCurrentInstance,
    onActivated,
    onBeforeMount,
    onBeforeUnmount,
    onDeactivated,
    onMounted,
    Ref,
    ref,
    watch,
    isVue2,
    h
} from 'vue-demi'
import getTableMiddle from '../../compound/DlTable/utils/getTableMiddle'
import { listenOpts, mergeSlot } from '../../../utils'
import { getScrollTarget } from '../../../utils/scroll'
import { DlList } from '../../essential/DlList'
import { DlMarkupTable } from '../../basic/DlMarkupTable'
import { useVirtualScroll, useVirtualScrollProps } from './useVirtualScroll'

const comps = {
    list: DlList,
    table: DlMarkupTable
}

const typeOptions = ['list', 'table', '__dltable']

export default defineComponent({
    name: 'DllVirtualScroll',
    props: {
        ...useVirtualScrollProps,

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

        itemsFn: { type: Function, default: void 0 },
        itemsSize: { type: Number, default: 0 },

        scrollTarget: {
            default: void 0
        }
    },
    emits: ['virtual-scroll'],
    setup(props, { slots, attrs }) {
        const vm = getCurrentInstance()

        let localScrollTarget: HTMLElement | undefined
        const rootRef: Ref<HTMLElement | null> = ref(null)

        const virtualScrollLength = computed(() => {
            return props.itemsSize >= 0 && props.itemsFn !== void 0
                ? parseInt(props.itemsSize as unknown as string, 10)
                : Array.isArray(props.items)
                ? props.items.length
                : 0
        })

        const {
            virtualScrollSliceRange,
            localResetVirtualScroll,
            padVirtualScroll,
            onVirtualScrollEvt
        } = useVirtualScroll({
            virtualScrollLength,
            getVirtualScrollTarget,
            getVirtualScrollEl
        })

        const virtualScrollScope = computed(() => {
            if (virtualScrollLength.value === 0) {
                return []
            }

            const mapFn = (item: any, i: number) => ({
                index: virtualScrollSliceRange.value.from + i,
                item
            })

            return props.itemsFn === void 0
                ? props.items
                      .slice(
                          virtualScrollSliceRange.value.from,
                          virtualScrollSliceRange.value.to
                      )
                      .map(mapFn)
                : props
                      .itemsFn(
                          virtualScrollSliceRange.value.from,
                          virtualScrollSliceRange.value.to -
                              virtualScrollSliceRange.value.from
                      )
                      .map(mapFn)
        })

        const classes = computed(
            () =>
                `dl-virtual-scroll dl-virtual-scroll` +
                (props.virtualScrollHorizontal === true
                    ? '--horizontal'
                    : '--vertical') +
                (props.scrollTarget !== void 0 ? '' : ' scroll')
        )

        const attributes = computed(() =>
            props.scrollTarget !== void 0 ? {} : { tabindex: 0 }
        )

        watch(virtualScrollLength, () => {
            localResetVirtualScroll()
        })

        watch(
            () => props.scrollTarget,
            () => {
                unconfigureScrollTarget()
                configureScrollTarget()
            }
        )

        function getVirtualScrollEl() {
            return (rootRef.value as any)?.$el || rootRef.value
        }

        function getVirtualScrollTarget() {
            return localScrollTarget
        }

        function configureScrollTarget() {
            localScrollTarget = getScrollTarget(
                getVirtualScrollEl(),
                props.scrollTarget
            )

            localScrollTarget!.addEventListener(
                'scroll',
                onVirtualScrollEvt,
                listenOpts.passive
            )
        }

        function unconfigureScrollTarget() {
            if (localScrollTarget !== void 0) {
                localScrollTarget.removeEventListener(
                    'scroll',
                    onVirtualScrollEvt,
                    listenOpts.passive
                )
                localScrollTarget = void 0
            }
        }

        function __getVirtualChildren(create: Function) {
            let child = padVirtualScroll(
                props.type === 'list' ? 'div' : 'tbody',
                virtualScrollScope.value.map(slots.default),
                create
            )

            if (slots.before !== void 0) {
                child = slots.before().concat(child)
            }

            return mergeSlot(slots.after, child)
        }

        onBeforeMount(() => {
            localResetVirtualScroll()
        })

        onMounted(() => {
            configureScrollTarget()
        })

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
            tag: comps[props.type],
            attrs,
            rootRef,
            classes,
            attributes
        }
    },
    render(createElement: Function) {
        const renderFn = isVue2 ? createElement : h
        const renderSlot = (fn: Function) => (isVue2 ? fn() : () => fn())

        if (!this.hasDefaultSlot) {
            console.error(
                'DlVirtualScroll: default scoped slot is required for rendering'
            )
            return
        }

        return this.$props.type === '__dltable'
            ? getTableMiddle(
                  {
                      ref: 'rootRef',
                      class: 'dl-table__middle ' + this.classes
                  },
                  this.getVirtualChildren(renderFn),
                  renderFn
              )
            : renderFn(
                  this.tag,
                  {
                      ...this.attrs,
                      ref: 'rootRef',
                      class: [this.attrs.class, this.classes],
                      ...this.attributes
                  },
                  renderSlot(() => this.getVirtualChildren(renderFn))
              )
    }
})
</script>
<style scoped lang="scss">
@import './styles/dl-virtual-scroll-styles.scss';
@import '../../compound/DlTable/styles/dl-table-styles.scss';
</style>
