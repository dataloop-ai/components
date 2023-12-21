import { Ref, ref } from 'vue-demi'
import { splitByQuotes } from '../utils/splitByQuotes'
import { flatten } from 'flat'
import { isObject } from 'lodash'

export type Data = {
    [key: string]: any
}

export type Schema = {
    [key: string]:
        | string
        | number
        | boolean
        | (number | boolean | string | Data)[]
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
const dateSuggestionPattern = '(dd/mm/yyyy)'

let localSuggestions: Suggestion[] = []

export const datePattern = new RegExp(
    /([\(']?\d{2}\/\d{2}\/\d{4}[\)']?\s?|\s?\(dd\/mm\/yyyy\)\s?)/,
    'gi'
)
export const datePatternNoBrackets =
    /(\d{2}\/\d{2}\/\d{4}\s?|\s?dd\/mm\/yyyy\s?)/

const mergeWords = (words: string[]) => {
    const result: string[] = []
    let merging = false
    let mergeIndex = -1

    for (let i = 0; i < words.length; ++i) {
        const currentItem = words[i]

        if (currentItem === 'IN' || currentItem === 'NOT-IN') {
            merging = true
            mergeIndex = i + 1
            result.push(currentItem)
            continue
        } else if (
            Object.values(Logical).includes(currentItem as any) ||
            Object.values(operators).includes(currentItem as any)
        ) {
            merging = false
        }

        if (merging) {
            if (!result[mergeIndex]) {
                result[mergeIndex] = ''
            }
            result[mergeIndex] += ' ' + currentItem
            continue
        }

        result.push(currentItem)
    }

    return result
}

export const useSuggestions = (
    schema: Ref<Schema>,
    aliases: Ref<Alias[]>,
    options: { strict?: Ref<boolean>; omitSuggestions?: Ref<string[]> } = {}
) => {
    const { strict, omitSuggestions } = options
    const aliasesArray = aliases.value ?? []
    const schemaValue = schema.value ?? {}

    const initialSuggestions = Object.keys(schemaValue)
    const aliasedKeys = aliasesArray.map((alias) => alias.key)
    const aliasedSuggestions = initialSuggestions.map((suggestion) =>
        aliasedKeys.includes(suggestion)
            ? aliasesArray.find((alias) => alias.key === suggestion)?.alias
            : suggestion
    )

    for (const alias of aliasesArray) {
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

    const checkErrors = (input: string) => {
        input = input.replace(/\s+/g, ' ').trimStart()

        const words = splitByQuotes(input, space)
        const mergedWords = mergeWords(words)
        const expressions = mapWordsToExpressions(mergedWords)

        error.value = input.length
            ? getError(schemaValue, aliasesArray, expressions, { strict })
            : null
    }

    const findSuggestions = (input: string) => {
        input = input.replace(/\s+/g, ' ').trimStart()
        localSuggestions = sortedSuggestions

        const words = splitByQuotes(input, space)
        const mergedWords = mergeWords(words)
        const expressions = mapWordsToExpressions(mergedWords)

        for (const { field, operator, value, keyword } of expressions) {
            let matchedField: Suggestion | null = null
            let matchedOperator: Suggestion | null = null
            let matchedKeyword: Suggestion | null = null

            if (!field) continue

            const fieldSeparated: string[] = field.split('.')

            if (fieldSeparated.length > 1) {
                localSuggestions = []
                matchedField = field
            } else {
                localSuggestions = getMatches(localSuggestions, field)
                matchedField = getMatch(localSuggestions, field)
            }

            if (!matchedField && isNextCharSpace(input, field)) {
                localSuggestions =
                    value && input.endsWith(space)
                        ? [Logical.AND, Logical.OR]
                        : []
                continue
            }

            if (
                !matchedField ||
                (!isNextCharSpace(input, matchedField) &&
                    fieldSeparated.length === 1)
            ) {
                continue
            }

            const dataType = getDataType(
                schemaValue,
                aliasesArray,
                matchedField
            )
            if (!dataType) {
                localSuggestions = []
                continue
            }

            if (operator && (!value || value === '')) {
                const valueSuggestion = getValueSuggestions(dataType, operator)
                if (valueSuggestion) {
                    localSuggestions = valueSuggestion
                    continue
                }
            }

            const ops: string[] = Array.isArray(dataType)
                ? getGenericOperators()
                : getOperatorByDataType(dataType)

            localSuggestions = getOperators(ops)

            if (!operator) {
                const dotSeparated = matchedField.split('.')
                const lastWord = dotSeparated.pop()
                let fieldOf = schemaValue
                for (const key of dotSeparated) {
                    fieldOf = fieldOf[key] as Schema
                }

                const toAdd: string[] = []

                if (fieldOf[lastWord]) {
                    fieldOf = fieldOf[lastWord] as Schema

                    if (isObject(fieldOf) && !Array.isArray(fieldOf)) {
                        for (const key of Object.keys(fieldOf)) {
                            if (key === '*') continue
                            toAdd.push(`.${key}`)
                        }
                    }
                } else {
                    for (const key in fieldOf) {
                        if (key === '*') continue
                        if (key.startsWith(lastWord)) {
                            toAdd.push(`.${key}`)
                        }
                    }
                }

                localSuggestions = toAdd.concat(localSuggestions)

                continue
            }

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
                    .filter(
                        (type) =>
                            !knownDataTypes.includes(type as string) &&
                            typeof type !== 'object'
                    )
                    .map((type) =>
                        typeof type === 'string' ? `'${type}'` : type
                    ) as string[]

                if (!value) continue

                localSuggestions = getMatches(localSuggestions, value)
            } else if (
                dataType === 'datetime' ||
                dataType === 'date' ||
                dataType === 'time'
            ) {
                localSuggestions = [dateSuggestionPattern]

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

        suggestions.value = localSuggestions.filter(
            (value) =>
                !omitSuggestions || !omitSuggestions.value.includes(value)
        )
    }

    return { suggestions, findSuggestions, error, checkErrors }
}

const errors = {
    INVALID_EXPRESSION: 'Invalid Expression',
    INVALID_VALUE: (field: string) => `Invalid value for "${field}" field`
}

const isInputAllowed = (input: string, allowedKeys: string[]): boolean => {
    for (const key of allowedKeys) {
        const keyParts = key.split('.')
        const inputParts = input.split('.')

        if (keyParts.length > inputParts.length) {
            continue
        }

        let isMatch = true
        for (let i = 0; i < keyParts.length; i++) {
            if (keyParts[i] !== '*' && keyParts[i] !== inputParts[i]) {
                isMatch = false
                break
            }
        }

        if (isMatch) {
            return true
        }
    }

    return false
}

const getError = (
    schema: Schema,
    aliases: Alias[],
    expressions: Expression[],
    options: { strict?: Ref<boolean> } = {}
): string | null => {
    const { strict } = options
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
            const fieldKey: string =
                getAliasObjByAlias(aliases, field)?.key ?? field

            /**
             * Handle nested keys to validate if the key exists in the schema or not.
             */
            const keys: string[] = []
            for (const key of Object.keys(schema)) {
                if (isObject(schema[key]) && !Array.isArray(schema[key])) {
                    const flattened = flatten({ [key]: schema[key] })
                    for (const k of Object.keys(flattened)) {
                        keys.push(k)
                    }
                } else {
                    keys.push(key)
                }
            }

            function hasValidExpression(
                arr: string[],
                pattern: RegExp
            ): boolean {
                for (const item of arr) {
                    if (pattern.test(item)) {
                        return true
                    }
                }
                return false
            }

            const pattern = new RegExp(`${fieldKey}\\.\\d`)
            const isValid = isInputAllowed(fieldKey, keys)
            if (
                !keys.includes(fieldKey) &&
                !hasValidExpression(keys, pattern) &&
                !isValid
            ) {
                return strict.value ? errors.INVALID_EXPRESSION : 'warning'
            }

            const valid = isValidByDataType(
                validateBracketValues(value),
                getDataType(schema, aliases, fieldKey),
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
    str: string | string[],
    dataType: string | (string | Data)[],
    operator: string
): boolean => {
    if (dataType === 'any') {
        return true
    }

    if (Array.isArray(str)) {
        for (const string of str) {
            if (!isValidByDataType(string, dataType, operator)) {
                return false
            }
        }
        return true
    }

    /**
     * TODO: create new support to validate by operation as well
     */

    if (Array.isArray(dataType)) {
        let isOneOf = !!getValueMatch(
            dataType.filter((type) => typeof type !== 'object') as string[],
            str
        )
        for (const type of dataType) {
            if (typeof type === 'object') {
                isOneOf = isOneOf || !!getValueMatch(Object.keys(type), str)
            } else {
                isOneOf = isOneOf || isValidByDataType(str, type, operator)
            }
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
    const bracketless = removeBrackets(value)
    const pureValue = bracketless.split(',')
    if (pureValue.length === 1) {
        return pureValue[0]
    }
    return pureValue
}

const isValidDateIntervalPattern = (str: string) => {
    return !!str.match(datePatternNoBrackets)
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
    const trimmed = str.trim()
    return match[0] === trimmed.substring(1, trimmed.length - 1)
}

const getOperatorByDataType = (dataType: string) => {
    if (dataType === 'boolean') return ['$eq', '$neq']

    if (dataType === 'object') {
        return []
    }

    let operators = Object.keys(operatorToDataTypeMap).filter((key) => {
        const value = operatorToDataTypeMap[key]
        return value.length === 0 || value.includes(dataType)
    })

    if (dataType === 'date' || dataType === 'datetime') {
        const toExclude = ['$in', '$nin']
        operators = operators.filter((s) => !toExclude.includes(s))
    }

    return operators
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
): string | (string | Data)[] | null => {
    const aliasedKey = getAliasObjByAlias(aliases, key)?.key ?? key

    const nestedKey = aliasedKey.split('.').filter((el) => el)

    let value = schema[nestedKey[0]] as Schema
    if (!value) return null

    for (let i = 1; i < nestedKey.length; i++) {
        if (!value) return null

        const nextKey = nestedKey[i]
        if (!value[nextKey] && value['*']) {
            return 'any'
        }
        value = (value[nextKey] as Schema) ?? null
    }

    if (isObject(value) && !Array.isArray(value)) {
        return 'object'
    }

    return value as unknown as string | (string | Data)[] | null
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

const getValueMatch = (
    strArr: (string | number | boolean)[],
    str: string | number | boolean
) => {
    for (const s of strArr) {
        let term = str
        let serach = s

        if (typeof str === 'string') {
            term = insensitive(str.replace(/["']/gi, ''))
        }
        if (typeof s === 'string') {
            serach = insensitive(s)
        }

        if (serach === term) {
            return s
        }
    }
    return null
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

const removeAllBrackets = (str: string) => {
    return str.replace(/\(/g, '').replace(/\)/g, '')
}

export const removeBrackets = (str: string) => {
    const quotesAt = []
    for (let i = 0; i < str.length; i++) {
        if (/['"]/.test(str.charAt(i))) {
            quotesAt.push(i)
        }
    }

    let result = removeAllBrackets(str.substring(0, quotesAt[0]))

    let skipFrom = 0
    let skipTo = 1
    while (quotesAt[skipFrom] !== undefined) {
        // skip as far as isValidString fails
        while (
            !isValidString(
                str.substring(
                    quotesAt[skipFrom],
                    (quotesAt[skipTo] || str.length) + 1
                )
            )
        ) {
            skipTo++
            if (!quotesAt[skipTo]) break
        }

        // this is either unifished invalid string or finished valid string - keep it as is
        result += str.substring(
            quotesAt[skipFrom],
            (quotesAt[skipTo] || str.length) + 1
        )

        if (quotesAt[skipTo]) {
            // there might still be something after the string
            skipFrom = skipTo + 1
            result += removeAllBrackets(
                str.substring(
                    quotesAt[skipTo] + 1,
                    quotesAt[skipFrom] || str.length
                )
            )

            skipTo = skipFrom + 1
        } else {
            // there is nothing left
            break
        }
    }

    return result
}

export const removeLeadingExpression = (str: string) => {
    // scan for a substring that isValidString
    for (let i = 2; i < str.length; i++) {
        if (isValidString(str.substring(0, i))) {
            return str.substring(i).trimStart()
        }
    }
    // return everything after 1st space, or an empty string
    return str.match(/\s+(.*)$/)?.[1] || ''
}

const getValueSuggestions = (
    dataType: string | (string | Data)[],
    operator: string
) => {
    const types: (string | Data)[] = Array.isArray(dataType)
        ? dataType
        : [dataType]
    const suggestion: string[] = []

    if (Array.isArray(dataType)) {
        for (const type of dataType) {
            if (
                !knownDataTypes.includes(type as string) &&
                typeof type !== 'object'
            ) {
                suggestion.push(typeof type === 'string' ? `'${type}'` : type)
            }
        }
    }

    for (const type of types) {
        switch (type) {
            case 'boolean':
                if (operator === '=' || operator === '!=') {
                    suggestion.push('true', 'false')
                }
                break
            case 'date':
            case 'time':
            case 'datetime':
                suggestion.push(dateSuggestionPattern)
            default:
                if (typeof type === 'object') {
                    // value aliases: key is the alias, value is the actual value
                    for (const key in type) suggestion.push(`'${key}'`)
                }
                break
        }
    }

    return suggestion
}
