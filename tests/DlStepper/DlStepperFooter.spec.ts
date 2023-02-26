import { mount } from '@vue/test-utils'
import DlStepperFooter from '../../src/components/DlStepper/DlStepperFooter.vue'

describe('DlStepperFooter', () => {
    it('should trigger the close & done events depending on the prop', async () => {
        const wrapper = mount(DlStepperFooter, {
            props: { finished: true }
        })

        const [prevBtn, nextBtn, createButton] = wrapper.findAll('button')

        await wrapper.setProps({
            hasPreviousStep: true
        })
        // const prevBtn = wrapper.find('button')
        expect(prevBtn.text()).toEqual('Back')
        await prevBtn.trigger('click')
        expect(wrapper.emitted()['prev'][0]).toBeTruthy()

        await wrapper.setProps({
            hasPreviousStep: false,
            hasNextStep: true
        })

        // const nextBtn = wrapper.findAll('button').at(1)
        expect(nextBtn.text()).toEqual('Next')
        await nextBtn.trigger('click')
        expect(wrapper.emitted()['next'][0]).toBeTruthy()

        await createButton.trigger('click')
        expect(wrapper.emitted()['done'][0]).toBeTruthy()

        await wrapper.setProps({ finished: false })
        await createButton.trigger('click')
        expect(wrapper.emitted()['done'][1]).toBeFalsy()
    })
})
