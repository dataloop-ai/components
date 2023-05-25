import { DlDialogBox } from '../../src/components'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlDialogBox', () => {
    describe('When mounting', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlDialogBox, {
                slots: {
                    body: '<p>Body</p>'
                }
            })

            wrapper.vm.show = true
        })

        it('will mount', () => {
            expect(wrapper.exists()).toBe(true)
        })
    })

    describe('When mounting with fullheight', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlDialogBox, {
                slots: {
                    body: '<p>Body</p>'
                },
                props: {
                    fullHeight: true
                }
            })

            wrapper.vm.show = true
            await wrapper.vm.$nextTick()
        })

        it('will mount', () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('will have full height class', () => {
            const dialogWrapper = wrapper.find('.dialog-wrapper')
            const classes = dialogWrapper.classes()
            expect(classes).toContain('dialog-wrapper--fullheight')
        })
        it('will not have maxHeight style', () => {
            const dialogWrapper = wrapper.find('.dialog-wrapper')
            const elem = dialogWrapper.element as HTMLElement
            expect(elem.style.maxHeight).to.equal('')
        })
    })

    describe('When mounting with fullscreen', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlDialogBox, {
                slots: {
                    body: '<p>Body</p>'
                },
                props: {
                    fullscreen: true
                }
            })

            wrapper.vm.show = true
            await wrapper.vm.$nextTick()
        })

        it('will mount', () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('will have full screen class', () => {
            const dialogWrapper = wrapper.find('.dialog-wrapper')
            const classes = dialogWrapper.classes()
            expect(classes).toContain('dialog-wrapper--fullscreen')
        })
        it('will not have maxHeight style', () => {
            const dialogWrapper = wrapper.find('.dialog-wrapper')
            const elem = dialogWrapper.element as HTMLElement
            expect(elem.style.maxHeight).to.equal('')
        })
    })
})
