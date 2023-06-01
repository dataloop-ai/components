import { Ref, ref } from 'vue-demi'
import { splitByQuotes } from '../utils/splitByQuotes'
import { flatten } from 'flat'
import { isObject } from 'lodash'

export type Schema = {
    [key: string]:
        | string
        | number
        | boolean
        | (number | boolean | string)[]
        | Schema
}

export type Alias = {
    alias: string
    key: string
}

type Operators = {
    [key: string]: string
}

export enum Logical {
    AND = 'AND',
    OR = 'OR'
}

export const operators: Operators = {
    $eq: '=', // all types
    $neq: '!=', // all types
    $gt: '>', // number, date, datetime, time
    $gte: '>=', // number, date, datetime, time
    $lt: '<', // number, date, datetime, time
    $lte: '<=', // number, date, datetime, time
    $in: 'IN', // all types
    $nin: 'NOT-IN' // all types
}

type OperatorToDataTypeMap = {
    [key: string]: string[]
}

const operatorToDataTypeMap: OperatorToDataTypeMap = {
    $eq: [],
    $neq: [],
    $gt: ['number', 'date', 'datetime', 'time'],
    $gte: ['number', 'date', 'datetime', 'time'],
    $lt: ['number', 'date', 'datetime', 'time'],
    $lte: ['number', 'date', 'datetime', 'time'],
    $in: [],
    $nin: []
}

const knownDataTypes = [
    'number',
    'boolean',
    'string',
    'date',
    'datetime',
    'time'
]

type Suggestion = string

type Expression = {
    field: string | null
    operator: string | null
    value: string | null
    keyword: string | null
}

const space = ' '
const dateStartSuggestionString = '(From dd/mm/yyyy)'
const dateEndSuggestionString = '(To dd/mm/yyyy)'
const dateIntervalSuggestionString = '(From (dd/mm/yyyy) To (dd/mm/yyyy))'

let localSuggestions: Suggestion[] = []

export const startDatePattern = new RegExp(
    /(from\s?\d{2}\/\d{2}\/\d{4}\s?|from\s?dd\/mm\/yyyy\s?)/,
    'gi'
)
export const endDatePattern = new RegExp(
    /(to\s?\d{2}\/\d{2}\/\d{4}\s?|to\s?dd\/mm\/yyyy\s?)/,
    'gi'
)
export const dateIntervalPattern = new RegExp(
    /(from\s?\d{2}\/\d{2}\/\d{4}\s?to\s?\d{2}\/\d{2}\/\d{4})|(from\s?dd\/mm\/yyyy\s?to\s?dd\/mm\/yyyy)/,
    'gi'
)

export const useSuggestions = (schema: Schema, aliases: Alias[]) => {
    const initialSuggestions = Object.keys(schema)
    const aliasedKeys = aliases.map((alias) => alias.key)
    const aliasedSuggestions = initialSuggestions.map((suggestion) =>
        aliasedKeys.includes(suggestion)
            ? aliases.find((alias) => alias.key === suggestion)?.alias
            : suggestion
    )

    for (const alias of aliases) {
        if (aliasedSuggestions.includes(alias.alias)) {
            continue
        }
        aliasedSuggestions.push(alias.alias)
    }

    const sortString = (a: string, b: string) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
    const sortedSuggestions = aliasedSuggestions.sort(sortString)

    const suggestions: Ref<Suggestion[]> = ref(sortedSuggestions)
    const error: Ref<string | null> = ref(null)

    const findSuggestions = (input: string) => {
        input = input.replace(/\s+/g, ' ').trimStart()
        localSuggestions = sortedSuggestions

        const words = splitByQuotes(input, space)
        const expressions = mapWordsToExpressions(words)

        for (const { field, operator, value, keyword } of expressions) {
            let matchedField: Suggestion | null = null
            let matchedOperator: Suggestion | null = null
            let matchedKeyword: Suggestion | null = null

            if (!field) continue

            localSuggestions = getMatches(localSuggestions, field)
            matchedField = getMatch(localSuggestions, field)

            if (!matchedField && isNextCharSpace(input, field)) {
                localSuggestions = []
                continue
            }

            if (!matchedField || !isNextCharSpace(input, matchedField)) {
                continue
            }

            const dataType = getDataType(schema, aliases, matchedField)
            if (!dataType) {
                localSuggestions = []
                continue
            }

            const ops: string[] = Array.isArray(dataType)
                ? getGenericOperators()
                : getOperatorByDataType(dataType)

            localSuggestions = getOperators(ops)

            if (!operator) continue

            localSuggestions = getMatches(localSuggestions, operator)
            matchedOperator = getMatch(localSuggestions, operator)

            if (!matchedOperator && isNextCharSpace(input, operator)) {
                localSuggestions = []
                continue
            }

            if (!matchedOperator || !isNextCharSpace(input, matchedOperator)) {
                continue
            }

            if (Array.isArray(dataType)) {
                localSuggestions = dataType.filter(
                    (type) => !knownDataTypes.includes(type)
                )

                if (!value) continue

                localSuggestions = getMatches(localSuggestions, value)
            } else if (
                dataType === 'datetime' ||
                dataType === 'date' ||
                dataType === 'time'
            ) {
                localSuggestions = [
                    dateIntervalSuggestionString,
                    dateStartSuggestionString,
                    dateEndSuggestionString
                ]

                if (!value) continue

                localSuggestions = getMatches(localSuggestions, value)
            } else {
                localSuggestions = []
            }

            if (!value || !isNextCharSpace(input, value)) {
                continue
            }

            localSuggestions = [Logical.AND, Logical.OR]

            if (!keyword) continue

            localSuggestions = getMatches(localSuggestions, keyword)
            matchedKeyword = getMatch(localSuggestions, keyword)

            if (!matchedKeyword || !isNextCharSpace(input, matchedKeyword))
                continue

            localSuggestions = sortedSuggestions
        }

        error.value = input.length
            ? getError(schema, aliases, expressions)
            : null

        suggestions.value = localSuggestions
    }

    return { suggestions, findSuggestions, error }
}

const errors = {
    INVALID_EXPRESSION: 'Invalid Expression',
    INVALID_VALUE: (field: string) => `Invalid value for "${field}" field`
}

const getError = (
    schema: Schema,
    aliases: Alias[],
    expressions: Expression[]
): string | null => {
    const hasErrorInStructure = expressions
        .flatMap((exp) => Object.values(exp))
        .some((el, index, arr) => {
            const isLastValue = index === arr.length - 1
            return (isLastValue && el) || (!isLastValue && !el)
        })

    if (hasErrorInStructure) {
        return errors.INVALID_EXPRESSION
    }

    return expressions
        .filter(({ field, value }) => field !== null && value !== null)
        .reduce<string | null>((acc, { field, value, operator }, _, arr) => {
            if (acc === 'warning') return acc
            const key: string = getAliasObjByAlias(aliases, field)?.key ?? field

            /**
             * Handle nested keys to validate if the key exists in the schema or not.
             */
            const keys: string[] = []
            for (const key of Object.keys(schema)) {
                if (isObject(schema[key]) && !Array.isArray(schema[key])) {
                    const flattened = flatten({ [key]: schema[key] })
                    keys.push(...Object.keys(flattened))
                } else {
                    keys.push(key)
                }
            }

            if (!keys.includes(key)) return 'warning'

            const valid = isValidByDataType(
                validateBracketValues(value),
                getDataType(schema, aliases, key),
                operator
            )

            if (!valid) {
                arr.splice(1)
                return (acc = errors.INVALID_VALUE(field))
            }

            return (acc = null)
        }, null)
}

const isValidByDataType = (
    str: string,
    dataType: string | string[],
    operator: string // TODO: use operator
): boolean => {
    if (Array.isArray(dataType)) {
        let isOneOf = !!getValueMatch(dataType, str)
        for (const type of dataType) {
            isOneOf = isOneOf || isValidByDataType(str, type, operator)
        }
        return isOneOf
    }

    switch (dataType) {
        case 'number':
            return isValidNumber(str)
        case 'boolean':
            return isValidBoolean(str)
        case 'string':
            return isValidString(str)
        case 'date':
        case 'datetime':
        case 'time':
            return isValidDateIntervalPattern(str)
    }
}

const validateBracketValues = (value: string) => {
    value = removeBrackets(value)
    value = value.split(',')[0]
    return value
}

const isValidDateIntervalPattern = (str: string) => {
    return (
        !!str.match(dateIntervalPattern) ||
        !!str.match(startDatePattern) ||
        !!str.match(endDatePattern)
    )
}

const isValidNumber = (str: string) => {
    return !isNaN(Number(str))
}

const isValidBoolean = (str: string) => {
    return true.toString() === str || false.toString() === str
}

const isValidString = (str: string) => {
    const match = str.match(/(?<=\")(.*?)(?=\")|(?<=\')(.*?)(?=\')/)
    if (!match) return false
    return match[0] === removeQuotes(str)
}

const getOperatorByDataType = (dataType: string) => {
    if (dataType === 'boolean') return ['$eq', '$neq']

    return Object.keys(operatorToDataTypeMap).filter((key) => {
        const value = operatorToDataTypeMap[key]
        return value.length === 0 || value.includes(dataType)
    })
}

const getOperators = (op: string[]) => op.map((o) => operators[o])

const mapWordsToExpression = (words: string[]): Expression => {
    return {
        field: words[0] ?? null,
        operator: words[1] ?? null,
        value: words[2] ?? null,
        keyword: words[3] ?? null
    }
}

const getDataType = (
    schema: Schema,
    aliases: Alias[],
    key: string
): string | string[] | null => {
    const aliasedKey = getAliasObjByAlias(aliases, key)?.key ?? key

    const nestedKey = aliasedKey.split('.')

    if (nestedKey.length === 1) {
        return (schema[nestedKey[0]] as string | string[]) ?? null
    }

    let value = schema[nestedKey[0]] as Schema
    if (!value) return null

    for (let i = 1; i < nestedKey.length; i++) {
        if (!value) return null

        const nextKey = nestedKey[i]
        value = (value[nextKey] as Schema) ?? null
    }

    return value as unknown as string | string[] | null
}

const getAliasObjByAlias = (aliases: Alias[], alias: string): Alias | null => {
    return aliases.find((el) => el.alias === alias)
}

const getGenericOperators = () => {
    return Object.keys(operatorToDataTypeMap).filter(
        (key) => operatorToDataTypeMap[key].length === 0
    )
}

export const mapWordsToExpressions = (words: string[]): Expression[] => {
    const _words = words.slice()
    const expressions = [mapWordsToExpression(_words.splice(0, 4))]

    while (_words.length) {
        expressions.push(mapWordsToExpression(_words.splice(0, 4)))
    }

    return expressions
}

const insensitive = (str: string): string => str.toLowerCase()

const getMatch = (strArr: string[], str: string) =>
    strArr.find((val) => insensitive(val) === insensitive(str)) ?? null

const getValueMatch = (strArr: string[], str: string | number | boolean) => {
    return (
        strArr.find((val) =>
            val.toString().charAt(0) === '"' && typeof str === 'string'
                ? insensitive(val.replaceAll('"', '')) === insensitive(str)
                : val.toString() === str.toString()
        ) ?? null
    )
}
const getMatches = (strArr: string[], str: string | number | boolean) =>
    strArr.filter((val) =>
        insensitive(val.toString()).includes(insensitive(str.toString()))
    )

const isNextCharSpace = (input: string, str: string) => {
    const insensitiveInput = insensitive(input)

    return (
        (insensitiveInput.lastIndexOf(insensitive(str)) > -1 &&
            insensitiveInput[
                insensitiveInput.lastIndexOf(insensitive(str)) + str.length
            ] === space) ||
        matchStringEnd(input, str)
    )
}

const matchStringEnd = (input: string, str: string) =>
    input.lastIndexOf(str + '" ') > -1 || input.lastIndexOf(str + "' ") > -1

export const removeBrackets = (str: string) => {
    return str.replace(/\(/g, '').replace(/\)/g, '')
}

const removeQuotes = (str: string) => {
    return str.replaceAll('"', '').replaceAll("'", '')
}
