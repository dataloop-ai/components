import * as VueDemiModule from 'vue-demi'

let renderComponent: (
    component: object | string,
    props: object,
    slots: any
) => void

let renderFunction

const VueDemi: any = VueDemiModule

if (VueDemi.isVue3) {
    renderFunction = VueDemi.h
    renderComponent = function (component, props, slots) {
        return VueDemi.h(component, props, slots)
    }
}

export function removeElement(el: Element) {
    if (typeof el.remove !== 'undefined') {
        el.remove()
    } else {
        el.parentNode?.removeChild(el)
    }
}

export { renderComponent, renderFunction }

// <template>
//     <DlTable
//         ref="dlTableRef"
//         :selected="selectedData"
//         :separator="separator"
//         :columns="tableColumns"
//         :bordered="bordered"
//         :draggable="draggable"
//         :dense="dense"
//         :filter="filter"
//         :selection="selection"
//         :loading="loading"
//         :rows="tableRows"
//         :is-tree-table="hasFlatTreeData"
//         :resizable="resizable"
//         :row-key="rowKey"
//         :color="color"
//         :title="title"
//         :virtual-scroll="virtualScroll"
//         :rows-per-page-options="rowsPerPageOptions"
//         :hide-pagination="hidePagination"
//         :is-empty="isEmpty"
//         :empty-state-props="emptyStateProps"
//         :no-data-label="noDataLabel"
//         @row-click="emitRowClick"
//         @th-click="emitThClick"
//         @update:selected="updateSelected"
//     >
//         <template #header-selection>
//             <DlCheckbox
//                 style="padding-left: 10px"
//                 :color="color"
//                 :model-value="headerSelectedValue"
//                 :indeterminate-value="true"
//                 @update:model-value="onMultipleSelectionSet"
//             />
//         </template>
//         <template #tbody="{ computedRows: rows }">
//             <!-- <tbody v-if="dlTableRef" class="dl-virtual-scroll__content"> -->
//             {{ log(dlTableRef) }}
//             <Sortable
//                 v-if="dlTableRef"
//                 :list="rows"
//                 item-key="name"
//                 tag="tbody"
//                 class="dl-virtual-scroll__content"
//                 :options="{
//                     handle: '.draggable-icon'
//                 }"
//             >
//                 <template #item="{ element: row, index }">
//                     <DlTrTreeView
//                         :key="index"
//                         :row="row"
//                         :row-index="index"
//                         :row-key="rowKey"
//                         :is-row-selected="
//                             isRowSelected(rowKey, getRowKey(row))
//                                 ? 'selected'
//                                 : ''
//                         "
//                         :has-any-action="dlTableRef?.hasAnyAction"
//                         :no-hover="dlTableRef?.noHover"
//                         :has-draggable-rows="dlTableRef?.hasDraggableRows"
//                         :has-selection-mode="dlTableRef?.hasSelectionMode"
//                         :bind-body-selection="
//                             dlTableRef.getBodySelectionScope({
//                                 key: getRowKey(row),
//                                 row,
//                                 pageIndex: index
//                             })
//                         "
//                         :bind-body-cell-scope="
//                             (col) =>
//                                 dlTableRef.getBodyCellScope({
//                                     key: getRowKey(row),
//                                     row,
//                                     pageIndex: index,
//                                     col
//                                 })
//                         "
//                         :color="color"
//                         :computed-cols="dlTableRef.computedCols"
//                         :slot-name="dlTableRef.slotNames"
//                         :computed-rows="computedRows"
//                         :model-value="isRowSelected(rowKey, getRowKey(row))"
//                         @update:model-value="
//                             (adding, evt) =>
//                                 updateSelectionHierarchy(adding, evt, row)
//                         "
//                         @rowClick="dlTableRef.onTrClick($event, row, index)"
//                         @rowDoubleClick="
//                             dlTableRef.onTrDblClick($event, row, index)
//                         "
//                         @rowContextMenu="
//                             dlTableRef.onTrContextMenu($event, row, index)
//                         "
//                         @updateExpandedRow="
//                             updateExpandedRow(!row.expanded, getRowKey(row))
//                         "
//                     >
//                         <template
//                             v-for="templateCol in dlTableRef.computedCols"
//                             #[getSlotByName(templateCol.name)]
//                         >
//                             <slot
//                                 :name="getSlotByName(templateCol.name)"
//                                 v-bind="
//                                     dlTableRef.getBodySelectionScope({
//                                         key: getRowKey(row),
//                                         row,
//                                         col: templateCol,
//                                         pageIndex: rowIndex
//                                     })
//                                 "
//                             />
//                         </template>
//                     </DlTrTreeView>
//                 </template>
//             </Sortable>
//             <!-- </tbody> -->
//         </template>

//         <!-- <template #table-body="tableBodyProps">
//             <slot name="table-body" v-bind="tableBodyProps">
//                 <template v-if="virtualScroll && !isEmpty">
//                     <slot
//                         v-for="(row, rowIndex) in dlTableRef.computedCols"
//                         name="row-body"
//                         v-bind="
//                             dlTableRef.getBodyScope({
//                                 key: getRowKey(row),
//                                 row,
//                                 pageIndex: rowIndex,
//                                 trClass: isRowSelected(rowKey, getRowKey(row))
//                                     ? 'selected'
//                                     : ''
//                             })
//                         "
//                     >
//                         <DlTrTreeView
//                             :row="tableBodyProps.item"
//                             :row-index="rowIndex"
//                             :is-row-selected="
//                                 isRowSelected(
//                                     rowKey,
//                                     getRowKey(tableBodyProps.item)
//                                 )
//                                     ? 'selected'
//                                     : ''
//                             "
//                             :has-any-action="dlTableRef.hasAnyAction"
//                             :no-hover="dlTableRef.noHover"
//                             :page-index="tableBodyProps.index"
//                             :has-draggable-rows="dlTableRef.hasDraggableRows"
//                             :has-selection-mode="dlTableRef.hasSelectionMode"
//                             :bind-body-selection="
//                                 dlTableRef.getBodySelectionScope({
//                                     key: getRowKey(tableBodyProps.item),
//                                     row: tableBodyProps.item,
//                                     pageIndex: tableBodyProps.index
//                                 })
//                             "
//                             :bind-body-cell-scope="
//                                 (col) =>
//                                     dlTableRef.getBodyCellScope({
//                                         key: getRowKey(tableBodyProps.item),
//                                         row: tableBodyProps.item,
//                                         pageIndex: tableBodyProps.index,
//                                         col
//                                     })
//                             "
//                             :color="color"
//                             :computed-cols="dlTableRef.computedCols"
//                             :slot-name="dlTableRef.slotNames"
//                             :computed-rows="computedRows"
//                             :model-value="
//                                 isRowSelected(
//                                     rowKey,
//                                     getRowKey(tableBodyProps.item)
//                                 )
//                             "
//                             @update:model-value="
//                                 (adding, evt) =>
//                                     updateSelectionHierarchy(
//                                         adding,
//                                         evt,
//                                         tableBodyProps.item
//                                     )
//                             "
//                             @rowClick="
//                                 dlTableRef.onTrClick(
//                                     $event,
//                                     tableBodyProps.item,
//                                     tableBodyProps.index
//                                 )
//                             "
//                             @rowDoubleClick="
//                                 dlTableRef.onTrDblClick(
//                                     $event,
//                                     tableBodyProps.item,
//                                     tableBodyProps.index
//                                 )
//                             "
//                             @rowContextMenu="
//                                 dlTableRef.onTrContextMenu(
//                                     $event,
//                                     tableBodyProps.item,
//                                     tableBodyProps.index
//                                 )
//                             "
//                             @updateExpandedRow="
//                                 updateExpandedRow(
//                                     !tableBodyProps.item.expanded,
//                                     getRowKey(tableBodyProps.item)
//                                 )
//                             "
//                         >
//                             <template
//                                 v-for="templateCol in dlTableRef.computedCols"
//                                 #[getSlotByName(templateCol.name)]
//                             >
//                                 <slot
//                                     :name="getSlotByName(templateCol.name)"
//                                     v-bind="
//                                         dlTableRef.getBodyCellScope({
//                                             key: getRowKey(tableBodyProps.item),
//                                             row: tableBodyProps.item,
//                                             pageIndex: tableBodyProps.index,
//                                             col: templateCol
//                                         })
//                                     "
//                                 />
//                             </template>
//                         </DlTrTreeView>
//                     </slot>
//                 </template>
//                 <template v-else>
//                     <template v-if="dlTableRef && !isEmpty">
//                         <template v-for="(row, rowIndex) in computedRows">
//                             <slot
//                                 name="row-body"
//                                 v-bind="
//                                     dlTableRef.getBodyScope({
//                                         key: getRowKey(row),
//                                         row,
//                                         pageIndex: rowIndex,
//                                         trClass: isRowSelected(
//                                             rowKey,
//                                             getRowKey(row)
//                                         )
//                                             ? 'selected'
//                                             : ''
//                                     })
//                                 "
//                             >
//                                 <DlTrTreeView
//                                     :key="rowIndex"
//                                     :row="row"
//                                     :row-index="rowIndex"
//                                     :row-key="rowKey"
//                                     :is-row-selected="
//                                         isRowSelected(rowKey, getRowKey(row))
//                                             ? 'selected'
//                                             : ''
//                                     "
//                                     :has-any-action="dlTableRef.hasAnyAction"
//                                     :no-hover="dlTableRef.noHover"
//                                     :has-draggable-rows="
//                                         dlTableRef.hasDraggableRows
//                                     "
//                                     :has-selection-mode="
//                                         dlTableRef.hasSelectionMode
//                                     "
//                                     :bind-body-selection="
//                                         dlTableRef.getBodySelectionScope({
//                                             key: getRowKey(row),
//                                             row,
//                                             pageIndex: rowIndex
//                                         })
//                                     "
//                                     :bind-body-cell-scope="
//                                         (col) =>
//                                             dlTableRef.getBodyCellScope({
//                                                 key: getRowKey(row),
//                                                 row,
//                                                 pageIndex: rowIndex,
//                                                 col
//                                             })
//                                     "
//                                     :color="color"
//                                     :computed-cols="dlTableRef.computedCols"
//                                     :slot-name="dlTableRef.slotNames"
//                                     :computed-rows="computedRows"
//                                     :model-value="
//                                         isRowSelected(rowKey, getRowKey(row))
//                                     "
//                                     @update:model-value="
//                                         (adding, evt) =>
//                                             updateSelectionHierarchy(
//                                                 adding,
//                                                 evt,
//                                                 row
//                                             )
//                                     "
//                                     @rowClick="
//                                         dlTableRef.onTrClick(
//                                             $event,
//                                             row,
//                                             rowIndex
//                                         )
//                                     "
//                                     @rowDoubleClick="
//                                         dlTableRef.onTrDblClick(
//                                             $event,
//                                             row,
//                                             rowIndex
//                                         )
//                                     "
//                                     @rowContextMenu="
//                                         dlTableRef.onTrContextMenu(
//                                             $event,
//                                             row,
//                                             rowIndex
//                                         )
//                                     "
//                                     @updateExpandedRow="
//                                         updateExpandedRow(
//                                             !row.expanded,
//                                             getRowKey(row)
//                                         )
//                                     "
//                                 >
//                                     <template
//                                         v-for="templateCol in dlTableRef.computedCols"
//                                         #[getSlotByName(templateCol.name)]
//                                     >
//                                         <slot
//                                             :name="
//                                                 getSlotByName(templateCol.name)
//                                             "
//                                             v-bind="
//                                                 dlTableRef.getBodySelectionScope(
//                                                     {
//                                                         key: getRowKey(row),
//                                                         row,
//                                                         col: templateCol,
//                                                         pageIndex: rowIndex
//                                                     }
//                                                 )
//                                             "
//                                         />
//                                     </template>
//                                 </DlTrTreeView>
//                             </slot>
//                         </template>
//                     </template>
//                 </template>
//             </slot>
//         </template> -->
//         <template #no-data>
//             <slot name="no-data" />
//         </template>
//     </DlTable>
// </template>
