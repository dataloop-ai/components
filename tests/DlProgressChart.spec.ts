import { mount } from '@vue/test-utils'
import { DlProgressChart } from '../src/'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlProgressChart', () => {
    const _counterLink = '[data-test="counter-link"]'
    const _counterText = '[data-test="counter-text"]'

    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlProgressChart, {
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
        })
        it('should exist component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should right text', function () {
            expect(wrapper.text()).toContain('Java')
        })
        it('should exist counter link', function () {
            expect(wrapper.find(_counterLink).exists()).toBe(true)
        })
        it('should ', function () {
            expect(wrapper.find(_counterLink).text()).toBe('(313)')
        })
    })
    describe('When you remove link prop', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlProgressChart, {
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
        })
        it('should not exist counter link', function () {
            expect(wrapper.find(_counterLink).exists()).toBe(false)
        })
        it('should right the counter text', function () {
            expect(wrapper.find(_counterText).text()).toBe('(102)')
        })
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
