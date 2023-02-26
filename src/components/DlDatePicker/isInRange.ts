import { CustomDate } from './classes/CustomDate'
import { DateInterval } from './types'

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
