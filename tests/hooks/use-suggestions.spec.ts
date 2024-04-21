import { toRef } from 'vue'
import {
    Alias,
    Schema,
    dateSuggestionPattern,
    useSuggestions
} from '../../src/hooks/use-suggestions'
import { describe, it, expect } from 'vitest'

export const schema: Schema = {
    name: ['string', { Voltaire: 'Arouet' }],
    level: ['high', 'medium', 'low', 30],
    completed: 'boolean',
    metadata: {
        nesting: {
            age: 'number',
            valid: 'boolean',
            arrVal: ['a', 'b', 'c', 'string']
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
        alias: 'Arr',
        key: 'metadata.nesting.arrVal'
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
    const schemaRef = toRef(schema)
    const aliasesRef = toRef(aliases)

    const { suggestions, error, findSuggestions, checkErrors } = useSuggestions(
        schemaRef,
        aliasesRef,
        { strict: toRef(false) }
    )

    const findSuggestionsAndCheckErrors = (input: string) => {
        findSuggestions(input)
        checkErrors(input)
    }

    const allTheFields = [
        'Name',
        'Completed',
        'Age',
        'StartTime',
        'Level',
        'No-Schema',
        'metadata',
        'Arr'
    ].sort(sortString)

    it('suggestions should have the aliases when the input is empty', () => {
        findSuggestions('')
        expect(suggestions.value).toEqual(allTheFields)
    })

    const limited = useSuggestions(schemaRef, aliasesRef, {
        strict: toRef(false),
        omitSuggestions: toRef(['Name', 'Age', 'Completed', 'StartTime', 'Arr'])
    })

    it('suggestions should not contain options from omitSuggestions list', () => {
        limited.findSuggestions('')
        expect(limited.suggestions.value).toEqual(
            ['Level', 'No-Schema', 'metadata'].sort(sortString)
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

    it('suggestions should have AND and OR when non-matched field is followed by the value and space', () => {
        findSuggestions('evel = value ')
        expect(suggestions.value).toEqual(['AND', 'OR'])
    })

    it('suggestions should have all the fields when non-matched field is followed by the value and the logical operator and space', () => {
        findSuggestions('evel = value AND ')
        expect(suggestions.value).toEqual(allTheFields)
    })

    it('suggestions should be empty when the alias does not exist in the schema', () => {
        findSuggestions('No-Schema ')
        expect(suggestions.value).toEqual([])
    })

    it('suggestions should have the generic operators', () => {
        const genericOperators = [
            '=',
            '!=',
            'IN',
            'NOT-IN',
            'EXISTS',
            'DOESNT-EXIST'
        ]

        findSuggestions('Level ')
        expect(suggestions.value).toEqual(genericOperators)

        findSuggestions('Level =')
        expect(suggestions.value).toEqual(genericOperators)
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
            'NOT-IN',
            'EXISTS',
            'DOESNT-EXIST'
        ])
    })

    describe('when the field has values defined', () => {
        it('suggestions should match the field values', () => {
            const levelValues = [`'high'`, `'medium'`, `'low'`, 30]
            findSuggestions('Level = ')
            expect(suggestions.value).toEqual(levelValues)

            findSuggestions('Level IN ')
            expect(suggestions.value).toEqual(levelValues)

            findSuggestions("Level IN 'high',")
            expect(suggestions.value).toEqual(levelValues)

            findSuggestions("Level IN 'high', 'low' OR Level IN ")
            expect(suggestions.value).toEqual(levelValues)
        })

        it('suggestions should match the correct field value without the quotes', () => {
            findSuggestions('Level = me')
            expect(suggestions.value).toEqual([`'medium'`])
        })

        it('suggestions should be empty when none of the field values were matched', () => {
            findSuggestions("Level = 'memo'")
            expect(suggestions.value).toEqual([])
        })

        it('suggestions should be empty when none of the field values were matched', () => {
            findSuggestions("Level = 'memo'")
            expect(suggestions.value).toEqual([])
        })

        it('suggestions should match aliased value that is also filtered', () => {
            findSuggestions('name = vol')
            expect(suggestions.value).toEqual([`'Voltaire'`])
        })
    })

    describe('when the field has value aliases defined', () => {
        it('suggestions should have value aliases', () => {
            findSuggestions('name = ')
            expect(suggestions.value).toEqual(["'Voltaire'"])
        })
    })

    describe('when the field is of type "datetime"', () => {
        it('suggestions should have the "dateIntervalSuggestionString"', () => {
            findSuggestions('StartTime = ')
            expect(suggestions.value).toEqual([dateSuggestionPattern])
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
        expect(suggestions.value).toEqual(allTheFields)
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
            findSuggestionsAndCheckErrors('')
            expect(error.value).toBe(null)
        })

        it('should be "Invalid Expression" when the expression is not complete', () => {
            findSuggestionsAndCheckErrors('Age = ')
            expect(error.value).toBe('Invalid Expression')
        })

        it('should be "Invalid value for "Age" field" when the Age is not a number', () => {
            findSuggestionsAndCheckErrors('Age = "value"')
            expect(error.value).toBe('Invalid value for "Age" field')
        })

        it('should be "Invalid value for "Level" field" when the "Level" is not a value from the schema', () => {
            findSuggestionsAndCheckErrors('Level = "value"')
            expect(error.value).toBe('Invalid value for "Level" field')
        })

        it('should be possible to type the Name value that does not have quotes', () => {
            findSuggestionsAndCheckErrors('Name = value')
            expect(error.value).toBe(null)
        })

        it('should be "Invalid value for "Completed" field" when the is not of the correct type', () => {
            findSuggestionsAndCheckErrors('Completed = "true"')
            expect(error.value).toBe('Invalid value for "Completed" field')
        })

        describe('When using a IN operator', () => {
            it('should be possible to type the "Name" values that do not have quotes', () => {
                findSuggestionsAndCheckErrors(`Name IN 'a', 5`)
                expect(error.value).toBe(null)
            })
            it('should be possible to type the "Name" values that have either single or double quotes', () => {
                findSuggestionsAndCheckErrors(`Name IN "a", '5'`)
                expect(error.value).toBe(null)
            })
        })

        it('should be valid for correct level value', () => {
            findSuggestionsAndCheckErrors('Level = "high"')
            expect(error.value).toBe(null)
        })

        describe('When using nested field with array', () => {
            it('should be valid for correct value', () => {
                findSuggestionsAndCheckErrors('Arr = "c"')
                expect(error.value).toBe(null)
            })
        })
    })
})
