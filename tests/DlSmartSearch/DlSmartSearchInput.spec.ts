import { mount, shallowMount } from '@vue/test-utils'
import DlSmartSearchInput from '../../src/components/compound/DlSearches/DlSmartSearch/components/DlSmartSearchInput.vue'
import { describe, it, expect, vi } from 'vitest'

window.ResizeObserver =
    window.ResizeObserver ||
    vi.fn().mockImplementation(() => ({
        disconnect: vi.fn(),
        observe: vi.fn(),
        unobserve: vi.fn()
    }))

describe('DlSmartSearchInput', () => {
    it('should render component with default props', async () => {
        const wrapper = mount(DlSmartSearchInput, {
            props: {}
        })
        expect(wrapper.vm.screenIcon).toMatch('icon-dl-full-screen')
    })

    it('should assign classes to component according to the props', async () => {
        const wrapper = mount(DlSmartSearchInput, {
            props: {
                status: { type: 'error', message: 'error label' }
            }
        })
        expect(wrapper.vm.searchBarClasses.includes('--error')).toBeTruthy()
        expect(wrapper.find('label').text()).toBe('error label')

        await wrapper.setProps({
            status: { type: 'info', message: 'info label' }
        })

        await wrapper.setProps({ disabled: true })
        expect(wrapper.vm.searchBarClasses.includes('--disabled')).toBeTruthy()

        await wrapper.setProps({
            styleModel: { fields: { values: '', color: 'red' } }
        })

        await wrapper.setProps({ placeholder: 'text' })

        await wrapper.setProps({ expandedInputHeight: '200px' })

        await wrapper.setProps({ withSearchIcon: true })

        await wrapper.setProps({ withScreenButton: true })

        await wrapper.setProps({ withSaveButton: true })

        await wrapper.setProps({ withDQLButton: false })

        await wrapper.setProps({ isDatePickerVisible: false })
    })

    it('Will update the v-model', async () => {
        const wrapper = mount(DlSmartSearchInput, {
            props: {
                modelValue: 'a',
                styleModel: { fields: { values: '', color: 'red' } }
            }
        })
        await wrapper.setProps({ modelValue: 'search' })
        // @ts-ignore // handled in jest setup
        await window.delay(500)
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$refs.input.innerHTML).toBe('search')
    })

    it('will show suggestions', async () => {
        const wrapper = mount(DlSmartSearchInput)
        await wrapper.vm.focus()
        await wrapper.setProps({ suggestions: ['one', 'two'] })
        // @ts-ignore // handled in jest setup
        await window.delay(500)
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.suggestionModal).toBe(true)
    })

    it('should focus', () => {
        const wrapper = mount(DlSmartSearchInput, {
            props: {
                disabled: false
            },
            mounted() {
                this.$refs.input.scrollTo = vi.fn()
            }
        })
        wrapper.vm.focus()
        expect(wrapper.emitted().focus).toBeTruthy()
    })

    it('should handle blur', () => {
        const wrapper = mount(DlSmartSearchInput, {
            mounted() {
                this.$refs.input.scrollTo = vi.fn()
            }
        })
        wrapper.vm.suggestionModal = true
        wrapper.vm.blur()
        expect(wrapper.vm.focused).toBe(true)
        wrapper.vm.cancelBlur = 1
        wrapper.vm.blur()
        expect(wrapper.emitted().focus).toEqual([[true]])
    })

    it('should render component with expanded data', async () => {
        const wrapper = shallowMount(DlSmartSearchInput, {
            props: {},
            mounted() {
                this.$refs.input.scrollTo = vi.fn()
            }
        })

        wrapper.vm.handleScreenBtnClick()
        expect(wrapper.vm.screenIcon).toBe('icon-dl-fit-to-screen')
    })

    it('should emit save', () => {
        const wrapper = shallowMount(DlSmartSearchInput)
        wrapper.vm.save()
        expect(wrapper.emitted().save).toBeTruthy()
    })
    it('should emit edit', () => {
        const wrapper = shallowMount(DlSmartSearchInput)
        wrapper.vm.edit()
        expect(wrapper.emitted()['dql-edit']).toBeTruthy()
    })

    it('should clear the value', () => {
        const wrapper = mount(DlSmartSearchInput, {
            mounted() {
                this.$refs.input.scrollTo = vi.fn()
            }
        })
        wrapper.vm.clearValue()
        expect(wrapper.emitted()['update:modelValue']).toEqual([['']])
    })

    it('should handle keyboard input', () => {
        const wrapper = mount(DlSmartSearchInput, {
            props: {
                modelValue: 'model'
            }
        })
        wrapper.vm.keyPress({ key: 'backspace', preventDefault: vi.fn() })
        wrapper.vm.keyPress({ key: 'Enter', preventDefault: vi.fn() })
        expect(wrapper.emitted().search).toEqual([['model']])
    })

    it('should handle value change', () => {
        const wrapper = mount(DlSmartSearchInput)
        wrapper.vm.handleValueChange({ target: { textContent: 'text' } })
        expect(wrapper.emitted()['update:modelValue']).toEqual([['text']])
    })

    it('should handle screen button click', () => {
        const wrapper = mount(DlSmartSearchInput, {
            mounted() {
                this.$refs.input.scrollTo = vi.fn()
            }
        })
        wrapper.vm.expanded = false
        wrapper.vm.handleScreenBtnClick()
        expect(wrapper.vm.expanded).toBe(true)
    })

    it('should handle selection update', () => {
        const wrapper = mount(DlSmartSearchInput)
        const interval = { from: 'date', to: 'date' }
        wrapper.vm.handleDateSelectionUpdate(interval)
        expect(wrapper.vm.datePickerSelection).toEqual(interval)
    })

    it('should render component with expanded data', () => {
        const wrapper = shallowMount(DlSmartSearchInput, {
            props: {},
            mounted() {
                this.$refs.input.scrollTo = vi.fn()
            }
        })

        wrapper.vm.handleScreenBtnClick()
        expect(wrapper.vm.screenIcon).toBe('icon-dl-fit-to-screen')
    })
})
