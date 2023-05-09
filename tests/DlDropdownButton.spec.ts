import { mount } from '@vue/test-utils'
import { DlDropdownButton } from '../src'
import { describe, it, expect } from 'vitest'

describe('DlDropdownButton', () => {
    it('should display DlDropdownButton content', async () => {
        const wrapper = mount(DlDropdownButton, {
            props: {}
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.props()).toStrictEqual({
            autoClose: false,
            color: '',
            contained: true,
            contentClass: '',
            contentStyle: '',
            cover: false,
            disabled: false,
            disableDropdown: false,
            disableMainBtn: false,
            dropdownIcon: 'icon-dl-down-chevron',
            flat: false,
            fluid: false,
            padding: '5px',
            icon: '',
            label: '',
            iconSize: '20px',
            mainBtnStyle: '',
            maxHeight: null,
            maxWidth: null,
            menuAnchor: 'bottom end',
            menuOffset: [0, 0],
            menuSelf: 'top end',
            modelValue: false,
            noIconAnimation: false,
            'onUpdate:modelValue': undefined,
            outlined: false,
            persistent: false,
            size: 'm',
            split: false,
            stretch: false,
            textColor: '',
            transform: 'default',
            fitContent: false,
            noWrap: false,
            overflow: false,
            tooltip: null,
            arrowNavItems: []
        })

        expect(wrapper.vm.btnCSSStyles).toStrictEqual({
            '--dl-btn-border-left': 'var(--dl-color-white)'
        })

        await wrapper.setProps({ disabled: true })

        await wrapper.setProps({ outlined: true })

        expect(wrapper.vm.btnCSSStyles).toStrictEqual({
            '--dl-btn-border-left': 'none'
        })

        await wrapper.setProps({ modelValue: true })
    })
})
