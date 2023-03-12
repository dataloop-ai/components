import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { DlItemSection } from '../src'

describe('DlItemSection', () => {
    it('should display item section content', async () => {
        const wrapper = mount(DlItemSection, {
            props: {},
            slots: {
                default: 'content'
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.props().side).toBe(false)
        expect(wrapper.props().noWrap).toBe(false)

        expect(wrapper.classes('dl-item__section--main')).toBe(true)

        await wrapper.setProps({ side: true, noWrap: true })

        expect(wrapper.classes('dl-item__section--main')).toBe(false)

        expect(wrapper.classes('dl-item__section--side')).toBe(true)

        expect(wrapper.classes('dl-item__section--nowrap')).toBe(true)
    })

    it('should apply content color', async () => {
        const wrapper = mount(DlItemSection, {
            props: {},
            slots: {
                default: 'content'
            }
        })

        expect(wrapper.vm.cssVars['--dl-item-color']).toBe('inherit')

        await wrapper.setProps({ color: 'dl-color-warning' })

        expect(wrapper.vm.cssVars['--dl-item-color']).toBe(
            'var(--dl-color-warning, var(--dl-color-darker))'
        )
    })
})
