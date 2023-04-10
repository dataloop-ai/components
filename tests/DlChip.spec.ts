import { DOMWrapper, VueWrapper, mount } from '@vue/test-utils'
import { DlChip } from '../src/'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlChip', () => {
    it('testing DlChip functionality', async () => {
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
            overflow: false,
            fit: false
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
    describe('When passing a dl-chip with fit property', () => {
        let chip: DOMWrapper<HTMLDivElement>

        beforeAll(async () => {
            const wrapper = mount(DlChip, {
                props: {
                    filled: true,
                    label: 'Filled chip',
                    disabled: false,
                    removable: true,
                    fit: true
                }
            })

            chip = await wrapper.find(`#${wrapper.vm.uuid}`)
        })

        it('will have max-width of "fit-content"', () => {
            expect(
                chip
                    .attributes('style')
                    ?.includes('--dl-chip-max-width: fit-content')
            ).to.be.true
        })
    })
})
