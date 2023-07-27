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
import { DlTooltip } from '../../../shared'
import { useSizeObserver } from '../../../../hooks/use-size-observer'
import { DlTransformOptions } from '../../../shared/types'

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
        transform: {
            type: String,
            default: 'default',
            validator: (value: string): boolean =>
                DlTransformOptions.includes(value)
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

        const letterClass = computed(() => {
            if (props.transform === 'default') {
                return 'first-letter-capitalized'
            }
            return null
        })

        const tdStyles = computed(() => {
            const styles: Record<string, string | number> = {
                background: props.bgColor ? getColor(props.bgColor, '') : null,
                textTransform: letterClass.value ? null : props.transform
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

        if (!hasOptionalProps.value) {
            return {
                classes: tdClasses,
                styles: tdStyles,
                tableTd,
                hasEllipsis
            }
        }

        if (!column.value) {
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

<style scoped src="../styles/dl-table-styles.scss" lang="scss" />
