import { mount } from '@vue/test-utils'
import { DlSeparator } from '../src/components'
import { describe, it, expect } from 'vitest'

describe('DlSeparator', () => {
    it('should render the separator', () => {
        const wrapper = mount(DlSeparator, {
            props: {
                color: 'red',
                height: '400px',
                type: 'vertical'
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect((wrapper.element as HTMLElement).style.height).toEqual('400px')
        expect((wrapper.element as HTMLElement).style.backgroundColor).toEqual(
            'red'
        )
        expect(wrapper.vm.type).toBe('vertical')
    })
})
