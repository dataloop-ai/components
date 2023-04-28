import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import ToastComponent from '../src/components/compound/DlToast/components/ToastComponent.vue'

describe('DlToastMessage component', () => {
    describe('When mounting', () => {
        let toast: any

        beforeAll(() => {
            mount(ToastComponent, {
                props: {
                    message: 'Test message'
                }
            })
            toast = document.body.querySelectorAll('.toast-item')
        })
        it('should the right toast message', function () {
            expect(
                toast[0].querySelector('[data-test="message-text"]')
                    ?.textContent
            ).toContain('Test message')
        })
        it('should the right toasts quantity', function () {
            expect(toast.length).toEqual(1)
        })
    })
    describe('When mounting toast bottom position', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(ToastComponent, {
                props: {
                    message: 'Test message',
                    position: 'bottom'
                }
            })
        })
        it('should the right compute transition prop', function () {
            expect(wrapper.vm.transition).toEqual({
                enter: 'dl-toast--fade-in-up',
                leave: 'dl-toast--fade-out'
            })
        })
        it('should the right compute correctParent prop', function () {
            expect(wrapper.vm.correctParent.id).toEqual(
                'DlToastContainerBottom'
            )
        })
    })
})
