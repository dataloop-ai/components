import { RecordStringAny } from '../types'
import { cloneDeep } from 'lodash'

export function convertToNestedObject(selectedRows: RecordStringAny[]) {
    const clonedSelectedRows = cloneDeep(selectedRows)
    let selectedItems: RecordStringAny[] = []

    function isObjectContained(row: RecordStringAny, rows: RecordStringAny[]) {
        for (const rowsItem of rows) {
            if (rowsItem.children) {
                const indexItem = rowsItem.children.findIndex(
                    (item: RecordStringAny) => item.name === row.name
                )

                if (indexItem > -1) {
                    return true
                }
            }
        }
        return false
    }

    const filteredObjects = clonedSelectedRows.filter(
        (obj) => !isObjectContained(obj, clonedSelectedRows)
    )

    function deleteMissingObjects(
        rows: RecordStringAny[],
        filteredObjects: RecordStringAny[]
    ) {
        const cloneFilteredObjects = filteredObjects.filter((obj) => {
            // Check if the object's name exists in rows
            return rows.some((row) => row.name === obj.name)
        })

        // Recursively delete missing objects from children arrays
        cloneFilteredObjects.forEach((obj) => {
            if (obj.children) {
                obj.children = deleteMissingObjects(rows, obj.children)
            }
        })

        return cloneFilteredObjects
    }

    selectedItems = deleteMissingObjects(selectedRows, filteredObjects)

    return {
        selectedItems
    }
}
