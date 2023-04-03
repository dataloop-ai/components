import { CalendarDate } from './CalendarDate'

export class Calendar {
    private _dateTitle: string
    private _monthTitle: string
    private _currentDate: CalendarDate
    private _activeDate: CalendarDate
    private _dates: CalendarDate[] = []

    constructor(date?: CalendarDate) {
        this._currentDate = date || new CalendarDate()
        this._activeDate = new CalendarDate(this._currentDate)

        this._dateTitle = ''
        this._monthTitle = ''
        this._updateState()
    }

    private _updateState() {
        this._dateTitle = this._activeDate.format('MMMM YYYY')
        this._monthTitle = this._activeDate.format('YYYY')

        const startOfMonth = this._activeDate.clone().startOf('month')
        const endOfMonth = this._activeDate.clone().endOf('month')

        let startDate = new CalendarDate(startOfMonth.day(0))

        const endDate = new CalendarDate(endOfMonth.day(6))

        this._dates = []

        while (startDate.isSameOrBefore(endDate)) {
            if (
                startDate.isSame(this._currentDate, 'day') &&
                startDate.isSame(this._currentDate, 'month')
            ) {
                startDate.isCurrent = true
            } else {
                startDate.isCurrent = false
            }

            if (!startDate.isSame(this._activeDate, 'month')) {
                startDate.isDisabled = true
            }

            this._dates.push(startDate)
            startDate = new CalendarDate(startDate.clone().add(1, 'd'))
        }
    }

    public get dates(): CalendarDate[] {
        return this._dates
    }

    public get dateTitle(): string {
        return this._dateTitle
    }

    public set dateTitle(value: string) {
        this._dateTitle = value
    }

    public get monthTitle(): string {
        return this._monthTitle
    }

    public set monthTitle(value: string) {
        this._monthTitle = value
    }

    public get currentDate(): CalendarDate {
        return this._currentDate
    }

    public set currentDate(value: CalendarDate) {
        this._currentDate = value
        this._dates.forEach((date) => {
            date.isCurrent = date.isSame(value)
        })
    }

    public get activeDate(): CalendarDate {
        return this._activeDate
    }

    public set activeDate(value: CalendarDate) {
        this._activeDate = value
        this._updateState()
    }

    public moveToNextMonth() {
        this._activeDate.add(1, 'M').startOf('month')
        this._updateState()
    }

    public moveToPreviousMonth() {
        this._activeDate.subtract(1, 'M').startOf('month')
        this._updateState()
    }

    public moveToNextYear() {
        this._activeDate.add(1, 'y').startOf('year')
        this._updateState()
    }

    public moveToPreviousYear() {
        this._activeDate.subtract(1, 'y').startOf('year')
        this._updateState()
    }
}
