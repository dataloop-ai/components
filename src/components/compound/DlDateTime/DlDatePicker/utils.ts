import { CalendarDate } from './models/CalendarDate'
import { CustomDate } from './models/CustomDate'
import { DateInterval } from './types'

export const getWeekDayNames = (): string[] => {
    const start = new CalendarDate().day(0)
    const end = new CalendarDate().day(6)

    const weekDayNames = []

    while (start.isSameOrBefore(end)) {
        weekDayNames.push(start.format('dddd').substring(0, 2))

        start.add(1, 'day')
    }

    return weekDayNames
}

export type Month = {
    name: string
    value: number
}

export const getMonths = (): Month[] => {
    const start = new CalendarDate().month(0)
    const end = new CalendarDate().month(11)

    const months = []

    while (start.isSameOrBefore(end)) {
        months.push({
            name: start.format('MMM'),
            value: start.month()
        })

        start.add(1, 'month')
    }

    return months
}

export function isInRange(
    range: Partial<DateInterval> | null,
    value: CustomDate | DateInterval | null
): boolean {
    const unit = 'day'
    if (!value || !range || Object.values(range).every((key) => !key))
        return true

    const valueFrom =
        'from' in value
            ? new CustomDate(value.from).startOf(unit)
            : value.startOf(unit)
    const valueTo =
        'to' in value
            ? new CustomDate(value.to).startOf(unit)
            : value.startOf(unit)

    const rangeFrom = range.from && new CustomDate(range.from)
    const rangeTo = range.to && new CustomDate(range.to)

    if (rangeFrom && rangeTo) {
        return (
            valueFrom.isSameOrAfter(rangeFrom, unit) &&
            valueTo.isSameOrBefore(rangeTo, unit)
        )
    }

    if (!rangeFrom) {
        return (
            valueFrom.isSameOrBefore(rangeTo, unit) &&
            valueTo.isSameOrBefore(rangeTo, unit)
        )
    }

    if (!rangeTo) {
        return (
            valueFrom.isSameOrAfter(rangeFrom, unit) &&
            valueTo.isSameOrAfter(rangeFrom, unit)
        )
    }
}
