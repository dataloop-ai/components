import { mount } from '@vue/test-utils'
import { DlProgressChart } from '../src/'
import { describe, it, expect } from 'vitest'

describe('DlProgressChart', () => {
    const _counterLink = '[data-test="counter-link"]'
    const _counterText = '[data-test="counter-text"]'

    /**
     * TODO: fix this test
     */
    it('should render the component', async () => {
        const wrapper = mount(DlProgressChart, {
            props: {
                options: [
                    {
                        name: 'Java',
                        value: 313,
                        color: '#b3d4fc',
                        link: 'https://www.java.com/en/'
                    }
                ]
            }
        })

        expect(wrapper.text()).toContain('Java')
        expect(wrapper.find(_counterLink).exists()).toBe(true)
        expect(wrapper.find(_counterLink).text()).toBe('(313)')

        await wrapper.setProps({
            options: [
                {
                    name: 'JavaScript',
                    value: 102,
                    color: '#b3d4fc'
                }
            ],
            width: '400px'
        })

        expect(wrapper.find(_counterLink).exists()).toBe(false)
        expect(wrapper.find(_counterText).text()).toBe('(102)')
    })

    it('should accept only the correct options property', () => {
        const validator = DlProgressChart.props.options.validator

        expect(
            validator([
                {
                    name: 'Java',
                    value: 313,
                    color: '#b3d4fc',
                    link: 'https://www.java.com/en/'
                },
                {
                    name: 'C++',
                    value: 94,
                    color: 'rgb(140 86 75)'
                }
            ])
        ).toBe(true)

        expect(
            validator([
                {
                    name: 'Java',
                    value: 313
                },
                {
                    name: 'C++',
                    value: 94
                }
            ])
        ).toBe(false)
    })
})
