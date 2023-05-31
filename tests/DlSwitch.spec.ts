import { mount } from '@vue/test-utils'
import { DlSwitch } from '../src/'
import { beforeAll, describe, expect, it } from 'vitest'
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
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlSwitch, {
                props: {
                    rightLabel: 'Switch Label',
                    leftLabel: 'Switch Label',
                    modelValue: ['rabbit', 'wolf'],
                    value: 'rabbit',
                    labelProps: {
                        fontSize: undefined,
                        color: 'dl-color-secondary'
                    }
                }
            })
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should render the given left label prop', function () {
            const label = wrapper.find('.left')?.element as HTMLElement
            expect(label).not.toBe(undefined)
        })
        it('should render the given right label prop', function () {
            const label = wrapper.find('.right')?.element as HTMLElement
            expect(label).not.toBe(undefined)
        })
        it('should apply default labelProps font size', function () {
            expect(wrapper.vm.cssLabelVars['--dl-label-font-size']).toBe('12px')
        })
        it('should have true isChecked computed value if the value is in v-model array', function () {
            expect(wrapper.vm.isTrue).toBe(true)
        })
    })
    describe('When update value', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlSwitch, {
                props: {
                    modelValue: [53, 32, 42],
                    value: 999
                }
            })
            wrapper.vm.$emit('update:model-value')
            wrapper.vm.$emit('update:model-value', 42)

            await wrapper.vm.$nextTick()
        })
        it('should emit @update:model-value event', function () {
            expect(wrapper.emitted()['update:model-value']).toBeTruthy()
            expect(wrapper.emitted()['update:model-value'][1]).toEqual([42])
        })
        it('should emit @update:model-value event on value change', async function () {
            wrapper.find('input').trigger('change')

            await wrapper.vm.$nextTick()
            expect(wrapper.emitted()['update:model-value']).toBeTruthy()
        })
    })
    describe('When emit @update:model-value event without the current value element', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlSwitch, {
                props: {
                    modelValue: ['one', 'two'],
                    value: 'three'
                }
            })
            wrapper.find('input').element.checked = true
            wrapper.find('input').trigger('change')

            await wrapper.vm.$nextTick()
        })
        it('should emit @update:model-value', function () {
            expect(wrapper.emitted()['update:model-value']).toBeTruthy()
            expect(wrapper.emitted()['update:model-value'][0]).toContainEqual([
                'one',
                'two',
                'three'
            ])
        })
    })
    describe('When emit @update:model-value event without the current value element', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlSwitch, {
                props: {
                    modelValue: ['one', 'two', 'three'],
                    value: 'two'
                }
            })
            wrapper.find('input').element.checked = false
            wrapper.find('input').trigger('change')

            await wrapper.vm.$nextTick()
        })
        it('should emit @update:model-value', function () {
            expect(wrapper.emitted()['update:model-value']).toBeTruthy()
            expect(wrapper.emitted()['update:model-value'][0]).toContainEqual([
                'one',
                'three'
            ])
        })
    })
})
