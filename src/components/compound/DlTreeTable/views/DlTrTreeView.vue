<template>
    <DlTrTree
        :class="rowClass"
        :no-hover="noHover"
        :children="childrenCount"
        :props="{ row }"
        @click="emitRowClick($event, row, rowIndex)"
        @dblclick="onTrDoubleClick($event, row, rowIndex)"
        @contextmenu="onTrContextMenu($event, row, rowIndex)"
        @mouseenter="isDragIconVisible = true"
        @mouseleave="isDragIconVisible = false"
    >
        <td
            v-if="hasDraggableRows"
            :style="`width: 25px; opacity: ${isDragIconVisible ? '1' : '0'}`"
        >
            <dl-icon
                class="draggable-icon"
                icon="icon-dl-drag"
                size="12px"
            />
        </td>
        <td
            v-if="hasSelectionMode"
            style="width: 30px"
        >
            <slot
                name="body-selection"
                v-bind="bindBodySelection"
            >
                <DlCheckbox
                    :color="color"
                    :model-value="modelValue"
                    :false-value="false"
                    :true-value="true"
                    @update:model-value="
                        (adding, evt) => emitUpdateModelValue(adding, evt)
                    "
                />
            </slot>
        </td>
        <td
            v-if="!indentedChevron"
            class="chevron-icon"
        >
            <DlIcon
                v-if="(row.children || []).length > 0"
                :icon="`icon-dl-${row.isExpanded ? 'down' : 'right'}-chevron`"
                @click.stop.prevent="emitUpdateExpandedRow"
            />
        </td>
        <DlTdTree
            v-for="(col, colIndex) in computedCols"
            :key="colIndex"
            :class="col.tdClass(row)"
            :style="
                col.tdStyle(row) +
                    `padding-left: ${
                        setTrPadding(
                            level,
                            (row.children || []).length > 0,
                            colIndex
                        ) + 1
                    }px;`
            "
            :col-index="colIndex"
        >
            <template v-if="indentedChevron">
                <div style="display: flex; width: 100%; align-items: center">
                    <div class="chevron-icon">
                        <DlIcon
                            v-if="
                                (row.children || []).length > 0 &&
                                    colIndex === 0
                            "
                            :icon="`icon-dl-${
                                row.isExpanded ? 'down' : 'right'
                            }-chevron`"
                            @click.stop.prevent="emitUpdateExpandedRow"
                        />
                    </div>
                    <slot
                        v-bind="bindBodyCellScope(col)"
                        :name="getSlotByName(col.name)"
                    >
                        {{ getCellValue(col, row) }}
                    </slot>
                </div>
            </template>
            <template v-else>
                <slot
                    v-bind="bindBodyCellScope(col)"
                    :name="getSlotByName(col.name)"
                >
                    {{ getCellValue(col, row) }}
                </slot>
            </template>
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
    watch,
    getCurrentInstance
} from 'vue-demi'
import DlTrTree from '../components/DlTrTree.vue'
import DlTdTree from '../components/DlTdTree.vue'
import DlIcon from '../../../essential/DlIcon/DlIcon.vue'
import DlCheckbox from '../../../essential/DlCheckbox/DlCheckbox.vue'
import { getRowKey } from '../utils/getRowKey'
import { DlTableRow } from '../../DlTable/types'
import { setTrPadding } from '../utils/trSpacing'
import { getCellValue } from '../../DlTable/utils/getCellValue'

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
        },
        indentedChevron: {
            type: Boolean,
            default: false
        }
    },
    emits: [
        'rowClick',
        'rowDoubleClick',
        'rowContextMenu',
        'update:model-value',
        'updateExpandedRow'
    ],
    setup(props, { emit, slots }) {
        const visibleChildren = ref(0)
        const childrenCount = ref(0)
        const { row } = toRefs(props)
        const isDragIconVisible = ref(false)

        const vm = getCurrentInstance()

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

        const emitRowClick = (
            event: MouseEvent,
            row: Record<string, any>,
            rowIndex: number
        ) => {
            emit('rowClick', event, row, rowIndex)
        }

        const onTrDoubleClick = (
            evt: MouseEvent,
            row: DlTableRow,
            rowIndex: number
        ) => {
            emit('rowDoubleClick', evt, row, rowIndex)
        }

        const onTrContextMenu = (
            evt: MouseEvent,
            row: DlTableRow,
            rowIndex: number
        ) => {
            emit('rowContextMenu', evt, row, rowIndex)
        }

        const emitUpdateModelValue = (adding: boolean, evt: Event) => {
            emit('update:model-value', adding, evt)
        }

        const getTdStyles = (row: any, colIndex: number) => {
            let styles = ''
            if (colIndex === 0) {
                styles = 'max-width: 100px; box-sizing: border-box;'
            }

            return styles
        }
        const emitUpdateExpandedRow = () => {
            emit('updateExpandedRow')
        }

        const hasSlotByName = (name: string) => !!slots[name]

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

            return 'dl-tr'
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
            isDragIconVisible,
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

<style scoped lang="scss">
@import '../../DlTable/styles/dl-table-styles.scss';
.chevron-icon {
    cursor: pointer;
    width: 25px;
    padding: 5px;
}
</style>
