import { mount } from '@vue/test-utils'
import { DlLink } from '../../src/components'
import { describe, it, expect } from 'vitest'

describe('DlLink', () => {
    it('should display a link  text', () => {
        const href = 'https://conosle.dataloop.ai/'
        const message = 'click me'
        const wrapper = mount(DlLink, {
            props: { href, external: true },
            slots: { default: message }
        })

        const a = wrapper.find('a')
        expect(a).not.toBe(undefined)
        expect(a.text()).toEqual(message)
        expect(a.element.href).toEqual(href)
    })

    it('can access global css variables for color', () => {
        const href = 'https://conosle.dataloop.ai/'
        const message = 'click me'
        const color = 'color-secondary'
        const wrapper = mount(DlLink, {
            props: { href, color },
            slots: { default: message }
        })

        const prop = wrapper.props('color')
        expect(prop).toBeTruthy()
        expect(prop).toEqual(color)
    })
})
