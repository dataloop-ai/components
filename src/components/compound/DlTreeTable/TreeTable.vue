<template>
    <DlTable
        ref="table"
        :selected="selected"
        :separator="separator"
        :columns="tableColumns"
        :bordered="bordered"
        :draggable="draggable"
        :pagination="pagination"
        :dense="dense"
        class="sticky-header"
        :filter="filter"
        :selection="selection"
        :loading="loading"
        :rows="tableRows"
        :resizable="resizable"
        row-key="name"
        color="dl-color-secondary"
        title="Table Title"
        :virtual-scroll="vScroll"
        style="height: 500px"
        :rows-per-page-options="rowsPerPageOptions"
        hide-bottom
        @row-click="log"
        @update:selected="updateSeleted"
    >
        <template #body-selection="props">
            <DlCheckbox
                style="padding-left: 10px"
                :color="color"
                :model-value="
                    $refs.table.isRowSelected(rowKey, getRowKey(props.item))
                "
                :indeterminate-value="true"
                :false-value="false"
                :true-value="true"
                @update:model-value="
                    (adding, evt) =>
                        updateSelectionHierarchy(adding, evt, props.item)
                "
            />
        </template>

        <template #body>
            <DlTrTreeView
                :row="row"
                :is-row-selected="isRowSelected(rowKey, getRowKey(row))"
                :has-any-action="hasAnyAction"
                :no-hover="noHover"
                :page-index="pageIndex"
                :has-draggable-rows="hasDraggableRows"
                :has-selection-mode="hasSelectionMode"
                :bind-body-selection="
                    getBodySelectionScope({
                        key: getRowKey(row),
                        row,
                        pageIndex
                    })
                "
                :bind-body-cell-scope="
                    getBodyCellScope({
                        key: getRowKey(row),
                        row,
                        pageIndex,
                        col
                    })
                "
                :color="color"
                :computed-cols="computedCols"
                :model-value="isRowSelected(rowKey, getRowKey(row))"
                :slot-name="slotNames"
                :computed-rows="computedRows"
                @update:model-value="
                    (adding, evt) => updateSelectionHierarchy(adding, evt, row)
                "
                @rowClick="onTrClick"
                @rowDoubleClick="onTrDblClick"
                @rowContextMenu="onTrContextMenu"
                @updateExpandedRow="
                    updateExpandedRow(!row.expanded, getRowKey(row))
                "
            />
        </template>
    </DlTable>
</template>

<script>
/**
 * The desired behavior is as above. we want a component that uses the slots of dl-table to generate the custom view of dl-tree-table
 * please move the logic needed to slots instead of cloning all the code of dl-table
 *
 * i gave a short demo above
 * you get all the information passed to the slots by the dltable
 *
 * if you want to use any code from the dltable you can wrap it with a ref and call functions that use the ref and return values based on that
 * if we want to have custom behavior we should allow doing that with a custom behavior
 *
 */
export default {}
</script>

<style></style>
