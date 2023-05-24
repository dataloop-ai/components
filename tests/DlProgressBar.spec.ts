import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { DlProgressBar } from '../src/'

describe('DlProgressBar', () => {
    it('should render the given label prop', () => {
        const wrapper = mount(DlProgressBar, {
            props: {
                color: 'dl-color-secondary',
                label: 'test label',
                showValue: false,
                showPercentage: false,
                value: 0,
                indeterminate: false,
                width: '100%',
                height: '4px',
                summary: ''
            }
        })

        const label = wrapper.find('[data-test-id="progress-label"]')
            ?.element as HTMLElement
        expect(label).not.toBe(undefined)

        expect(wrapper.props()).toStrictEqual({
            color: 'dl-color-secondary',
            label: 'test label',
            showValue: false,
            showPercentage: false,
            value: 0,
            indeterminate: false,
            width: '100%',
            height: '4px',
            summary: ''
        })
    })
    it('should accept only values between 0 and 1', () => {
        const validator = DlProgressBar.props.value.validator

        expect(validator(0.5)).toBe(true)
        expect(validator(5)).toBe(false)
    })
})
