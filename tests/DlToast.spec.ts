import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ToastComponent from '../src/components/compound/DlToast/components/ToastComponent.vue'

describe('DlToastMessage component', () => {
    it('dom node test', () => {
        mount(ToastComponent, {
            props: {
                message: 'Test message'
            }
        })
        const toast = document.body.querySelectorAll('.v-dl-toast__item')
        expect(
            toast[0].querySelector('[data-test="message-text"]').textContent
        ).toContain('Test message')
        expect(toast.length).toEqual(1)
    })
    it('check computed properties', () => {
        const wrapper = mount(ToastComponent, {
            props: {
                message: 'Test message',
                position: 'bottom'
            }
        })
        expect(wrapper.vm.transition).toEqual({
            enter: 'v-dl-toast--fade-in-up',
            leave: 'v-dl-toast--fade-out'
        })
        expect(
            wrapper.vm.correctParent.classList.contains('v-dl-toast--bottom')
        ).toBe(true)
    })
})
