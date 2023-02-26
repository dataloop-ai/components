import { mount } from '@vue/test-utils'
import DlTimePicker from '../../src/components/DlTimePicker/DlTimePicker.vue'
import { CustomDate } from '../../src/components/DlDatePicker/classes/CustomDate'

jest.useFakeTimers('modern')
jest.setSystemTime(new Date(1990, 12, 1))

describe('Time picker', () => {
    it('should emit new values for the time object when the methods are called', () => {
        const date = new Date(1990, 12, 1)
        const date2 = new Date(1990, 12, 2)
        const customDate = new CustomDate(date.toString())
        const customDate2 = new CustomDate(date2.toString())

        const wrapper = mount(DlTimePicker, {
            props: {
                modelValue: {
                    from: date,
                    to: date2
                }
            }
        })
        const from = {
            hour: '00',
            minute: '00'
        }
        const to = {
            hour: '00',
            miunte: '00'
        }

        wrapper.vm.handleFromTimeChange(from)
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
            { from: date, to: date2 }
        ])
        wrapper.vm.handleToTimeChange(to)
        expect(wrapper.emitted()['update:modelValue'][1]).toEqual([
            { from: date, to: date2 }
        ])
    })

    afterAll(() => {
        jest.useRealTimers()
    })
})
