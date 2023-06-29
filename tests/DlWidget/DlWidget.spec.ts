import { mount } from '@vue/test-utils'
import { DlWidget } from '../../src/components'
import { describe, it, expect } from 'vitest'

describe('DlWidget', () => {
    it('should mount the widget component', () => {
        const wrapper = mount(DlWidget)
    })

    it('should add draggable class to widget', () => {
        const wrapper = mount(DlWidget)
        wrapper.vm.isDragging = true
        expect(wrapper.vm.widgetClasses).toMatch('dl-widget__drag')
    })

    it('should start performing drag operation', () => {
        const wrapper = mount(DlWidget)
        const div = document.createElement('div')
        wrapper.vm.startDragging({ target: div })
        expect(wrapper.vm.isDragging).toBe(true)
    })

    it('should move the dragged widget clone', () => {
        const wrapper = mount(DlWidget, {})
        wrapper.vm.isDragging = true
        wrapper.vm.moveClone({ pageX: 100, pageY: 100 })
        expect(wrapper.vm.clone.style.top).toMatch('110px')
        expect(wrapper.vm.clone.style.left).toMatch('95px')
    })

    it('should turn off dragging operation', () => {
        const wrapper = mount(DlWidget, {
            data() {
                return {
                    isDragging: true
                }
            }
        })
        const div = document.createElement('div')
        wrapper.vm.stopDragging({ target: div })
        expect(wrapper.vm.isDragging).toBe(false)
    })

    it('should handle mouseenter', () => {
        const wrapper = mount(DlWidget)
        const div = document.createElement('div')
        wrapper.vm.handleMouseEnter({ target: div })
        expect(wrapper.vm.hoveredWidget).toEqual(div)
    })

    it('should insert widget before or after', () => {
        const parent = document.createElement('div')
        parent.classList.add('widget-wrapper')
        const child = document.createElement('div')
        parent.appendChild(child)
        document.body.appendChild(parent)
        const wrapper = mount(DlWidget, {
            data() {
                return {
                    hoveredWidget: child
                }
            }
        })
        wrapper.vm.insertWidget()
    })

    it('should handle mouse move inside widget', () => {
        const div = document.createElement('div')
        div.style.left = '100px'
        div.style.width = '30px'
        const wrapper = mount(DlWidget, {
            data() {
                return {
                    hoveredWidget: div
                }
            }
        })
        wrapper.vm.handleMouseInsideWidget({ clientX: 100 })
        expect(wrapper.vm.isLeftSide).toBe(false)
    })
})
