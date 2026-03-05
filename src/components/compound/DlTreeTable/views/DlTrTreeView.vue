<template>
    <DlTrTree
        :class="rowClass()"
        :no-hover="noHover"
        :children="childrenCount"
        :props="{ row }"
        @click="emitRowClick($event, row, rowIndex)"
        @dblclick="onTrDoubleClick($event, row, rowIndex)"
        @contextmenu="onTrContextMenu($event, row, rowIndex)"
        @mouseenter="onRowHoverStart($event, row, rowIndex)"
        @mouseleave="onRowHoverEnd($event, row, rowIndex)"
    >
        <td
            :style="`opacity: ${
                isDragIconVisible || isRowHighlighted ? '1' : '0'
            }`"
            class="dl-draggable-container"
        >
            <dl-icon
                v-if="hasDraggableRows && !row.disableDraggable"
                class="draggable-icon"
                icon="icon-dl-drag"
                size="12px"
                :color="
                    isDragIconHovered ? 'dl-color-darker' : 'dl-color-lighter'
                "
                @mouseenter.native="isDragIconHovered = true"
                @mouseleave.native="isDragIconHovered = false"
            />
        </td>
        <td v-if="hasSelectionMode" class="dl-table--col-auto-width">
            <slot name="body-selection" v-bind="bindBodySelection">
                <dl-tooltip
                    v-if="isCheckboxDisabled && childDisabledCheckboxTooltip"
                >
                    {{ childDisabledCheckboxTooltip }}
                </dl-tooltip>
                <DlCheckbox
                    v-if="!row.hideCheckbox"
                    :disabled="isCheckboxDisabled || !row.isSelectable"
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
        <td
            class="chevron-icon-container"
            :class="{ 'no-children': (row.children || []).length === 0 }"
        >
            <div
                class="chevron-icon"
                :class="{ 'no-children': (row.children || []).length === 0 }"
            >
                <DlIcon
                    v-if="(row.children || []).length > 0"
                    :icon="`${
                        row.isExpanded
                            ? customIconExpandedRow
                            : customIconCompressedRow
                    }`"
                    :style="`color: ${chevronIconColor};`"
                    @click.stop.prevent="emitUpdateExpandedRow"
                />
            </div>
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
            :tooltip="tooltip"
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
    watch,
    getCurrentInstance,
    computed
} from 'vue-demi'
import DlTrTree from '../components/DlTrTree.vue'
import DlTdTree from '../components/DlTdTree.vue'
import DlIcon from '../../../essential/DlIcon/DlIcon.vue'
import DlCheckbox from '../../../essential/DlCheckbox/DlCheckbox.vue'
import DlTooltip from '../../../shared/DlTooltip/DlTooltip.vue'
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
        DlCheckbox,
        DlTooltip
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
        tooltip: {
            type: String,
            default: null
        },
        /**
         * Custom icon class to use for expanded rows.
         */
        customIconExpandedRow: {
            type: String,
            default: 'icon-dl-down-chevron'
        },
        /**
         * Custom icon class to use for compressed (collapsed) rows.
         */
        customIconCompressedRow: {
            type: String,
            default: 'icon-dl-right-chevron'
        },
        /**
         * color of the chevron icon
         */
        chevronIconColor: {
            type: String,
            default: ''
        },
        isRowHighlighted: {
            type: Boolean,
            default: false
        },
        /**
         * Disable child checkbox when parent is selected
         */
        disableChildCheckbox: {
            type: Boolean,
            default: false
        },
        /**
         * Tooltip text for disabled child checkbox
         */
        childDisabledCheckboxTooltip: {
            type: String,
            default: 'Cannot unselect child when parent is selected'
        },
        /**
         * Whether the parent row is selected
         */
        parentSelected: {
            type: Boolean,
            default: false
        }
    },
    emits: [
        'rowClick',
        'rowDoubleClick',
        'rowContextMenu',
        'update:model-value',
        'updateExpandedRow',
        'rowHoverStart',
        'rowHoverEnd'
    ],
    setup(props, { emit, slots }) {
        const visibleChildren = ref(0)
        const childrenCount = ref(0)
        const { row } = toRefs(props)
        const isDragIconVisible = ref(false)
        const isDragIconHovered = ref(false)
        const vm = getCurrentInstance()

        const isCheckboxDisabled = computed(() => {
            if (!props.disableChildCheckbox) {
                return false
            }

            if (props.level === 1) {
                return false
            }

            return props.parentSelected
        })

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

        const onRowHoverStart = (
            event: MouseEvent,
            row: Record<string, any>,
            rowIndex: number
        ) => {
            isDragIconVisible.value = true
            emit('rowHoverStart', event, row, rowIndex)
        }

        const onRowHoverEnd = (
            event: MouseEvent,
            row: Record<string, any>,
            rowIndex: number
        ) => {
            isDragIconVisible.value = false
            emit('rowHoverEnd', event, row, rowIndex)
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
            if (props.isRowHighlighted) {
                return 'highlighted'
            }
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
            isDragIconHovered,
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
            updateExpandedvisibleChildren,
            onRowHoverStart,
            onRowHoverEnd,
            isCheckboxDisabled
        }
    }
})
</script>

<style scoped lang="scss">
@import '../../DlTable/styles/dl-table-styles.scss';
.chevron-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 5px;
    height: 100%;

    &.no-children {
        cursor: default;
    }
}
.chevron-icon-container {
    cursor: pointer;
    width: 25px;

    &.no-children {
        cursor: default;
    }
}
.dl-draggable-container {
    width: 25px;
}
</style>
