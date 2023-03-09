import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { DlTrend } from '../src/'

describe('DlProgressBar', () => {
    it('should compute values properly', async () => {
        const wrapper = mount(DlTrend, {
            props: {
                value: 50,
                direction: 'up'
            }
        })

        const isUp = wrapper.vm.isUp
        expect(isUp).toBe(true)

        const TEXT_VALUE = 'some text value'
        await wrapper.setProps({ value: TEXT_VALUE })
        const computedValue = wrapper.vm.computedValue
        expect(computedValue).toEqual(TEXT_VALUE)
    })

    it("should accept only 'up' or 'down' options", () => {
        const validator = DlTrend.props.direction.validator

        expect(validator('up')).toBe(true)
        expect(validator('left')).toBe(false)
    })

    it('should take proper color', async () => {
        const wrapper = mount(DlTrend, {
            props: {
                value: 50,
                direction: 'up',
                color: 'negative'
            }
        })

        expect(wrapper.vm.computedColor).toBe(
            'var(--dl-color-negative, var(--dl-color-darker))'
        )

        await wrapper.setProps({ color: null })
        expect(wrapper.vm.computedColor).toBe(
            'var(--dl-color-positive, var(--dl-color-darker))'
        )

        await wrapper.setProps({ direction: 'down' })
        expect(wrapper.vm.computedColor).toBe(
            'var(--dl-color-negative, var(--dl-color-darker))'
        )
    })
})
