import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeAll } from 'vitest'
import { DlInput } from '../src/components'

describe('DlInput component', () => {
    describe('When mounting', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlInput, {
                slots: {
                    prepend: '<p>Slot</p>'
                },
                props: {
                    size: 'l'
                }
            })
        })
        it('should exist the component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should have the correct classes', async () => {
            expect(wrapper.find('input').classes()).toContain(
                'dl-text-input__input--prepend'
            )
            await wrapper.setProps({ error: true })
            expect(wrapper.find('input').classes()).toContain(
                'dl-text-input__input--error'
            )

            await wrapper.setProps({
                redAsterisk: true,
                required: true,
                title: 'test'
            })

            console.log(wrapper.vm.asteriskClasses)
            expect(
                wrapper.find('.dl-text-input__asterisk').classes()
            ).toContain('dl-text-input__asterisk--red')
        })
    })
    describe('when trigger the events', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlInput)
        })
        it('should trigger right input event', async () => {
            await wrapper.find('input').trigger('input')

            // @ts-ignore // handled in jest setup
            await window.delay(100)
            await wrapper.vm.$nextTick()

            const inputEvent: any = wrapper.emitted('input')
            expect(inputEvent).toHaveLength(1)
        })
        it('should trigger right blur event', async () => {
            await wrapper.find('input').trigger('blur')
            // @ts-ignore // handled in jest setup
            await window.delay(50)
            await wrapper.vm.$nextTick()

            const blurEvent: any = wrapper.emitted('blur')
            expect(blurEvent).toHaveLength(1)
        })
        it('should trigger right focus event', async () => {
            await wrapper.find('input').trigger('focus')
            // @ts-ignore // handled in jest setup
            await window.delay(50)
            await wrapper.vm.$nextTick()

            const focusEvent: any = wrapper.emitted('focus')
            expect(focusEvent).toHaveLength(1)
        })
        it('should trigger right enter event', async () => {
            await wrapper.find('input').trigger('keyup.enter')

            const enterEvent: any = wrapper.emitted('enter')
            expect(enterEvent).toHaveLength(1)
        })
        it('should working the show pass button', async () => {
            await wrapper.setProps({ type: 'password' })
            await wrapper
                .findComponent({ ref: 'input-show-pass-button' })
                .find('.dl-button')
                .trigger('click')

            const showPass = wrapper.vm.$data.showPass

            expect(showPass).toEqual(true)
        })
        it('should working the clear button', async () => {
            await wrapper.setProps({ type: 'text', modelValue: 'test' })
            await wrapper.find('input').trigger('focus')

            // @ts-ignore // handled in jest setup
            await window.delay(50)
            await wrapper.vm.$nextTick()

            await wrapper
                .findComponent({ ref: 'input-clear-button' })
                .find('.dl-button')
                .trigger('click')

            const clearEvent: any = wrapper.emitted('clear')
            expect(clearEvent).toHaveLength(1)
            const clearBtnInputEvent: any = wrapper.emitted('input')
            expect(clearBtnInputEvent).toHaveLength(2)
        })
    })
    describe(`When there's a warning`, () => {
        const wrapper = mount(DlInput, { props: { warning: true } })

        describe(`When there's no error message`, () => {
            it(`should show the warning only`, async () => {
                expect(wrapper.find('input').classes()).toContain(
                    'dl-text-input__input--warning'
                )
            })
        })

        describe(`When there's also an error`, () => {
            beforeAll(async () => {
                await wrapper.setProps({ error: true })
            })
            it(`should show the error only`, () => {
                expect(wrapper.find('input').classes()).toContain(
                    'dl-text-input__input--error'
                )
                expect(wrapper.find('input').classes()).not.toContain(
                    'dl-text-input__input--warning'
                )
            })
        })
    })
    /**
     * TODO: Find a way to test this
     */
    describe.skip(`Trigger blur() method`, () => {
        const wrapper = mount(DlInput)

        describe(`When blur() method is triggered`, () => {
            beforeAll(async () => {
                await wrapper.vm.blur()
                await wrapper.vm.$nextTick()
            })
            it(`should emit 'blur' event`, () => {
                const focusEvent: any = wrapper.emitted('blur')
                expect(focusEvent).toHaveLength(1)
            })
        })
    })
    /**
     * TODO: Find a way to test this
     */
    describe.skip(`Trigger focus() method`, () => {
        // Should be skipped until we find a way to test this
        const wrapper = mount(DlInput)

        describe(`When focus() method is triggered`, () => {
            beforeAll(async () => {
                await wrapper.vm.focus()
                await wrapper.vm.$nextTick()
            })
            it(`should emit 'focus' event`, () => {
                const focusEvent: any = wrapper.emitted('focus')
                expect(focusEvent).toHaveLength(1)
            })
        })
    })
})
