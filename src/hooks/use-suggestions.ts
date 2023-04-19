import { Ref, ref } from 'vue-demi'
import { splitByQuotes } from '../utils/splitByQuotes'

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

type Suggestion = string

type Expression = {
    field: string | null
    operator: string | null
    value: string | null
    keyword: string | null
}

const space = ' '
const dateIntervalSuggestionString = '(From (dd/mm/yyyy) To (dd/mm/yyyy))'

let localSuggestions: Suggestion[] = []

export const dateIntervalPattern = new RegExp(
    /\((from\s?\(\d{2}\/\d{2}\/\d{4}\)\s?to\s?\(\d{2}\/\d{2}\/\d{4}\))\)|\((from\s?\(dd\/mm\/yyyy\)\s?to\s?\(dd\/mm\/yyyy\))\)/,
    'gi'
)

export const useSuggestions = (schema: Schema, aliases: Alias[]) => {
    const initialSuggestions = aliases.map((alias) => alias.alias)
    const suggestions: Ref<Suggestion[]> = ref(initialSuggestions)
    const error: Ref<string | null> = ref(null)

    const findSuggestions = (input: string) => {
        localSuggestions = initialSuggestions

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

            const alias = getAliasObjByAlias(aliases, matchedField)
            if (!alias) continue
            const dataType = getDataTypeByAliasKey(schema, alias.key)
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
                localSuggestions = dataType

                if (!value) continue

                localSuggestions = getMatches(localSuggestions, value)
            } else if (
                dataType === 'datetime' ||
                dataType === 'date' ||
                dataType === 'time'
            ) {
                localSuggestions = [dateIntervalSuggestionString]

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

            localSuggestions = initialSuggestions
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
            const aliasObj = getAliasObjByAlias(aliases, field)
            if (!aliasObj) return 'warning'
            const valid = isValidByDataType(
                value,
                getDataTypeByAliasKey(schema, aliasObj!.key),
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
        return !!getValueMatch(dataType, str)
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

const isValidDateIntervalPattern = (str: string) => {
    return !!str.match(dateIntervalPattern)
}

const isValidNumber = (str: string) => {
    return !isNaN(Number(str))
}

const isValidBoolean = (str: string) => {
    return true.toString() === str || false.toString() === str
}

const isValidString = (str: string) => {
    return !!str.match(
        /^('[A-Za-z0-9._~()'!*:@,;+?-]*')|("[A-Za-z0-9._~()'!*:@,;+?-]*")$/
    )
}

const getOperatorByDataType = (dataType: string) => {
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

const getDataTypeByAliasKey = (
    schema: Schema,
    key: string
): string | string[] | null => {
    const nestedKey = key.split('.')

    if (nestedKey.length === 1) {
        return (schema[nestedKey[0]] as string | string[]) ?? null
    }

    let value = schema[nestedKey[0]] as Schema
    for (let i = 1; i < nestedKey.length; i++) {
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
