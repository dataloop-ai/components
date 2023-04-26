import { mount } from '@vue/test-utils'
import { DlSeparator } from '../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlSeparator', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlSeparator, {
                props: {
                    color: 'red',
                    height: '400px',
                    type: 'vertical'
                }
            })
        })
        it('should exist component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should have the right styles', function () {
            expect((wrapper.element as HTMLElement).style.height).toEqual(
                '400px'
            )
            expect(
                (wrapper.element as HTMLElement).style.backgroundColor
            ).toEqual('red')
        })
        it('should have the right props', function () {
            expect(wrapper.vm.type).toBe('vertical')
        })
    })
})
