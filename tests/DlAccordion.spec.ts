import { mount } from '@vue/test-utils'
import { DlAccordion } from '../src/components'
import AccordionHeader from '../src/components/basic/DlAccordion/components/AccordionHeader.vue'
import { describe, it, expect } from 'vitest'

describe('DlAccordion', () => {
    it('should set title color from the given prop', () => {
        const PASSED_COLOR = 'dl-color-warning'
        const wrapper = mount(AccordionHeader, {
            props: {
                title: 'Some title',
                titleColor: PASSED_COLOR
            }
        })

        const titleColor = wrapper.vm.accordionHeadStyles['--dl-title-color']

        expect(titleColor).toEqual(
            `var(--${PASSED_COLOR}, var(--dl-color-medium))`
        )
    })

    it('should emit click event on header click', async () => {
        const wrapper = mount(AccordionHeader, {
            props: {
                title: 'heh'
            }
        })

        await wrapper.trigger('click')
        expect(wrapper.emitted()['click'][0]).toBeTruthy()
    })

    it('should initiate component with true isOpen property', async () => {
        const wrapper = mount(DlAccordion, {
            props: {
                title: 'accordion',
                modelValue: true
            }
        })
        expect(wrapper.vm.isOpen).toBe(true)
    })

    it('should initiate component with proper default isOpen property', async () => {
        const wrapper = mount(DlAccordion, {
            props: {
                title: 'accordion',
                modelValue: null,
                defaultOpened: true
            }
        })
        expect(wrapper.vm.isOpen).toBe(true)
    })

    it('should handle click value', async () => {
        const wrapper = mount(DlAccordion, {
            props: {
                title: 'title',
                modelValue: false
            }
        })

        // const header = wrapper.find('[data-test-id="accordion-header"]')

        const INITIAL_VALUE = wrapper.vm.isOpen
        await wrapper.vm.handleClick()
        const FINAL_VALUE = wrapper.vm.isOpen
        expect(FINAL_VALUE).not.toBe(INITIAL_VALUE)
        expect(wrapper.emitted()['update:model-value']).toBeTruthy()
        expect(wrapper.emitted()['show']).toBeTruthy()

        await wrapper.vm.handleClick()
        expect(wrapper.emitted()['hide']).toBeTruthy()
    })
})
