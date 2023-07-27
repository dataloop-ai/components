import { mount } from '@vue/test-utils'
import { DlTd } from '../../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlTd', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlTd)
        })

        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })

        it('should have the right classes', () => {
            expect(wrapper.vm.classes).toBe('dl-td')
        })
        it('should have the right styles', () => {
            expect(wrapper.vm.styles).toStrictEqual({
                background: null,
                textTransform: null
            })
        })
        it('should the right ellipsis prop', () => {
            expect(wrapper.vm.hasEllipsis).toBe(false)
        })
        describe('When change autoWidth prop', () => {
            beforeAll(async () => {
                await wrapper.setProps({ autoWidth: true })
            })

            it('should have the right classes', () => {
                expect(wrapper.vm.classes).toBe(
                    'dl-td dl-table--col-auto-width'
                )
            })
        })
        describe('When change noHover prop', () => {
            beforeAll(async () => {
                await wrapper.setProps({ noHover: true })
            })

            it('should have the right classes', () => {
                expect(wrapper.vm.classes).toBe(
                    'dl-td dl-table--col-auto-width dl-td--no-hover'
                )
            })
        })
        describe('When change bgColor prop', () => {
            beforeAll(async () => {
                await wrapper.setProps({ bgColor: 'red' })
            })

            it('should have the right styles', () => {
                expect(wrapper.vm.styles).toStrictEqual({
                    background: 'red',
                    textTransform: null
                })
            })
        })
    })
})
