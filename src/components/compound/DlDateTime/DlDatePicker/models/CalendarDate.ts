import { CustomDate } from './CustomDate'

export class CalendarDate extends CustomDate {
    public isCurrent: boolean
    public isDisabled: boolean

    constructor(date?: CalendarDate | CustomDate | Date | string) {
        super(date)
        this.isCurrent = false
        this.isDisabled = false
    }
}
