import {
    getWeekDayNames,
    getMonths
} from '../../src/components/compound/DlDateTime/DlDatePicker/utils'
import { describe, it, expect } from 'vitest'

const months = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 1 },
    { name: 'Mar', value: 2 },
    { name: 'Apr', value: 3 },
    { name: 'May', value: 4 },
    { name: 'Jun', value: 5 },
    { name: 'Jul', value: 6 },
    { name: 'Aug', value: 7 },
    { name: 'Sep', value: 8 },
    { name: 'Oct', value: 9 },
    { name: 'Nov', value: 10 },
    { name: 'Dec', value: 11 }
]

describe('DlDatePickerUtils', () => {
    it('should get the week days', () => {
        expect(getWeekDayNames()).toEqual([
            'Su',
            'Mo',
            'Tu',
            'We',
            'Th',
            'Fr',
            'Sa'
        ])
    })

    it('should get the month days', () => {
        expect(getMonths()).toEqual(months)
    })
})
