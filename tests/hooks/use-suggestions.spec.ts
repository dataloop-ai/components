import { Alias, Schema, useSuggestions } from '../../src/hooks/use-suggestions'
import { describe, it, expect } from 'vitest'

export const schema: Schema = {
    name: 'string',
    level: ['high', 'medium', 'low', 30],
    completed: 'boolean',
    metadata: {
        nesting: {
            age: 'number',
            valid: 'boolean'
        },
        date: 'date',
        start: 'datetime',
        classTime: 'time'
    }
}

export const aliases: Alias[] = [
    {
        alias: 'Name',
        key: 'name'
    },
    {
        alias: 'Completed',
        key: 'completed'
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
    },
    {
        alias: 'No-Schema',
        key: 'no-schema'
    }
]

const sortString = (a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })

describe('use-suggestions', () => {
    const { suggestions, error, findSuggestions } = useSuggestions(
        schema,
        aliases
    )

    it('suggestions should have the aliases when the input is empty', () => {
        findSuggestions('')
        expect(suggestions.value).toEqual(
            [
                'Name',
                'Completed',
                'Age',
                'StartTime',
                'Level',
                'No-Schema',
                'metadata'
            ].sort(sortString)
        )
    })

    it('suggestions should have the field that includes the value', () => {
        findSuggestions('ev')
        expect(suggestions.value).toEqual(['Level'])
    })

    it('suggestions should be empty when none of the fields were matched', () => {
        findSuggestions('evel ')
        expect(suggestions.value).toEqual([])
    })

    it('suggestions should be empty when the alias does not exist in the schema', () => {
        findSuggestions('No-Schema ')
        expect(suggestions.value).toEqual([])
    })

    it('suggestions should have the generic operators', () => {
        findSuggestions('Level ')
        expect(suggestions.value).toEqual(['=', '!=', 'IN', 'NOT-IN'])
    })

    it('suggestions should have the correct operators', () => {
        findSuggestions('Age ')
        expect(suggestions.value).toEqual([
            '=',
            '!=',
            '>',
            '>=',
            '<',
            '<=',
            'IN',
            'NOT-IN'
        ])
    })

    describe('when the field has values defined', () => {
        it('suggestions should match the field values', () => {
            findSuggestions('Level = ')
            console.log(suggestions.value)
            expect(suggestions.value).toEqual(['high', 'medium', 'low', 30])
        })

        it('suggestions should match the correct field value without the quotes', () => {
            findSuggestions('Level = me')
            expect(suggestions.value).toEqual(['medium'])
        })

        it('suggestions should be empty when none of the field values were matched', () => {
            findSuggestions("Level = 'memo'")
            expect(suggestions.value).toEqual([])
        })

        it('suggestions should be empty when none of the field values were matched', () => {
            findSuggestions("Level = 'memo'")
            expect(suggestions.value).toEqual([])
        })
    })

    describe('when the field is of type "datetime"', () => {
        it('suggestions should have the "dateIntervalSuggestionString"', () => {
            findSuggestions('StartTime = ')
            expect(suggestions.value).toEqual([
                '(From (dd/mm/yyyy) To (dd/mm/yyyy))',
                '(From dd/mm/yyyy)',
                '(To dd/mm/yyyy)'
            ])
        })

        it('suggestions should be empty when value does not matches', () => {
            findSuggestions('StartTime = (From (dd/mm/ffff)')
            expect(suggestions.value).toEqual([])
        })
    })

    describe('when the field is of type "boolean"', () => {
        it('suggestions should options of true or false', () => {
            findSuggestions('completed = ')
            expect(suggestions.value).toEqual(['true', 'false'])
        })
    })

    describe('when the field type does not have predefined values or requires custom behavior', () => {
        it('suggestions should be empty', () => {
            findSuggestions('Age = ')
            expect(suggestions.value).toEqual([])
        })
    })

    it('suggestions should have logical operators when the value introduced', () => {
        findSuggestions('Age = 10 ')
        expect(suggestions.value).toEqual(['AND', 'OR'])
    })

    it('suggestions should have the correct logical operator', () => {
        findSuggestions('Age = 10 AN')
        expect(suggestions.value).toEqual(['AND'])
    })

    it('suggestions should have the the aliases when the expression is complete', () => {
        findSuggestions('Age = 10 AND ')
        expect(suggestions.value).toEqual(
            [
                'Name',
                'Level',
                'Completed',
                'metadata',
                'Age',
                'StartTime',
                'No-Schema'
            ].sort(sortString)
        )
    })

    // sort array of strings ignore case

    it('should give suggestions for multiple expressions', () => {
        findSuggestions(
            'Age = 10 AND Level = medium AND StartTime = (From 12/12/2022 To 15/12/2022) '
        )
        expect(suggestions.value).toEqual(['AND', 'OR'])
    })

    describe('error', () => {
        it('should be null when the input is empty', () => {
            findSuggestions('')
            expect(error.value).toBe(null)
        })

        it('should be "Invalid Expression" when the expression is not complete', () => {
            findSuggestions('Age = ')
            expect(error.value).toBe('Invalid Expression')
        })

        it('should be "Invalid value for "Age" field" when the Age is not a number', () => {
            findSuggestions('Age = "value"')
            expect(error.value).toBe('Invalid value for "Age" field')
        })

        it('should be "Invalid value for "Level" field" when the "Level" is not a value from the schema', () => {
            findSuggestions('Level = "value"')
            expect(error.value).toBe('Invalid value for "Level" field')
        })

        it('should be "Invalid value for "Name" field" when the Name value does not have quotes', () => {
            findSuggestions('Name = value')
            expect(error.value).toBe('Invalid value for "Name" field')
        })

        it('should be "Invalid value for "Completed" field" when the Name value does not have quotes', () => {
            findSuggestions('Completed = "true"')
            expect(error.value).toBe('Invalid value for "Completed" field')
        })
    })
})
