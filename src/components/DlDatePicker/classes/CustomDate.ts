import moment, { DurationInputArg1, Moment } from 'moment'

export class CustomDate {
    private _momentDate: Moment = moment()

    constructor(date?: CustomDate | Moment | Date | string) {
        if (date instanceof CustomDate) {
            this._momentDate = date._momentDate.clone()
        } else if (moment.isMoment(date)) {
            this._momentDate = date.clone()
        } else if (typeof date === 'string' || date instanceof Date) {
            this._momentDate = moment(date)
        }
    }

    public day(d: number | string): CustomDate
    public day(): number
    public day(d?: any): any {
        if (typeof d === 'string' || typeof d === 'number') {
            this._momentDate.day(d)

            return this
        }

        return this._momentDate.day()
    }

    public date(d: number): CustomDate
    public date(): number
    public date(d?: any): any {
        if (typeof d === 'number') {
            this._momentDate.date(d)

            return this
        }

        return this._momentDate.date()
    }

    public month(M: string | number): CustomDate
    public month(): number
    public month(M?: any): any {
        if (typeof M === 'string' || typeof M === 'number') {
            this._momentDate.month(M)

            return this
        }

        return this._momentDate.month()
    }

    public year(y: number): CustomDate
    public year(): number
    public year(y?: any): any {
        if (typeof y === 'number') {
            this._momentDate.year(y)

            return this
        }

        return this._momentDate.year()
    }

    public hours(h?: number): CustomDate
    public hours(): number
    public hours(h?: any): any {
        if (typeof h === 'number') {
            this._momentDate.hours(h)

            return this
        }

        return this._momentDate.hours()
    }

    public minutes(m?: number): CustomDate
    public minutes(): number
    public minutes(m?: any): any {
        if (typeof m === 'number') {
            this._momentDate.minutes(m)

            return this
        }

        return this._momentDate.minutes()
    }

    public format(format?: string) {
        return this._momentDate.format(format)
    }

    public toString() {
        return this._momentDate.toISOString()
    }

    public startOf(unitOfTime: string) {
        this._momentDate.startOf(unitOfTime as moment.unitOfTime.StartOf)

        return this
    }

    public endOf(unitOfTime: string) {
        this._momentDate.endOf(unitOfTime as moment.unitOfTime.StartOf)

        return this
    }

    public add(amount: number, unitOfTime: string) {
        this._momentDate.add(
            amount as DurationInputArg1,
            unitOfTime as moment.unitOfTime.DurationConstructor
        )

        return this
    }

    public subtract(amount: number, unitOfTime: string) {
        this._momentDate.subtract(
            amount as DurationInputArg1,
            unitOfTime as moment.unitOfTime.DurationConstructor
        )

        return this
    }

    public clone() {
        return new CustomDate(this)
    }

    public isSame(date: CustomDate, granularity?: string) {
        return this._momentDate.isSame(
            date._momentDate,
            granularity as moment.unitOfTime.StartOf
        )
    }

    public isAfter(date: CustomDate, granularity?: string) {
        return this._momentDate.isAfter(
            date._momentDate,
            granularity as moment.unitOfTime.StartOf
        )
    }

    public isBefore(date: CustomDate, granularity?: string) {
        return this._momentDate.isBefore(
            date._momentDate,
            granularity as moment.unitOfTime.StartOf
        )
    }

    public isSameOrBefore(date: CustomDate, granularity?: string) {
        return this._momentDate.isSameOrBefore(
            date._momentDate,
            granularity as moment.unitOfTime.StartOf
        )
    }

    public isSameOrAfter(date: CustomDate, granularity?: string) {
        return this._momentDate.isSameOrAfter(
            date._momentDate,
            granularity as moment.unitOfTime.StartOf
        )
    }

    public toDate() {
        return this._momentDate.toDate()
    }

    public static toString(date?: string) {
        return moment(date).toISOString()
    }

    public static format(date?: Date | string, format?: string): string {
        return moment(date).format(format)
    }

    public static startOf(unitOfTime: string, date?: string): CustomDate {
        return new CustomDate(
            moment(date).startOf(unitOfTime as moment.unitOfTime.StartOf)
        )
    }

    public static endOf(unitOfTime: string, date?: string): CustomDate {
        return new CustomDate(
            moment(date).endOf(unitOfTime as moment.unitOfTime.StartOf)
        )
    }

    public static add(
        amount: number,
        unitOfTime: string,
        date?: string
    ): CustomDate {
        return new CustomDate(
            moment(date).add(
                amount as DurationInputArg1,
                unitOfTime as moment.unitOfTime.DurationConstructor
            )
        )
    }

    public static subtract(
        amount: number,
        unitOfTime: string,
        date?: string
    ): CustomDate {
        return new CustomDate(
            moment(date).subtract(
                amount as DurationInputArg1,
                unitOfTime as moment.unitOfTime.DurationConstructor
            )
        )
    }

    public static toDate(date: CustomDate) {
        return date._momentDate.toDate()
    }
}
