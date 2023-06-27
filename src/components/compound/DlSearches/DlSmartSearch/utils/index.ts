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
import { flatten, unflatten } from 'flat'

export const isEndOfString = (str: string, pattern: RegExp): boolean => {
    if (!str) return false
    if (!str.length) return false
    if (!str[str.length - 1].trim().length) return false

    const trimmed = str.trim()
    const matches = trimmed.match(pattern)

    if (!matches || !matches.length) return false

    const lastMatch = matches[matches.length - 1]

    return trimmed.lastIndexOf(lastMatch) + lastMatch.length === trimmed.length
}

export const isEndingWithDateIntervalPattern = (str: string) => {
    return isEndOfString(str, datePattern)
}

export const replaceDateInterval = (str: string, date: DateInterval) => {
    const newStr = `${formatDate(date.from)}`
    return replaceLastOccurrence(str, newStr, datePatternNoBrackets)
}

const formatDate = (date: Date): string => {
    if (!date) return
    return `${addZero(date.getDate())}/${addZero(
        date.getMonth() + 1
    )}/${date.getFullYear()}`
}

const addZero = (value: number): string => {
    return value < 10 ? `0${value}` : value.toString()
}

const replaceLastOccurrence = (
    string: string,
    replaceValue: string,
    pattern: RegExp
) => {
    const matches = string.match(pattern)

    return matches && matches.length
        ? string.replace(matches[matches.length - 1], replaceValue)
        : string
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

function formatToNumericDate(str: string) {
    const dateString = str.replace(/['"]+/g, '')
    const dateInfo = dateString.split('/')
    const day = parseInt(dateInfo[0])
    const month = parseInt(dateInfo[1])
    const year = parseInt(dateInfo[2])
    const newDate = new Date(year, month, day)
    const ms = newDate.getTime()
    return ms
}

function formatToStringDate(time: string | number) {
    const date = new Date(Number(time))
    const formatedDate = formatDate(date)
    const noBrackets = removeBrackets(formatedDate)
    return noBrackets
}

export function replaceJSDatesWithStringifiedDates(
    json: { [key: string]: any },
    dateKeys: string[] = []
) {
    const flat: { [key: string]: any } = flatten(json)
    for (const key of Object.keys(flat)) {
        const value = flat[key]
        const keyToCheck = key.split('.').pop()

        if (dateKeys.includes(keyToCheck)) {
            flat[key] = formatToStringDate(value)
        }
    }
    return unflatten(flat)
}

export function replaceAliases(json: string, aliases: Alias[]) {
    let newJson = json
    aliases.forEach((alias) => {
        newJson = newJson.replaceAll(alias.alias, alias.key)
    })
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

    const regex = new RegExp(words.join('|'), 'gi')
    return str.replace(regex, replacement)
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
