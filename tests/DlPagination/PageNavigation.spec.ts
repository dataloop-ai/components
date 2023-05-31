import { mount } from '@vue/test-utils'
import PageNavigation from '../../src/components/compound/DlPagination/components/PageNavigation.vue'
import { beforeAll, describe, expect, it } from 'vitest'

describe('PageNavigation', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(PageNavigation, {
                props: {
                    max: 10,
                    maxPages: 6
                }
            })
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should the right compute prop isFirstPage', function () {
            expect(wrapper.vm.isFirstPage).toBe(true)
        })
        describe('When set modelValue', () => {
            beforeAll(async () => {
                await wrapper.setProps({
                    modelValue: 5,
                    max: 5
                })
            })
            it('should the right compute prop isLastPage', function () {
                expect(wrapper.vm.isLastPage).toBe(true)
            })
        })
        describe('When press first button', () => {
            beforeAll(async () => {
                const btns = wrapper.findAll('button')
                await btns[0].trigger('click')
            })
            it('should emitted click event', function () {
                expect(wrapper.emitted()['update:modelValue'][0]).toBeTruthy()
            })
            it('should have the right value', function () {
                expect(wrapper.vm.value).toBe(1)
            })
            describe('When set offset', () => {
                beforeAll(() => {
                    wrapper.vm.setByOffset(2)
                })
                it('should have the right value', function () {
                    expect(wrapper.vm.value).toBe(3)
                })
            })
        })
        describe('When set boundaryNumbers prop', () => {
            let btns: any

            beforeAll(async () => {
                await wrapper.setProps({
                    boundaryNumbers: true,
                    max: 100,
                    maxPages: 6,
                    modelValue: 20
                })
                btns = wrapper.findAll('button')
            })
            it('should have the right button text', function () {
                expect(btns[1].text()).toEqual('...')
                expect(btns[btns.length - 2].text()).toEqual('...')
            })
        })
    })
    describe('Validator test', () => {
        it('should not pass the validation for the "max pages" value ', () => {
            const validator = PageNavigation.props.maxPages.validator

            expect(validator(-1)).toBe(false)
            expect(validator(10)).toBe(true)
        })
    })
})
