import { mount } from '@vue/test-utils'
import { nextTick } from 'vue-demi'
import { DlPagination } from '../../src/components'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlPagination', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlPagination, {
                props: {
                    maxDisplayRange: 7,
                    totalItems: 1002,
                    rowsPerPage: 50,
                    modelValue: 2
                }
            })
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should have the right rowFrom', function () {
            expect(wrapper.vm.rowFrom).toBe(51)
        })
        it('should have the right rowTo', function () {
            expect(wrapper.vm.rowTo).toBe(100)
        })
        describe('When set modelValue', () => {
            beforeAll(async () => {
                await wrapper.setProps({
                    modelValue: 21
                })
            })
            it('should have the right rowFrom', function () {
                expect(wrapper.vm.rowFrom).toBe(1001)
            })
            it('should have the right rowTo', function () {
                expect(wrapper.vm.rowTo).toBe(1002)
            })
            it('should have the right value', async function () {
                wrapper.vm.rowsPerPageState = 10
                await nextTick()
                expect(wrapper.vm.value).toEqual(1)
            })
        })
    })
})
