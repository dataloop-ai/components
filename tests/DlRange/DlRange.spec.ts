import { mount, VueWrapper } from '@vue/test-utils'
import { ComponentOptionsBase, ComponentPublicInstance } from 'vue'
import { DlRange } from '../../src/components'
import touchPanDirective from '../../src/directives/TouchPan'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

const _resetBtn = '[data-test="reset-btn"]'
const _sliderBar = '[data-test="slider-bar"]'
const _trackContainer = '[data-test="track-container"]'
const _minThumb = '[data-test="min-thumb"]'

describe('DlRange', () => {
    describe('When behave accordingly', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlRange, {
                props: {
                    width: '500px',
                    color: 'red',
                    textColor: 'orange',
                    min: 0,
                    max: 100,
                    step: 10,
                    text: 'test range'
                },
                attachTo: document.body,
                global: {
                    directives: {
                        touchPan: touchPanDirective as any
                    }
                }
            })
            await wrapper.setProps({
                modelValue: {
                    min: 5,
                    max: 20
                }
            })

            await wrapper.setProps({
                disabled: true
            })
        })
        it('should have the right aria-disabled flag', function () {
            expect(wrapper.find(_sliderBar).attributes()['aria-disabled']).toBe(
                'true'
            )
        })
        it('should have the right aria-readonly flag', async function () {
            await wrapper.setProps({
                disabled: false,
                readonly: true
            })

            expect(wrapper.find(_sliderBar).attributes()['aria-readonly']).toBe(
                'true'
            )
        })
        it('should unmount wrapper', async function () {
            await wrapper.setProps({
                disabled: false
            })

            wrapper.unmount()
        })
    })
})

describe('DlRange', () => {
    let wrapper: VueWrapper<
        ComponentPublicInstance<
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            false,
            ComponentOptionsBase<
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
            >
        >
    >

    beforeEach(() => {
        wrapper = mount(DlRange, {
            props: {
                min: 0,
                max: 100,
                step: 1,
                text: 'range'
            },
            attachTo: document.body,
            global: {
                directives: {
                    touchPan: touchPanDirective as any
                }
            },
            data() {
                return {
                    model: {
                        min: 0,
                        max: 100
                    }
                }
            }
        })
    })

    describe('when state is editable', () => {
        it('should attach thumb events', async () => {
            await wrapper.find(_trackContainer).trigger('click')
            await wrapper.find(_trackContainer).trigger('keydown.pagedown')
        })
    })

    describe('when reset btn is pressed', () => {
        describe('when state is editable', () => {
            it('should reset the model value', async () => {
                await wrapper
                    .find(_resetBtn)
                    .find('.dl-button')
                    .trigger('click')
                expect(wrapper.emitted()['update:model-value'][0]).toEqual([
                    { min: 0, max: 100 }
                ])
                expect(wrapper.vm.$data.model).toEqual({
                    min: 0,
                    max: 100
                })
            })
        })

        describe('otherwise', () => {
            it('should not change the model', async () => {
                await wrapper.setProps({
                    disabled: true
                })
                wrapper.find(_resetBtn).find('.dl-button').trigger('click')
                expect(wrapper.emitted()).not.toHaveProperty(
                    'update:model-value'
                )
                expect(wrapper.vm.$data.model).toEqual({
                    min: 0,
                    max: 100
                })
            })
        })
    })

    describe('when name prop is provided', () => {
        it('should insert an input element', async () => {
            await wrapper.setProps({
                name: 'range'
            })
            expect(wrapper.find('input')).toBeDefined()
        })
    })
})
