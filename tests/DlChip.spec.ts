import { mount } from '@vue/test-utils'
import { DlChip } from '../src/components'

describe('DlChip', () => {
    test('testing DlChip functionality', async () => {
        const wrapper = mount(DlChip, {
            props: {
                filled: true,
                label: 'Filled chip',
                disabled: false,
                removable: true
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.props()).toStrictEqual({
            filled: true,
            label: 'Filled chip',
            color: 'dl-color-secondary',
            disabled: false,
            outlined: false,
            iconColor: '',
            removable: true,
            maxWidth: '',
            tabIndex: '',
            icon: '',
            textColor: '',
            transform: 'lowercase',
            overflow: false
        })

        expect(wrapper.vm.hasIcon).toBe(false)
        expect(wrapper.vm.computedIconColor).toBe('dl-color-white')

        await wrapper.setProps({
            filled: false,
            label: 'Outlined chip',
            disabled: false,
            outlined: true,
            textColor: ''
        })

        expect(wrapper.vm.computedIconColor).toBe('dl-color-secondary')

        await wrapper.setProps({
            filled: false,
            label: 'Outlined chip',
            disabled: false,
            outlined: true,
            textColor: '',
            iconColor: 'dl-color-black'
        })

        expect(wrapper.vm.computedIconColor).toBe('dl-color-black')

        await wrapper.setProps({
            filled: false,
            label: 'Outlined chip',
            disabled: false,
            outlined: true,
            textColor: '',
            removable: true,
            iconColor: 'dl-color-black'
        })

        expect(
            await wrapper.find('span').classes('dl-chip-remove-icon-container')
        ).toBe(true)
    })
})
