import { mount } from '@vue/test-utils'
import { DlStepper } from '../../src/components'
import { StepState } from '../../src/components/types'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlStepper', () => {
    const headerTitle = 'title'
    const contentTitle = 'Content Title'
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlStepper, {
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
        })
        it('should mount the component', () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should have the right header title', () => {
            expect(wrapper.text()).toContain(headerTitle)
        })
        describe('When set steps', () => {
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
            beforeAll(async () => {
                await wrapper.setProps({
                    steps: options,
                    modelValue: false
                })

                // to trigger the watch
                await wrapper.setProps({
                    modelValue: true
                })
            })
            it('should ', () => {
                expect(wrapper.vm.isOpen).toBe(true)

                wrapper.vm.closeStepper()
            })
        })
    })
})
