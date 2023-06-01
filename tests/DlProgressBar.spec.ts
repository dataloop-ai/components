import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeAll } from 'vitest'
import { DlProgressBar } from '../src/'

describe('DlProgressBar', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlProgressBar, {
                props: {
                    label: 'test label'
                }
            })
        })
        it('should exist', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should render the given label prop', () => {
            const label = wrapper.find('[data-test-id="progress-label"]')
                ?.element as HTMLElement
            expect(label).not.toBe(undefined)
        })
    })
    it('should accept only values between 0 and 1', () => {
        const validator = DlProgressBar.props.value.validator

        expect(validator(0.5)).toBe(true)
        expect(validator(5)).toBe(false)
    })
})
