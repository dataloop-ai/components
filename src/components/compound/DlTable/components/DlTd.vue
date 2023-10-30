<template>
    <td
        ref="tableTd"
        :class="classes"
        :style="styles"
        :data-col-index="colIndex"
    >
        <dl-tooltip v-if="!noTooltip && hasEllipsis">
            <slot />
        </dl-tooltip>
        <slot />
    </td>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, computed, ref } from 'vue-demi'
import { getColor } from '../../../../utils'
import { DlTooltip } from '../../../shared'
import { useSizeObserver } from '../../../../hooks/use-size-observer'

export default defineComponent({
    name: 'DlTd',
    components: {
        DlTooltip
    },
    props: {
        props: { type: Object, default: null },
        autoWidth: Boolean,
        noHover: Boolean,
        bgColor: {
            type: String,
            default: ''
        },
        colIndex: {
            type: Number,
            default: null
        },
        noTooltip: Boolean,
        padding: {
            type: String,
            default: '0 10px'
        }
    },
    setup(props) {
        const vm = getCurrentInstance()

        const tableTd = ref(null)

        const { hasEllipsis } = useSizeObserver(tableTd)

        const hasOptionalProps = computed(() => {
            return !!props.props
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
            let styles = `padding: ${props.padding};`

            if (props.bgColor) {
                styles = styles.concat(
                    `background: ${getColor(props.bgColor, '')}`
                )
            }
            return styles
        })

        const column = computed(() => {
            const name = vm.vnode.key as string

            const colmap = props.props?.colsMap
                ? props.props.colsMap[name]
                : null

            return colmap ?? props.props?.col
        })

        const colIndex = computed(() => {
            return props.props?.colIndex ?? props.colIndex
        })

        if (!hasOptionalProps.value || !column.value || colIndex.value === -1) {
            // return empty if !column if you dont want line.
            return {
                classes: tdClasses,
                styles: tdStyles,
                tableTd,
                hasEllipsis
            }
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

<style scoped src="../styles/dl-table-styles.scss" lang="scss" />
