<template>
    <th
        ref="tableTh"
        :style="headerStyle"
        :class="thClasses"
        :data-col-index="colIndex"
        :aria-sort="ariaSort"
        :tabindex="isSortable ? 0 : undefined"
        @click="onClick"
        @keydown="onKeydown"
        @pointerenter="onPointerEnter"
        @mouseenter="iconHover = true"
        @mouseleave="iconHover = false"
    >
        <div class="inner-th-wrapper">
            <span v-if="isSortable && align === 'right'" class="th-sort-icon">
                <dl-icon
                    :class="iconClass"
                    :icon="computedSortIcon"
                    size="16px"
                    :style="
                        !isCurrentlySorted && !iconHover
                            ? 'opacity: 0 !important;'
                            : ''
                    "
                />
            </span>
            <dl-tooltip v-if="sortDisabledReason">
                {{ sortDisabledReason }}
            </dl-tooltip>
            <dl-tooltip v-else-if="hasEllipsis">
                <slot />
            </dl-tooltip>
            <slot />
            <span class="th-icons">
                <dl-icon
                    v-if="hasHint"
                    icon="icon-dl-info"
                    size="10px"
                    style="max-width: 30%; margin-top: 1px; margin-left: 4px"
                >
                    <dl-tooltip>
                        {{ props.col.hint }}
                    </dl-tooltip>
                </dl-icon>
                <dl-icon
                    v-if="isSortable && ['left', 'center'].includes(align)"
                    :class="iconClass"
                    :icon="computedSortIcon"
                    size="16px"
                    :style="
                        !isCurrentlySorted && !iconHover
                            ? 'opacity: 0 !important;'
                            : ''
                    "
                />
            </span>
        </div>
    </th>
</template>

<script lang="ts">
import { isString } from 'lodash'
import { defineComponent, getCurrentInstance, computed, ref } from 'vue-demi'
import { useLazyEllipsis } from '../../../../hooks/use-lazy-ellipsis'
import { stringStyleToRecord } from '../../../../utils'
import { DlIcon } from '../../../essential'
import { DlTooltip } from '../../../shared'

export default defineComponent({
    name: 'DlTh',
    components: {
        DlIcon,
        DlTooltip
    },
    props: {
        props: { type: Object, default: null },
        autoWidth: Boolean,
        colIndex: {
            type: Number,
            default: null
        },
        pagination: {
            type: Object,
            default: () => ({})
        },
        padding: {
            type: String,
            default: '0 10px'
        }
    },
    emits: ['click'],

    setup(props, { emit, attrs }) {
        const vm = getCurrentInstance()
        const tableTh = ref(null)
        const iconHover = ref(false)

        const { hasEllipsis, onPointerEnter } = useLazyEllipsis(tableTh)

        const onClickFn = (event: Event, name: string) => {
            emit('click', event, name)
        }

        const isCurrentlySorted = computed(() => {
            return props.props?.col?.name === props.pagination.sortBy
        })

        const computedSortIcon = computed<string>(() => {
            return props.pagination.descending
                ? 'icon-dl-arrow-down'
                : 'icon-dl-arrow-up'
        })

        const hasOptionalProps = computed(() => {
            return !!Object.keys(props.props ?? {})
        })

        const hasHint = computed(() => {
            return !!props.props?.col?.hint
        })

        const isDense = computed(() => {
            // @ts-ignore
            return !!props.props?.dense || !!props.props?.col?.dense
        })

        const isResizingInProgress = computed(() => {
            return !!props.props?.isResizingInProgress
        })

        const column = computed(() => {
            let col: any
            const name = vm.vnode.key as string
            if (name) {
                col = props.props?.colsMap[name]
            } else {
                col = props?.props?.col
            }

            return col
        })

        const colIndex = computed(() => {
            return props.props?.colIndex ?? props.colIndex
        })

        if (!column.value || colIndex.value === -1) {
            return {
                headerStyle: null,
                thClasses: null,
                isSortable: false,
                ariaSort: undefined,
                onKeydown: () => {},
                sortDisabledReason: null,
                hasEllipsis: false,
                onPointerEnter: () => {},
                onClick: onClickFn,
                hasHint,
                isDense
            }
        }

        const thClasses = computed(() => {
            let className = 'dl-th'

            if (props.autoWidth) {
                className = className.concat(' dl-table--col-auto-width')
            }

            if (column.value.thClass) {
                className = className.concat(' ' + column.value.thClass)
            }

            return className
        })

        const handleClick = (evt: Event) => {
            if (isResizingInProgress.value) {
                return
            }
            if (column.value.sortable) {
                const sort = props.props?.sort as Function
                sort(column.value)
            }
            onClickFn(evt, column.value.name)
        }

        const onClick = !hasOptionalProps.value ? onClickFn : handleClick

        // SORT-04: why a column cannot be sorted (e.g. the data source refuses it)
        const sortDisabledReason = computed(() =>
            !column.value?.sortable && column.value?.sortDisabledReason
                ? column.value.sortDisabledReason
                : null
        )

        // SORT-05: computed, so later changes of the column (thClass carries
        // `sorted`/`sort-desc`, sortable, headerStyle) reach the header
        const isSortable = computed<boolean>(() =>
            !hasOptionalProps.value ? false : !!column.value?.sortable
        )

        const ariaSort = computed(() => {
            if (!isSortable.value) return undefined
            if (!isCurrentlySorted.value) return 'none'
            return props.pagination.descending ? 'descending' : 'ascending'
        })

        // A11Y-02: sortable headers are reachable with the keyboard
        const onKeydown = (evt: KeyboardEvent) => {
            if (!isSortable.value) return
            if (evt.key === 'Enter' || evt.key === ' ') {
                evt.preventDefault()
                handleClick(evt)
            }
        }

        return {
            hasHint,
            isDense,
            isResizingInProgress,
            isSortable,
            ariaSort,
            onKeydown,
            thClasses: computed(() =>
                ((attrs.class ?? '') + ' ' + thClasses.value).trim()
            ),
            align: computed(() => column.value?.align ?? 'left'),
            iconClass: computed(() => column.value?.iconClass ?? null),
            hasOptionalProps,
            headerStyle: computed(
                () =>
                    [
                        {
                            padding: props.padding
                        },
                        isString(attrs.style)
                            ? stringStyleToRecord(attrs.style)
                            : attrs.style,
                        stringStyleToRecord(column.value?.headerStyle ?? '')
                    ] as any
            ),
            tableTh,
            hasEllipsis,
            sortDisabledReason,
            onPointerEnter,
            onClick,
            column,
            computedSortIcon,
            isCurrentlySorted,
            iconHover
        }
    }
})
</script>

<style scoped src="../styles/dl-table-styles.scss" lang="scss" />
