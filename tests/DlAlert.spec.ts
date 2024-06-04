import { mount } from '@vue/test-utils'
import { DlAlert } from '../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

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
})
