export * from './highlightSyntax'
export * from './utils'

import { DateInterval } from '../../../DlDateTime/types'
import {
    datePattern,
    datePatternNoBrackets
} from '../../../../../hooks/use-suggestions'

export const isEndOfString = (str: string, pattern: RegExp): boolean => {
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
