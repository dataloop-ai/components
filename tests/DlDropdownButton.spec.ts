import { mount } from '@vue/test-utils'
import { DlDropdownButton } from '../src'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlDropdownButton', () => {
    describe('When mounting', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlDropdownButton, {
                props: {}
            })
        })
        it('should exist component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should right props', function () {
            expect(wrapper.props()).toStrictEqual({
                autoClose: false,
                color: '',
                contained: true,
                contentClass: '',
                contentStyle: '',
                cover: false,
                disabled: false,
                disableDropdown: false,
                disableMainButton: false,
                dropdownIcon: 'icon-dl-down-chevron',
                flat: false,
                fluid: false,
                padding: '5px',
                icon: '',
                label: '',
                iconSize: '20px',
                inheritIconColor: false,
                mainButtonStyle: '',
                maxHeight: null,
                maxWidth: null,
                menuMaxWidth: null,
                menuAnchor: 'bottom end',
                menuOffset: [0, 0],
                menuSelf: 'top end',
                modelValue: false,
                noIconAnimation: false,
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
                arrowNavItems: [],
                contentGap: null,
                zIndex: null,
                mainButtonHoverColor: null,
                mainButtonFontSize: 'm'
            })
        })
        it('should right button style', function () {
            expect(wrapper.vm.buttonCSSStyles).toStrictEqual({
                '--dl-button-border-left': 'var(--dl-color-white)'
            })
        })
    })
    describe('When updating bordered prop', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlDropdownButton, {
                props: {}
            })
            await wrapper.setProps({ disabled: true })
            await wrapper.setProps({ outlined: true })
        })
        it('should right border style', function () {
            expect(wrapper.vm.buttonCSSStyles).toStrictEqual({
                '--dl-button-border-left': 'none'
            })
        })
    })
})
