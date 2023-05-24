import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ToastComponent from '../src/components/compound/DlToast/components/ToastComponent.vue'
import {
    DlToastPositions,
    DlToastTypes
} from '../src/components/compound/DlToast/types'

describe('DlToastMessage component', () => {
    it('dom node test', () => {
        mount(ToastComponent, {
            props: {
                message: 'Test message',
                type: DlToastTypes.SUCCESS
            }
        })
        const toast = document.body.querySelectorAll('.toast-item')
        console.log(toast)
        expect(
            toast[0].querySelector('[data-test="message-text"]')?.textContent
        ).toContain('Test message')
        expect(toast.length).toEqual(1)
    })
    it('check computed properties', () => {
        const wrapper = mount(ToastComponent, {
            props: {
                message: 'Test message',
                position: DlToastPositions.BOTTOM,
                type: DlToastTypes.SUCCESS
            }
        })
        expect(wrapper.vm.transition).toEqual({
            enter: 'dl-toast--fade-in-up',
            leave: 'dl-toast--fade-out'
        })
        expect(wrapper.vm.correctParent.id).toEqual('DlToastContainerBottom')
    })
})
