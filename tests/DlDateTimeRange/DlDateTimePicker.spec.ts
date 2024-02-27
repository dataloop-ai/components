import { mount } from '@vue/test-utils'
import { DlDateTimePicker } from '../../src/components'
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi
} from 'vitest'

const date = new Date(1990, 12, 1)

vi.useFakeTimers('modern' as any)
vi.setSystemTime(new Date(date))

describe('Date Time Picker', () => {
    let wrapper: any

    beforeEach(async () => {
        wrapper = mount(DlDateTimePicker, {
            props: {
                modelValue: date
            }
        })
    })

    it('should have date range with both ends equal', () => {
        expect(wrapper.vm.dateInterval).toEqual({
            from: date,
            to: date
        })
    })

    it('should clear the selection on click Clear button', async () => {
        wrapper.vm.handleClearAction()
        expect(wrapper.vm.dateInterval).toEqual(null)
        expect(wrapper.vm.isInputDisabled).toEqual(false)
    })

    afterAll(() => {
        vi.useRealTimers()
    })
})
