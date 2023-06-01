import { mount } from '@vue/test-utils'
import { DlEmptyState } from '../src/'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlEmptyState', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlEmptyState, {
                props: {}
            })
        })
        it('should mount the component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should compute the correct classes when calling computeClass', function () {
            expect(wrapper.vm.iconClassName).toBe('empty-state--icon')
            expect(wrapper.vm.titleClassName).toBe('empty-state--title')
            expect(wrapper.vm.subtitleClassName).toBe('empty-state--subtitle')
            expect(wrapper.vm.infoClassName).toBe('empty-state--info')
        })
    })

    describe('When set bgImage size prop', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlEmptyState, {
                props: {
                    bgSize: '400px'
                }
            })
        })
        it('should have a warn', function () {
            expect(wrapper.vm.cssVars).toEqual({
                '--bg-image': null,
                '--bg-size': '400px'
            })
        })
    })
})
