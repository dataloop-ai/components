export * from './highlightSyntax'
export * from './utils'

import { datePattern } from '../../../../../hooks/use-suggestions'
import { DateInterval } from '../../../DlDateTime/types'

export const isEndOfString = (str: string, pattern: RegExp): boolean => {
    const trimmed = str.trim()
    const matches = trimmed.match(pattern)

    if (!matches || !matches.length) return false

    const lastMatch = matches[matches.length - 1]

    return (
        trimmed.lastIndexOf(lastMatch) + lastMatch.length + 1 === trimmed.length
    )
}

export const isEndingWithDateIntervalPattern = (str: string) => {
    return isEndOfString(str, datePattern)
}

export const replaceDateInterval = (str: string, date: DateInterval) => {
    const newStr = `${formatDate(date.from)}`
    return replaceLastOccurrence(str, newStr, datePattern)
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
