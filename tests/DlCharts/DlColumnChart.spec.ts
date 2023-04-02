import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { DlColumnChart } from '../../src/components'
import { config } from './config'

describe('DlColumnChart', () => {
    it('should render a canvas', () => {
        const wrapper = mount(DlColumnChart, {
            props: config as any
        })

        const canvas = wrapper.find('canvas')

        expect(canvas.exists()).toBe(true)
        expect(canvas.element.id).toBe('')
    })

    it('should change id based on prop', () => {
        const wrapper = mount(DlColumnChart, {
            props: {
                id: 'bar-chart-id',
                ...config
            } as any
        })

        const canvas = wrapper.find('canvas')

        expect(canvas.exists()).toBe(true)
        expect(canvas.element.id).toBe('bar-chart-id')
    })

    it('should add inline plugins based on prop', () => {
        const testPlugin = {
            id: 'test'
        }

        const wrapper = mount(DlColumnChart, {
            props: {
                plugins: [testPlugin],
                ...config
            } as any
        })

        expect(wrapper.props().plugins.length).toEqual(1)
    })
})
