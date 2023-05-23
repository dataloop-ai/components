import { mount } from '@vue/test-utils'
import { DlButton } from '../src/components'
import { describe, expect, it } from 'vitest'

describe('DlButton', () => {
    it('testing setup functionality', async () => {
        const wrapper = mount(DlButton, {
            props: {
                filled: true,
                label: 'Filled',
                disabled: false
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.props()).toStrictEqual({
            filled: true,
            label: 'Filled',
            color: '',
            colorsObject: null,
            disabled: false,
            round: false,
            padding: '',
            margin: '0 auto',
            flat: false,
            styles: null,
            fluid: false,
            transform: 'default',
            icon: '',
            noWrap: false,
            outlined: false,
            size: 'm',
            textColor: '',
            iconColor: '',
            overflow: false,
            tooltip: null,
            dense: false,
            active: false,
            shaded: false
        })

        const buttonElem = await wrapper.find('.dl-button')
        buttonElem.trigger('click')

        expect(wrapper.emitted()).toHaveProperty('click')

        expect(wrapper.vm.isActionable).toBe(true)

        expect(buttonElem.attributes().tabindex).toBe('0')

        const clickEvent = wrapper.emitted('click')

        expect(clickEvent).toHaveLength(1)

        await wrapper.setProps({
            filled: true,
            label: 'Filled',
            color: '',
            disabled: true,
            uppercase: false,
            flat: false,
            padding: '',
            fluid: false,
            icon: 'dl-add',
            outlined: false,
            size: 'm',
            textColor: ''
        })

        expect(wrapper.vm.isActionable).toBe(false)

        expect(buttonElem.attributes().tabindex).toBe('-1')

        buttonElem.trigger('click')

        const clickEventDisabled = wrapper.emitted('click')

        expect(clickEventDisabled).toHaveLength(1)

        await wrapper.setProps({
            filled: true,
            label: '',
            color: '',
            padding: '',
            disabled: true,
            flat: false,
            uppercase: false,
            fluid: false,
            icon: 'dl-add',
            iconColor: '',
            outlined: false,
            size: 'm',
            textColor: ''
        })

        const button = wrapper.find('.dl-button-container')

        expect(
            (button.element as HTMLElement).style.getPropertyValue(
                '--dl-button-border-radius'
            )
        ).toBe('2px')
    })
})
