import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { DlColumnChart } from '../../src/components'
import { config } from './config'

describe('DlColumnChart', () => {
    describe('When mounting', () => {
        let wrapper: any
        let canvas: any

        beforeAll(() => {
            wrapper = mount(DlColumnChart, {
                props: config as any
            })
            canvas = wrapper.find('canvas')
        })
        it('should mount the canvas', function () {
            expect(canvas.exists()).toBe(true)
        })
        it('should the right id', function () {
            expect(canvas.element.id).toBe('')
        })
    })
    describe('When set id in prop', () => {
        let wrapper: any
        let canvas: any

        beforeAll(() => {
            wrapper = mount(DlColumnChart, {
                props: {
                    id: 'bar-column-id',
                    ...config
                } as any
            })
            canvas = wrapper.find('canvas')
        })
        it('should the right id', function () {
            expect(canvas.element.id).toBe('bar-column-id')
        })
    })
    describe('When set plugins in prop', () => {
        let wrapper: any

        beforeAll(() => {
            const testPlugin = {
                id: 'test'
            }

            wrapper = mount(DlColumnChart, {
                props: {
                    plugins: [testPlugin],
                    ...config
                } as any
            })
        })
        it('should the right plugins length', function () {
            expect(wrapper.props().plugins.length).toEqual(1)
        })
    })
})
