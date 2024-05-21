import { mount } from '@vue/test-utils'
import DlStepperSidebar from '../../src/components/compound/DlStepper/components/DlStepperSidebar.vue'
import { StepState } from '../../src/components/types'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlStepperSidebar', () => {
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
        },
        {
            title: 'step with icon',
            value: 'withIcon',
            icon: 'icon-dl-lock'
        }
    ]
    describe('When mounting', () => {
        let wrapper: any
        let listItems: any

        beforeAll(() => {
            wrapper = mount(DlStepperSidebar, {
                props: {}
            })
            listItems = wrapper.findAll('[data-test-index]')
        })
        it('should mount the component', () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should have the right list items length', () => {
            expect(listItems.length).toBe(0)
        })
        describe('When set steps', () => {
            beforeAll(async () => {
                await wrapper.setProps({ steps })
                listItems = wrapper.findAll('[data-test-index]')
            })
            it('should have the right list items text', () => {
                expect(listItems[0].text()).toEqual('1. Active step')
                expect(listItems[1].text()).toEqual('2. Completed step')
                expect(listItems[2].text()).toEqual(
                    '3. Optional step (Optional)'
                )
                expect(listItems[3].text()).toEqual(
                    '4. With subtitle--subtitle'
                )
                expect(listItems[4].text()).toEqual('5. Error step')
                expect(listItems[5].text()).toEqual('6. Disabled step')
            })
            it('should render the icon for the step with an icon', () => {
                const listItemComponent = wrapper.findAllComponents({
                    name: 'DlListItem'
                })[6]
                expect(listItemComponent.props('startIcon').icon).toEqual(
                    'icon-dl-lock'
                )
                expect(listItems[6].text()).to.not.contain('7.')
            })
            it('should apply the active step background class to the active step', () => {
                expect(listItems[0].classes()).to.contain(
                    'sidebar--item-active'
                )
                expect(listItems[1].classes()).to.not.contain(
                    'sidebar--item-active'
                )
            })

            describe('When click on list item', () => {
                beforeAll(async () => {
                    wrapper.vm.handleStepClick({}, 1)
                    await listItems[1].trigger('click')
                })
                it('should emitted click', () => {
                    expect(wrapper.emitted()['step-click'][0]).toBeTruthy()
                })
                it('should have the right step subtitles', () => {
                    expect(wrapper.vm.getStepSubtitle(steps[0])).toEqual('')
                    expect(wrapper.vm.getStepSubtitle(steps[3])).toEqual(
                        '--subtitle'
                    )
                })
            })
        })
    })
})
