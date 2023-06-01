import { mount } from '@vue/test-utils'
import { DlTr } from '../../src/components'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlTr', () => {
    describe('When mounting', () => {
        let wrapper: any
        let trClasses: any

        beforeAll(() => {
            wrapper = mount(DlTr, {
                props: {}
            })
            trClasses = wrapper.vm.trClasses
        })

        it('should mount the component', () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should the right class', () => {
            expect(trClasses).toBe('dl-tr')
        })
        describe('When change header prop', () => {
            beforeAll(async () => {
                await wrapper.setProps({ props: { header: true } })
                trClasses = wrapper.vm.trClasses
            })
            it('should compute right class name', () => {
                expect(wrapper.vm.trClasses).toBe('dl-tr')
            })
        })
        describe('When change _trClass prop', () => {
            beforeAll(async () => {
                await wrapper.setProps({ props: { _trClass: 'styled' } })
                trClasses = wrapper.vm.trClasses
            })
            it('should compute right class name', () => {
                expect(wrapper.vm.trClasses).toBe('dl-tr styled')
            })
        })
        describe('When change noHover prop', () => {
            beforeAll(async () => {
                await wrapper.setProps({ noHover: true })
                trClasses = wrapper.vm.trClasses
            })
            it('should compute right class name', () => {
                expect(wrapper.vm.trClasses).toBe(
                    'dl-tr styled dl-tr--no-hover'
                )
            })
        })
    })
})
