import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DlKpi } from '../../src'
import { DlKpiCounterFormat } from '../../src/components/types'

const counterData = {
    value: 200000,
    format: DlKpiCounterFormat.long
}
const progressData = {
    value: 40,
    text: '75/100 Items'
}
const counterDataEmpty = {}
const progressDataEmpty = {}

describe('DlKpi', () => {
    it('should render kpi box', () => {
        const wrapper = mount(DlKpi, {
            props: {
                counter: counterData,
                progress: progressData
            }
        })

        expect(wrapper.exists()).toBe(true)
    })

    it('should compute the correct classes when calling computeClass', () => {
        const wrapper = mount(DlKpi, {
            props: {
                counter: counterData,
                progress: progressData,
                withProgressBar: true
            }
        })

        const className = 'kpi_box'
        const expected = [
            // 'kpi_box',
            'kpi_box__counter',
            'kpi_box__title',
            'kpi_box__title__text',
            'kpi_box__progress_bar'
        ]

        const result = wrapper.classes(className)

        expected.forEach(() => {
            expect(result).toBe(true)
        })
    })

    it('should not to display when it passed empty data', () => {
        const wrapper = mount(DlKpi, {
            props: {
                counter: counterData,
                progress: progressData,
                withProgressBar: true
            }
        })

        const className = 'kpi_box'
        const expected = [
            'kpi_box',
            'kpi_box__counter',
            'kpi_box__title',
            'kpi_box__title__text',
            'kpi_box__progress_bar'
        ]

        const result = wrapper.classes(className)

        expected.forEach(() => {
            expect(result).toBe(true)
        })
    })
    it('should to display when it passed empty params', () => {
        const wrapper = mount(DlKpi, {
            props: {
                counter: counterDataEmpty,
                progress: progressDataEmpty,
                withProgressBar: true
            }
        })

        const className = 'kpi_box'
        const expected = [
            'kpi_box',
            'kpi_box__counter',
            'kpi_box__title',
            'kpi_box__title__text',
            'kpi_box__progress_bar'
        ]

        const result = wrapper.classes(className)

        expected.forEach(() => {
            expect(result).toBe(true)
        })
    })
})
