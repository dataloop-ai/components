import { CustomDate } from '../../src/components/DlDatePicker/classes/CustomDate'
import { isInRange } from '../../src/components/DlDatePicker/isInRange'
import { DateInterval } from '../../src/components/DlDatePicker/types'

const range = {
    from: new Date('2023-01-01T12:39:55.854Z'),
    to: new Date('2023-02-01T12:39:55.854Z')
}

const inRangeCustomDate = new CustomDate('2023-01-21T12:39:55.854Z')
const outsideRangeCustomDate = new CustomDate('2023-02-03T12:39:55.854Z')

const inRangeDateInterval: DateInterval = {
    from: new Date('2023-01-05T12:39:55.854Z'),
    to: new Date('2023-01-10T12:39:55.854Z')
}
const outsideRangeDateInterval: DateInterval = {
    from: new Date('2022-12-01T12:39:55.854Z'),
    to: new Date('2023-03-01T12:39:55.854Z')
}

describe('isInRange', () => {
    describe('when the value is null', () => {
        it('should return true', () => {
            expect(isInRange(range, null)).toBe(true)
        })
    })

    describe('when the range is null', () => {
        it('should return true', () => {
            expect(isInRange(null, inRangeCustomDate)).toBe(true)
        })
    })

    describe('when the range has from and to set to null', () => {
        it('should return true', () => {
            expect(isInRange({}, inRangeCustomDate)).toBe(true)
        })
    })

    describe('when value is a DateInterval', () => {
        describe('when both range keys are provided', () => {
            it('should compare using both keys', () => {
                expect(isInRange(range, inRangeDateInterval)).toBe(true)
            })
        })

        describe('when only the from key is provided', () => {
            it('should compare using the from key', () => {
                expect(
                    isInRange({ from: range.from }, outsideRangeDateInterval)
                ).toBe(false)
            })
        })

        describe('when only the to key is provided', () => {
            it('should compare using the from key', () => {
                expect(
                    isInRange({ to: range.to }, outsideRangeDateInterval)
                ).toBe(false)
            })
        })
    })

    describe('when value is a CustomDate', () => {
        describe('when both range keys are provided', () => {
            it('should compare using both keys', () => {
                expect(isInRange(range, inRangeCustomDate)).toBe(true)
            })
        })

        describe('when only the from key is provided', () => {
            it('should compare using the from key', () => {
                expect(
                    isInRange({ from: range.from }, outsideRangeCustomDate)
                ).toBe(true)
            })
        })

        describe('when only the to key is provided', () => {
            it('should compare using the from key', () => {
                expect(
                    isInRange({ to: range.to }, outsideRangeCustomDate)
                ).toBe(false)
            })
        })
    })
})
