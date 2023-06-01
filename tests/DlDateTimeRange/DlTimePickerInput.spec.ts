import { mount } from '@vue/test-utils'
import DlTimePickerInput from '../../src/components/compound/DlDateTime/DlTimePicker/components/DlTimePickerInput.vue'
import { describe, it, expect, afterAll, vi, beforeAll } from 'vitest'

vi.useFakeTimers('modern' as any)
vi.setSystemTime(new Date(1990, 12, 1))

describe('Time Picker Input', () => {
    describe('When switch between dates back and forth upon clicking the up and down buttons', () => {
        const time = { hour: '09', minute: '11' }
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlTimePickerInput, {
                props: {
                    modelValue: time
                }
            })
        })

        it('should have the right time', () => {
            expect(wrapper.vm.options[0].hour).toMatch('06')
            expect(wrapper.vm.options[0].minute).toMatch('08')
        })
        it('should have the right time', () => {
            wrapper.vm.handleHourDownChevronClick()
            expect(wrapper.vm.options[0].hour).toMatch('13')
            wrapper.vm.handleHourUpChevronClick()
            expect(wrapper.vm.options[0].hour).toMatch('06')
        })
        it('should have the right time', () => {
            wrapper.vm.handleMinuteUpChevronClick()
            expect(wrapper.vm.options[0].minute).toMatch('01')
            wrapper.vm.handleMinuteDownChevronClick()
            expect(wrapper.vm.options[0].minute).toMatch('08')
        })
    })

    afterAll(() => {
        vi.useRealTimers()
    })
})
