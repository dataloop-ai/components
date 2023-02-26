import { mount } from '@vue/test-utils'
import { DlSkeleton } from '../src'

describe('DlSkeleton', () => {
    it('should have correct dimensions given', () => {
        const wrapper = mount(DlSkeleton, {
            props: {
                width: '200px',
                height: '200px'
            }
        })

        const element = wrapper.find('.skeleton-box')?.element as HTMLElement
        expect(element).not.toBe(undefined)
        expect(element.style.width).toEqual('200px')
        expect(element.style.height).toEqual('200px')
    })
})
