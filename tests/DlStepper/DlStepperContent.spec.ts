import { mount } from '@vue/test-utils'
import DlStepperContent from '../../src/components/compound/DlStepper/components/DlStepperContent.vue'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlStepperContent', () => {
    describe('When mounting', () => {
        let wrapper: any
        const title = 'Title'

        beforeAll(() => {
            wrapper = mount(DlStepperContent, {
                props: { title, error: 'fields are required' }
            })
        })
        it('should mount the component', () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should have the right text', () => {
            expect(wrapper.text()).toContain(title)
            expect(wrapper.text()).toContain('fields are required')
        })
        describe('When completed', () => {
            beforeAll(async () => {
                await wrapper.setProps({
                    error: '',
                    completed: true
                })
            })
            it('should ', () => {
                expect(wrapper.text()).toContain('completed')
            })
        })
    })
})
