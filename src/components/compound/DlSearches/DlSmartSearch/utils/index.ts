export * from './highlightSyntax'

import { DateInterval } from '../../../DlDateTime/types'
import { ColorSchema, SyntaxColorSchema, Filters } from '../types'
import {
    operators,
    Alias,
    datePattern,
    datePatternNoBrackets,
    removeBrackets
} from '../../../../../hooks/use-suggestions'
import moment from 'moment'
import { cloneDeep } from 'lodash'

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

export const replaceDateInterval = (str: string, date: DateInterval) => {
    const newStr = `${formatDate(date.from)}`
    const replaced = replaceFirstOrLastOccurrence(
        str,
        newStr,
        datePatternNoBrackets
    )
    return replaced
}

const formatDate = (date: Date | string | number): string => {
    return moment(date).format('DD/MM/YYYY')
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
        if (match[0] === 'dd/mm/yyyy' && !firstMatch) {
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
    const newDate = moment(dateString, 'DD/MM/YYYY')
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
                if (['$gt', '$gte', '$lt', '$lte'].includes(testKey)) {
                    toReturn[key][testKey] = formatToStringDate(
                        toReturn[key][testKey]
                    )
                }
            } else {
                toReturn[key] = formatToStringDate(value)
            }
        } else if (typeof value === 'object') {
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

type Data = { [key: string]: any }
function valueAliases(schema: Data, field: string) {
    let aliases: Data = {};
        const type: any = schema[field]
    if (Array.isArray(type)) {
        for (const element of type) {
            if (typeof element !== 'string')
                aliases = Object.assign(aliases, element)
        }
    } else {
        if (typeof type !== 'string') aliases = Object.assign(aliases, type)
    }
    return aliases
}

export function revertValueAliases(json: Data, schema: Data) {
    const clone = cloneDeep(json);
        const replaceAliases = (where: Data) => {
            for (const key in where) {
                if (typeof where[key] === 'object') {
                    replaceAliases(where[key])
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

export function setValueAliases(json: Data, schema: any[]) {
    const clone = cloneDeep(json);
        const replaceValues = (where: Data) => {
            for (const key in where) {
                if (typeof where[key] === 'object') {
                    replaceValues(where[key])
                } else {
                    const aliases = valueAliases(schema, key)
                    for (const alias in aliases) {
                        if (where[key] === aliases[alias]) {
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
    aliases: Alias[]
): SyntaxColorSchema {
    const thisFields = []
    for (const key in aliases) {
        thisFields.push(aliases[key].alias)
    }

    const thisOperators = []
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
