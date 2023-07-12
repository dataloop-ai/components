<template>
    <DlTrTree
        v-show="row.isExpandedParent || row.level === 1"
        :key="getRowKey(row)"
        :class="
            isRowSelected ? 'selected' : hasAnyAction ? ' cursor-pointer' : ''
        "
        :no-hover="noHover"
        @click="emitRowClick($event, row, pageIndex)"
        @dblclick="onTrDoubleClick($event, row, pageIndex)"
        @contextmenu="onTrContextMenu($event, row, pageIndex)"
    >
        <td v-if="hasDraggableRows">
            <dl-icon
                class="draggable-icon"
                icon="icon-dl-drag"
                size="12px"
            />
        </td>
        <td
            v-if="hasSelectionMode"
            class="dl-table--col-auto-with"
        >
            <slot
                name="body-selection"
                v-bind="bindBodySelection"
            >
                <DlCheckbox
                    style="padding-left: 10px"
                    :color="color"
                    :model-value="modelValue"
                    :indeterminate-value="true"
                    :false-value="false"
                    :true-value="true"
                    @update:model-value="
                        (adding, evt) => emitUpdateModelValue(adding, evt)
                    "
                />
            </slot>
        </td>
        <slot
            v-for="(col, colIndex) in computedCols"
            v-bind="bindBodyCellScope"
            :name="
                hasSlotByName(`body-cell-${col.name}`)
                    ? `body-cell-${col.name}`
                    : 'body-cell'
            "
        >
            <DlTdTree
                :class="col.tdClass(row)"
                :style="col.tdStyle(row) + getTdStyles(row, colIndex)"
            >
                <template #icon="{}">
                    <DlIcon
                        v-if="(row.children || []).length > 0 && colIndex === 0"
                        :icon="`icon-dl-${
                            row.expanded ? 'down' : 'right'
                        }-chevron`"
                        @click="emitUpdateExpandedRow"
                    />
                </template>
                {{ getCellValue(col, row) }}
            </DlTdTree>
        </slot>
    </DlTrTree>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, PropType } from 'vue-demi'
import DlTrTree from '../components/DlTrTree.vue'
import DlTdTree from '../components/DlTdTree.vue'
import DlIcon from '../../../essential/DlIcon/DlIcon.vue'
import DlCheckbox from '../../../essential/DlCheckbox/DlCheckbox.vue'
import { getRowKey } from '../utils/getRowKey'
import { useTreeTableRowSelection } from '../utils/treeTableRowSelection'
import { DlTableProps, DlTableRow } from '../../DlTable/types'
import { RecordStringAny } from '../types'
import { injectProp } from '../../../../utils/inject-object-prop'
import { setTrSpacing } from '../utils/trSpacing'

export default defineComponent({
    name: 'DlTrTreeView',
    components: {
        DlTrTree,
        DlTdTree,
        DlIcon,
        DlCheckbox
    },
    props: {
        row: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        },
        isRowSelected: {
            type: Boolean,
            default: false
        },
        hasAnyAction: {
            type: Boolean,
            defalut: false
        },
        noHover: {
            type: Boolean,
            default: false
        },
        pageIndex: {
            type: Number,
            default: null
        },
        hasDraggableRows: {
            type: Boolean,
            default: false
        },
        hasSelectionMode: {
            type: Boolean,
            default: false
        },
        bindBodySelection: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        },
        bindBodyCellScope: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        },
        color: {
            type: String,
            default: null
        },
        computedCols: {
            type: Array,
            default: () => [] as Record<string, any>[]
        },
        modelValue: {
            type: String,
            default: null
        },
        slotName: {
            type: String,
            default: null
        },
        computedRows: {
            type: Object as PropType<Record<string, any>>, //DlTableRow[]
            default: () => ({})
        },
        cellValue: {
            type: String,
            default: null
        },
        slotsProps: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        }
    },
    emit: [
        'rowClick',
        'rowDblClick',
        'rowContextMenu',
        'update:model-value',
        'updateExpandedRow'
    ],
    setup(props, context) {
        const emitRowClick = (
            event: MouseEvent,
            row: RecordStringAny,
            pageIndex: number
        ) => {
            context.emit('rowClick', event, row, pageIndex)
        }

        const onTrDoubleClick = (
            evt: MouseEvent,
            row: DlTableRow,
            pageIndex: number
        ) => {
            context.emit('rowDoubleClick', evt, row, pageIndex)
        }

        const onTrContextMenu = (
            evt: MouseEvent,
            row: DlTableRow,
            pageIndex: number
        ) => {
            context.emit('rowContextMenu', evt, row, pageIndex)
        }

        const emitUpdateModelValue = (adding: boolean, evt: Event) => {
            context.emit('update:model-value', adding, evt)
        }

        const getTdStyles = (
            row: (typeof props.computedRows)[number],
            colIndex: number
        ) => {
            let styles = ''
            if (colIndex === 0) {
                styles = 'max-width: 100px; box-sizing: border-box;'
                styles =
                    styles +
                    setTrSpacing({
                        ...row,
                        colIndex
                    })
            }

            return styles
        }
        const emitUpdateExpandedRow = () => {
            context.emit('updateExpandedRow')
        }
        const getCellValue = (col: RecordStringAny, row: RecordStringAny) => {
            const val =
                typeof col.field === 'function'
                    ? col.field(row)
                    : row[col.field]
            return col.format !== void 0 ? col.format(val, row) : val
        }

        const hasSlotByName = (name: string) => {
            if (!Object.values(props.slotsProps)?.length) {
                return false
            }

            const slotName = props.slotsProps.filter(
                (propName: string) => propName === name
            )

            return !!slotName
        }

        return {
            getRowKey,
            emitRowClick,
            onTrDoubleClick,
            onTrContextMenu,
            emitUpdateModelValue,
            getTdStyles,
            emitUpdateExpandedRow,
            getCellValue,
            hasSlotByName
        }
    }
})
</script>

<style scoped src="../../DlTable/styles/dl-table-styles.scss" lang="scss" />
