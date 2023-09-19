<template>
    <!-- v-show="row.isExpandedParent || row.level === 1" -->

    <DlTrTree
        :class="rowClass"
        :no-hover="noHover"
        :children="childrenCount"
        :props="{ row }"
        @click="emitRowClick($event, row, rowIndex)"
        @dblclick="onTrDoubleClick($event, row, rowIndex)"
        @contextmenu="onTrContextMenu($event, row, rowIndex)"
    >
        <td
            v-if="hasDraggableRows"
            style="width: 25px"
        >
            <dl-icon
                class="draggable-icon"
                icon="icon-dl-drag"
                size="12px"
            />
        </td>
        <td style="width: 12px">
            <DlIcon
                v-if="(row.children || []).length > 0"
                style="margin-right: 5px"
                :icon="`icon-dl-${row.isExpanded ? 'down' : 'right'}-chevron`"
                @click="emitUpdateExpandedRow"
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
        <DlTdTree
            v-for="(col, colIndex) in computedCols"
            :key="colIndex"
            :class="col.tdClass(row)"
            :style="
                col.tdStyle(row) +
                    `padding-left: ${setTrPadding(
                        level,
                        (row.children || []).length > 0,
                        colIndex
                    )}px;`
            "
        >
            <template v-if="!hasSlotByName(`body-cell-${col.name}`)">
                {{ getCellValue(col, row) }}
            </template>
            <span v-else>
                <slot
                    v-bind="bindBodyCellScope(col)"
                    :name="getSlotByName(col.name)"
                />
            </span>
        </DlTdTree>
    </DlTrTree>
</template>

<script lang="ts">
import {
    defineComponent,
    PropType,
    onMounted,
    ref,
    toRefs,
    watch
} from 'vue-demi'
import DlTrTree from '../components/DlTrTree.vue'
import DlTdTree from '../components/DlTdTree.vue'
import DlIcon from '../../../essential/DlIcon/DlIcon.vue'
import DlCheckbox from '../../../essential/DlCheckbox/DlCheckbox.vue'
import { getRowKey } from '../utils/getRowKey'
import { DlTableRow } from '../../DlTable/types'
import { setTrSpacing, setTrPadding } from '../utils/trSpacing'

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
            default: () => ({} as Record<string, any>)
        },
        rowKey: {
            type: [String, Function]
        },
        isRowSelected: {
            type: [Boolean, String],
            default: null
        },
        hasAnyAction: {
            type: Boolean,
            default: false
        },
        noHover: {
            type: Boolean,
            default: false
        },
        level: {
            type: Number,
            default: 1
        },
        rowIndex: {
            type: Number,
            required: true
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
            type: Function,
            default: () => {}
        },
        color: {
            type: String,
            default: null
        },
        computedCols: {
            type: Array as PropType<Record<string, any>[]>,
            default: () => [] as Record<string, any>[]
        },
        modelValue: {
            type: [String, Boolean],
            default: null
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
        const visibleChildren = ref(0)
        const childrenCount = ref(0)
        const { row } = toRefs(props)

        watch(
            row,
            () => {
                getChildrenCount()
            },
            {
                deep: true,
                flush: 'post'
            }
        )

        // console.log({ row: row.value.name, level: props.level })

        const emitRowClick = (
            event: MouseEvent,
            row: Record<string, any>,
            rowIndex: number
        ) => {
            context.emit('rowClick', event, row, rowIndex)
        }

        const onTrDoubleClick = (
            evt: MouseEvent,
            row: DlTableRow,
            rowIndex: number
        ) => {
            context.emit('rowDoubleClick', evt, row, rowIndex)
        }

        const onTrContextMenu = (
            evt: MouseEvent,
            row: DlTableRow,
            rowIndex: number
        ) => {
            context.emit('rowContextMenu', evt, row, rowIndex)
        }

        const emitUpdateModelValue = (adding: boolean, evt: Event) => {
            context.emit('update:model-value', adding, evt)
        }

        const getTdStyles = (row: any, colIndex: number) => {
            let styles = ''
            if (colIndex === 0) {
                styles = 'max-width: 100px; box-sizing: border-box;'
                // styles = styles
                // setTrSpacing({
                //     ...row,
                //     colIndex
                // })
            }

            return styles
        }
        const emitUpdateExpandedRow = () => {
            context.emit('updateExpandedRow')
        }
        const getCellValue = (
            col: Record<string, any>,
            row: Record<string, any>
        ) => {
            if (!col) {
                return
            }
            const val =
                typeof col?.field === 'function'
                    ? col.field(row)
                    : row[col.field]
            return col?.format !== void 0 ? col.format(val, row) : val
        }

        const hasSlotByName = (name: string) => !!context.slots[name]

        const getSlotByName = (name: string) => {
            return hasSlotByName(`body-cell-${name}`)
                ? `body-cell-${name}`
                : 'body-cell'
        }

        const rowClass = (): string => {
            if (props.isRowSelected) {
                return 'selected'
            }
            if (props.hasAnyAction) {
                return ' cursor-pointer'
            }

            return ''
        }

        const getExpandedvisibleChildren = (): void => {
            visibleChildren.value = 1
            updateExpandedvisibleChildren(row.value)
        }

        const updateExpandedvisibleChildren = (
            parentRow: Record<string, any>
        ): void => {
            if (!parentRow) {
                return
            }

            if (!parentRow.expanded) {
                visibleChildren.value = 1
                return
            } else {
                visibleChildren.value += parentRow.children.length
            }

            if (!parentRow?.children) {
                return
            }

            for (const child of parentRow.children) {
                if (child.expanded) {
                    updateExpandedvisibleChildren(child)
                }
            }
        }

        const getChildrenCount = (): void => {
            childrenCount.value = 1
            let arr = []

            if (!Array.isArray(row.value)) {
                arr.push(row.value)
            } else {
                arr = row.value
            }

            getLength(arr)
        }

        const getLength = (data: any) => {
            for (let count = 0; count < data.length; count++) {
                if (data[count]?.children?.length) {
                    childrenCount.value += data[count].children.length
                    getLength(data[count].children)
                }
            }
        }

        onMounted(() => {
            getChildrenCount()
        })

        return {
            visibleChildren,
            childrenCount,
            getRowKey,
            emitRowClick,
            onTrDoubleClick,
            onTrContextMenu,
            emitUpdateModelValue,
            getTdStyles,
            setTrPadding,
            emitUpdateExpandedRow,
            getCellValue,
            hasSlotByName,
            rowClass,
            getSlotByName,
            getExpandedvisibleChildren,
            updateExpandedvisibleChildren
        }
    }
})
</script>

<style scoped src="../../DlTable/styles/dl-table-styles.scss" lang="scss" />
