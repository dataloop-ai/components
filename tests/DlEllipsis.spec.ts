import { mount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { DlEllipsis } from '../src/components'

const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi corrupti rerum voluptate amet ex quas perspiciatis dicta ea similique, voluptatum perferendis possimus. Quasi eveniet asperiores, dolorum quia facilis reiciendis animi.'

describe('DlEllipsis', () => {
    beforeEach(() => {
        vi.resetModules()
    })
    describe('When mounting', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlEllipsis, {
                props: {
                    text
                }
            })
        })
        it('should exist component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should right props', function () {
            expect(wrapper.props()).toMatchObject({
                text
            })
        })
        it('should to display both parts of label without middle ellipsis', () => {
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
    describe('When mounting middle ellipsis', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlEllipsis, {
                props: {
                    text,
                    middleEllipsis: true
                }
            })
        })
        it('should to display both parts of label with middle ellipsis', function () {
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
})
