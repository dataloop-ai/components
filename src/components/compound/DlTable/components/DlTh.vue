<template>
    <th
        :style="headerStyle"
        :class="thClasses"
        @click="onClick"
    >
        <div
            ref="tableTh"
            class="dl-table-cell-inner-div"
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
            <dl-icon
                v-if="isSortable && ['left', 'center'].includes(align)"
                :class="iconClass"
                icon="icon-dl-arrow-up"
            />
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
        autoWidth: Boolean
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

        if (!column.value) {
            return {
                headerStyle: '',
                thClasses: '',
                isSortable: false,
                hasEllipsis: false,
                onClick: onClickFn
            }
        }

        const thClasses = computed(() => {
            let className = ''

            if (props.autoWidth) {
                className = 'dl-table--col-auto-width'
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
            isSortable: !hasOptionalProps.value
                ? false
                : column?.value?.sortable ?? false,
            thClasses: (attrs.class ?? '') + ' ' + thClasses.value,
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
