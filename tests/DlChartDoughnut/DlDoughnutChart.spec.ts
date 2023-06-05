import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { DlDoughnutChart } from '../../src/components'
import {
    doughnutLessData,
    doughnutEmptyObject,
    doughnutEmptyData,
    doughnutEmptyDataset
} from './data'

describe('DlDoughnutChart', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlDoughnutChart, {
                props: {
                    data: doughnutLessData
                }
            })
        })

        it('should mount the component', function () {
            const canvas = wrapper.find('canvas')

            expect(canvas.exists()).toBe(true)
        })

        describe('When set summary', () => {
            beforeAll(async () => {
                await wrapper.setProps({ hasSummary: true })
            })
            it('should have chart summary', function () {
                const summary = wrapper.find({
                    ref: 'dlDoughnutChartSummaryRef'
                })
                expect(summary.exists()).toBe(true)
            })
        })
        describe('When set false summary', () => {
            beforeAll(async () => {
                await wrapper.setProps({ hasSummary: false })
            })
            it('should have chart summary', function () {
                const summary = wrapper.find({
                    ref: 'dlDoughnutChartSummaryRef'
                })
                expect(summary.exists()).toBe(false)
            })
        })
    })
    describe('When mounting with empty object', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlDoughnutChart, {
                props: {
                    data: doughnutEmptyObject
                }
            })
        })

        it('should not mount the component', function () {
            const canvas = wrapper.find('canvas')

            expect(canvas.exists()).toBe(false)
        })
    })
    describe('When mounting with empty dataset', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlDoughnutChart, {
                props: {
                    data: doughnutEmptyDataset
                }
            })
        })
        it('should not mount the component', function () {
            const canvas = wrapper.find('canvas')

            expect(canvas.exists()).toBe(false)
        })
    })
    describe('When mounting with empty data', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlDoughnutChart, {
                props: {
                    data: doughnutEmptyData
                }
            })
        })
        it('should not mount the component', function () {
            const canvas = wrapper.find('canvas')

            expect(canvas.exists()).toBe(false)
        })
    })
})
