import { mount } from '@vue/test-utils'
import DlStepperHeader from '../../src/components/compound/DlStepper/components/DlStepperHeader.vue'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlStepperHeader', () => {
    describe('When mounted', () => {
        let wrapper: any
        const headerTitle = 'Title'
        beforeAll(() => {
            wrapper = mount(DlStepperHeader, {
                props: { headerTitle }
            })
        })
        it('should mount the component', () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should have the right text', () => {
            expect(wrapper.text()).toContain(headerTitle)
        })
        it('should emitted click', async () => {
            const button = wrapper.find('button')
            await button.trigger('click')
            expect(wrapper.emitted()['close'][0]).toBeTruthy()
        })
    })
})
