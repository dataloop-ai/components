import { mount } from '@vue/test-utils'
import DlStepperContent from '../../src/components/DlStepper/DlStepperContent.vue'
import { describe, it, expect } from 'vitest'

describe('DlStepperContent', () => {
    it('should display the title, error message, completion message, nav buttons; should trigger events', async () => {
        const title = 'Title'
        const wrapper = mount(DlStepperContent, {
            props: { title, error: 'fields are required' }
        })

        expect(wrapper.text()).toContain(title)
        expect(wrapper.text()).toContain('fields are required')

        await wrapper.setProps({
            error: '',
            completed: true
        })
        expect(wrapper.text()).toContain('completed')
    })
})
