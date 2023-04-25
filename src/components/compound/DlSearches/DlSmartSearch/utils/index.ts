export * from './highlightSyntax'
export * from './utils'

import { DateInterval } from '../../../DlDateTime/types'

const startDatePattern = new RegExp(
    /\(from\s?\d{2}\/\d{2}\/\d{4}\s?\)|\(from\s?dd\/mm\/yyyy\s?\)/,
    'gi'
)
const endDatePattern = new RegExp(
    /\(to\s?\d{2}\/\d{2}\/\d{4}\s?\)|\(to\s?dd\/mm\/yyyy\s?\)/,
    'gi'
)
const dateIntervalPattern = new RegExp(
    /\((from\s?\(\d{2}\/\d{2}\/\d{4}\)\s?to\s?\(\d{2}\/\d{2}\/\d{4}\))\)|\((from\s?\(dd\/mm\/yyyy\)\s?to\s?\(dd\/mm\/yyyy\))\)/,
    'gi'
)

export const isEndOfString = (str: string, pattern: RegExp): boolean => {
    const trimmed = str.trim()
    const matches = trimmed.match(pattern)

    if (!matches || !matches.length) return false

    const lastMatch = matches[matches.length - 1]
    return trimmed.lastIndexOf(lastMatch) + lastMatch.length === trimmed.length
}

export const isEndingWithDateIntervalPattern = (str: string) => {
    return (
        isEndOfString(str, dateIntervalPattern) ||
        isEndOfString(str, startDatePattern) ||
        isEndOfString(str, endDatePattern)
    )
}

export const replaceDateInterval = (
    str: string,
    dateInterval: DateInterval
) => {
    const dateFrom = new Date(dateInterval.from)
    const dateTo = new Date(dateInterval.to)
    const values = str.match(/\((.*?)\)/g)
    let newStr = ''
    if (!values) return str

    if (values.length > 1) {
        newStr = `(From (${formatDate(dateFrom)}) To (${formatDate(dateTo)}))`
        return replaceLastOccurrence(str, newStr, dateIntervalPattern)
    } else if (values[0].includes('From')) {
        newStr = `(From ${formatDate(dateFrom)})`
        return replaceLastOccurrence(str, newStr, startDatePattern)
    } else if (values[0].includes('To')) {
        newStr = `(To ${formatDate(dateTo)})`
        return replaceLastOccurrence(str, newStr, endDatePattern)
    }
}

const formatDate = (date: Date): string => {
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
