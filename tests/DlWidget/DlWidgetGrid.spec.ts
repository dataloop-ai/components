import { mount } from '@vue/test-utils'
import { DlWidgetGrid } from '../../src'

describe('DlWidgetGrid', () => {
    it('should return grid row gap', () => {
        const wrapper = mount(DlWidgetGrid, {
            props: {
                rowGap: '10px'
            }
        })
        expect(wrapper.vm.gridStyle.gap).toMatch('10px')
    })

    it('should return grid item gap', () => {
        const wrapper = mount(DlWidgetGrid, {
            props: {
                columnGap: '10px'
            }
        })
        expect(wrapper.vm.rowStyle.gap).toMatch('10px')
    })
    it('should return dragging clone classes', () => {
        const wrapper = mount(DlWidgetGrid, {
            data() {
                return { isDragging: true }
            }
        })
        expect(wrapper.vm.cloneClasses).toMatch(
            'dl-widget-grid__clone dl-widget-grid__clone--dragging'
        )
    })

    it('should return the grid item classes', () => {
        const wrapper = mount(DlWidgetGrid, {
            data() {
                return { isDragging: true }
            }
        })
        expect(wrapper.vm.gridItemClasses).toMatch(
            'dl-widget-grid__item dl-widget-grid__item--dragging'
        )
    })
    it('start dragging a given widget', () => {
        const mockDiv = document.createElement('div')
        mockDiv.setAttribute('id', '0-0')
        document.body.appendChild(mockDiv)
        const wrapper = mount(DlWidgetGrid)
        wrapper.vm.startDragging('0-0', 'test-widget')
        expect(wrapper.vm.isDragging).toBeTruthy()
        expect(wrapper.vm.draggedWidget).toMatch('test-widget')
    })
    it('should drop the currently dragged widget', () => {
        const wrapper = mount(DlWidgetGrid, {
            data() {
                return {
                    isDragging: true
                }
            }
        })
        wrapper.vm.stopDragging({
            target: {
                classList: {
                    contains: jest.fn()
                }
            }
        })
        expect(wrapper.vm.isDragging).toBeFalsy()
        expect(wrapper.vm.draggedWidgetId).toBeNull()
    })
    it('should move the clone widget to the mouse position', () => {
        const wrapper = mount(DlWidgetGrid)
        const mockEvent = { pageX: 100, pageY: 100 }
        wrapper.vm.moveWidget(mockEvent)
        expect(wrapper.vm.$refs.clone.style.top).toMatch(
            `${mockEvent.pageY + 10}px`
        )
        expect(wrapper.vm.$refs.clone.style.left).toMatch(
            `${mockEvent.pageX - 5}px`
        )
    })
    it('should emit a remove event containing the widget', () => {
        const wrapper = mount(DlWidgetGrid, {
            props: {
                modelValue: [[{ title: 'w1' }]]
            }
        })
        wrapper.vm.removeWidget('0-0')
        expect(wrapper.emitted().remove).toEqual([[{ title: 'w1' }]])
    })
    it('should handle mouse enter', () => {
        const wrapper = mount(DlWidgetGrid)
        wrapper.vm.handleMouseEnter({ target: 'jest' })
        expect(wrapper.vm.dragTarget).toEqual('jest')
    })
    it('should rearrange the widgets', async () => {
        const wrapper = mount(DlWidgetGrid, {
            data() {
                return {
                    draggedWidgetId: '1-0',
                    currentRow: 0,
                    currentItem: 0
                }
            },
            props: {
                modelValue: [
                    [{}, {}],
                    [{}, {}]
                ]
            }
        })
        wrapper.vm.rearrangeWidgets()
        await wrapper.setProps({
            modelValue: [
                [{ title: '', subtitle: '', content: '', description: '' }]
            ]
        })
        expect(wrapper.emitted()['update:model-value'][0]).toEqual([
            [[{}, null, {}], [{}]]
        ])
    })
    it('should handle mouse move', () => {
        const wrapper = mount(DlWidgetGrid, {
            data() {
                return {
                    dragTarget: {
                        offsetLeft: 100
                    }
                }
            }
        })
        wrapper.vm.handleMouseMove({ x: 100, target: { offsetLeft: 100 } })
        expect(wrapper.vm.dragSide).toEqual({ current: false, previous: false })
    })
})
