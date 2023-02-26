import { Calendar } from '../../src/components/DlDatePicker/classes/Calendar'
import { CalendarDate } from '../../src/components/DlDatePicker/classes/CalendarDate'
import { CustomDate } from '../../src/components/DlDatePicker/classes/CustomDate'

jest.useFakeTimers('modern')
jest.setSystemTime(new Date(1990, 12, 1))

describe('Calendar', () => {
    it('should get and set the dates of the calendar object', () => {
        const date = new Date(1990, 12, 1).toISOString()
        const calendarDate = new CalendarDate(date)
        const calendar = new Calendar(calendarDate)

        expect(calendar.dates[2].toString()).toMatch(date)
        calendar.dateTitle = 'Jan 1991'
        expect(calendar.dateTitle).toMatch('Jan 1991')
        calendar.monthTitle = '19911'
        expect(calendar.monthTitle).toMatch('19911')
        calendar.currentDate = calendarDate
        expect(calendar.currentDate).toEqual(calendarDate)
        calendar.activeDate = calendarDate
        expect(calendar.activeDate).toEqual(calendarDate)
        calendar.moveToNextMonth()
        expect(calendar.dates[0].month()).toBe(0)
        calendar.moveToNextYear()
        expect(calendar.dates[0].year()).toBe(1991)
        calendar.moveToPreviousMonth()
        expect(calendar.dates[0].month()).toBe(11)
        calendar.moveToPreviousYear()
        expect(calendar.dates[0].year()).toBe(1989)
    })
})

describe('CustomDate', () => {
    it('should get information about the properties of the date object', () => {
        const date = new Date(1990, 12, 1)
        let customDate = new CustomDate(date.toString())

        customDate.date(10)
        expect(customDate.date()).toBe(10)

        customDate.month(1)
        expect(customDate.month()).toBe(1)

        customDate.year(2000)
        expect(customDate.year()).toBe(2000)

        customDate.hours(10)
        expect(customDate.hours()).toBe(10)

        customDate.minutes(10)
        expect(customDate.minutes()).toBe(10)

        const afterDate = new CustomDate(new Date(2005, 12, 1).toString())

        customDate = new CustomDate(date.toString())

        expect(afterDate.isSameOrAfter(customDate)).toBeTruthy()
        expect(afterDate.isAfter(customDate)).toBeTruthy()
        expect(customDate.isSameOrBefore(afterDate)).toBeTruthy()
        expect(customDate.isBefore(afterDate)).toBeTruthy()

        expect(customDate.toString()).toMatch(date.toISOString())
    })

    afterAll(() => {
        jest.useRealTimers()
    })
})
