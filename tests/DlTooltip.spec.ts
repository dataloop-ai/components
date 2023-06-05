import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue-demi'
import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest'
import { DlTooltip } from '../src/components'

describe('DlTooltip', () => {
    beforeEach(() => {
        vi.resetModules()
    })
    describe('When mounting', () => {
        const Parent = defineComponent({
            name: 'DlParent',
            template: '<div id="parent"><slot></slot></div>'
        })
        let wrapper: any

        beforeAll(() => {
            vi.useFakeTimers()
            wrapper = mount(DlTooltip, {
                parentComponent: Parent,
                props: {
                    color: 'white',
                    backgroundColor: 'black',
                    delay: 300,
                    hideDelay: 200,
                    maxWidth: '100px',
                    maxHeight: '200px',
                    anchor: 'bottom left',
                    self: 'top middle',
                    scrollTarget: null
                },
                slots: {
                    default:
                        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi corrupti rerum voluptate amet ex quas perspiciatis dicta ea similique, voluptatum perferendis possimus. Quasi eveniet asperiores, dolorum quia facilis reiciendis animi.'
                }
            })
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should the right props', function () {
            expect(wrapper.props()).toMatchObject({
                color: 'white',
                backgroundColor: 'black',
                delay: 300,
                hideDelay: 200,
                maxWidth: '100px',
                maxHeight: '200px',
                anchor: 'bottom left',
                self: 'top middle',
                scrollTarget: null,
                offset: [9, 9],
                transitionDuration: 300
            })
        })
        it('should the right offset', function () {
            expect(wrapper.vm.offset).toEqual([9, 9])
        })

        describe('When mouse move inside DlTooltip', () => {
            describe('When mouseenter inside DlTooltip', () => {
                beforeAll(() => {
                    wrapper.vm.$el.parentNode.dispatchEvent(
                        new MouseEvent('mouseenter')
                    )
                    vi.runAllTimers()
                })
                it('should not to be null', function () {
                    expect(
                        document.querySelector('[data-test-id="portal"]')
                    ).not.toBeNull()
                })
                it('should have the before-show property', function () {
                    expect(wrapper.emitted()).toHaveProperty('before-show')
                })
            })
            describe('When mouseleave inside DlTooltip', () => {
                beforeAll(() => {
                    wrapper.vm.$el.parentNode.dispatchEvent(
                        new MouseEvent('mouseleave')
                    )
                    vi.runAllTimers()
                })
                it('should have the before-hide property', function () {
                    expect(wrapper.emitted()).toHaveProperty('before-hide')
                })
                it('should have the hide property', function () {
                    expect(wrapper.emitted()).toHaveProperty('hide')
                })
            })
        })
        describe('When set noParentEvent prop', () => {
            beforeAll(async () => {
                await wrapper.setProps({
                    noParentEvent: true
                })
            })
            it('should have to be null', function () {
                expect(
                    document.querySelector('[data-test-id="portal"]')
                ).toBeNull()
            })
        })
    })
    describe('Testing validator', () => {
        it('should accept only the correct offset property', () => {
            const validator = DlTooltip.props.offset.validator

            expect(validator([1, -1])).toBe(true)
            expect(validator(['string', -1])).toBe(false)
        })

        it('should accept only the correct anchor property', () => {
            const validator = DlTooltip.props.anchor.validator

            expect(validator('bottom middle')).toBe(true)
            expect(validator('up down')).toBe(false)
        })

        it('should accept only the correct self property', () => {
            const validator = DlTooltip.props.self.validator

            expect(validator('top middle')).toBe(true)
            expect(validator('up down')).toBe(false)
        })
    })
})
