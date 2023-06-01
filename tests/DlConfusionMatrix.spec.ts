import { mount } from '@vue/test-utils'
import { DlConfusionMatrix } from '../src'
import { beforeAll, describe, expect, it, vi } from 'vitest'

const matrixProps = {
    matrix: [
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3]
    ],
    labels: ['Label 1', 'Label 2', 'Label 3']
}

vi.useFakeTimers()

describe('DlConfusionMatrix', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlConfusionMatrix, {
                props: matrixProps
            })
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('should have the right flattenedMatrix', function () {
            expect(wrapper.vm.flattenedMatrix[0]).toEqual({
                value: 0.3,
                unnormalizedValue: 1,
                xLabel: 'Label 1',
                yLabel: 'Label 1',
                x: 0,
                y: 0
            })
        })
    })
    describe('When scroll matrix', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlConfusionMatrix, {
                props: matrixProps,
                mounted() {
                    this.$refs.matrixWrapper.scroll = vi.fn()
                    this.$refs.yAxisOuter.scroll = vi.fn()
                }
            })
            const cell = document.createElement('div')
            cell.classList.add('matrix__cell')
            document.body.appendChild(cell)
        })
        it('should handle brush update', function () {
            const brush = { min: 0, max: 3 }
            wrapper.vm.handleBrushUpdate(brush)
            expect(wrapper.vm.currentBrushState).toEqual(brush)
        })
        it('should scroll the yAxis along with the matrix', function () {
            wrapper.vm.handleMatrixScroll({ target: { scrollTop: 30 } })
        })
    })
    describe('When set tooltip according to the mouseenter event and hide it on mouseleave', () => {
        let wrapper: any
        let cell: any
        let event: any

        beforeAll(() => {
            vi.useFakeTimers()
            wrapper = mount(DlConfusionMatrix, {
                props: matrixProps
            })
            cell = {
                value: 1,
                xLabel: 'Label 1',
                yLabel: 'Label 1'
            }
            event = {
                pageX: 10,
                pageY: 10
            }
        })
        it('should the right tooltipState', function () {
            wrapper.vm.handleShowTooltip(cell, event)
            wrapper.vm.handleShowTooltip(cell, event)
            vi.runOnlyPendingTimers()
            expect(wrapper.vm.tooltipState).toEqual({
                value: 1,
                xLabel: 'Label 1',
                yLabel: 'Label 1',
                x: 10,
                y: 10,
                visible: true
            })
        })
        it('should the right tooltipState visible', function () {
            wrapper.vm.handleHideTooltip()
            wrapper.vm.handleHideTooltip()
            vi.runOnlyPendingTimers()
            expect(wrapper.vm.tooltipState.visible).toBe(false)
        })
    })
})
