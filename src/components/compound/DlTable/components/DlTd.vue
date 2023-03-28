<template>
    <td
        :class="classes"
        :style="styles"
    >
        <div
            ref="tableTd"
            class="dl-table-cell-inner-div"
        >
            <dl-tooltip v-if="hasEllipsis">
                <slot />
            </dl-tooltip>
            <slot />
        </div>
    </td>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, computed, ref } from 'vue-demi'
import { getColor } from '../../../../utils'
import { DlTooltip } from '../../../essential'
import { useSizeObserver } from '../../../../hooks/use-size-observer'

export default defineComponent({
    name: 'DlTd',
    components: {
        DlTooltip
    },
    props: {
        props: { type: Object, default: () => {} },
        autoWidth: Boolean,
        noHover: Boolean,
        bgColor: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const vm = getCurrentInstance()

        const tableTd = ref(null)

        const { hasEllipsis } = useSizeObserver(tableTd)

        const hasOptionalProps = computed(() => {
            return props.props !== void 0
        })

        const tdClasses = computed(() => {
            let classNames = 'dl-td'

            if (props.autoWidth) {
                classNames = classNames.concat(' dl-table--col-auto-width')
            }

            if (props.noHover) {
                classNames = classNames.concat(' dl-td--no-hover')
            }

            return classNames
        })

        const tdStyles = computed(() => {
            let styles = ''

            if (props.bgColor) {
                styles = styles.concat(
                    `background: ${getColor(props.bgColor, '')}`
                )
            }
            return styles
        })

        const column = computed(() => {
            const name = vm.vnode.key as string

            return (
                (props.props.colsMap !== void 0
                    ? props.props.colsMap[name]
                    : null) || props.props.col
            )
        })

        if (!hasOptionalProps.value) {
            return {
                classes: tdClasses,
                styles: tdStyles,
                tableTd,
                hasEllipsis
            }
        }

        if (column.value === void 0) {
            return
        }

        const { row } = props.props

        return {
            classes: tdClasses.value + column.value.tdClass(row),
            styles: tdStyles.value + column.value.tdStyle(row),
            tableTd,
            hasEllipsis
        }
    }
})
</script>

<style scoped src="./dl-table-styles.scss" lang="scss" />
