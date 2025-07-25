import { Ref, ref } from 'vue-demi'
import { splitByQuotes, tokenize, TokenType } from '../utils/splitByQuotes'
import { Token } from 'tokenizr'
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
    $ne: '!=', // all types
    $gt: '>', // number, date, datetime, time
    $gte: '>=', // number, date, datetime, time
    $lt: '<', // number, date, datetime, time
    $lte: '<=', // number, date, datetime, time
    $in: 'IN', // all types
    $nin: 'NOT-IN', // all types
    $exists: 'EXISTS', // all types
    $doesnt_exist_dummy: 'DOESNT-EXIST' // all types
}

type OperatorToDataTypeMap = {
    [key: string]: string[]
}

const operatorToDataTypeMap: OperatorToDataTypeMap = {
    $eq: [],
    $ne: [],
    $gt: ['number', 'date', 'datetime', 'time'],
    $gte: ['number', 'date', 'datetime', 'time'],
    $lt: ['number', 'date', 'datetime', 'time'],
    $lte: ['number', 'date', 'datetime', 'time'],
    $in: [],
    $nin: [],
    $exists: [],
    $doesnt_exist_dummy: []
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
export const pureDateSuggestionPattern = 'DD/MM/YYYY HH:mm:ss'
export const dateSuggestionPattern = `(${pureDateSuggestionPattern})`

let localSuggestions: Suggestion[] = []

export const datePattern = new RegExp(
    /[\(']?(\d{2}\/\d{2}\/\d{4}[\)']?\s?|\s?DD\/MM\/YYYY)\s?(\d{2}:\d{2}:\d{2}|\s?HH:mm:ss)[\)']?/,
    'gi'
)
export const datePatternNoBrackets =
    /(\d{2}\/\d{2}\/\d{4}[\)']?\s?|\s?DD\/MM\/YYYY)\s?(\d{2}:\d{2}:\d{2}|\s?HH:mm:ss)/

const existsValuePlaceholder = 'existsValuePlaceholder'

const mergeWords = (words: string[]) => {
    const result: string[] = []
    let merging = false
    let mergeIndex = -1

    for (let i = 0; i < words.length; ++i) {
        const currentItem = words[i]
        if (
            currentItem === operators.$exists ||
            currentItem === operators.$doesnt_exist_dummy
        ) {
            merging = false
            result.push(currentItem)
            result.push(existsValuePlaceholder)
            continue
        } else if (
            currentItem === operators.$in ||
            currentItem === operators.$nin
        ) {
            merging = true
            result.push(currentItem)
            mergeIndex = result.length
            continue
        } else if (
            Object.values(Logical).includes(currentItem as any) ||
            Object.values(operators).includes(currentItem as any)
        ) {
            merging = false
        }

        if (merging) {
            if (!result[mergeIndex]) {
                result[mergeIndex] = currentItem
            } else if (currentItem) {
                result[mergeIndex] += ' ' + currentItem
            }
            continue
        }

        result.push(currentItem)
    }

    return result
}

export const useSuggestions = (
    schema: Ref<Schema>,
    aliases: Ref<Alias[]>,
    options: {
        strict?: Ref<boolean>
        forbiddenKeys?: Ref<string[]>
        omitSuggestions?: Ref<string[]>
        operatorsOverride?: Ref<{[name: string]: string[]}>
    } = {}
) => {
    const { strict, forbiddenKeys, omitSuggestions, operatorsOverride } = options
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
        const aliasBeforeDot = alias.alias.replace(/\..+$/, '')
        if (aliasedSuggestions.includes(aliasBeforeDot)) {
            continue
        }
        aliasedSuggestions.push(aliasBeforeDot)
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
            ? getError(schemaValue, aliasesArray, expressions, {
                  strict,
                  forbiddenKeys,
                  omitSuggestions
              })
            : null
    }

    const findSuggestions = (input: string) => {
        const tokens = tokenize(input)

        let fieldToken: Token | null = null
        let operatorToken: Token | null = null
        let valueToken: Token | null = null
        let keywordToken: Token | null = null

        let i = tokens.length -1
        let whitespace = false
        while (i > -1) {
            const token = tokens[i]
            switch (token.type) {
                case TokenType.WHITESPACE:
                    whitespace = true
                    break
                case TokenType.LOGICAL:
                    keywordToken = token
                    break
                case TokenType.BOOLEAN:
                case TokenType.COMMA:
                case TokenType.DATETIME:
                case TokenType.NUMBER:
                case TokenType.STRING:
                case TokenType.PARTIAL_VALUE:
                    if (!valueToken) {
                        valueToken = token
                    }
                    break
                case TokenType.OPERATOR:
                    // quirk: mapWordsToExpression would only set operator if followed by a whitespace
                    if (whitespace || valueToken) {
                        operatorToken = token
                    }
                    break
                case TokenType.FIELD:
                    fieldToken = token
                    i = 0
                    break
            }
            i--
        }

        const expressions: Expression[] = [{
            field: fieldToken?.text,
            operator: operatorToken?.text,
            value: valueToken?.type === TokenType.COMMA ? '' : valueToken?.text,
            keyword: keywordToken?.text
        }]
                
        localSuggestions = sortedSuggestions

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
                        ? keyword
                            ? sortedSuggestions
                            : [Logical.AND, Logical.OR]
                        : []
                continue
            }

            if (
                !matchedField ||
                (
                    !operator &&
                    insensitive(input).endsWith(insensitive(matchedField)) &&
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
                // 2nd half of key aliases with the dot: matchedField ~ 'Item.H' of 'Item.Height'
                const matchedFieldWithDot =
                    matchedField.indexOf('.') > 0
                        ? matchedField
                        : matchedField + '.'
                for (const a of aliasesArray) {
                    if (a.alias.startsWith(matchedFieldWithDot)) {
                        localSuggestions.push(a.alias.replace(/^.+\./, '.'))
                    }
                }
                continue
            }

            if (operator && (!value || value === '')) {
                const valueSuggestion = getValueSuggestions(dataType, operator)
                if (valueSuggestion) {
                    localSuggestions = valueSuggestion
                    continue
                }
            }

            localSuggestions = operatorsOverride?.value?.[
                getAliasObjByAlias(aliasesArray, matchedField)?.key ?? matchedField
            ]
            if (!localSuggestions) {
                const ops: string[] = Array.isArray(dataType)
                    ? getGenericOperators()
                    : getOperatorByDataType(dataType)

                localSuggestions = getOperators(ops)
            }

            if (!operator) {
                const dotSeparated = matchedField.split('.')
                const lastWord = dotSeparated.pop()
                let fieldOf = schemaValue
                for (const key of dotSeparated) {
                    fieldOf = fieldOf[key] as Schema
                }

                if (!fieldOf) continue

                const toAdd: string[] = []

                if (fieldOf[lastWord]) {
                    fieldOf = fieldOf[lastWord] as Schema

                    if (isObject(fieldOf) && !Array.isArray(fieldOf)) {
                        for (const key of Object.keys(fieldOf)) {
                            if (key === '*') continue
                            if (aliasedKeys.includes(`${matchedField}.${key}`))
                                continue
                            toAdd.push(`.${key}`)
                        }
                    }
                } else {
                    const matchedFieldBeforeDot = matchedField.replace(
                        new RegExp(`\\.${lastWord}$`),
                        ''
                    )
                    for (const key in fieldOf) {
                        if (key === '*') continue
                        if (
                            aliasedKeys.includes(
                                `${matchedFieldBeforeDot}.${key}`
                            )
                        )
                            continue
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

            if (!matchedOperator || (
                !value &&
                !isNextCharSpace(input, matchedOperator)
            )) {
                continue
            }

            if (Array.isArray(dataType)) {
                const filteredTypes = dataType.filter(
                    (type) => !knownDataTypes.includes(type as string)
                )
                const mappedTypes: string[] = []
                for (const type of filteredTypes) {
                    if (typeof type === 'string') {
                        mappedTypes.push(enquoteString(type))
                    } else if (typeof type === 'object') {
                        mappedTypes.push(
                            ...Object.keys(type).map((key) =>
                                enquoteString(key)
                            )
                        )
                    } else {
                        mappedTypes.push(type)
                    }
                }

                if (!value) continue

                localSuggestions = getMatches(mappedTypes, value)
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

            const lastTerm =
                operator === operators.$exists ||
                operator === operators.$doesnt_exist_dummy
                    ? operator
                    : value
            if (!lastTerm || !isNextCharSpace(input, lastTerm)) {
                continue
            }

            localSuggestions = [Logical.AND, Logical.OR]

            if (operator === operators.$in || operator === operators.$nin) {
                localSuggestions.unshift(',')
            }

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
    INVALID_OPERATOR: 'Invalid operator',
    INVALID_VALUE: (field: string) => `Invalid value for "${field}" field`,
    FORBIDDEN_KEY: (field: string) => `Forbidden field "${field}"`
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
    options: {
        strict?: Ref<boolean>
        forbiddenKeys?: Ref<string[]>
        omitSuggestions?: Ref<string[]>
    } = {}
): string | null => {
    const { strict, forbiddenKeys, omitSuggestions } = options
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
        .reduce<string | null>(
            (acc, { field, value, keyword, operator }, _, arr) => {
                if (acc && acc !== 'warning') return acc
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

                const pattern = new RegExp(`^${fieldKey}\\.\\d`)
                const isValid = isInputAllowed(fieldKey, keys)
                const isForbidden = !!forbiddenKeys?.value?.includes(fieldKey)
                if (
                    !keys.includes(fieldKey) &&
                    !hasValidExpression(keys, pattern) &&
                    !isValid &&
                    !isForbidden
                ) {
                    return strict?.value ? errors.INVALID_EXPRESSION : 'warning'
                }

                if (isForbidden) {
                    arr.splice(1)
                    return (acc = errors.FORBIDDEN_KEY(field))
                }

                const valid =
                    operator === operators.$exists ||
                    operator === operators.$doesnt_exist_dummy ||
                    isValidByDataType(
                        validateBracketValues(value),
                        getDataType(schema, aliases, fieldKey),
                        operator
                    )

                if (!valid) {
                    arr.splice(1)
                    return (acc = errors.INVALID_VALUE(field))
                }

                if (omitSuggestions) {
                    if (omitSuggestions.value.includes(value)) {
                        arr.splice(1)
                        return (acc = errors.INVALID_VALUE(field))
                    }
                    if (
                        omitSuggestions.value.includes(keyword) ||
                        omitSuggestions.value.includes(operator)
                    ) {
                        arr.splice(1)
                        return (acc = errors.INVALID_OPERATOR)
                    }
                }

                return acc === 'warning' ? acc : (acc = null)
            },
            null
        )
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
            return (
                isValidString(str) ||
                (str && isValidString(`'${str.trim?.()}'`))
            )
        case 'date':
        case 'datetime':
        case 'time':
            return isValidDateIntervalPattern(str)
    }
}

const validateBracketValues = (value: string) => {
    const bracketless = removeBrackets(value)
    if (isValidString(bracketless)) {
        return bracketless
    }
    const pureValue = bracketless.split(/,\s*/)
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
    const matchSingleQuotes = str.match(/^\s*(?<!\\)'(.*)(?<!\\)'\s*$/)
    if (matchSingleQuotes) {
        return !/(?<!\\)'/.test(matchSingleQuotes[1])
    }
    const matchDoubleQuotes = str.match(/^\s*(?<!\\)"(.*)(?<!\\)"\s*$/)
    if (matchDoubleQuotes) {
        return !/(?<!\\)"/.test(matchDoubleQuotes[1])
    }
    return false
}

export const enquoteString = (str: string) => {
    return `'${str.replace(/'/g, "\\'")}'`
}

const getOperatorByDataType = (dataType: string) => {
    if (dataType === 'boolean') return ['$eq', '$ne']

    if (dataType === 'object') {
        return []
    }

    let operators = Object.keys(operatorToDataTypeMap).filter((key) => {
        const value = operatorToDataTypeMap[key]
        return value.length === 0 || value.includes(dataType)
    })

    if (dataType === 'date' || dataType === 'datetime') {
        const toExclude = ['$eq', '$ne', '$in', '$nin']
        operators = operators.filter((s) => !toExclude.includes(s))
    }

    return operators
}

const getOperators = (op: string[]) => op.map((o) => operators[o])

export function getStringOperators() {
    const keys = getOperatorByDataType('string').filter(key => !key.includes('exist'))
    return getOperators(keys)
}

const mapWordsToExpression = (words: string[]): Expression => {
    let operator = words[1] ?? null
    let value = words[2] ?? null

    if (operator === operators.$in || operator === operators.$nin) {
        if (value && /\,\s?$/.test(value)) {
            value = ''
        }
    }

    if (value === null) {
        operator = null
    }

    return {
        field: words[0] ?? null,
        operator,
        value,
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
            term = insensitive(
                str.replace(/^["'](.*)["']$/, '$1').replace(/\\'/g, "'")
            )
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
const getMatches = (strArr: string[], str: string | number | boolean) => {
    const filtered = strArr.filter((val) =>
        insensitive(val.toString()).includes(insensitive(str.toString()))
    )
    return filtered
}

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
                suggestion.push(
                    type !== 'null' && typeof type === 'string' ? enquoteString(type) : type
                )
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
                    for (const key in type) suggestion.push(enquoteString(key))
                }
                break
        }
    }

    return suggestion
}
