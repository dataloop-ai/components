import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { DlEllipsis } from '../src/components'

const props = {
    text: '',
    split: false,
    splitPosition: 0.5,
    tooltip: true,
    tooltipPosition: 'top middle',
    tooltipOffset: [0, 25]
}

describe('DlEllipsis', () => {
    it('renders the component with default props', () => {
        const wrapper = mount(DlEllipsis)

        // Assert that the leftText slot or leftText value is displayed
        expect(wrapper.text()).toContain(wrapper.vm.leftText)

        // Assert that rightText is not displayed
        expect(wrapper.find('.dl-ellipsis__right').exists()).toBe(false)

        // Assert that dl-tooltip is not displayed
        expect(wrapper.find('dl-tooltip').exists()).toBe(false)
    })

    it('renders the component with all props', () => {
        const text = 'Hello World'
        const wrapper = mount(DlEllipsis, {
            props
        })
        expect(wrapper.props()).toStrictEqual(props)
    })

    it('renders the component with split prop', async () => {
        const text = 'Hello World with split prop and very long text'
        const wrapper = mount(DlEllipsis, {
            props: {
                text,
                split: true
            }
        })

        // Assert that the leftText slot or leftText value is displayed
        expect(wrapper.text()).toContain(wrapper.vm.leftText)

        // Assert that the rightText is displayed
        expect(wrapper.text()).toContain(wrapper.vm.rightText)

        // Assert that leftText and rightText are displayed
        await expect(wrapper.find('.dl-ellipsis__left').exists()).toBe(true)
        await expect(wrapper.find('.dl-ellipsis__right').exists()).toBe(true)

        // Assert that dl-tooltip is not displayed
        expect(wrapper.find('dl-tooltip').exists()).toBe(false)
    })

    it('renders the component with tooltip prop', () => {
        const text = 'Hello World'
        const wrapper = mount(DlEllipsis, {
            props: {
                text,
                tooltip: true
            }
        })

        // Assert that the leftText slot or leftText value is displayed
        expect(wrapper.text()).toContain(wrapper.vm.leftText)

        // Assert that rightText is not displayed
        expect(wrapper.find('.dl-ellipsis__right').exists()).toBe(false)
    })

    it('renders the component with tooltip and hasEllipsis', () => {
        const text = 'Hello World'
        const wrapper = mount(DlEllipsis, {
            props: {
                text,
                tooltip: true
            }
        })

        // Set hasEllipsis to true
        wrapper.vm.hasEllipsis = true

        // Assert that the leftText slot or leftText value is displayed
        expect(wrapper.text()).toContain(wrapper.vm.leftText)

        // Assert that rightText is not displayed
        expect(wrapper.find('.dl-ellipsis__right').exists()).toBe(false)
    })
    it('renders the component with default slot', () => {
        const text = 'Hello World'
        const wrapper = mount(DlEllipsis, {
            slots: {
                default: text
            }
        })

        expect(wrapper.find('.dl-ellipsis__left').text()).toContain(text)
    })
})
