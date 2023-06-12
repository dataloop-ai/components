import { mount } from '@vue/test-utils'
import DlStepperFooter from '../../src/components/compound/DlStepper/components/DlStepperFooter.vue'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlStepperFooter', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlStepperFooter, {
                props: { finished: true }
            })
        })
        it('should mount the component', () => {
            expect(wrapper.exists()).toBe(true)
        })
        describe('When trigger the close & done events depending on the prop', () => {
            let prevBtn: any
            let nextBtn: any
            let createButton: any

            beforeAll(() => {
                [prevBtn, nextBtn, createButton] = wrapper.findAll('button')
            })
            it('should have the right prevBtn text', async () => {
                await wrapper.setProps({
                    hasPreviousStep: true
                })
                expect(prevBtn.text()).toEqual('Back')
            })
            it('should emitted click on prevBtn', async () => {
                await prevBtn.trigger('click')
                expect(wrapper.emitted()['prev'][0]).toBeTruthy()
            })
            it('should have the right nextBtn text', async () => {
                await wrapper.setProps({
                    hasPreviousStep: false,
                    hasNextStep: true
                })
                expect(nextBtn.text()).toEqual('Next')
            })
            it('should emitted click on nextBtn', async () => {
                await nextBtn.trigger('click')
                expect(wrapper.emitted()['next'][0]).toBeTruthy()
            })
            it('should emitted click on createButton', async () => {
                await createButton.trigger('click')
                expect(wrapper.emitted()['done'][0]).toBeTruthy()
            })
            it('should emitted click on createButton when finished false', async () => {
                await wrapper.setProps({ finished: false })
                await createButton.trigger('click')
                expect(wrapper.emitted()['done'][1]).toBeFalsy()
            })
        })
    })
})
