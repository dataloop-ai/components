<template>
    <th
        ref="tableTh"
        :style="headerStyle"
        :class="thClasses"
        :data-col-index="colIndex"
        @click="onClick"
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
            <dl-tooltip v-if="hasEllipsis">
                <slot />
            </dl-tooltip>
            <slot />
            <span class="th-icons">
                <dl-icon
                    v-if="hasHint"
                    icon="icon-dl-info"
                    size="10px"
                    style="max-width: 30%; margin-top: 1px"
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
import { useSizeObserver } from '../../../../hooks/use-size-observer'
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

        const { hasEllipsis } = useSizeObserver(tableTh)

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
                headerStyle:
                    vm.vnode.key === 'visibleColumnsSlot'
                        ? [{ position: 'sticky', right: 0, zIndex: 101 }]
                        : null,
                thClasses: null,
                isSortable: false,
                hasEllipsis: false,
                onClick: onClickFn as any as (payload: MouseEvent) => void,
                hasHint,
                isDense,
                computedSortIcon: ''
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

        const onClick: (payload: MouseEvent) => void = !hasOptionalProps.value
            ? (onClickFn as any as (payload: MouseEvent) => void)
            : (handleClick as any as (payload: MouseEvent) => void)

        return {
            hasHint,
            isDense,
            isResizingInProgress,
            isSortable: !hasOptionalProps.value
                ? false
                : column?.value?.sortable ?? false,
            thClasses: ((attrs.class ?? '') + ' ' + thClasses.value).trim(),
            align: column?.value?.align ?? 'left',
            iconClass: column?.value?.iconClass ?? null,
            hasOptionalProps,
            headerStyle: [
                {
                    padding: props.padding
                },
                isString(attrs.style)
                    ? stringStyleToRecord(attrs.style)
                    : attrs.style,
                stringStyleToRecord(column.value.headerStyle ?? '')
            ] as any,
            tableTh,
            hasEllipsis,
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
