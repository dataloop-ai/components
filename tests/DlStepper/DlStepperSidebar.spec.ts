import { mount } from '@vue/test-utils'
import DlStepperSidebar from '../../src/components/DlStepper/DlStepperSidebar.vue'
import { StepState } from '../../src/components/DlStepper/interfaces'
import { describe, it, expect } from 'vitest'

describe('DlStepperSidebar', () => {
    it('should render the steps', async () => {
        const steps: StepState[] = [
            {
                title: 'active step',
                value: 'active',
                active: true
            },
            {
                title: 'completed step',
                value: 'completed',
                completed: true
            },
            {
                title: 'optional step',
                value: 'optional',
                optional: true
            },
            {
                title: 'with subtitle',
                value: 'withSubtitle',
                subtitle: '--subtitle'
            },
            {
                title: 'error step',
                value: 'error',
                error: 'custom error'
            },
            {
                title: 'disabled step',
                value: 'disabled'
                // disabled: true
            }
        ]
        const wrapper = mount(DlStepperSidebar, {
            props: {}
        })

        let listItems = wrapper.findAll('[data-test-index]')
        expect(listItems.length).toBe(0)

        await wrapper.setProps({ steps })
        listItems = wrapper.findAll('[data-test-index]')
        expect(listItems[0].text()).toEqual('1. Active step')
        expect(listItems[1].text()).toEqual('2. Completed step')
        expect(listItems[2].text()).toEqual('3. Optional step (Optional)')
        expect(listItems[3].text()).toEqual('4. With subtitle--subtitle')
        expect(listItems[4].text()).toEqual('5. Error step')
        expect(listItems[5].text()).toEqual('6. Disabled step')

        wrapper.vm.handleStepClick({}, 1)
        await listItems[1].trigger('click')

        expect(wrapper.emitted()['step-click'][0]).toBeTruthy()
        expect(wrapper.vm.getStepSubtitle(steps[0])).toEqual('')
        expect(wrapper.vm.getStepSubtitle(steps[3])).toEqual('--subtitle')
    })
})
