import { mount } from '@vue/test-utils'
import { DlAlert } from '../src/'

describe('DlAlert', () => {
    const _closeBtn = '[data-test="close-btn-icon"]'
    const _root = '[data-test="root"]'

    it('should render the given text prop', () => {
        const wrapper = mount(DlAlert, {
            props: {
                text: 'Alert'
            }
        })

        expect(wrapper.text()).toContain('Alert')
    })

    it('should render the close icon', () => {
        const wrapper = mount(DlAlert, {
            props: {
                text: 'Alert',
                closable: true
            }
        })

        expect(wrapper.get(_root)).toBeDefined()
        expect(wrapper.get(_closeBtn)).toBeDefined()
    })

    it('should accept only valid "type" properties', () => {
        const validator = DlAlert.props.type.validator

        expect(validator('info')).toBe(true)
        expect(validator('text')).toBe(false)
    })

    describe('when the props are updated', () => {
        it('should adapt the styling accordingly', async () => {
            const wrapper = mount(DlAlert, {
                props: {
                    text: 'Alert'
                }
            })

            await wrapper.setProps({ fluid: true })

            expect(
                (wrapper.get(_root).element as HTMLElement).style.width
            ).toEqual('100%')
        })
    })

    describe('when the close icon is clicked', () => {
        it('should trigger the "update:model-value" event and close hide the component', async () => {
            const wrapper = mount(DlAlert, {
                props: {
                    text: 'Alert',
                    closable: true
                }
            })

            const closeBtn = await wrapper.find(_closeBtn)
            closeBtn.trigger('click')
            await wrapper.vm.$nextTick()
            expect(wrapper.emitted()).toHaveProperty('update:model-value')
            let error: any
            try {
                const root = wrapper.get(_root)
            } catch (e) {
                error = e
            }
            expect(error).toBeDefined()
        })
    })
})
