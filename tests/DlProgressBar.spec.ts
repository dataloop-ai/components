import { mount } from '@vue/test-utils'
import { DlProgressBar } from '../src/'

describe('DlProgressBar', () => {
    it('should render the given label prop', () => {
        const wrapper = mount(DlProgressBar, {
            props: {
                label: 'test label'
            }
        })

        const label = wrapper.find('[data-test-id="progress-label"]')
            ?.element as HTMLElement
        expect(label).not.toBe(undefined)
    })
    it('should accept only values between 0 and 1', () => {
        const validator = DlProgressBar.props.value.validator

        expect(validator(0.5)).toBe(true)
        expect(validator(5)).toBe(false)
    })
})
