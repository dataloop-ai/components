import { CalendarDate } from './classes/CalendarDate'

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
