<template>
    <div
        :id="uuid"
        :key="tableKey"
        ref="rootRef"
        :style="containerStyle"
        :class="containerClass"
    >
        <div ref="dragRef" class="dl-table__drag" />
        <!-- Top Slots -->
        <div v-if="hasTopSlots" class="dl-table__top row items-center">
            <slot v-bind="marginalsScope" name="top">
                <slot
                    v-if="hasTopSelectionMode"
                    v-bind="marginalsScope"
                    name="top-selection"
                />

                <div v-else class="dl-table__control">
                    <slot name="top-left" v-bind="marginalsScope">
                        <div v-if="title" class="dl-table__control">
                            <div :class="titleClasses">
                                {{ title }}
                            </div>
                        </div>
                    </slot>
                </div>

                <div class="dl-table__separator col" />
                <div class="dl-table__control">
                    <slot name="top-right" v-bind="marginalsScope" />
                </div>
            </slot>
        </div>
        <!--  -->

        <!-- Virtual scroll  -->
        <DlVirtualScroll
            v-if="hasVirtScroll"
            v-bind="virtProps"
            ref="virtScrollRef"
            type="__dltable"
            :class="virtualScrollClasses"
            :style="tableStyle"
            :table-colspan="colspanWithExpandableRow"
            :scroll-target="virtualScrollTarget"
            :items="computedRows"
            :scroll-debounce="scrollDebounce"
            @virtual-scroll="onVScroll"
        >
            <template #before>
                <thead
                    :colspan="colspanWithExpandableRow"
                    style="position: relative; z-index: 100"
                >
                    <slot
                        v-if="!hideHeader"
                        name="header"
                        v-bind="getHeaderScope({ header: true })"
                    >
                        <DlTr>
                            <th
                                v-if="isTreeTable"
                                class="dl-table--col-auto-width empty-col"
                                :data-resizable="false"
                                style="width: 25px"
                                @mousedown="stopAndPrevent"
                            />
                            <th
                                v-if="singleSelection"
                                class="dl-table--col-auto-width dl-table--col-checkbox-wrapper"
                                @mousedown="stopAndPrevent"
                            />

                            <th
                                v-else-if="multipleSelection"
                                class="dl-table--col-auto-width dl-table--col-checkbox-wrapper"
                                :data-resizable="false"
                                @mousedown="stopAndPrevent"
                            >
                                <slot
                                    name="header-selection"
                                    v-bind="getHeaderScope({})"
                                >
                                    <DlCheckbox
                                        :color="color"
                                        :model-value="headerSelectedValue"
                                        :indeterminate-value="true"
                                        @update:model-value="
                                            onMultipleSelectionSet
                                        "
                                    />
                                </slot>
                            </th>

                            <th
                                v-if="expandableRows"
                                style="width: 26px"
                                class="dl-table--col-auto-width dl-table--col-icon-wrapper"
                            />

                            <th
                                v-if="isTreeTable"
                                class="dl-table--col-auto-width empty-col"
                                :data-resizable="false"
                                style="width: 25px; padding: 5px"
                            />

                            <slot
                                v-for="(col, colIndex) in computedCols"
                                v-bind="getHeaderScope({ col, onThClick })"
                                :name="
                                    hasSlotByName(`header-cell-${col.name}`)
                                        ? `header-cell-${col.name}`
                                        : 'header-cell'
                                "
                            >
                                <DlTh
                                    :key="col.name"
                                    :props="getHeaderScope({ col })"
                                    :col-index="colIndex"
                                    :pagination="computedPagination"
                                    :padding="`0 ${columnSpacing}`"
                                    @click="onThClick($event, col.name)"
                                >
                                    <span
                                        :class="`inner-th ${`inner-th--${col.align}`}`"
                                        :style="
                                            col.width && {
                                                maxWidth: 'calc(100% - 15px)'
                                            }
                                        "
                                    >
                                        <dl-ellipsis v-if="fitAllColumns">
                                            {{ col.label }}
                                        </dl-ellipsis>
                                        <span v-else> {{ col.label }} </span>
                                    </span>
                                </DlTh>
                            </slot>
                            <DlTh
                                v-if="showRowActions"
                                key="visibleColumnsSlot"
                                class="dl-table-visible-column"
                                no-tooltip
                                padding="0"
                            >
                                <slot
                                    name="header-cell-visible-columns-button"
                                    :visible-columns-state="visibleColumnsState"
                                    :group-options="groupOptions"
                                    :handle-visible-columns-update="
                                        handleVisibleColumnsUpdate
                                    "
                                >
                                    <div
                                        v-if="
                                            visibleColumns &&
                                            visibleColumns.length
                                        "
                                        class="visible-columns-justify-end"
                                        style="width: 100%; display: flex"
                                    >
                                        <dl-button
                                            :text-color="
                                                isVisibleColumnsOpen
                                                    ? 'dl-color-secondary'
                                                    : 'dl-color-medium'
                                            "
                                            flat
                                            icon="icon-dl-column"
                                            tooltip="Manage columns"
                                            padding="0"
                                            :disabled="isDataEmpty"
                                        >
                                            <slot
                                                name="header-cell-visible-columns-menu"
                                                :visible-columns-state="
                                                    visibleColumnsState
                                                "
                                                :group-options="groupOptions"
                                                :handle-visible-columns-update="
                                                    handleVisibleColumnsUpdate
                                                "
                                            >
                                                <dl-popup
                                                    v-model="
                                                        isVisibleColumnsOpen
                                                    "
                                                    dense
                                                >
                                                    <slot
                                                        name="header-cell-visible-columns-menu-content"
                                                        :visible-columns-state="
                                                            visibleColumnsState
                                                        "
                                                        :group-options="
                                                            groupOptions
                                                        "
                                                        :handle-visible-columns-update="
                                                            handleVisibleColumnsUpdate
                                                        "
                                                    >
                                                        <dl-list
                                                            :class="menuClass"
                                                        >
                                                            <dl-option-group
                                                                :model-value="
                                                                    computedVisibleCols
                                                                "
                                                                :options="
                                                                    groupOptions
                                                                "
                                                                :left-label="
                                                                    true
                                                                "
                                                                max-width="250px"
                                                                type="switch"
                                                                class="table-options"
                                                                @update:model-value="
                                                                    handleVisibleColumnsUpdate
                                                                "
                                                            />
                                                        </dl-list>
                                                    </slot>
                                                </dl-popup>
                                            </slot>
                                        </dl-button>
                                    </div>
                                </slot>
                            </DlTh>
                        </DlTr>
                    </slot>
                    <tr
                        v-if="loading && !hasLoadingSlot"
                        class="dl-table__progress"
                    >
                        <th
                            :colspan="colspanWithExpandableRow"
                            class="relative-position"
                        >
                            <dl-progress-bar indeterminate :color="color" />
                        </th>
                    </tr>
                </thead>
            </template>
            <template #default="props">
                <slot name="table-body" v-bind="props">
                    <template v-if="!isDataEmpty && !hasSlotBody">
                        <slot
                            v-bind="
                                getBodyScope({
                                    key: getRowKey(props.item),
                                    row: props.item,
                                    pageIndex: props.pageIndex,
                                    trClass: isRowSelected(
                                        getRowKey(props.item)
                                    )
                                        ? 'selected'
                                        : ''
                                })
                            "
                            :has-any-action="hasAnyAction"
                            name="row-body"
                        >
                            <DlTr
                                :key="getRowKey(props.item)"
                                :class="
                                    isRowSelected(getRowKey(props.item))
                                        ? 'selected'
                                        : hasAnyAction
                                        ? ' cursor-pointer'
                                        : ''
                                "
                                :no-hover="noHover"
                                @click="
                                    onTrClick(
                                        $event,
                                        props.item,
                                        props.pageIndex
                                    )
                                "
                                @dblclick="
                                    onTrDblClick(
                                        $event,
                                        props.item,
                                        props.pageIndex
                                    )
                                "
                                @contextmenu="
                                    onTrContextMenu(
                                        $event,
                                        props.item,
                                        props.pageIndex
                                    )
                                "
                            >
                                <td
                                    v-if="hasDraggableRows"
                                    class="dl-table__drag-icon"
                                >
                                    <dl-icon
                                        class="draggable-icon"
                                        icon="icon-dl-drag"
                                        size="12px"
                                    />
                                </td>
                                <td
                                    v-if="hasSelectionMode"
                                    class="dl-table--col-auto-width"
                                >
                                    <slot
                                        name="body-selection"
                                        v-bind="
                                            getBodySelectionScope({
                                                key: getRowKey(props.item),
                                                row: props.item,
                                                pageIndex: props.pageIndex
                                            })
                                        "
                                    >
                                        <DlCheckbox
                                            :color="color"
                                            :model-value="
                                                isRowSelected(
                                                    getRowKey(props.item)
                                                )
                                            "
                                            @update:model-value="
                                                (adding, evt) =>
                                                    updateSelection(
                                                        [getRowKey(props.item)],
                                                        [props.item],
                                                        adding,
                                                        evt
                                                    )
                                            "
                                        />
                                    </slot>
                                </td>
                                <td v-if="expandableRows">
                                    <dl-icon
                                        :icon="getRowExpandedIcon(props.item)"
                                        @click.stop.prevent="
                                            updateExpanded(props.item)
                                        "
                                    />
                                </td>
                                <DlTd
                                    v-for="(col, colIndex) in computedCols"
                                    :key="col.name"
                                    :class="col.tdClass(props.item)"
                                    :style="col.tdStyle(props.item)"
                                    :no-hover="noHover"
                                    :col-index="colIndex"
                                    :no-tooltip="col.ignoreTooltip"
                                    :padding="`0 ${columnSpacing}`"
                                >
                                    <slot
                                        v-bind="
                                            getBodyCellScope({
                                                key: getRowKey(props.item),
                                                row: props.item,
                                                pageIndex: props.pageIndex,
                                                col
                                            })
                                        "
                                        :name="
                                            hasSlotByName(
                                                `body-cell-${col.name}`
                                            )
                                                ? `body-cell-${col.name}`
                                                : 'body-cell'
                                        "
                                    >
                                        {{ getCellValue(col, props.item) }}
                                    </slot>
                                </DlTd>
                                <DlTd
                                    v-if="showRowActions"
                                    key="visibleColumnsSlot"
                                    class="visible-columns-justify-end dl-table-visible-column"
                                    no-tooltip
                                >
                                    <slot
                                        v-bind="
                                            getBodyCellScope({
                                                key: getRowKey(props.item),
                                                row: props.item,
                                                pageIndex: props.pageIndex
                                            })
                                        "
                                        :name="
                                            hasSlotByName(
                                                `body-cell-row-actions`
                                            )
                                                ? `body-cell-row-actions`
                                                : 'body-cell'
                                        "
                                    >
                                        <div style="width: 15px"></div>
                                    </slot>
                                </DlTd>
                            </DlTr>
                            <tr
                                v-if="isRowExpanded(props.item)"
                                :key="getRowExpandedKey(props.item)"
                                class="dl-virtual-scroll--with-prev"
                            >
                                <td :colspan="colspanWithExpandableRow">
                                    <slot
                                        v-bind="{ row: props.item }"
                                        name="body-cell-expandable-content"
                                    >
                                        <div class="expanded-row">
                                            {{ emptyExpandableMessage }}
                                        </div>
                                    </slot>
                                </td>
                            </tr>
                        </slot>
                    </template>
                    <DlTr v-if="isDataEmpty">
                        <DlTd colspan="100%">
                            <div
                                class="flex justify-center full-width empty-state-wrapper"
                            >
                                <dl-empty-state v-bind="emptyStateProps">
                                    <template
                                        v-for="(_, slot) in $slots"
                                        #[slot]="emptyStateSlotProps"
                                    >
                                        <slot
                                            :name="slot"
                                            v-bind="emptyStateSlotProps"
                                        />
                                    </template>
                                </dl-empty-state>
                            </div>
                        </DlTd>
                    </DlTr>
                </slot>
            </template>
        </DlVirtualScroll>
        <!--  -->

        <div v-else ref="tableScroll" class="dl-table__middle scroll">
            <table ref="tableRef" class="dl-table" :class="additionalClasses">
                <thead
                    :colspan="colspanWithExpandableRow"
                    style="position: relative; z-index: 100"
                >
                    <slot
                        v-if="!hideHeader"
                        name="header"
                        v-bind="getHeaderScope({ header: true })"
                    >
                        <DlTr>
                            <th
                                v-if="isTreeTable"
                                class="dl-table--col-auto-width empty-col"
                                :data-resizable="false"
                                style="width: 25px"
                                @mousedown="stopAndPrevent"
                            />
                            <th
                                v-if="singleSelection"
                                class="dl-table--col-auto-width dl-table--col-checkbox-wrapper"
                                @mousedown="stopAndPrevent"
                            />

                            <th
                                v-else-if="multipleSelection"
                                class="dl-table--col-auto-width dl-table--col-checkbox-wrapper"
                                :data-resizable="false"
                                @mousedown="stopAndPrevent"
                            >
                                <slot
                                    name="header-selection"
                                    v-bind="getHeaderScope({})"
                                >
                                    <DlCheckbox
                                        :color="color"
                                        :model-value="headerSelectedValue"
                                        :indeterminate-value="true"
                                        @update:model-value="
                                            onMultipleSelectionSet
                                        "
                                    />
                                </slot>
                            </th>

                            <th
                                v-if="expandableRows"
                                style="width: 26px"
                                class="dl-table--col-auto-width dl-table--col-icon-wrapper"
                            />

                            <th
                                v-if="isTreeTable"
                                class="dl-table--col-auto-width empty-col"
                                :data-resizable="false"
                                style="width: 25px; padding: 5px"
                            />

                            <slot
                                v-for="(col, colIndex) in computedCols"
                                v-bind="getHeaderScope({ col, onThClick })"
                                :name="
                                    hasSlotByName(`header-cell-${col.name}`)
                                        ? `header-cell-${col.name}`
                                        : 'header-cell'
                                "
                            >
                                <DlTh
                                    :key="col.name"
                                    :props="getHeaderScope({ col })"
                                    :col-index="colIndex"
                                    :pagination="computedPagination"
                                    :padding="
                                        isTreeTable ? '0' : `0 ${columnSpacing}`
                                    "
                                    @click="onThClick($event, col.name)"
                                >
                                    <span
                                        :class="`inner-th ${`inner-th--${col.align}`}`"
                                        :style="
                                            col.width && {
                                                maxWidth: 'calc(100% - 15px)'
                                            }
                                        "
                                    >
                                        <dl-ellipsis v-if="fitAllColumns">
                                            {{ col.label }}
                                        </dl-ellipsis>
                                        <span v-else> {{ col.label }} </span>
                                    </span>
                                </DlTh>
                            </slot>
                            <DlTh
                                v-if="showRowActions"
                                key="visibleColumnsSlot"
                                class="dl-table-visible-column"
                                no-tooltip
                                padding="0"
                            >
                                <slot
                                    name="header-cell-visible-columns-button"
                                    :visible-columns-state="visibleColumnsState"
                                    :group-options="groupOptions"
                                    :handle-visible-columns-update="
                                        handleVisibleColumnsUpdate
                                    "
                                >
                                    <div
                                        v-if="
                                            visibleColumns &&
                                            visibleColumns.length
                                        "
                                        class="visible-columns-justify-end"
                                        style="width: 100%; display: flex"
                                    >
                                        <dl-button
                                            :text-color="
                                                isVisibleColumnsOpen
                                                    ? 'dl-color-secondary'
                                                    : 'dl-color-medium'
                                            "
                                            flat
                                            icon="icon-dl-column"
                                            tooltip="Manage columns"
                                            :disabled="isDataEmpty"
                                            padding="0"
                                        >
                                            <slot
                                                name="header-cell-visible-columns-menu"
                                                :visible-columns-state="
                                                    visibleColumnsState
                                                "
                                                :group-options="groupOptions"
                                                :handle-visible-columns-update="
                                                    handleVisibleColumnsUpdate
                                                "
                                            >
                                                <dl-popup
                                                    v-model="
                                                        isVisibleColumnsOpen
                                                    "
                                                    dense
                                                >
                                                    <slot
                                                        name="header-cell-visible-columns-menu-content"
                                                        :visible-columns-state="
                                                            visibleColumnsState
                                                        "
                                                        :group-options="
                                                            groupOptions
                                                        "
                                                        :handle-visible-columns-update="
                                                            handleVisibleColumnsUpdate
                                                        "
                                                    >
                                                        <dl-list
                                                            :class="menuClass"
                                                        >
                                                            <dl-option-group
                                                                :model-value="
                                                                    computedVisibleCols
                                                                "
                                                                :options="
                                                                    groupOptions
                                                                "
                                                                :left-label="
                                                                    true
                                                                "
                                                                max-width="250px"
                                                                type="switch"
                                                                class="table-options"
                                                                @update:model-value="
                                                                    handleVisibleColumnsUpdate
                                                                "
                                                            />
                                                        </dl-list>
                                                    </slot>
                                                </dl-popup>
                                            </slot>
                                        </dl-button>
                                    </div>
                                </slot>
                            </DlTh>
                        </DlTr>
                    </slot>
                    <tr
                        v-if="loading && !hasLoadingSlot"
                        class="dl-table__progress"
                    >
                        <th
                            :colspan="colspanWithExpandableRow"
                            class="relative-position"
                        >
                            <dl-progress-bar indeterminate :color="color" />
                        </th>
                    </tr>
                </thead>
                <slot
                    name="tbody"
                    v-bind="{
                        computedRows,
                        class: 'dl-virtual-scroll__content'
                    }"
                >
                    <Sortable
                        :key="tbodyKey"
                        ref="tbody"
                        tag="tbody"
                        class="nested-table dl-virtual-scroll__content"
                        style="position: relative; z-index: 90"
                        v-bind="{
                            onEnd: handleSortableEvent
                        }"
                        :is-sortable="hasDraggableRows"
                        :options="sortableOptions"
                    >
                        <slot name="top-row" :cols="computedCols" />
                        <slot name="table-body" :computed-rows="computedRows">
                            <dl-top-scroll
                                v-if="
                                    tableScroll &&
                                    infiniteScroll &&
                                    !isDataEmpty
                                "
                                :container-ref="tableScroll"
                                @scroll-to-top="
                                    $emit(
                                        'scroll-to-top',
                                        computedPagination.rowsPerPage,
                                        tableScroll
                                    )
                                "
                            />
                            <slot
                                v-for="(row, pageIndex) in computedRows"
                                v-bind="
                                    getBodyScope({
                                        key: getRowKey(row),
                                        row,
                                        pageIndex,
                                        trClass: isRowSelected(getRowKey(row))
                                            ? 'selected'
                                            : ''
                                    })
                                "
                                :has-any-action="hasAnyAction"
                                name="row-body"
                            >
                                <DlTr
                                    v-if="!isDataEmpty"
                                    :key="getRowKey(row)"
                                    :has-any-action="hasAnyAction"
                                    :class="
                                        isRowSelected(getRowKey(row))
                                            ? 'selected'
                                            : hasAnyAction
                                            ? ' cursor-pointer'
                                            : ''
                                    "
                                    :no-hover="noHover"
                                    @click="onTrClick($event, row, pageIndex)"
                                    @dblclick="
                                        onTrDblClick($event, row, pageIndex)
                                    "
                                    @contextmenu="
                                        onTrContextMenu($event, row, pageIndex)
                                    "
                                >
                                    <td
                                        v-if="hasDraggableRows"
                                        style="width: 25px"
                                        class="dl-table__drag-icon"
                                    >
                                        <dl-icon
                                            class="draggable-icon"
                                            icon="icon-dl-drag"
                                            size="12px"
                                        />
                                    </td>
                                    <td
                                        v-if="hasSelectionMode"
                                        class="dl-table--col-auto-width"
                                    >
                                        <slot
                                            name="body-selection"
                                            v-bind="
                                                getBodySelectionScope({
                                                    key: getRowKey(row),
                                                    row,
                                                    pageIndex
                                                })
                                            "
                                        >
                                            <DlCheckbox
                                                :color="color"
                                                :model-value="
                                                    isRowSelected(
                                                        getRowKey(row)
                                                    )
                                                "
                                                @update:model-value="
                                                    (adding, evt) =>
                                                        updateSelection(
                                                            [getRowKey(row)],
                                                            [row],
                                                            adding,
                                                            evt
                                                        )
                                                "
                                            />
                                        </slot>
                                    </td>
                                    <td v-if="expandableRows">
                                        <dl-icon
                                            :icon="getRowExpandedIcon(row)"
                                            @click="updateExpanded(row)"
                                        />
                                    </td>
                                    <DlTd
                                        v-for="(col, colIndex) in computedCols"
                                        :key="col.name"
                                        :class="col.tdClass(row)"
                                        :style="col.tdStyle(row)"
                                        :col-index="colIndex"
                                        :no-tooltip="col.ignoreTooltip"
                                        :padding="`0 ${columnSpacing}`"
                                    >
                                        <slot
                                            v-bind="
                                                getBodyCellScope({
                                                    key: getRowKey(row),
                                                    row,
                                                    pageIndex,
                                                    col
                                                })
                                            "
                                            :name="
                                                hasSlotByName(
                                                    `body-cell-${col.name}`
                                                )
                                                    ? `body-cell-${col.name}`
                                                    : 'body-cell'
                                            "
                                        >
                                            {{ getCellValue(col, row) }}
                                        </slot>
                                    </DlTd>
                                    <DlTd
                                        v-if="showRowActions"
                                        key="visibleColumnsSlot"
                                        class="visible-columns-justify-end dl-table-visible-column"
                                        no-tooltip
                                    >
                                        <slot
                                            v-bind="
                                                getBodyCellScope({
                                                    key: getRowKey(row),
                                                    row: row,
                                                    pageIndex: pageIndex
                                                })
                                            "
                                            :name="
                                                hasSlotByName(
                                                    `body-cell-row-actions`
                                                )
                                                    ? `body-cell-row-actions`
                                                    : 'body-cell'
                                            "
                                        >
                                            <div style="width: 15px"></div>
                                        </slot>
                                    </DlTd>
                                </DlTr>
                                <tr
                                    v-if="isRowExpanded(row)"
                                    :key="getRowExpandedKey(row)"
                                >
                                    <td :colspan="colspanWithExpandableRow">
                                        <slot
                                            v-bind="{ row }"
                                            name="body-cell-expandable-content"
                                        >
                                            <div class="expanded-row">
                                                {{ emptyExpandableMessage }}
                                            </div>
                                        </slot>
                                    </td>
                                </tr>
                            </slot>
                            <dl-bottom-scroll
                                v-if="
                                    tableScroll &&
                                    infiniteScroll &&
                                    !isDataEmpty
                                "
                                :container-ref="tableScroll"
                                @scroll-to-bottom="
                                    $emit(
                                        'scroll-to-bottom',
                                        computedPagination.rowsPerPage,
                                        tableScroll
                                    )
                                "
                            />
                        </slot>

                        <slot name="bottom-row" :cols="computedCols" />
                    </Sortable>
                </slot>
            </table>
        </div>

        <div
            v-if="!hideBottom || (nothingToDisplay && !hideNoData)"
            :class="bottomClasses"
        >
            <div
                v-if="nothingToDisplay && !hideNoData"
                class="dl-table__control"
            >
                <slot name="no-data">
                    <DlTr v-if="isDataEmpty && hasEmptyStateProps && !loading">
                        <DlTd colspan="100%">
                            <div
                                class="flex justify-center full-width empty-state-wrapper"
                            >
                                <dl-empty-state v-bind="emptyStateProps">
                                    <template
                                        v-for="(_, slot) in $slots"
                                        #[slot]="emptyStateProps"
                                    >
                                        <slot
                                            :name="slot"
                                            v-bind="emptyStateProps"
                                        />
                                    </template>
                                </dl-empty-state>
                            </div>
                        </DlTd>
                    </DlTr>
                    <div v-else>
                        {{ noDataMessage }}
                    </div>
                </slot>
            </div>
            <div v-else class="dl-table__control">
                <slot name="bottom" v-bind="marginalsScope">
                    <div
                        v-if="
                            hasBottomSelectionBanner &&
                            selectedRowsLabel(rowsSelectedNumber)
                        "
                        class="dl-table__control"
                    >
                        <div>
                            {{ selectedRowsLabel(rowsSelectedNumber) }}
                        </div>
                    </div>

                    <slot name="pagination" v-bind="marginalsScope">
                        <dl-pagination
                            v-if="displayPagination"
                            v-bind="marginalsScope.pagination"
                            :total-items="totalItemsCount"
                            @update:rowsPerPage="
                                (v) => updatePagination(v, 'rowsPerPage')
                            "
                            @update:model-value="
                                (v) => updatePagination(v, 'page')
                            "
                        />
                    </slot>
                </slot>
            </div>
        </div>

        <slot v-if="loading" name="loading" />
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    computed,
    ref,
    watch,
    getCurrentInstance,
    ComputedRef,
    onMounted,
    onBeforeUnmount,
    toRefs,
    nextTick,
    PropType
} from 'vue-demi'
import { emits } from './utils/emits'
import {
    useTablePagination,
    useTablePaginationProps,
    useTablePaginationState
} from './hooks/tablePagination'
import DlTr from './components/DlTr.vue'
import DlTh from './components/DlTh.vue'
import DlTd from './components/DlTd.vue'
import {
    commonVirtPropsList,
    commonVirtScrollProps
} from '../../shared/DlVirtualScroll/useVirtualScroll'
import DlVirtualScroll from '../../shared/DlVirtualScroll/DlVirtualScroll.vue'
import { useTableFilter, useTableFilterProps } from './hooks/tableFilter'
import { useTableSort, useTableSortProps } from './hooks/tableSort'
import {
    useTableRowSelection,
    useTableRowSelectionProps
} from './hooks/tableRowSelection'
import {
    useTableColumnSelection,
    useTableColumnSelectionProps
} from './hooks/tableColumnSelection'
import {
    useTableRowExpand,
    useTableRowExpandProps
} from './hooks/tableRowExpand'
import { useTableActions, useTableActionsProps } from './hooks/tableActions'
import { applyDraggableColumns, applyResizableColumns } from '../../../utils'
import { injectProp } from '../../../utils/inject-object-prop'
import {
    DlTableRow,
    DlTableProps,
    DlTableColumn,
    TableStickyPosition
} from './types'
import { DlPagination } from '../DlPagination'
import {
    DlIcon,
    DlCheckbox,
    DlProgressBar,
    DlList,
    DlEllipsis
} from '../../essential'
import { DlButton, DlPopup } from '../../basic'
import DlOptionGroup from '../DlOptionGroup/DlOptionGroup.vue'
import DlEmptyState from '../../basic/DlEmptyState/DlEmptyState.vue'
import { v4 } from 'uuid'
import { stopAndPrevent, setAllColumnWidths } from '../../../utils'
import { DlEmptyStateProps, DlVirtualScrollEvent } from '../../types'
import Sortable from './components/SortableJS.vue'
import { SortableEvent } from 'sortablejs'
import { insertAtIndex } from './utils/insertAtIndex'
import { getCellValue } from './utils/getCellValue'
import { getContainerClass } from './utils/tableClasses'
import { isEqual } from 'lodash'
import { DlTopScroll, DlBottomScroll } from '../../shared/DlInfiniteScroll'

const commonVirtPropsObj = {} as Record<string, any>
commonVirtPropsList.forEach((p) => {
    commonVirtPropsObj[p] = {}
})

export default defineComponent({
    name: 'DlTable',
    components: {
        DlTr,
        DlTh,
        DlTd,
        DlVirtualScroll,
        DlPagination,
        DlProgressBar,
        DlIcon,
        DlCheckbox,
        DlEmptyState,
        DlButton,
        DlOptionGroup,
        DlPopup,
        DlList,
        Sortable,
        DlEllipsis,
        DlTopScroll,
        DlBottomScroll
    },
    props: {
        /**
         * Array of DlTableColumn objects
         */
        columns: { type: Array, default: () => [] as Record<string, any>[] },
        /**
         * Array of DlTableRow objects
         */
        rows: {
            type: Array,
            default: () => [] as Record<string, any>[]
        },
        /**
         * Specify which key will identify each row
         */
        rowKey: {
            type: [String, Function],
            default: 'id'
        },
        /**
         * Surrounded by a border
         */
        bordered: Boolean,
        /**
         * Borders inside the table: horizontal, vertical, cell or none
         */
        separator: {
            type: String,
            default: 'horizontal',
            validator: (v: string) =>
                ['horizontal', 'vertical', 'cell', 'none'].includes(v)
        },
        /**
         * Type of the draggable functionality: rows, columns or both
         */
        draggable: {
            type: String,
            default: 'none',
            validator: (v: string) =>
                ['rows', 'columns', 'none', 'both'].includes(v)
        },
        /**
         * Title to be displayed next to the table
         */
        title: { type: String, default: '' },
        /**
         * Text color
         */
        color: {
            type: String,
            default: 'dl-color-darker'
        },
        /**
         * Show a loading animation on the table
         */
        loading: {
            type: Boolean,
            default: false
        },
        /**
         *  Cells shrinks in size
         */
        dense: {
            type: Boolean,
            default: false
        },
        /**
         * Resizable columns
         */
        resizable: {
            type: Boolean,
            default: false
        },
        /**
         * Don't show the "No data" message
         */
        hideNoData: {
            type: Boolean,
            default: false
        },
        /**
         * Don't show the header
         */
        hideHeader: {
            type: Boolean,
            default: false
        },
        /**
         * Don't show the footer
         */
        hideBottom: {
            type: Boolean,
            default: false
        },
        /**
         * Enable virtual scroll
         */
        virtualScroll: {
            type: Boolean,
            default: false
        },
        /**
         * Enable infinite scroll
         */
        infiniteScroll: {
            type: Boolean,
            default: false
        },
        /**
         * Hide table pagination
         */
        hidePagination: {
            type: Boolean,
            default: false
        },
        /**
         * Hide selected banner
         */
        hideSelectedBanner: {
            type: Boolean,
            default: false
        },
        /**
         * Function to generate the label visible when selecting rows
         */
        selectedRowsLabel: {
            type: Function,
            default: (val: number) => null
        },
        /**
         * Label visible when loading is active
         */
        loadingLabel: {
            type: String,
            default: 'Loading...'
        },
        /**
         * Label visible when there are no results
         */
        noResultsLabel: {
            type: String,
            default: 'There are no results to display'
        },
        /**
         * Label visible when data is empty
         */
        noDataLabel: {
            type: String,
            default: 'No data available'
        },
        /**
         * Virtual scroll target
         */
        virtualScrollTarget: {
            type: Object as PropType<HTMLElement>,
            default: null as unknown as PropType<HTMLElement>
        },
        /**
         *  CSS class for the title
         */
        titleClass: {
            type: [String, Array, Object],
            default: null as unknown as PropType<any[]>
        },
        /**
         * Styles to be applied to the table container
         */
        tableStyle: {
            type: [String, Array, Object],
            default: null as unknown as PropType<any[]>
        },
        /**
         * CSS class for the table container
         */
        tableClass: {
            type: [String, Array, Object],
            default: null as unknown as PropType<any[]>
        },
        /**
         * Styles to be applies to the table header
         */
        tableHeaderStyle: {
            type: [String, Array, Object],
            default: null as unknown as PropType<any[]>
        },
        /**
         * CSS class for the table header
         */
        tableHeaderClass: {
            type: [String, Array, Object],
            default: null as unknown as PropType<any[]>
        },
        menuClass: {
            type: [String, Array, Object],
            default: null as unknown as PropType<any[]>
        },
        noHover: Boolean,
        /**
         * Will add another column with a button opening a menu which lets the user choose the visible columns
         */
        visibleColumns: {
            type: Array as PropType<DlTableColumn[]>,
            default: (): [] => []
        },
        /**
         * Padding of TD and TH elements
         */
        columnSpacing: {
            type: String,
            default: '10px',
            required: false
        },
        /**
         * Props for the empty state component
         */
        emptyStateProps: {
            type: Object as PropType<DlEmptyStateProps>,
            default: () =>
                ({
                    title: '',
                    subtitle: 'No data to show yet',
                    icon: 'icon-dl-dataset-filled'
                } as unknown as PropType<DlEmptyStateProps>)
        },
        /**
         * Scrolling delay
         */
        scrollDebounce: {
            type: Number,
            default: 100
        },
        isTreeTable: {
            type: Boolean,
            default: false
        },
        fitAllColumns: {
            type: Boolean,
            default: false
        },
        expandableRows: {
            type: Boolean,
            default: false
        },
        emptyExpandableMessage: {
            type: String,
            default: 'No data'
        },
        stickyColumns: {
            type: String as PropType<TableStickyPosition>,
            default: null,
            validator: (value: string) =>
                ['first', 'last', 'both'].includes(value)
        },
        ...useTableActionsProps,
        ...commonVirtScrollProps,
        ...useTableRowExpandProps,
        ...useTablePaginationProps,
        ...useTableFilterProps,
        ...useTableSortProps,
        ...useTableColumnSelectionProps,
        ...useTableRowSelectionProps
    },
    emits,
    setup(props, { emit, slots }) {
        const vm = getCurrentInstance()
        const {
            tableStyle,
            tableClass,
            tableHeaderStyle,
            tableHeaderClass,
            menuClass,
            dense,
            draggable,
            virtualScroll,
            rows,
            pagination,
            visibleColumns,
            rowKey,
            titleClass,
            emptyStateProps,
            hideNoData,
            loading,
            loadingLabel,
            filter,
            noResultsLabel,
            noDataLabel,
            columns,
            fitAllColumns,
            resizable,
            hidePagination,
            hideSelectedBanner,
            color,
            virtualScrollStickySizeStart,
            noHover
        } = toRefs(props)

        const tbodyKey = ref()
        const tableKey = ref()
        const getTableKey = () => tableKey.value

        const rootRef = ref<HTMLDivElement>(null)
        const tableRef = ref<HTMLTableElement>(null)
        const virtScrollRef = ref(null)
        const tableScroll = ref(null)
        const isVisibleColumnsOpen = ref(false)

        const hasExpandableSlot = computed(() =>
            hasSlotByName('body-cell-expandable-content')
        )
        const hasVirtScroll = computed<boolean>(
            () => virtualScroll.value && !hasExpandableSlot.value
        )

        const hasEmptyStateProps = computed(() =>
            emptyStateProps.value
                ? Object.keys(props.emptyStateProps).length > 0
                : false
        )

        const isDataEmpty = computed(() => !rows.value.length)

        const groupOptions = computed(() =>
            (
                props.columns.filter(
                    (col) => !(col as DlTableColumn).required
                ) as DlTableColumn[]
            )?.map((item) => ({
                label: item.label,
                value: item.name
            }))
        )

        const visibleColumnsState = ref(visibleColumns.value)

        const computedVisibleCols = computed(() =>
            computedCols.value.map((col) => col.name)
        )

        const { hasAnyAction } = useTableActions(props) // todo: does not work

        const getRowKey = computed(() =>
            typeof rowKey.value === 'function'
                ? rowKey.value
                : (row: Record<string, any>) => row[rowKey.value as string]
        )

        const isResizing = ref(false)
        const isResizingInProgress = ref(false)
        const isDragging = ref(false)
        const setIsResizing = (val: boolean) => (isResizing.value = val)
        const setResizingInProgress = (val: boolean) =>
            (isResizingInProgress.value = val)
        const setIsDragging = (val: boolean) => (isDragging.value = val)
        const getIsDragging = () => isDragging.value
        const getIsResizing = () => isResizing.value
        const getResizingInProgress = () => isResizingInProgress.value
        const getVisibleColumnsState = () => visibleColumnsState.value

        // table slots
        const hasSlotByName = (name: string) => !!slots[name]

        const hasPaginationSlot = computed(() => hasSlotByName('pagination'))

        const hasTopSlots = computed(
            () =>
                !!slots['top'] ||
                !!slots['top-left'] ||
                !!slots['top-right'] ||
                !!slots['top-selection']
        )
        //
        const containerClass = computed(() => {
            const { separator, bordered, dense, loading } = props
            return getContainerClass(separator, bordered, dense, loading)
        })

        const containerStyle = computed(() => {
            if (virtualScroll.value) {
                return {
                    height: 'var(--dl-table-height, 500px)'
                }
            }
        })

        const nothingToDisplay = computed(() => computedRows.value.length === 0)

        const titleClasses = computed(
            () => 'dl-table__title ' + (titleClass.value || '')
        )

        const bottomClasses = computed(() => {
            let classNames = 'dl-table__bottom row items-center'

            if (nothingToDisplay.value && !hideNoData.value) {
                // TODO add styles for this class
                classNames = classNames + ' dl-table__bottom--nodata'
            }

            return classNames
        })
        //

        const noDataMessage = computed(() => {
            if (loading.value) {
                return loadingLabel.value
            }

            if (filter.value) {
                return noResultsLabel.value
            }

            return noDataLabel.value
        })

        const hasDraggableRows = computed(() =>
            ['rows', 'both'].includes(draggable.value)
        )

        const hasDraggableColumns = computed(() =>
            ['columns', 'both'].includes(draggable.value)
        )

        const removeDraggableColumns = () => {}

        let tableEl: HTMLTableElement = null

        const totalItemsCount = computed(() => {
            return computedPagination.value.rowsNumber || rows.value.length
        })

        const updateTableSizing = () => {
            tableEl =
                tableRef.value ||
                virtScrollRef.value.rootRef.querySelector('table') ||
                (document.querySelector('table.dl-table') as HTMLTableElement)
            const cols = getVisibleColumnsState()
                ? props.columns.filter((col: any) =>
                      getVisibleColumnsState().includes(col.name)
                  )
                : props.columns
            nextTick(() => {
                setAllColumnWidths(
                    tableEl,
                    cols as DlTableColumn[],
                    props.stickyColumns,
                    props.fitAllColumns,
                    !!props.visibleColumns
                )
            })
            return tableEl
        }

        onMounted(() => {
            const tableEl = updateTableSizing()
            window.addEventListener(
                'virtual-scroll-content-update',
                updateTableSizing
            )
            if (resizable.value) {
                applyResizableColumns(tableEl, vm)
            }
            if (hasDraggableColumns.value === true) {
                applyDraggableColumns(
                    tableEl,
                    vm,
                    vm.refs.dragRef as HTMLDivElement
                )
            }
        })
        onBeforeUnmount(() => {
            window.removeEventListener(
                'virtual-scroll-content-update',
                updateTableSizing
            )
        })

        watch(
            hasVirtScroll,
            () => {
                tableEl =
                    tableRef.value ||
                    virtScrollRef.value.rootRef.querySelector('table') ||
                    (document.querySelector(
                        'table.dl-table'
                    ) as HTMLTableElement)
                const cols = getVisibleColumnsState()
                    ? props.columns.filter((col: any) =>
                          getVisibleColumnsState().includes(col.name)
                      )
                    : props.columns
                nextTick(() => {
                    setAllColumnWidths(
                        tableEl,
                        cols as DlTableColumn[],
                        props.stickyColumns,
                        props.fitAllColumns,
                        !!props.visibleColumns
                    )
                })

                if (resizable.value) {
                    applyResizableColumns(tableEl, vm)
                }
                if (hasDraggableColumns.value === true) {
                    applyDraggableColumns(
                        tableEl,
                        vm,
                        vm.refs.dragRef as HTMLDivElement
                    )
                }
            },
            {
                flush: 'post'
            }
        )

        watch(resizable, () => {
            applyResizableColumns(tableEl, vm)
        })

        watch(
            columns,
            (newColumns) => {
                tableEl =
                    tableRef.value ||
                    virtScrollRef.value.rootRef.querySelector('table') ||
                    (document.querySelector(
                        'table.dl-table'
                    ) as HTMLTableElement)
                nextTick(() => {
                    setAllColumnWidths(
                        tableRef.value,
                        newColumns as DlTableColumn[],
                        props.stickyColumns,
                        props.fitAllColumns
                    )
                })
            },
            {
                flush: 'post'
            }
        )

        watch(
            visibleColumns,
            (value: string[]) => {
                visibleColumnsState.value = value
            },
            { immediate: true, deep: true }
        )

        watch(
            draggable,
            () => {
                if (tableEl && !visibleColumns.value) {
                    if (hasDraggableColumns.value === true) {
                        applyDraggableColumns(
                            tableEl,
                            vm,
                            vm.refs.dragRef as HTMLDivElement
                        )
                    } else {
                        removeDraggableColumns()
                    }
                }
            },
            { immediate: true }
        )

        watch(
            [
                tableStyle,
                tableClass,
                tableHeaderStyle,
                tableHeaderClass,
                containerClass
            ],
            () => {
                if (
                    hasVirtScroll.value === true &&
                    virtScrollRef.value !== null
                ) {
                    virtScrollRef.value.reset()
                }
            }
        )

        const { innerPagination, computedPagination, setPagination } =
            useTablePaginationState(vm, getCellValue)

        watch(
            [computedPagination, dense],
            () => {
                if (tableEl && props.resizable) {
                    const tableHeight = tableEl.offsetHeight || 0
                }
            },
            { deep: true, flush: 'post' }
        )

        watch(
            pagination,
            (newPagination) => {
                setPagination(newPagination)
            },
            { deep: true }
        )

        const { computedFilterMethod } = useTableFilter(props, setPagination)

        const { isRowExpanded, setExpanded, updateExpanded } =
            useTableRowExpand(props, emit)

        const filteredSortedRows = computed(() => {
            let filtered = rows.value as DlTableRow[]

            if (filtered.length === 0) {
                return rows.value as DlTableRow[]
            }

            const { sortBy, descending } = computedPagination.value

            if (filter.value) {
                filtered = computedFilterMethod.value(
                    rows.value,
                    filter.value,
                    computedCols.value,
                    getCellValue
                )
            }

            if (columnToSort.value !== null) {
                filtered = computedSortMethod.value(
                    rows.value === filtered ? filtered.slice() : filtered,
                    sortBy,
                    descending
                )
            }

            return filtered
        })

        const filteredSortedRowsNumber = computed(
            () => filteredSortedRows.value.length
        )

        const computedRows = computed(() => {
            if (props.infiniteScroll) return filteredSortedRows.value
            let filtered = filteredSortedRows.value

            const { rowsPerPage } = computedPagination.value

            if (rowsPerPage !== 0) {
                if (firstRowIndex.value === 0 && rows.value !== filtered) {
                    if (filtered.length > lastRowIndex.value) {
                        filtered = filtered.slice(0, lastRowIndex.value)
                    }
                } else {
                    if (
                        filtered.length > computedPagination.value.rowsPerPage
                    ) {
                        filtered = filtered.slice(
                            firstRowIndex.value,
                            lastRowIndex.value
                        )
                    }
                }
            }

            return filtered
        })

        const additionalClasses = computed<string[]>(() => {
            const classes: string[] = []

            if (hasDraggableRows.value === true) {
                classes.push('dl-table--draggable-rows')
            }

            if (hasDraggableColumns.value === true) {
                classes.push('dl-table--draggable-columns')
            }

            return classes
        })

        const displayPagination = computed(
            () =>
                !props.infiniteScroll &&
                !(hidePagination.value || nothingToDisplay.value)
        )

        const {
            hasSelectionMode,
            singleSelection,
            multipleSelection,
            allRowsSelected,
            someRowsSelected,
            rowsSelectedNumber,
            isRowSelected,
            clearSelection,
            updateSelection
        } = useTableRowSelection(
            props as unknown as DlTableProps,
            emit,
            computedRows,
            getRowKey as ComputedRef<(val: string | DlTableRow) => any>
        )
        const { colList, computedCols, computedColsMap, computedColspan } =
            useTableColumnSelection(
                props as unknown as DlTableProps,
                computedPagination,
                hasSelectionMode,
                hasDraggableRows,
                visibleColumnsState
            )

        const colspanWithActionsRow = computed(() => {
            return computedColspan.value + (showRowActions.value ? 1 : 0)
        })

        const colspanWithExpandableRow = computed(() => {
            return (
                colspanWithActionsRow.value + (hasExpandableSlot.value ? 1 : 0)
            )
        })

        const { columnToSort, computedSortMethod, sort } = useTableSort(
            props as unknown as DlTableProps,
            computedPagination,
            colList,
            setPagination
        )

        const headerSelectedValue = computed(() =>
            someRowsSelected.value === true ? null : allRowsSelected.value
        )

        const selectionCheckboxIndeterminateVal = computed(
            () =>
                multipleSelection.value === true &&
                computedRows.value.length > 0 &&
                computedRows.value.length < rows.value.length
        )

        function onMultipleSelectionSet(val: boolean) {
            if (someRowsSelected.value === true) {
                val = false
            }

            updateSelection(
                computedRows.value.map(getRowKey.value as any),
                computedRows.value,
                val
            )
        }

        const hasTopSelectionMode = computed(() => {
            return (
                hasSelectionMode.value === true && rowsSelectedNumber.value > 0
            )
        })

        const hasBottomSelectionBanner = computed(() => {
            return (
                hideSelectedBanner.value !== true &&
                hasSelectionMode.value === true &&
                rowsSelectedNumber.value > 0
            )
        })

        const {
            firstRowIndex,
            lastRowIndex,
            isFirstPage,
            isLastPage,
            pagesNumber,
            computedRowsNumber,
            firstPage,
            prevPage,
            nextPage,
            lastPage
        } = useTablePagination(
            vm,
            computedPagination,
            setPagination,
            filteredSortedRowsNumber
        )

        function getHeaderScope(data: Record<string, any>) {
            Object.assign(data, {
                cols: computedCols.value,
                sort,
                colsMap: computedColsMap.value,
                color: color.value,
                dense: dense.value
            })

            if (multipleSelection.value === true) {
                injectProp(
                    data,
                    'selected',
                    () => headerSelectedValue.value,
                    onMultipleSelectionSet
                )
            }

            if (resizable.value) {
                injectProp(data, 'isResizingInProgress', getResizingInProgress)
            }

            return data
        }

        // Virtual scroll functionality

        const virtProps = computed(() => {
            const acc: Record<string, any> = {}

            commonVirtPropsList.forEach((p) => {
                acc[p] = (props as Record<string, any>)[p]
            })

            return acc
        })

        const marginalsScope = computed(() => ({
            pagination: paginationState.value,
            pagesNumber: pagesNumber.value,
            isFirstPage: isFirstPage.value,
            isLastPage: isLastPage.value,
            firstPage,
            prevPage,
            nextPage,
            lastPage
        }))

        function resetVirtualScroll() {
            if (hasVirtScroll.value === true) {
                virtScrollRef.value.reset()
            }
        }

        function scrollTo(toIndex: string | number, edge?: string) {
            if (virtScrollRef.value !== null) {
                virtScrollRef.value.scrollTo(toIndex, edge)
                return
            }

            toIndex = parseInt(toIndex as string, 10)
            const rowEl = rootRef.value.querySelector(
                `tbody tr:nth-of-type(${toIndex + 1})`
            ) as HTMLElement

            if (rowEl !== null) {
                const scrollTarget = rootRef.value.querySelector(
                    '.dl-table__middle.scroll'
                )
                const offsetTop =
                    rowEl.offsetTop -
                    (virtualScrollStickySizeStart.value as number)
                const direction =
                    offsetTop < scrollTarget.scrollTop ? 'decrease' : 'increase'

                scrollTarget.scrollTop = offsetTop

                emit('virtual-scroll', {
                    index: toIndex,
                    from: 0,
                    to: innerPagination.value.rowsPerPage - 1,
                    direction
                })
            }
        }

        const prevScroll = ref<DlVirtualScrollEvent>(null)

        function onVScroll(info: DlVirtualScrollEvent) {
            if (isEqual(prevScroll.value, info)) {
                return
            }

            prevScroll.value = info
            emit('virtual-scroll', info)
        }

        //

        const onThClick = (evt: MouseEvent, name: string) => {
            emit('th-click', evt, computedRows.value, name)
        }

        const trClickTimeout = ref<any>(null)

        const onTrClick = (
            evt: MouseEvent,
            row: DlTableRow,
            pageIndex: number
        ) => {
            clearTimeout(trClickTimeout.value)
            trClickTimeout.value = setTimeout(() => {
                emit('row-click', evt, row, pageIndex)
            }, 50)
        }

        const onTrDblClick = (
            evt: MouseEvent,
            row: DlTableRow,
            pageIndex: number
        ) => {
            clearTimeout(trClickTimeout.value)
            emit('row-dblclick', evt, row, pageIndex)
        }

        const onTrContextMenu = (
            evt: MouseEvent,
            row: DlTableRow,
            pageIndex: number
        ) => {
            emit('row-contextmenu', evt, row, pageIndex)
        }

        function injectBodyCommonScope(data: Record<string, any>) {
            Object.assign(data, {
                cols: computedCols.value,
                visibleColumnsState: visibleColumnsState.value,
                colsMap: computedColsMap.value,
                sort,
                rowIndex: firstRowIndex.value + data.pageIndex,
                color: color.value,
                dense: dense.value,
                noHover: noHover.value
            })

            if (hasSelectionMode.value === true) {
                injectProp(
                    data,
                    'selected',
                    () => isRowSelected(data.key),
                    (adding: boolean, evt: any) => {
                        updateSelection([data.key], [data.row], adding, evt)
                    }
                )
            }

            injectProp(
                data,
                'expand',
                () => isRowExpanded(data.key),
                () => {
                    updateExpanded(data.key)
                }
            )
        }

        function getBodyScope(data: Record<string, any>) {
            injectBodyCommonScope(data)

            data.cols = data.cols.map((col: DlTableColumn) =>
                Object.defineProperty({ ...col }, 'value', {
                    get: () => getCellValue(col, data.row),
                    enumerable: true
                })
            )

            return data
        }

        function getBodyCellScope(data: Record<string, any>) {
            injectBodyCommonScope(data)
            injectProp(data, 'value', () => getCellValue(data.col, data.row))

            return data
        }

        function getBodySelectionScope(data: Record<string, any>) {
            injectBodyCommonScope(data)

            return data
        }

        const hasLoadingSlot = computed(() => slots['loading'])

        const paginationState = computed(() => {
            return {
                ...computedPagination.value,
                'update:rowsPerPage': (rowsPerPage: number) =>
                    setPagination({ rowsPerPage }),
                'update:model-value': (page: number) => setPagination({ page }),
                modelValue: computedPagination.value.page,
                totalItems: computedRowsNumber.value
            }
        })
        const hasSlotBody = computed(() => !!slots['table-body'])
        const hasSlotHeaderSelection = computed(
            () => !!slots['header-selection']
        )

        const handleSortableEvent = (event: SortableEvent) => {
            const { oldIndex, newIndex } = event
            const newRows = insertAtIndex(rows.value, oldIndex, newIndex)
            tbodyKey.value = v4()
            emit('row-reorder', newRows)
        }

        const reorderColumns = (sourceIndex: number, targetIndex: number) => {
            const newColumns = insertAtIndex(
                columns.value,
                sourceIndex,
                targetIndex
            )
            if (isEqual(newColumns, columns.value)) return
            tableKey.value = v4()
            emit('col-update', newColumns)
        }

        const updateColumns = (newColumns: DlTableColumn[]) => {
            emit('col-update', newColumns)
        }

        // expose public methods and needed computed props
        Object.assign(vm.proxy, {
            resetVirtualScroll,
            scrollTo,
            setExpanded,
            sort,
            firstPage,
            prevPage,
            nextPage,
            lastPage,
            updateColumns,
            reorderColumns,
            setIsResizing,
            setResizingInProgress,
            setIsDragging,
            getIsResizing,
            getResizingInProgress,
            getIsDragging,
            getVisibleColumnsState,
            getTableKey
        })

        const slotNames = computed(() => {
            return slots.length ? slots.map((slot: any) => slot.name) : null
        })

        const sortableOptions: any = {
            group: 'nested',
            animation: 150,
            fallbackOnBody: true,
            invertSwap: true,
            swapThreshold: 0.5
        }

        const virtualScrollClasses = computed(() => {
            let classes: string[] = []

            if (tableClass.value) {
                if (Array.isArray(tableClass.value)) {
                    classes = (tableClass.value as string[]) ?? []
                } else if (typeof tableClass.value === 'string') {
                    classes = (tableClass.value as string)?.split(' ')
                } else if (typeof tableClass.value === 'object') {
                    classes = Object.keys(
                        tableClass.value as Record<string, any>
                    ).filter(
                        (key: string) =>
                            !!(tableClass.value as Record<string, any>)[key]
                    )
                }
            }

            return classes.concat(additionalClasses.value)
        })

        const updatePagination = (value: any, key: string) => {
            return setPagination({ [`${key}`]: value })
        }

        const handleVisibleColumnsUpdate = (columns: string[]) => {
            if (columns.length < 1) return
            visibleColumnsState.value = columns
            emit('update:visible-columns', columns)
        }

        const showRowActions = computed<boolean>(
            () =>
                !!(visibleColumns.value && visibleColumns.value.length) ||
                !!hasSlotByName(`body-cell-row-actions`)
        )

        const getRowExpandedIcon = (row: DlTableRow) => {
            return isRowExpanded(row)
                ? 'icon-dl-down-chevron'
                : 'icon-dl-right-chevron'
        }

        const getRowExpandedKey = (row: DlTableRow) => {
            return getRowKey.value(row)?.toString() + '-expanded'
        }

        return {
            containerStyle,
            isDataEmpty,
            handleSortableEvent,
            tbodyKey,
            tableKey,
            uuid: `dl-table-${v4()}`,
            rootRef,
            containerClass,
            computedRows,
            computedCols,
            computedColspan,
            colspanWithActionsRow,
            colspanWithExpandableRow,
            virtualScrollClasses,
            sortableOptions,
            getRowKey,
            additionalClasses,
            getHeaderScope,
            virtScrollRef,
            hasVirtScroll,
            virtProps,
            onVScroll,
            hasSlotByName,
            hasDraggableRows,
            hasDraggableColumns,
            marginalsScope,
            titleClasses,
            bottomClasses,
            hasTopSlots,
            nothingToDisplay,
            noDataMessage,
            paginationState,
            hasTopSelectionMode,
            hasBottomSelectionBanner,
            rowsSelectedNumber,
            singleSelection,
            multipleSelection,
            headerSelectedValue,
            selectionCheckboxIndeterminateVal,
            onMultipleSelectionSet,
            getBodyScope,
            isRowSelected,
            getCellValue,
            getBodyCellScope,
            hasSelectionMode,
            getBodySelectionScope,
            hasAnyAction,
            updateSelection,
            updateExpanded,
            isRowExpanded,
            setPagination,
            hasLoadingSlot,
            displayPagination,
            onTrClick,
            onTrDblClick,
            onThClick,
            onTrContextMenu,
            hasPaginationSlot,
            slotNames,
            hasSlotBody,
            hasSlotHeaderSelection,
            stopAndPrevent,
            updatePagination,
            hasEmptyStateProps,
            groupOptions,
            visibleColumnsState,
            handleVisibleColumnsUpdate,
            computedVisibleCols,
            totalItemsCount,
            showRowActions,
            tableRef,
            getRowExpandedIcon,
            computedPagination,
            getRowExpandedKey,
            hasExpandableSlot,
            tableScroll,
            isVisibleColumnsOpen
        }
    }
})
</script>

<style scoped lang="scss">
@import './styles/dl-table-styles.scss';

table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    border-spacing: 0;
}

tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
}

tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
}
th,
td {
    box-sizing: border-box;
}

.empty-state-wrapper {
    margin-top: 16px;
}
</style>
