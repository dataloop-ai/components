import {
    updateEditor,
    createColorSchema
} from '../../src/components/compound/DlSearches/DlSmartSearch/utils'
import { describe, expect, it } from 'vitest'

const aliases = [
    {
        alias: 'Name',
        key: 'name'
    },
    {
        alias: 'Age',
        key: 'metadata.nesting.age'
    },
    {
        alias: 'StartTime',
        key: 'metadata.start'
    },
    {
        alias: 'Level',
        key: 'level'
    }
]

const schema = {
    fields: {
        values: ['Name', 'Age', 'StartTime', 'Level'],
        color: 'blue'
    },
    operators: {
        values: [
            '=',
            '!=',
            '>',
            '>=',
            '<',
            '<=',
            'IN',
            'NOT-IN',
            'EXISTS',
            'DOESNT-EXIST'
        ],
        color: 'darkgreen'
    },
    keywords: { values: ['OR', 'AND'], color: 'bold' }
}

describe('createColorSchema', () => {
    it('should return a syntax color object', () => {
        const colors = {
            fields: 'blue',
            operators: 'darkgreen',
            keywords: 'bold'
        }
        const colorSchema = createColorSchema(colors, aliases)
        expect(colorSchema).toEqual(schema)
    })
    it('should update the editor div', () => {
        const mockDiv = document.createElement('div')
        mockDiv.setAttribute('id', 'editor')
        document.body.appendChild(mockDiv)
        updateEditor(mockDiv, schema)
        expect(mockDiv.innerHTML.includes('span')).toBeTruthy()
    })
})
