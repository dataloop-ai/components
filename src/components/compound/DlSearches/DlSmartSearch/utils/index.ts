export * from './highlightSyntax'

import { ColorSchema, SyntaxColorSchema, Filters } from '../types'
import {
    operators,
    Alias,
    Data,
    datePattern,
    datePatternNoBrackets,
    removeBrackets,
    pureDateSuggestionPattern
} from '../../../../../hooks/use-suggestions'
import moment from 'moment'
import { cloneDeep, get } from 'lodash'

export const isEndOfString = (
    str: string,
    pattern: RegExp,
    options: { checkWhiteSpace?: boolean } = {}
): boolean => {
    const { checkWhiteSpace } = options
    if (!str) return false
    if (!str.length) return false
    if (checkWhiteSpace && !str[str.length - 1].trim().length) return false

    const trimmed = str.trim()
    const matches = trimmed.match(pattern)

    if (!matches || !matches.length) return false

    const lastMatch = matches[matches.length - 1]

    return trimmed.lastIndexOf(lastMatch) + lastMatch.length === trimmed.length
}

export const isEndingWithDateIntervalPattern = (str: string) => {
    return isEndOfString(str, datePattern, { checkWhiteSpace: true })
}

export const replaceDateInterval = (str: string, date: Date) => {
    const newStr = `${formatDate(date)}`
    const replaced = replaceFirstOrLastOccurrence(
        str,
        newStr,
        datePatternNoBrackets
    )
    return replaced
}

export const removeDateInterval = (str: string) => {
    return replaceFirstOrLastOccurrence(str, '', datePattern)
}

const formatDate = (date: Date | string | number): string => {
    return moment(date).format(pureDateSuggestionPattern)
}

const replaceFirstOrLastOccurrence = (
    string: string,
    replaceValue: string,
    pattern: RegExp
) => {
    const regex = RegExp(pattern, 'g')

    let firstMatch
    let lastMatch
    let match

    while ((match = regex.exec(string))) {
        if (match[0] === pureDateSuggestionPattern && !firstMatch) {
            firstMatch = match
        }
        lastMatch = match
    }

    if (firstMatch) {
        const modifiedString =
            string.slice(0, firstMatch.index) +
            string.slice(firstMatch.index).replace(firstMatch[0], replaceValue)

        return modifiedString
    } else if (lastMatch) {
        const modifiedString =
            string.slice(0, lastMatch.index) +
            string.slice(lastMatch.index).replace(lastMatch[0], replaceValue)

        return modifiedString
    }

    return string
}

export function getTabItems(filters: Filters) {
    return [
        {
            label: `Saved DQL Queries (${filters.saved?.length ?? 0})`,
            name: 'saved'
        },
        {
            label: `Recent Searches (${filters.recent?.length ?? 0})`,
            name: 'recent'
        },
        {
            label: `Suggested Searches (${filters.suggested?.length ?? 0})`,
            name: 'suggested'
        }
    ]
}

export function replaceStringifiedDatesWithJSDates(str: string) {
    const dates = str.match(datePattern) ?? []
    let newStr = str

    for (const date of dates) {
        newStr = newStr.replace(date, `${formatToNumericDate(date)} `)
    }

    return newStr
}

export function formatToNumericDate(str: string) {
    const dateString = str.replace(/['"\(\)]+/g, '')
    const newDate = moment(dateString, pureDateSuggestionPattern)
    const ms = newDate.toDate().getTime()
    return ms
}

export function formatToStringDate(time: string | number) {
    const formattedDate = formatDate(time)
    const noBrackets = removeBrackets(formattedDate)
    return noBrackets
}

export function replaceJSDatesWithStringifiedDates(
    json: { [key: string]: any },
    dateKeys: string[] = []
): {
    [key: string]: any
} {
    if (!dateKeys.length) {
        return json
    }

    const toReturn = cloneDeep(json)

    for (const key of Object.keys(toReturn)) {
        const value = toReturn[key]
        const keyToCheck = key.split('.').pop()

        if (dateKeys.includes(keyToCheck)) {
            if (typeof value === 'object') {
                const testKey = Object.keys(toReturn[key])[0]
                if (
                    ['$gt', '$gte', '$lt', '$lte', '$eq', '$ne'].includes(
                        testKey
                    )
                ) {
                    toReturn[key][testKey] = formatToStringDate(
                        toReturn[key][testKey]
                    )
                }
            } else {
                toReturn[key] = formatToStringDate(value)
            }
        } else if (value && typeof value === 'object') {
            toReturn[key] = replaceJSDatesWithStringifiedDates(
                toReturn[key],
                dateKeys
            )
        }
    }

    return toReturn
}

export function revertAliases(json: string, aliases: Alias[]) {
    let newJson = json
    for (const alias of aliases) {
        const regex = new RegExp(`${alias.alias}`, 'gi')
        newJson = newJson.replace(regex, alias.key)
    }
    return newJson
}

export function setAliases(str: string, aliases: Alias[]) {
    const words: string[] = []
    for (const alias of aliases) {
        words.push(alias.key)
    }
    const replacement = (match: string) => {
        const index = words.indexOf(match)
        return aliases[index].alias
    }

    const regex = new RegExp(`\\b(?<!\\S)(${words.join('|')})\\b(?!\\S)`, 'gi')
    return str.replace(regex, replacement)
}

function valueAliases(schema: Data, field: string) {
    let aliases: Data = {}
    const type: any = get(schema, field)

    if (Array.isArray(type)) {
        for (const element of type) {
            if (typeof element === 'object') {
                aliases = Object.assign(aliases, element)
            }
        }
    } else {
        if (typeof type === 'object') aliases = Object.assign(aliases, type)
    }
    return aliases
}

export function revertValueAliases(json: Data, schema: Data) {
    const clone = cloneDeep(json)
    const operatorKeys = [
        '$in',
        '$nin',
        '$eq',
        '$ne',
        '$gt',
        '$gte',
        '$lt',
        '$lte'
    ]

    const replaceAliases = (where: Data) => {
        for (const key in where) {
            if (where[key] && typeof where[key] === 'object') {
                const val = where[key]
                const isOperator = operatorKeys.includes(Object.keys(val)[0])
                const isArrayOperator = ['$in', '$nin'].includes(
                    Object.keys(val)[0]
                )

                if (isOperator) {
                    const opVal = val[Object.keys(val)[0]]
                    const aliases = valueAliases(schema, key)

                    if (isArrayOperator) {
                        for (let i = 0; i < opVal.length; ++i) {
                            const value = aliases[opVal[i] as string]
                            if (value) {
                                val[Object.keys(val)[0]][i] = value
                            }
                        }
                    } else {
                        const value = aliases[opVal]
                        if (value) {
                            val[Object.keys(val)[0]] = value
                        }
                    }
                } else if (Array.isArray(val)) {
                    for (const element of val) {
                        replaceAliases(element)
                    }
                } else {
                    replaceAliases(where[key])
                }
            } else {
                const aliases = valueAliases(schema, key)
                const value = aliases[where[key] as string]
                if (value) {
                    where[key] = value
                }
            }
        }
    }

    replaceAliases(clone)
    return clone
}

export function setValueAliases(json: Data, schema: Data) {
    const clone = cloneDeep(json)
    const operatorKeys = [
        '$in',
        '$nin',
        '$eq',
        '$ne',
        '$gt',
        '$gte',
        '$lt',
        '$lte'
    ]

    const replaceValues = (where: Data) => {
        for (const key in where) {
            const val = where[key]
            if (val && typeof val === 'object') {
                const isOperator = operatorKeys.includes(Object.keys(val)[0])
                const isArrayOperator = ['$in', '$nin'].includes(
                    Object.keys(val)[0]
                )

                if (isOperator) {
                    const opVal = val[Object.keys(val)[0]]
                    const aliases = valueAliases(schema, key)
                    const aliasesKeys = Object.keys(aliases)

                    if (isArrayOperator) {
                        for (let i = 0; i < opVal.length; ++i) {
                            const opVal_i = opVal[i]
                            const value = aliasesKeys.find(
                                (key) => aliases[key] === opVal_i
                            )
                            if (value) {
                                val[Object.keys(val)[0]][i] = value
                            }
                        }
                    } else {
                        const value = aliasesKeys.find(
                            (key) => aliases[key] === opVal
                        )
                        if (value) {
                            val[Object.keys(val)[0]] = value
                        }
                    }
                }
                if (Array.isArray(val)) {
                    for (const element of val) {
                        replaceValues(element)
                    }
                } else {
                    replaceValues(where[key])
                }
            } else {
                const aliases = valueAliases(schema, key)
                for (const alias in aliases) {
                    if (val === aliases[alias]) {
                        where[key] = alias
                        break
                    }
                }
            }
        }
    }

    replaceValues(clone)
    return clone
}

export function createColorSchema(
    colorSchema: ColorSchema,
    aliases: Alias[],
    schema: Data
): SyntaxColorSchema {
    const thisFields: string[] = []
    for (const key in aliases) {
        const aliasParts = aliases[key].alias.split('.')
        while (aliasParts.length > 0) {
            thisFields.push(aliasParts.join('.'))
            aliasParts.pop()
        }
    }

    const addKeysFromSchema = (schema: Data, parentKey?: string) => {
        for (const key in schema) {
            const fullKey = parentKey ? `${parentKey}.${key}` : key
            thisFields.push(fullKey)
            if (typeof schema[key] === 'object') {
                addKeysFromSchema(schema[key], fullKey)
            }
        }
    }
    addKeysFromSchema(schema)

    const thisOperators: string[] = []
    for (const key in operators) {
        thisOperators.push(operators[key])
    }

    return {
        fields: {
            values: thisFields,
            color: colorSchema.fields
        },
        operators: {
            values: thisOperators,
            color: colorSchema.operators
        },
        keywords: {
            values: ['OR', 'AND'],
            color: colorSchema.keywords
        }
    }
}

export const isEligibleToChange = (target: HTMLElement, expanded: boolean) => {
    let childOffsetRight = 0
    let childOffsetBottom = 20

    if (target?.lastChild) {
        const range = document.createRange()
        range.selectNode(target?.lastChild)
        childOffsetRight =
            range.getBoundingClientRect().right -
            target.getBoundingClientRect().left
        childOffsetBottom =
            range.getBoundingClientRect().bottom -
            target.getBoundingClientRect().top +
            5
    }

    if (childOffsetRight <= target.clientWidth) {
        return [-childOffsetRight, 5]
    } else {
        return [-target.clientWidth, 5]
    }
}
