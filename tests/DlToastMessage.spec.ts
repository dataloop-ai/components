import { mount } from '@vue/test-utils'
import ToastComponent from '../src/components/DlToastMessage/components/ToastComponent.vue'

describe('DlToastMessage component', () => {
    it('should render the given message prop', () => {
        mount(ToastComponent, {
            props: {
                message: 'Test message'
            }
        })
        const toast = document.body.querySelectorAll('.v-toast__item')
        expect(
            toast[0].querySelector('[data-test="message-text"]').textContent
        ).toContain('Test message')
        expect(toast.length).toEqual(1)
    })
})
