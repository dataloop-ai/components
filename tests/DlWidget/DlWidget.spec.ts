import { mount } from '@vue/test-utils'
import { DlWidget } from '../../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlWidget', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlWidget)
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
    })
    describe('When draggable widget', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlWidget, {
                data() {
                    return {
                        isDragging: true
                    }
                }
            })
        })
        it('should add draggable class to widget', () => {
            expect(wrapper.vm.widgetClasses).toMatch('dl-widget__drag')
        })
        it('should start performing drag operation', () => {
            const div = document.createElement('div')
            wrapper.vm.startDragging({ target: div })
            expect(wrapper.vm.isDragging).toBe(true)
        })
        it('should move the dragged widget clone', () => {
            wrapper.vm.moveClone({ pageX: 100, pageY: 100 })
            expect(wrapper.vm.$refs.clone.style.top).toMatch('110px')
            expect(wrapper.vm.$refs.clone.style.left).toMatch('95px')
        })
        it('should turn off dragging operation', () => {
            const div = document.createElement('div')
            wrapper.vm.stopDragging({ target: div })
            expect(wrapper.vm.isDragging).toBe(false)
        })
    })
    describe('When mouse move inside widget', () => {
        let wrapper: any

        beforeAll(() => {
            const div = document.createElement('div')
            div.style.left = '100px'
            div.style.width = '30px'
            wrapper = mount(DlWidget, {
                data() {
                    return {
                        hoveredWidget: div
                    }
                }
            })
        })
        it('should handle mouseenter', () => {
            const div = document.createElement('div')
            wrapper.vm.handleMouseEnter({ target: div })
            expect(wrapper.vm.hoveredWidget).toEqual(div)
        })
        it('should handle mouse move inside widget', () => {
            wrapper.vm.handleMouseInsideWidget({ clientX: 100 })
            expect(wrapper.vm.isLeftSide).toBe(false)
        })
    })
    describe('When insert widget before or after', () => {
        let wrapper: any

        beforeAll(() => {
            const parent = document.createElement('div')
            parent.classList.add('widget-wrapper')
            const child = document.createElement('div')
            parent.appendChild(child)
            document.body.appendChild(parent)
            wrapper = mount(DlWidget, {
                data() {
                    return {
                        hoveredWidget: child
                    }
                }
            })
        })
        it('should insert widget', function () {
            wrapper.vm.insertWidget()
        })
    })
})
