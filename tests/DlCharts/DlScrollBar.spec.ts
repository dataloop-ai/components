import { describe, it, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import DlChartsScrollBar from '../../src/components/compound/DlCharts/components/DlChartScrollBar.vue'

describe('DlScrollBar', () => {
    it('should trigger the drag functionality', () => {
        const wrapper = mount(DlChartsScrollBar, {
            props: {
                itemCount: 20,
                itemsInView: 6,
                height: '700px',
                position: 0
            }
        })
        wrapper.vm.startDragging({ clientY: 400 })
        expect(wrapper.vm.isDragging).toBeTruthy()
        expect(wrapper.vm.mouseOffsetTop).toBe(400)
    })

    it('should turn off dragging', () => {
        const wrapper = mount(DlChartsScrollBar, {
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
        expect(wrapper.vm.isDragging).toBeFalsy()
    })

    it('should move the scrollbar while dragging', async () => {
        const wrapper = shallowMount(DlChartsScrollBar, {
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

        expect(wrapper.emitted()['position-update']).toBeTruthy()
    })
})
