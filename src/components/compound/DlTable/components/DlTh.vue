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
import { defineComponent, getCurrentInstance, computed, ref } from 'vue-demi'
import { useSizeObserver } from '../../../../hooks/use-size-observer'
import { DlIcon, DlTooltip } from '../../../essential'

export default defineComponent({
    name: 'DlTh',
    components: {
        DlIcon,
        DlTooltip
    },
    props: {
        props: { type: Object, default: () => {} },
        autoWidth: Boolean
    },
    emits: ['click'],

    setup(props, { emit }) {
        const vm = getCurrentInstance()
        const tableTh = ref(null)

        const { hasEllipsis } = useSizeObserver(tableTh)

        const onClickFn = (event: Event) => {
            emit('click', event)
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
            onClickFn(evt)
        }

        const onClick = !hasOptionalProps.value ? onClickFn : handleClick

        const state = {
            isSortable: !hasOptionalProps.value
                ? false
                : column?.value?.sortable ?? false,
            thClasses,
            align: column?.value?.align ?? 'left',
            iconClass: column?.value?.iconClass ?? null,
            hasOptionalProps,
            headerStyle: column.value.headerStyle ?? '',
            tableTh,
            hasEllipsis,
            onClick
        }

        return state
    }
})
</script>

<style scoped src="../styles/dl-table-styles.scss" lang="scss" />
