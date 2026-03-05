import { mount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { DlEllipsis } from '../src/components'

const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi corrupti rerum voluptate amet ex quas perspiciatis dicta ea similique, voluptatum perferendis possimus. Quasi eveniet asperiores, dolorum quia facilis reiciendis animi.'

const props = {
    text: '',
    split: false,
    splitPosition: 0.5,
    tooltip: true,
    tooltipPosition: 'top middle',
    tooltipOffset: [0, 25],
    tooltipText: '',
    multiline: false,
    maxLines: 3,
    textClass: ''
}

describe('DlEllipsis', () => {
    beforeEach(() => {
        vi.resetModules()
    })
    describe('When mounting', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlEllipsis)
        })
        it('should exist component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('renders the component with default props', async () => {
            // const wrapper = mount(DlEllipsis)

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
        it('should display leftText slot or leftTextValue', function () {
            expect(wrapper.text()).toContain(wrapper.vm.leftText)
        })
        it('should not display rightText slot or rightTextValue', function () {
            expect(wrapper.find('.dl-ellipsis__right').exists()).toBe(false)
        })
        it('should not display tooltip', function () {
            expect(wrapper.find('dl-tooltip').exists()).toBe(false)
        })
    })

    describe('When mounting with props', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlEllipsis, {
                props: {
                    text
                }
            })
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
            await expect(wrapper.find('.dl-ellipsis__right').exists()).toBe(
                true
            )

            // Assert that dl-tooltip is not displayed
            expect(wrapper.find('dl-tooltip').exists()).toBe(false)
        })

        describe('When mounting middle ellipsis', () => {
            let wrapper: any
            beforeAll(() => {
                wrapper = mount(DlEllipsis, {
                    props: {
                        text,
                        middleEllipsis: true
                    }
                })
            })
            it('should to display both parts of label with middle ellipsis', function () {
                const className = 'dl-ellipsis'
                const expected = [
                    'dl-ellipsis',
                    'dl-dl-ellipsis__left',
                    'dl-dl-ellipsis__right'
                ]

                const result = wrapper.classes(className)

                expected.forEach(() => {
                    expect(result).toBe(true)
                })
            })
        })

        describe('When mounting with split', () => {
            const text = 'Hello World with split prop and very long text'
            let wrapper: any

            beforeAll(() => {
                wrapper = mount(DlEllipsis, {
                    props: {
                        text,
                        split: true
                    }
                })
            })

            it('should display both left and right text', () => {
                expect(wrapper.text()).toContain(wrapper.vm.leftText)
                expect(wrapper.text()).toContain(wrapper.vm.rightText)
                expect(wrapper.find('.dl-ellipsis__left').exists()).toBe(true)
                expect(wrapper.find('.dl-ellipsis__right').exists()).toBe(true)
            })

            it('should not display tooltip', () => {
                expect(wrapper.find('dl-tooltip').exists()).toBe(false)
            })
        })

        describe('when using tooltip', () => {
            const text = 'Hello World'
            let wrapper: any

            beforeAll(() => {
                wrapper = mount(DlEllipsis, {
                    props: {
                        text,
                        tooltip: true
                    }
                })
            })

            it('should display left text', () => {
                expect(wrapper.text()).toContain(wrapper.vm.leftText)
            })

            it('should not display right text', () => {
                expect(wrapper.find('.dl-ellipsis__right').exists()).toBe(false)
            })
        })

        describe('When mounting with default slot', () => {
            const text = 'Hello World'
            let wrapper: any

            beforeAll(() => {
                wrapper = mount(DlEllipsis, {
                    slots: {
                        default: text
                    }
                })
            })

            it('should display left text', () => {
                expect(wrapper.find('.dl-ellipsis__left').text()).toContain(
                    text
                )
            })
            it('renders the component with default slot', () => {
                const text = 'Hello World'
                const wrapper = mount(DlEllipsis, {
                    slots: {
                        default: text
                    }
                })

                expect(wrapper.find('.dl-ellipsis__left').text()).toContain(
                    text
                )
            })
        })
    })
})
