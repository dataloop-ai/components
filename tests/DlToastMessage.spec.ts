import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ToastComponent from '../src/components/DlToastMessage/components/ToastComponent.vue'

describe('DlToastMessage component', () => {
    it('dom node test', () => {
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
    it('check computed properties', () => {
        const wrapper = mount(ToastComponent, {
            props: {
                position: 'bottom'
            }
        })
        expect(wrapper.vm.transition).toEqual({
            enter: 'v-toast--fade-in-up',
            leave: 'v-toast--fade-out'
        })
        expect(
            wrapper.vm.correctParent.classList.contains('v-toast--bottom')
        ).toBe(true)
    })
})
