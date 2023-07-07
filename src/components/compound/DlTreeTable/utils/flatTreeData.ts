import { flatMapDeep } from 'lodash'

type TreeDataItem = Record<string, any>

const flatten = (item: TreeDataItem): TreeDataItem[] => {
    if (!item.level) {
        item.level = 1
    }
    const leveledItems = (item.children || []).map((i: any) => {
        return {
            ...i,
            level: (item.level || 1) + 1
        }
    })

    return [item, flatMapDeep(leveledItems, flatten)]
}

export const flatTreeData = (data: TreeDataItem[]) => flatMapDeep(data, flatten)
