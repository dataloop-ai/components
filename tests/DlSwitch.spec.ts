import { mount } from '@vue/test-utils'
import { DlSwitch } from '../src/'
import {
    calculateActiveMarginLeft,
    calculateBorderRadius,
    calculateCircleRadius,
    calculateMargin,
    calculateWidth
} from '../src/utils'

describe('Switch Utils', () => {
    it('should calculate switch width', () => {
        expect(calculateWidth(24)).toEqual(50)
    })

    it('should calculate indicator margin', () => {
        expect(calculateMargin(36)).toEqual(3)
    })

    it('should calculate indicator radius', () => {
        expect(calculateCircleRadius(48)).toEqual(40)
    })

    it('should calculate indicator left margin in active position', () => {
        expect(calculateActiveMarginLeft(36)).toEqual(42)
    })

    it('should calculate border radius of the element', () => {
        expect(calculateBorderRadius(36)).toEqual(18)
    })
})

describe('DlSwitch', () => {
    it('should render the given left label prop', () => {
        const wrapper = mount(DlSwitch, {
            props: {
                leftLabel: 'Switch Label',
                modelValue: [5],
                value: 4
            }
        })

        const label = wrapper.find('.left')?.element as HTMLElement
        expect(label).not.toBe(undefined)
    })

    it('should render the given right label prop', () => {
        const wrapper = mount(DlSwitch, {
            props: {
                rightLabel: 'Switch Label',
                modelValue: [5, 3, 4],
                value: 3
            }
        })

        const label = wrapper.find('.right')?.element as HTMLElement
        expect(label).not.toBe(undefined)
    })

    it('should apply default labelProps font size', () => {
        const wrapper = mount(DlSwitch, {
            props: {
                rightLabel: 'Switch Label',
                modelValue: ['dog', 'house'],
                value: 'car',
                labelProps: {
                    fontSize: undefined,
                    color: 'dl-color-secondary'
                }
            }
        })

        expect(wrapper.vm.cssLabelVars['--dl-label-font-size']).toBe('12px')
    })

    it('should have true isChecked computed value if the value is in v-model array', () => {
        const wrapper = mount(DlSwitch, {
            props: {
                rightLabel: 'Switch Label',
                modelValue: ['rabbit', 'wolf'],
                value: 'rabbit'
            }
        })

        expect(wrapper.vm.isTrue).toBe(true)
    })

    it("should have false isChecked computed value if the value isn't in v=model array", () => {
        const wrapper = mount(DlSwitch, {
            props: {
                rightLabel: 'Switch Label',
                modelValue: ['rabbit', 'wolf'],
                value: 'bear'
            }
        })

        expect(wrapper.vm.isTrue).toBe(false)
    })

    it('should emit @update:model-value event', async () => {
        const wrapper = mount(DlSwitch, {
            props: {
                modelValue: [53, 32, 42],
                value: 999
            }
        })

        wrapper.vm.$emit('update:model-value')
        wrapper.vm.$emit('update:model-value', 42)

        await wrapper.vm.$nextTick()
        expect(wrapper.emitted()['update:model-value']).toBeTruthy()
        expect(wrapper.emitted()['update:model-value'][1]).toEqual([42])
    })

    it('should emit @update:model-value event on value change', async () => {
        const wrapper = mount(DlSwitch, {
            props: {
                modelValue: ['one', 'two', 'three'],
                value: 'two'
            }
        })

        wrapper.find('input').trigger('change')

        await wrapper.vm.$nextTick()
        expect(wrapper.emitted()['update:model-value']).toBeTruthy()
    })

    it('should emit @update:model-value event without the current value element', async () => {
        const wrapper = mount(DlSwitch, {
            props: {
                modelValue: ['one', 'two'],
                value: 'three'
            }
        })

        wrapper.find('input').element.checked = true
        wrapper.find('input').trigger('change')

        await wrapper.vm.$nextTick()
        expect(wrapper.emitted()['update:model-value']).toBeTruthy()
        expect(wrapper.emitted()['update:model-value'][0]).toContainEqual([
            'one',
            'two',
            'three'
        ])
    })

    it('should emit @update:model-value event without the current value element', async () => {
        const wrapper = mount(DlSwitch, {
            props: {
                modelValue: ['one', 'two', 'three'],
                value: 'two'
            }
        })

        wrapper.find('input').element.checked = false
        wrapper.find('input').trigger('change')

        await wrapper.vm.$nextTick()
        expect(wrapper.emitted()['update:model-value']).toBeTruthy()
        expect(wrapper.emitted()['update:model-value'][0]).toContainEqual([
            'one',
            'three'
        ])
    })
})
