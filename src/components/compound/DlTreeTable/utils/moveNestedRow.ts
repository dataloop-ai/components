import { SortableEvent } from 'sortablejs'
import { SortingMovement } from '../../types'

interface NestedObject {
    id: string
    children?: NestedObject[]
    [key: string]: any
}

export function moveNestedRow(
    rows: any[],
    event: SortableEvent,
    sortingMovement: SortingMovement
) {
    const sourceId = event.item.querySelector('tr').dataset.id
    const { lastId, direction } = sortingMovement
    return moveItem(rows, sourceId, lastId, direction)
}

function moveItem(
    objects: NestedObject[],
    sourceId: string,
    targetId: string,
    direction: 'up' | 'down'
): NestedObject[] {
    const findItemAndParent = (
        items: NestedObject[],
        id: string,
        parent: NestedObject | null = null
    ): { item: NestedObject | null; parent: NestedObject | null } => {
        for (const item of items) {
            if (item.id === id) {
                return { item, parent }
            }
            if (item.children) {
                const result = findItemAndParent(item.children, id, item)
                if (result.item) {
                    return result
                }
            }
        }
        return { item: null, parent }
    }

    const cloneObjects = (objectsToClone: NestedObject[]): NestedObject[] => {
        return objectsToClone.map((obj) => ({ ...obj }))
    }

    const rootObjects = cloneObjects(objects)
    const { item: sourceItem, parent: sourceParent } = findItemAndParent(
        rootObjects,
        sourceId
    )
    const { item: targetItem, parent: targetParent } = findItemAndParent(
        rootObjects,
        targetId
    )

    if (!sourceItem || !targetItem) {
        return rootObjects
    }

    if (sourceItem === targetItem) {
        return rootObjects
    }

    if (sourceParent) {
        const sourceIndex = sourceParent.children!.findIndex(
            (child) => child.id === sourceId
        )
        if (sourceIndex !== -1) {
            sourceParent.children!.splice(sourceIndex, 1)
        }
    } else {
        const sourceIndex = rootObjects.findIndex(
            (item) => item.id === sourceId
        )
        if (sourceIndex !== -1) {
            rootObjects.splice(sourceIndex, 1)
        }
    }
    const targetIndex = targetParent
        ? targetParent.children!.findIndex((child) => child.id === targetId)
        : rootObjects.findIndex((item) => item.id === targetId)

    const insertIndex = direction === 'up' ? targetIndex : targetIndex + 1

    if (targetParent) {
        targetParent.children!.splice(insertIndex, 0, sourceItem)
    } else {
        rootObjects.splice(insertIndex, 0, sourceItem)
    }

    return rootObjects
}
