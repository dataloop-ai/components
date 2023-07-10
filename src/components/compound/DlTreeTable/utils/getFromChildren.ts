import { cloneDeep } from 'lodash'
import { RecordStringAny } from '../types'

export function getFromChildren(
    parent: RecordStringAny,
    propsRowKey: string | Function
) {
    const clonedParentRows = cloneDeep(parent)
    const childrenKeys: string[] = []
    const childrenCollection: RecordStringAny[] = []

    childrenCollection.push(clonedParentRows)

    if (typeof propsRowKey === 'function') {
        const keys = clonedParentRows.map(propsRowKey)
        childrenCollection.concat(keys)
    }

    function traverseChildren(parentRow: RecordStringAny) {
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
