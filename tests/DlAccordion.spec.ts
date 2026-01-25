import { mount } from '@vue/test-utils'
import { DlAccordion } from '../src/components'
import AccordionHeader from '../src/components/basic/DlAccordion/components/AccordionHeader.vue'
import { describe, it, expect, beforeAll } from 'vitest'

describe('AccordionHeader', () => {
    describe('When set title color prop', () => {
        let wrapper: any
        const PASSED_COLOR = 'dl-color-warning'
        beforeAll(() => {
            wrapper = mount(AccordionHeader, {
                props: {
                    title: 'Some title',
                    titleColor: PASSED_COLOR
                }
            })
        })
        it('should right title color', function () {
            const titleColor =
                wrapper.vm.accordionHeadStyles['--dl-title-color']

            expect(titleColor).toEqual(
                `var(--${PASSED_COLOR}, var(--dell-gray-600))`
            )
        })
    })
    describe('When you click on header', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(AccordionHeader, {
                props: {
                    title: 'Some title'
                }
            })
            await wrapper.trigger('click')
        })
        it('should emit click event on header click', async () => {
            expect(wrapper.emitted()['click'][0]).toBeTruthy()
        })
    })
})
describe('DlAccordion', () => {
    describe('When mounting', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlAccordion, {
                props: {
                    title: 'accordion',
                    modelValue: true
                }
            })
        })
        it('should exist the component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should initiate component with proper default isOpen property', async () => {
            expect(wrapper.vm.isOpen).toBe(true)
        })
    })
    describe('When clicking on accordion', async () => {
        let wrapper: any
        let INITIAL_VALUE: any
        let FINAL_VALUE: any
        beforeAll(async () => {
            wrapper = mount(DlAccordion, {
                props: {
                    title: 'Some title'
                }
            })
            INITIAL_VALUE = wrapper.vm.isOpen
            await wrapper.vm.handleClick()
            FINAL_VALUE = wrapper.vm.isOpen
        })
        it('should be changed state', () => {
            expect(FINAL_VALUE).not.toBe(INITIAL_VALUE)
        })
        it('should be emitted hide action', async () => {
            await wrapper.vm.handleClick()
            expect(wrapper.emitted()['hide']).toBeTruthy()
        })
    })
})
