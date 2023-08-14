import { mount } from '@vue/test-utils'
import DlSmartSearchInput from '../../src/components/compound/DlSearches/DlSmartSearch/components/DlSmartSearchInput.vue'
import { describe, it, expect, vi } from 'vitest'

window.ResizeObserver =
    window.ResizeObserver ||
    vi.fn().mockImplementation(() => ({
        disconnect: vi.fn(),
        observe: vi.fn(),
        unobserve: vi.fn()
    }))

const schema = {
    name: 'string',
    level: ['high', 'medium', 'low', 30],
    completed: 'boolean',
    metadata: {
        nesting: {
            age: 'number',
            valid: 'boolean'
        },
        date: 'date',
        start: 'datetime',
        classTime: 'time',
        '*': 'any'
    }
}

const aliases = [
    {
        alias: 'Name',
        key: 'name'
    },
    {
        alias: 'Age',
        key: 'metadata.nesting.age'
    },
    {
        alias: 'StartTime',
        key: 'metadata.start'
    },
    {
        alias: 'Level',
        key: 'level'
    }
]

describe('DlSmartSearchInput', () => {
    it('should assign classes to component according to the props', async () => {
        const wrapper = mount(DlSmartSearchInput, {
            props: {
                status: { type: 'error', message: 'error label' }
            }
        })
        expect(wrapper.vm.searchBarClasses.includes('--error')).toBeTruthy()

        await wrapper.setProps({
            status: { type: 'info', message: 'info label' }
        })

        wrapper.vm.focused = true
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.searchBarClasses.includes('--focused')).toBeTruthy()

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
        const wrapper = mount(DlSmartSearchInput as any, {
            props: {
                modelValue: { a: true },
                styleModel: { fields: { values: '', color: 'red' } }
            }
        })
        await wrapper.setProps({ modelValue: { a: false } })
        // @ts-ignore // handled in jest setup
        await window.delay(500)
        await wrapper.vm.$nextTick()
        const inputRef = wrapper.vm.$refs.input as HTMLInputElement
        expect(inputRef.innerHTML).toBe('a = false')
    })

    it('will show focus on click', async () => {
        const wrapper = mount(DlSmartSearchInput, {
            props: {
                schema,
                aliases,
                modelValue: {}
            }
        })

        await wrapper.vm.input.click()
        // @ts-ignore // handled in jest setup
        await window.delay(500)
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.focused).toBe(true)
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

    it('should handle blur', async () => {
        const wrapper = mount(DlSmartSearchInput, {
            mounted() {
                this.$refs.input.scrollTo = vi.fn()
            }
        })
        wrapper.vm.blur()
        expect(wrapper.emitted().blur).toBeDefined()
        expect(wrapper.vm.focused).toBe(false)
    })

    it('should clear the value', () => {
        const wrapper = mount(DlSmartSearchInput, {
            mounted() {
                this.$refs.input.scrollTo = vi.fn()
            }
        })
        wrapper.vm.onClear()
        expect(wrapper.emitted()['update:model-value']).toEqual([[{}]])
    })

    it('should handle keyboard input', async () => {
        const wrapper = mount(DlSmartSearchInput, {
            props: {}
        })
        await wrapper.setProps({ modelValue: { a: false } })

        //@ts-ignore
        await window.delay(500)
        await wrapper.vm.$nextTick()

        wrapper.vm.onKeyPress({
            key: 'backspace',
            preventDefault: vi.fn()
        } as any as KeyboardEvent)
        wrapper.vm.onKeyPress({
            key: 'Enter',
            preventDefault: vi.fn()
        } as any as KeyboardEvent)

        const inputRef = wrapper.vm.$refs.input as HTMLInputElement
        expect(inputRef.innerHTML).toBe('a = false')
    })

    it('should handle value change', async () => {
        const wrapper = mount(DlSmartSearchInput)
        wrapper.vm.debouncedSetInputValue('text')
        //@ts-ignore
        await window.delay(500)
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted()['input']).toEqual([['text']])
    })

    it('should handle selection update', () => {
        const wrapper = mount(DlSmartSearchInput)
        const interval = { from: new Date(), to: new Date() }
        wrapper.vm.onDateSelection(interval)
        expect(wrapper.vm.datePickerSelection).toEqual(interval)
    })
})
