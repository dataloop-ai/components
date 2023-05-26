import { mount } from '@vue/test-utils'
import { DlTh } from '../../src/components'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlTh', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlTh, {
                props: {
                    autoWidth: false,
                    props: {
                        col: {}
                    }
                }
            })
        })
        it('should mount the component', () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should compute right class name', () => {
            expect(wrapper.vm.thClasses).toBe('')
        })
        describe('When change autoWidth prop', () => {
            beforeAll(async () => {
                wrapper = mount(DlTh, {
                    props: {
                        autoWidth: true,
                        props: {
                            col: {}
                        }
                    }
                })
            })

            it('should compute right class name', () => {
                expect(wrapper.vm.thClasses).toBe('dl-table--col-auto-width')
            })
            it('should compute right styles', () => {
                expect(wrapper.vm.headerStyle).toBe('')
            })
        })
        describe('When set props', () => {
            beforeAll(async () => {
                wrapper = mount(DlTh, {
                    props: {
                        autoWidth: true,
                        props: {
                            col: {
                                thClass: 'styled',
                                headerStyle: 'color: red;',
                                sortable: true
                            }
                        }
                    }
                })
            })
            it('should compute right class name', () => {
                expect(wrapper.vm.thClasses).toBe(
                    'dl-table--col-auto-width styled'
                )
            })
            it('should compute right styles', () => {
                expect(wrapper.vm.headerStyle).toBe('color: red;')
            })
        })
        describe('When emit click', () => {
            beforeAll(async () => {
                wrapper = mount(DlTh, {
                    props: {}
                })
                wrapper.trigger('click')
            })

            it('should emit click', () => {
                expect(wrapper.emitted()['click'][0]).toBeTruthy()
            })
        })
    })
})
