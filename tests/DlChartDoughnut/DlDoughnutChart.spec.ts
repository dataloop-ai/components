import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DlDoughnutChart from '../../src/components/DlChart/Doughnut/DlDoughnutChart.vue'
import {
    doughnutLessData,
    doughnutEmptyObject,
    doughnutEmptyData,
    doughnutEmptyDataset
} from './data'

describe('DlDoughnutChart', () => {
    it('should render a canvas', () => {
        const wrapper = mount(DlDoughnutChart, {
            props: {
                data: doughnutLessData
            }
        })

        const canvas = wrapper.find('canvas')

        expect(canvas.exists()).toBe(true)
    })
    it('pass empty data object', () => {
        const wrapper = mount(DlDoughnutChart, {
            props: {
                data: doughnutEmptyObject
            }
        })

        const canvas = wrapper.find('canvas')

        expect(canvas.exists()).toBe(false)
    })
    it('pass empty dataset', () => {
        const wrapper = mount(DlDoughnutChart, {
            props: {
                data: doughnutEmptyDataset
            }
        })

        const canvas = wrapper.find('canvas')

        expect(canvas.exists()).toBe(false)
    })
    it('pass empty data', () => {
        const wrapper = mount(DlDoughnutChart, {
            props: {
                data: doughnutEmptyData
            }
        })

        const canvas = wrapper.find('canvas')

        expect(canvas.exists()).toBe(false)
    })

    it('should render a summary', () => {
        const wrapper = mount(DlDoughnutChart, {
            props: {
                data: doughnutLessData,
                hasSummary: true
            }
        })

        const summary = wrapper.find({ ref: 'dlDoughnutChartSummaryRef' })
        expect(summary.exists()).toBe(true)
    })
    it('should render a summary', () => {
        const wrapper = mount(DlDoughnutChart, {
            props: {
                data: doughnutLessData,
                hasSummary: false
            }
        })

        const summary = wrapper.find({ ref: 'dlDoughnutChartSummaryRef' })
        expect(summary.exists()).toBe(false)
    })
})
