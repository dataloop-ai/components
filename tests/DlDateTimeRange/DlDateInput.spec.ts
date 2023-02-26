import { mount, VueWrapper } from '@vue/test-utils'
import DlDateInput from '../../src/components/DlDateTimeRange/DlDateInput.vue'

describe('DlDateInput', () => {
    let wrapper: VueWrapper<any>
    beforeAll(() => {
        wrapper = mount(DlDateInput)
    })
    it('will mount', () => {
        expect(wrapper.exists()).toBe(true)
    })
})
