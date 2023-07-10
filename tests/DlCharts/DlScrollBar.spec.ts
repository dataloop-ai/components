import { describe, it, expect, beforeAll } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import DlChartsScrollBar from '../../src/components/compound/DlCharts/components/DlChartScrollBar.vue'

describe('DlScrollBar', () => {
    describe('When trigger drag', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlChartsScrollBar, {
                props: {
                    itemCount: 20,
                    itemsInView: 6,
                    height: '700px',
                    position: 0
                }
            })
            wrapper.vm.startDragging({ clientY: 400 })
        })
        it('should trigger the drag functionality', function () {
            expect(wrapper.vm.isDragging).toBeTruthy()
        })
        it('should the right offset', function () {
            expect(wrapper.vm.mouseOffsetTop).toBe(400)
        })
    })
    describe('When turn off dragging', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlChartsScrollBar, {
                data() {
                    return {
                        isDragging: true
                    }
                },
                props: {
                    height: '700px'
                }
            })
            wrapper.vm.stopDragging()
        })
        it('should off dragging', function () {
            expect(wrapper.vm.isDragging).toBeFalsy()
        })
    })
    describe('When move the scrollbar while dragging', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = shallowMount(DlChartsScrollBar, {
                props: {
                    itemCount: 20,
                    itemsInView: 6,
                    height: '700px',
                    position: 0
                },
                data() {
                    return {
                        isDragging: true,
                        maxHeight: 700
                    }
                }
            })
            wrapper.vm.moveScrollBar({ clientY: 200 })

            await wrapper.vm.$nextTick()
        })
        it('should updated position', function () {
            expect(wrapper.emitted()['position-update']).toBeTruthy()
        })
    })
})
