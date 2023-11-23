import { mount } from '@vue/test-utils'
import { DlToggleButton } from '../src/components'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlToggleButton', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlToggleButton, {
                props: {
                    options: [
                        { label: 'Button 1', value: 1 },
                        { label: 'Button 2', value: 2 }
                    ]
                }
            })
        })
        it('should exist component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should the right compute styles', function () {
            expect(wrapper.vm.getStyles(true, false)).toEqual({
                padding: '7px 10px',
                height: '28px',
                fontSize: 'var(--dl-font-size-body)',
                borderRadius: '0',
                color: 'var(--dl-color-secondary)',
                borderColor: 'var(--dl-color-secondary)',
                background: 'var(--dl-color-secondary-opaque)'
            })
        })
        it('should have 2 buttons', function () {
            const listButtons = wrapper.findAll('[data-test="button"]')
            expect(listButtons.length).toBe(2)
        })
        describe('When you click button', () => {
            beforeAll(async () => {
                const buttonElem = await wrapper.find('.dl-button')
                buttonElem.trigger('click')
                //@ts-ignore
                await window.delay(50)
                await wrapper.vm.$nextTick()
            })
            it('should have click event', async function () {
                expect(wrapper.emitted()).toHaveProperty('click')
                const clickEvent = wrapper.emitted('click')
                expect(clickEvent).toHaveLength(1)
            })
            it('should the right selected button value', function () {
                expect(wrapper.vm.scopedValue).toBe(1)
            })
        })
    })
})
