import { cloneDeep } from 'lodash'

export function insertAtIndex<T>(
    arr: T[],
    oldIndex: number,
    newIndex: number
): T[] {
    if (
        oldIndex < 0 ||
        oldIndex >= arr.length ||
        newIndex < 0 ||
        newIndex >= arr.length
    ) {
        return arr
    }

    const newArray = cloneDeep(arr)
    const elementToInsert = newArray.splice(oldIndex, 1)[0]
    newArray.splice(newIndex, 0, elementToInsert)

    return newArray
}
