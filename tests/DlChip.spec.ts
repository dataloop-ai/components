import { DOMWrapper, mount } from '@vue/test-utils'
import { DlChip } from '../src/'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlChip', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlChip, {
                props: {
                    filled: true,
                    label: 'Filled chip',
                    disabled: false,
                    removable: true
                }
            })
        })
        it('should exist the component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should right props', () => {
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
        })
        it('should compute right hasIcon flag', () => {
            expect(wrapper.vm.hasIcon).toBe(false)
        })
        it('should compute right icon color', function () {
            expect(wrapper.vm.computedIconColor).toBe('dl-color-white')
        })
    })
    describe('When updating props', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlChip, {
                props: {
                    filled: true,
                    label: 'Filled chip',
                    disabled: false,
                    removable: true
                }
            })
            await wrapper.setProps({
                filled: false,
                label: 'Outlined chip',
                disabled: false,
                outlined: true,
                textColor: '',
                removable: true,
                iconColor: 'dl-color-black'
            })
        })
        it('should right class', async () => {
            expect(
                await wrapper
                    .find('span')
                    .classes('dl-chip-remove-icon-container')
            ).toBe(true)
        })
        it('should compute right icon color', () => {
            expect(wrapper.vm.computedIconColor).toBe('dl-color-black')
        })
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
