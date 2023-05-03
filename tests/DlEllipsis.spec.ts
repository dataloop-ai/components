import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DlEllipsis } from '../src/components'

const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi corrupti rerum voluptate amet ex quas perspiciatis dicta ea similique, voluptatum perferendis possimus. Quasi eveniet asperiores, dolorum quia facilis reiciendis animi.'

describe('DlEllipsis', () => {
    beforeEach(() => {
        vi.resetModules()
    })

    it('should have text', async () => {
        const wrapper = mount(DlEllipsis, {
            props: {
                text
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.props()).toMatchObject({
            text
        })
    })

    it('should to display both parts of label with middle ellipsis', () => {
        const wrapper = mount(DlEllipsis, {
            props: {
                text,
                middleEllipsis: true
            }
        })

        const className = 'dl-ellipsis'
        const expected = [
            'dl-ellipsis',
            'dl-dl-ellipsis__left',
            'dl-dl-ellipsis__right'
        ]

        const result = wrapper.classes(className)

        expected.forEach(() => {
            expect(result).toBe(true)
        })
    })

    it('should to display both parts of label without middle ellipsis', () => {
        const wrapper = mount(DlEllipsis, {
            props: {
                text
            }
        })

        const className = 'dl-ellipsis'
        const expected = [
            'dl-ellipsis',
            'dl-dl-ellipsis__left',
            'dl-dl-ellipsis__right'
        ]

        const result = wrapper.classes(className)

        expected.forEach(() => {
            expect(result).toBe(true)
        })
    })
})
