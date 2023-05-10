import { mount } from '@vue/test-utils'
import DlStepperFooter from '../../src/components/compound/DlStepper/components/DlStepperFooter.vue'
import { describe, it, expect } from 'vitest'

describe('DlStepperFooter', () => {
    it('should trigger the close & done events depending on the prop', async () => {
        const wrapper = mount(DlStepperFooter, {
            props: { finished: true }
        })

        const [prevButton, nextButton, createButton] = wrapper.findAll('button')

        await wrapper.setProps({
            hasPreviousStep: true
        })
        // const prevButton = wrapper.find('button')
        expect(prevButton.text()).toEqual('Back')
        await prevButton.trigger('click')
        expect(wrapper.emitted()['prev'][0]).toBeTruthy()

        await wrapper.setProps({
            hasPreviousStep: false,
            hasNextStep: true
        })

        // const nextButton = wrapper.findAll('button').at(1)
        expect(nextButton.text()).toEqual('Next')
        await nextButton.trigger('click')
        expect(wrapper.emitted()['next'][0]).toBeTruthy()

        await createButton.trigger('click')
        expect(wrapper.emitted()['done'][0]).toBeTruthy()

        await wrapper.setProps({ finished: false })
        await createButton.trigger('click')
        expect(wrapper.emitted()['done'][1]).toBeFalsy()
    })
})
