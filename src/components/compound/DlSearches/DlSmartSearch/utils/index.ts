export * from './highlightSyntax'

import { dateIntervalPattern } from '../../../../../hooks/use-suggestions'
import { DateInterval } from '../../../DlDateTime/types'

export const isEndOfString = (str: string, pattern: RegExp): boolean => {
    const trimmed = str.trim()
    const matches = trimmed.match(pattern)

    if (!matches || !matches.length) return false

    const lastMatch = matches[matches.length - 1]
    return trimmed.lastIndexOf(lastMatch) + lastMatch.length === trimmed.length
}

export const isEndingWithDateIntervalPattern = (str: string) =>
    isEndOfString(str, dateIntervalPattern)

export const replaceDateInterval = (
    str: string,
    dateInterval: DateInterval
) => {
    const dateFrom = new Date(dateInterval.from)
    const dateTo = new Date(dateInterval.to)

    const newStr = `(From ${formatDate(dateFrom)} To ${formatDate(dateTo)})`

    return replaceLastOccurrence(str, newStr)
}

const formatDate = (date: Date): string => {
    return `(${addZero(date.getDate())}/${addZero(
        date.getMonth() + 1
    )}/${date.getFullYear()})`
}

const addZero = (value: number): string => {
    return value < 10 ? `0${value}` : value.toString()
}

const replaceLastOccurrence = (string: string, replaceValue: string) => {
    const matches = string.match(dateIntervalPattern)

    return matches && matches.length
        ? string.replace(matches[matches.length - 1], replaceValue)
        : string
}
