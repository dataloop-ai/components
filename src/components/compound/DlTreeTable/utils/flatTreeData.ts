import { flatMapDeep } from 'lodash'

const flatten = (item: Record<string, any>): Record<string, any>[] => {
    const leveledItems = (item.children || []).map((i: any) => {
        return {
            ...i,
            level: (item.level || 1) + 1
        }
    })

    return [item, flatMapDeep(leveledItems, flatten)]
}

export const flatTreeData = (data: Record<string, any>[]) =>
    flatMapDeep(data, flatten)
