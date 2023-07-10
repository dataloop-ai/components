import { mount, VueWrapper } from '@vue/test-utils'
import DlDateInput from '../../src/components/compound/DlDateTime/DlDateTimeRange/DateInput.vue'
import { describe, beforeAll, expect, it } from 'vitest'

describe('DlDateInput', () => {
    let wrapper: VueWrapper<any>
    beforeAll(() => {
        wrapper = mount(DlDateInput)
    })
    it('will mount', () => {
        expect(wrapper.exists()).toBe(true)
    })
})
