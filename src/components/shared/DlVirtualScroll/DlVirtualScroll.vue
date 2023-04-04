<template>
    <!-- Component was created based on Quasar: https://github.com/quasarframework/quasar/blob/dev/ui/src/components/virtual-scroll/QVirtualScroll.js -->
    <div
        :id="uuid"
        ref="rootRef"
        :style="cssVars"
        class="dl-table__middle"
        :class="classes"
    >
        <table class="dl-table">
            <slot
                v-if="hasBeforeSlot"
                name="before"
            />
            <tbody
                key="before"
                ref="beforeRef"
                class="dl-virtual-scroll__padding"
            >
                <tr>
                    <td
                        class="dl-virtual-scroll__before"
                        :colspan="colspanAttr"
                    />
                </tr>
            </tbody>
            <tbody
                key="content"
                ref="contentRef"
                class="dl-virtual-scroll__content"
                tabindex="-1"
            >
                <slot
                    v-for="scope in virtualScrollScope"
                    :item="scope.item"
                />
            </tbody>
            <tbody
                key="after"
                ref="afterRef"
                class="dl-virtual-scroll__padding"
            >
                <tr>
                    <td
                        class="dl-virtual-scroll__after"
                        :colspan="colspanAttr"
                    />
                </tr>
            </tbody>
            <slot
                v-if="hasAfterSlot"
                name="after"
            />
        </table>
    </div>
</template>
<script lang="ts">
import { v4 } from 'uuid'
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
    watch
} from 'vue-demi'
import { listenOpts } from '../../../utils'
import { getScrollTarget } from '../../../utils/scroll'
import { useVirtualScroll, useVirtualScrollProps } from './useVirtualScroll'

export default defineComponent({
    name: 'DlVirtualScroll',
    props: {
        ...useVirtualScrollProps,

        items: {
            type: Array,
            default: () => [] as Record<string, any>[]
        },

        itemsFn: { type: Function, default: void 0 },
        itemsSize: { type: Number, default: 0 },

        scrollTarget: {
            default: void 0
        }
    },
    setup(props, { slots, attrs }) {
        const vm = getCurrentInstance()

        let localScrollTarget: HTMLElement | undefined
        const rootRef: Ref<HTMLElement | null> = ref(null)

        const virtualScrollLength = computed(() =>
            props.itemsSize && props.itemsSize >= 0 && props.itemsFn !== void 0
                ? parseInt(props.itemsSize as unknown as string, 10)
                : Array.isArray(props.items)
                ? props.items.length
                : 0
        )

        const {
            virtualScrollSliceRange,
            localResetVirtualScroll,
            onVirtualScrollEvt,
            virtualScrollPaddingBefore,
            virtualScrollPaddingAfter,
            beforeRef,
            afterRef,
            contentRef,
            colspanAttr
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

            if (props.itemsFn === void 0) {
                return props.items
                    .slice(
                        virtualScrollSliceRange.value.from,
                        virtualScrollSliceRange.value.to
                    )
                    .map(mapFn)
            }

            return (props.itemsFn as Function)(
                virtualScrollSliceRange.value.from,
                virtualScrollSliceRange.value.to -
                    virtualScrollSliceRange.value.from
            ).map(mapFn)
        })

        const classes = computed(
            () =>
                'dl-virtual-scroll dl-virtual-scroll--vertical' +
                (props.scrollTarget !== void 0 ? '' : ' scroll')
        )

        const cssVars = computed(() => {
            return {
                '--item-height-before': virtualScrollPaddingBefore.value + 'px',
                '--item-height-after': virtualScrollPaddingAfter.value + 'px',
                '--dl-virtual-scroll-item-height':
                    props.virtualScrollItemSize + 'px'
            }
        })

        const attributes = computed(() =>
            props.scrollTarget !== void 0 ? {} : { tabindex: 0 }
        )

        const hasBeforeSlot = computed(() => !!slots['before'])
        const hasAfterSlot = computed(() => !!slots['after'])

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
            return (
                (rootRef.value && (rootRef.value as any).$el) || rootRef.value
            )
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

        return {
            uuid: `dl-virtual-scroll-${v4()}`,
            rootRef,
            beforeRef,
            afterRef,
            contentRef,
            virtualScrollScope,
            virtualScrollPaddingBefore,
            virtualScrollPaddingAfter,
            attributes,
            classes,
            hasBeforeSlot,
            hasAfterSlot,
            colspanAttr,
            cssVars
        }
    }
})
</script>
<style scoped lang="scss">
@import '../../compound/DlTable/styles/dl-table-styles.scss';
.dl-virtual-scroll {
    &:focus {
        outline: 0;
    }
    &__content {
        outline: none;
        contain: content;

        > * {
            overflow-anchor: none;
        }
        > [data-dl-vs-anchor] {
            overflow-anchor: auto;
        }
    }
    &__before {
        height: var(--item-height-before);
    }

    &__after {
        height: var(--item-height-after);
    }
    &__padding {
        background: repeating-linear-gradient(
            rgba(128, 128, 128, 0.03),
            rgba(128, 128, 128, 0.08) var(--dl-virtual-scroll-item-height, 50px)
        );

        .dl-table & {
            tr {
                height: 0 !important;
            }
            td {
                padding: 0 !important;
            }
        }
    }
}
</style>
