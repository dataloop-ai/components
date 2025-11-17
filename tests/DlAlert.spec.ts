import { mount } from '@vue/test-utils'
import { DlAlert } from '../src/components'
import { describe, it, expect, beforeAll, beforeEach } from 'vitest'

describe('DlAlert', () => {
    const _closeBtn = '[data-test="close-button-icon"]'
    const _root = '[data-test="root"]'

    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlAlert, {
                props: {
                    type: 'success',
                    text: 'Alert',
                    closable: true
                }
            })
        })
        it('should mount the component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should the right text', function () {
            expect(wrapper.text()).toContain('Alert')
        })
        it('should accept only valid "type" properties', () => {
            const validator = DlAlert.props.type.validator

            expect(validator('info')).toBe(true)
            expect(validator('text')).toBe(false)
        })
        it('should render the close icon', () => {
            expect(wrapper.get(_root)).toBeDefined()
            expect(wrapper.get(_closeBtn)).toBeDefined()
        })
    })

    describe('When the props are updated', () => {
        it('should adapt the styling accordingly', async () => {
            const wrapper = mount(DlAlert, {
                props: {
                    type: 'success',
                    text: 'Alert'
                }
            })

            await wrapper.setProps({ fluid: true })
            await wrapper.vm.$nextTick()
            expect(
                (wrapper.get(_root).element as HTMLElement).style.width
            ).toEqual('100%')
        })
    })

    describe('When the close icon is clicked', () => {
        let wrapper: any = null
        beforeAll(async () => {
            wrapper = mount(DlAlert, {
                props: {
                    text: 'Alert',
                    type: 'success',
                    closable: true
                }
            })
            const closeBtn = await wrapper.find(_closeBtn)
            closeBtn.trigger('click')
            await wrapper.vm.$nextTick()
            // @ts-ignore
            await window.delay(500)
        })

        it('should trigger the "update:model-value" event and close hide the component', () => {
            expect(wrapper.emitted()).toHaveProperty('update:model-value')
            let error: any
            try {
                const root = wrapper.get(_root)
                console.log(root)
            } catch (e) {
                error = e
            }
            expect(error).toBeDefined()
        })
    })

    describe('Confirmation Dialog', () => {
        describe('When confirmClose is false', () => {
            it('should close immediately without showing dialog', async () => {
                const wrapper = mount(DlAlert, {
                    props: {
                        text: 'Alert',
                        type: 'warning',
                        closable: true,
                        confirmClose: false
                    }
                })

                const closeBtn = wrapper.find(_closeBtn)
                await closeBtn.trigger('click')
                await wrapper.vm.$nextTick()

                // Dialog should not be visible (check modelValue of dialog component)
                const dialog = wrapper.findComponent({ name: 'DlDialogBox' })
                if (dialog.exists()) {
                    expect(dialog.props('modelValue')).toBe(false)
                }

                // Alert should be closed
                expect(wrapper.emitted()).toHaveProperty('update:model-value')
                expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                    false
                ])
            })
        })

        describe('When confirmClose is true', () => {
            let wrapper: any

            beforeEach(() => {
                wrapper = mount(DlAlert, {
                    props: {
                        text: 'Alert',
                        type: 'warning',
                        closable: true,
                        confirmClose: true
                    }
                })
            })

            it('should show confirmation dialog when close button is clicked', async () => {
                const closeBtn = wrapper.find(_closeBtn)
                await closeBtn.trigger('click')
                await wrapper.vm.$nextTick()

                const dialog = wrapper.findComponent({ name: 'DlDialogBox' })
                expect(dialog.exists()).toBe(true)
                expect(dialog.props('modelValue')).toBe(true)
            })

            it('should not close alert when dialog is shown', async () => {
                const closeBtn = wrapper.find(_closeBtn)
                await closeBtn.trigger('click')
                await wrapper.vm.$nextTick()

                // Alert should still be visible
                const root = wrapper.find(_root)
                expect(root.exists()).toBe(true)
                expect(root.isVisible()).toBe(true)

                // Should not emit update:model-value yet
                expect(wrapper.emitted()['update:model-value']).toBeUndefined()
            })

            it('should close dialog and keep alert open when Cancel is clicked', async () => {
                const closeBtn = wrapper.find(_closeBtn)
                await closeBtn.trigger('click')
                await wrapper.vm.$nextTick()

                // Wait for dialog to be visible
                const dialog = wrapper.findComponent({ name: 'DlDialogBox' })
                expect(dialog.exists()).toBe(true)
                expect(dialog.props('modelValue')).toBe(true)

                // Call the cancel handler directly
                wrapper.vm.handleCancelDismiss()
                await wrapper.vm.$nextTick()

                // Dialog should be closed (check modelValue)
                const dialogAfter = wrapper.findComponent({
                    name: 'DlDialogBox'
                })
                if (dialogAfter.exists()) {
                    expect(dialogAfter.props('modelValue')).toBe(false)
                }

                // Alert should still be visible
                const root = wrapper.find(_root)
                expect(root.exists()).toBe(true)
                expect(root.isVisible()).toBe(true)

                // Should not emit any events
                expect(wrapper.emitted()['update:model-value']).toBeUndefined()
                expect(wrapper.emitted()['dismiss']).toBeUndefined()
            })

            it('should close dialog and alert when Dismiss is clicked', async () => {
                const closeBtn = wrapper.find(_closeBtn)
                await closeBtn.trigger('click')
                await wrapper.vm.$nextTick()

                // Wait for dialog to be visible
                const dialog = wrapper.findComponent({ name: 'DlDialogBox' })
                expect(dialog.exists()).toBe(true)
                expect(dialog.props('modelValue')).toBe(true)

                // Call the dismiss handler directly
                wrapper.vm.handleConfirmDismiss()
                await wrapper.vm.$nextTick()

                // Dialog should be closed (check modelValue)
                const dialogAfter = wrapper.findComponent({
                    name: 'DlDialogBox'
                })
                if (dialogAfter.exists()) {
                    expect(dialogAfter.props('modelValue')).toBe(false)
                }

                // Should emit both events
                expect(wrapper.emitted()).toHaveProperty('update:model-value')
                expect(wrapper.emitted()).toHaveProperty('dismiss')
                expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                    false
                ])
            })

            it('should use default header and message', async () => {
                const wrapper = mount(DlAlert, {
                    props: {
                        text: 'Alert',
                        type: 'warning',
                        closable: true,
                        confirmClose: true
                    }
                })

                const closeBtn = wrapper.find(_closeBtn)
                await closeBtn.trigger('click')
                await wrapper.vm.$nextTick()

                const dialog = wrapper.findComponent({ name: 'DlDialogBox' })
                expect(dialog.exists()).toBe(true)
                expect(dialog.props('modelValue')).toBe(true)

                // Check that default header is used
                const header = wrapper.find('.title')
                expect(header.exists()).toBe(true)
                expect(header.text()).toContain('Are you sure?')

                // Check that default message is used (empty by default)
                const message = wrapper.find('.confirm-message')
                expect(message.exists()).toBe(true)
            })

            it('should use custom header and message when provided', async () => {
                const wrapper = mount(DlAlert, {
                    props: {
                        text: 'Alert',
                        type: 'warning',
                        closable: true,
                        confirmClose: true,
                        confirmCloseHeader: 'Custom Header',
                        confirmCloseMessage: 'Custom message text'
                    }
                })

                const closeBtn = wrapper.find(_closeBtn)
                await closeBtn.trigger('click')
                await wrapper.vm.$nextTick()

                const dialog = wrapper.findComponent({ name: 'DlDialogBox' })
                expect(dialog.exists()).toBe(true)
                expect(dialog.props('modelValue')).toBe(true)

                // Check that custom header is used
                const header = wrapper.find('.title')
                expect(header.exists()).toBe(true)
                expect(header.text()).toContain('Custom Header')

                // Check that custom message is used
                const message = wrapper.find('.confirm-message')
                expect(message.exists()).toBe(true)
                expect(message.text()).toContain('Custom message text')
            })
        })
    })
})
