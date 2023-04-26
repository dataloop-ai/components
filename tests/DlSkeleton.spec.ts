import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeAll } from 'vitest'
import { DlSkeleton } from '../src'

describe('DlSkeleton', () => {
    describe('When mounting', () => {
        let wrapper: any
        let element: any
        beforeAll(() => {
            wrapper = mount(DlSkeleton, {
                props: {
                    width: '200px',
                    height: '200px'
                }
            })
            element = wrapper.find('.skeleton-box')?.element as HTMLElement
        })
        it('should exist component', function () {
            expect(element).not.toBe(undefined)
        })
        it('should have the right styles', function () {
            expect(element.style.width).toEqual('200px')
            expect(element.style.height).toEqual('200px')
        })
    })
})
