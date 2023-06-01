import { beforeAll, describe, expect, it } from 'vitest'
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
    describe('When mounting', () => {
        let wrapper: any
        let className: any
        let expected: any

        beforeAll(() => {
            className = 'kpi_box'
            expected = [
                'kpi_box',
                'kpi_box__counter',
                'kpi_box__title',
                'kpi_box__title__text',
                'kpi_box__progress_bar'
            ]
            wrapper = mount(DlKpi, {
                props: {
                    title: 'test',
                    counter: counterData,
                    progress: progressData
                }
            })
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should compute the correct classes when calling computeClass', () => {
            const result = wrapper.classes(className)

            expected.forEach(() => {
                expect(result).toBe(true)
            })
        })
        it('should to display when it passed empty params', async () => {
            await wrapper.setProps({
                counter: counterDataEmpty,
                progress: progressDataEmpty
            })
            await wrapper.vm.$nextTick()

            const result = wrapper.classes(className)

            expected.forEach(() => {
                expect(result).toBe(true)
            })
        })
    })
})
