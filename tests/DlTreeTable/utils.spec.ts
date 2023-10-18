import { cloneDeep, isEqual } from 'lodash'
import {
    convertToNestedObject,
    getFromChildren,
    getRowKey,
    moveNestedRow
} from '../../src/components/compound/DlTreeTable/utils'
import { describe, it, expect } from 'vitest'

const rows = [
    {
        id: '12345',
        name: 'Frozen Yogurt',
        calories: 159,
        isExpanded: false,
        children: [
            {
                id: '2',
                name: 'Eclair1',
                calories: 262,

                isExpanded: false
            }
        ]
    }
]

const nestedObjects = {
    selectedItems: [
        {
            id: '12345',
            name: 'Frozen Yogurt',
            calories: 159,
            isExpanded: false,
            children: []
        }
    ]
}

const selectionFromChildren = {
    childrenKeys: ['Frozen Yogurt', 'Eclair1'],
    childrenCollection: [
        {
            id: '12345',
            name: 'Frozen Yogurt',
            calories: 159,
            isExpanded: false,
            children: [
                {
                    calories: 262,
                    id: '2',
                    isExpanded: false,
                    name: 'Eclair1'
                }
            ]
        },
        { id: '2', name: 'Eclair1', calories: 262, isExpanded: false }
    ]
}

const mockSortableEvent = {
    item: {
        querySelector: () => ({
            dataset: {
                id: '2'
            }
        })
    }
}
const mockSortingMovement = {
    lastId: '12345',
    direction: 'up'
} as const

describe('convertToNestedObject', () => {
    it('convert array to object', () => {
        expect(convertToNestedObject(rows)).toEqual(nestedObjects)
    })
})
describe('getFromChildren', () => {
    it('get selection from children', () => {
        expect(getFromChildren(rows[0], 'name')).toEqual(selectionFromChildren)
    })
})
describe('getRowKey', () => {
    it('get row based on key', () => {
        const rowKey = 'name'
        expect(getRowKey(rowKey)(rows[0])).toMatch(rows[0][rowKey])
    })
})
describe('moveNestedRow', () => {
    it('should move row inside nested hierarchy', () => {
        const newRows = moveNestedRow(
            cloneDeep(rows),
            mockSortableEvent as any,
            mockSortingMovement
        )
        expect(isEqual(newRows[0], rows[0].children[0])).toBe(true)
    })
})
