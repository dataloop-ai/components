<template>
    <th
        ref="tableTh"
        :style="headerStyle"
        :class="thClasses"
        :data-col-index="colIndex"
        @click="onClick"
    >
        <dl-icon
            v-if="isSortable && align === 'right'"
            :class="iconClass"
            icon="icon-dl-arrow-up"
        />
        <dl-tooltip v-if="hasEllipsis">
            <slot />
        </dl-tooltip>
        <slot />
        <span
            class="th-icons"
            :style="{ top: props?.dense ? '5px' : '10px' }"
        >
            <dl-icon
                v-if="hasHint"
                icon="icon-dl-info"
                size="10px"
                style="max-width: 30%"
            >
                <dl-tooltip>
                    {{ props.col.hint }}
                </dl-tooltip>
            </dl-icon>
            <dl-icon
                v-if="isSortable && ['left', 'center'].includes(align)"
                style="margin-top: 2px"
                :class="iconClass"
                icon="icon-dl-arrow-up"
            />
        </span>
    </th>
</template>

<script lang="ts">
import { isString } from 'lodash'
import {
    defineComponent,
    getCurrentInstance,
    computed,
    ref,
    toRefs
} from 'vue-demi'
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
        }
    },
    emits: ['click'],

    setup(props, { emit, attrs }) {
        const vm = getCurrentInstance()
        const tableTh = ref(null)

        const { hasEllipsis } = useSizeObserver(tableTh)

        const onClickFn = (event: Event, name: string) => {
            emit('click', event, name)
        }

        const hasOptionalProps = computed(() => {
            return !!Object.keys(props.props ?? {})
        })

        const hasHint = computed(() => {
            return !!props.props?.col?.hint
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
                headerStyle: '',
                thClasses: '',
                isSortable: false,
                hasEllipsis: false,
                onClick: onClickFn,
                hasHint
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
            if (column.value.sortable) {
                const sort = props.props?.sort as Function
                sort(column.value)
            }
            onClickFn(evt, column.value.name)
        }

        const onClick = !hasOptionalProps.value ? onClickFn : handleClick

        return {
            hasHint,
            isSortable: !hasOptionalProps.value
                ? false
                : column?.value?.sortable ?? false,
            thClasses: ((attrs.class ?? '') + ' ' + thClasses.value).trim(),
            align: column?.value?.align ?? 'left',
            iconClass: column?.value?.iconClass ?? null,
            hasOptionalProps,
            headerStyle: [
                isString(attrs.style)
                    ? stringStyleToRecord(attrs.style)
                    : attrs.style,
                stringStyleToRecord(column.value.headerStyle ?? '')
            ] as any,
            tableTh,
            hasEllipsis,
            onClick,
            column
        }
    }
})
</script>

<style scoped src="../styles/dl-table-styles.scss" lang="scss" />
