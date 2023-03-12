import { mount } from '@vue/test-utils'
import { DlStepper } from '../../src'
import { StepState } from '../../src/components/DlStepper/interfaces'
import { describe, it, expect } from 'vitest'

describe('DlStepper', () => {
    it('should render the stepper', async () => {
        const headerTitle = 'title'
        const contentTitle = 'Content Title'
        const wrapper = mount(DlStepper, {
            props: {
                modelValue: true,
                headerTitle,
                width: '800px',
                contentTitle,
                doneButtonLabel: 'Done',
                hasNextStep: true,
                hasPrevStep: false,
                isDone: false
            }
        })

        expect(wrapper.text()).toContain(headerTitle)

        const options: StepState[] = [
            {
                value: 'general',
                title: 'general',
                completed: true
            },
            {
                value: 'data',
                title: 'data',
                completed: true
            },
            {
                value: 'instructions',
                title: 'instructions'
            },
            {
                value: 'assignments',
                title: 'assignments'
            },
            {
                value: 'quality',
                title: 'quality',
                optional: true
            }
        ]

        await wrapper.setProps({
            steps: options,
            modelValue: false
        })

        // to trigger the watch
        await wrapper.setProps({
            modelValue: true
        })
        expect(wrapper.vm.isOpen).toBe(true)

        wrapper.vm.closeStepper()
    })
})
