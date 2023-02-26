// 49,86,99

import { mount } from '@vue/test-utils'
import { DlTh } from '../../src/components'

describe('DlTh', () => {
    it('should compute right class name', async () => {
        const wrapper = mount(DlTh, {
            props: {
                autoWidth: false,
                props: {
                    col: {}
                }
            }
        })

        expect(wrapper.vm.thClasses).toBe('')
    })

    it('should compute right class name if auto width prop is given', async () => {
        const wrapper = mount(DlTh, {
            props: {
                autoWidth: true,
                props: {
                    col: {}
                }
            }
        })

        expect(wrapper.vm.thClasses).toBe('dl-table--col-auto-width')
        expect(wrapper.vm.headerStyle).toBe('')
    })

    it('should compute right class name if thClass prop is given', async () => {
        const wrapper = mount(DlTh, {
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

        expect(wrapper.vm.thClasses).toBe('dl-table--col-auto-width styled')
        expect(wrapper.vm.headerStyle).toBe('color: red;')
    })

    it('should emit click', async () => {
        const wrapper = mount(DlTh, {
            props: {
                props: {
                    col: {}
                }
            }
        })

        wrapper.trigger('click')

        expect(wrapper.emitted()['click'][0]).toBeTruthy()
    })

    // it("should return no computed values if col isn't passed", async () => {
    //     const wrapper = mount(DlTh, {
    //         props: {}
    //     })

    //     console.log(wrapper.vm)

    //     expect(wrapper.vm.thClasses).toBeUndefined()
    //     expect(wrapper.vm.isSortable).toBe(false)
    //     expect(wrapper.vm.onClick).toBeUndefined()
    //     expect(wrapper.vm.hasOptionalProps).toBeUndefined()
    // })
})
