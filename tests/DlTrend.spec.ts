import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import { DlTrend } from '../src/'

describe('DlTrend', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlTrend, {
                props: {
                    value: 50,
                    direction: 'up'
                }
            })
        })
        it('should exist component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should the right isUp compute prop', function () {
            expect(wrapper.vm.isUp).toBe(true)
        })
        describe('When you change text value', () => {
            let TEXT_VALUE: string
            beforeAll(async () => {
                TEXT_VALUE = 'some text value'
                await wrapper.setProps({ value: TEXT_VALUE })
            })
            it('should the right computedValue', function () {
                const computedValue = wrapper.vm.computedValue
                expect(computedValue).toEqual(TEXT_VALUE)
            })
        })
        describe('When you change color prop', () => {
            beforeAll(async () => {
                await wrapper.setProps({ color: 'negative' })
            })
            it('should the right computedColor', function () {
                expect(wrapper.vm.computedColor).toBe(
                    'var(--dell-red-500, var(--dell-gray-800))'
                )
            })
        })
    })

    it("should accept only 'up' or 'down' options", () => {
        const validator = DlTrend.props.direction.validator

        expect(validator('up')).toBe(true)
        expect(validator('left')).toBe(false)
    })
})
