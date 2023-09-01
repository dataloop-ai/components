import { cloneDeep } from 'lodash'

export function getFromChildren(
    parent: Record<string, any>,
    propsRowKey: string | Function
) {
    const clonedParentRows = cloneDeep(parent)
    const childrenKeys: string[] = []
    const childrenCollection: Record<string, any>[] = []

    childrenCollection.push(clonedParentRows)

    if (typeof propsRowKey === 'function') {
        const keys = clonedParentRows.map(propsRowKey)
        childrenCollection.concat(keys)
    }

    function traverseChildren(parentRow: Record<string, any>) {
        if (!parentRow) {
            return
        }

        if (typeof propsRowKey === 'string') {
            childrenKeys.push(parentRow[propsRowKey])
        }

        if (!(parentRow as any)?.children) {
            return
        }
        for (const child of (parentRow as any).children) {
            childrenCollection.push(child)
            traverseChildren(child)
        }
    }

    traverseChildren(clonedParentRows)

    return { childrenKeys, childrenCollection }
}
