import { mount } from '@vue/test-utils'
import { DlLink } from '../../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlLink', () => {
    const href = 'https://conosle.dataloop.ai/'
    const message = 'click me'
    const color = 'color-secondary'

    describe('When mounting', () => {
        let wrapper: any
        let a: any
        let prop: any

        beforeAll(() => {
            wrapper = mount(DlLink, {
                props: { href, external: true, color },
                slots: { default: message }
            })
            a = wrapper.find('a')
            prop = wrapper.props('color')
        })
        it('should mount the link', function () {
            expect(a).not.toBe(undefined)
        })
        it('should have the right message', function () {
            expect(a.text()).toEqual(message)
        })
        it('should have the right href', function () {
            expect(a.element.href).toEqual(href)
        })
        it('should have the right color prop', function () {
            expect(prop).toEqual(color)
        })
        it('should have prop', function () {
            expect(prop).toBeTruthy()
        })
        it('should have the right target', function () {
            expect(a.element.target).toEqual('')
        })
    })
})
