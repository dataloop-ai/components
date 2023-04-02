import { mount } from '@vue/test-utils'
import { DlOptionGroup } from '../src'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import MenuItemWrapper from '../src/components/compound/DlOptionGroup/components/MenuItemWrapper.vue'
import { optionsValidator } from '../src/components/compound/DlOptionGroup/utils'

describe('DlOptionGroup', () => {
    beforeEach(() => {
        vi.resetModules()
    })

    it('should validate options if the value and label fields are present', () => {
        const result = optionsValidator([
            { value: 1, label: 'one', disabled: true },
            { value: 2, label: 'two', color: 'dl-color-darker' },
            { value: 3, label: 'three' }
        ])

        expect(result).toBe(true)
    })

    it('should simulate a label click on item click', () => {
        const wrapper = mount(DlOptionGroup, {
            props: {
                options: [{ label: 'Option', value: 1 }],
                modelValue: 2
            }
        })

        const itemClick = vi.fn().mockImplementation(() => {})

        const itemWrapper = wrapper.find('[data-test="item-wrapper"]')
        const item = wrapper.find('[data-test="item-control-element"]')

        wrapper.find('label').element.addEventListener('click', itemClick)
        wrapper.find('label').trigger('click')
        expect(itemClick).toBeCalled()
    })

    it("should log an error in console if the modelValue isn't of the right type", () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {})
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

        mount(DlOptionGroup, {
            props: {
                type: 'switch',
                modelValue: 39,
                options: [{ value: 42, label: 'answer' }]
            }
        })

        expect(error).toBeCalledWith(
            expect.stringContaining(
                'Option group with multiple choices should have an array of options as modelValue.'
            )
        )
        error.mockReset()
        warn.mockReset()
    })

    it('should set css variables', () => {
        const wrapper = mount(DlOptionGroup, {
            props: {
                type: 'switch',
                modelValue: 39,
                options: [{ value: 42, label: 'answer' }],
                leftLabel: true
            }
        })

        const flexDirection = wrapper.vm.cssVars['--option-flex-direction']
        const justifyContent = wrapper.vm.cssVars['--option-justify-content']
        const groupWidth = wrapper.vm.cssVars['--option-group-width']

        expect(flexDirection).toEqual('row')
        expect(justifyContent).toEqual('space-between')
        expect(groupWidth).toEqual('100%')
    })

    it('should emit @update:model-value event', async () => {
        const wrapper = mount(DlOptionGroup, {
            props: {
                options: [{ label: 'A', value: 'A' }],
                modelValue: [53, 32, 42]
            }
        })

        const event = new Event('change')
        await wrapper.vm.handleUpdate(42, event)

        expect(wrapper.emitted()['update:model-value'][0]).toEqual([42, event])
    })

    it('should emit @click event', async () => {
        const wrapper = mount(MenuItemWrapper, {
            props: { leftLabel: false }
        })

        const listItem = wrapper.find('.dl-list-item')
        await listItem.trigger('click')

        expect(wrapper.emitted()['click']).toBeTruthy()
    })
})
