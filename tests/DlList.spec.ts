import { mount } from '@vue/test-utils'
import { DlList } from '../src'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlList', () => {
    describe('When mounting', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlList, {
                props: {},
                slots: {
                    default: 'content'
                }
            })
        })
        it('should exist component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should right props', function () {
            expect(wrapper.props()).toStrictEqual({
                bordered: false,
                separator: false,
                padding: false,
                clickable: false,
                type: 'div'
            })
        })
        it('should right class', function () {
            expect(wrapper.vm.classes).toBe('dl-list')
        })
    })
    describe('When updating bordered prop', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlList, {
                props: {},
                slots: {
                    default: 'content'
                }
            })
            await wrapper.setProps({ bordered: true })
        })
        it('should compute right class', function () {
            expect(wrapper.vm.classes).toBe('dl-list dl-list--bordered')
        })
    })
    describe('When updating separator prop', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlList, {
                props: {},
                slots: {
                    default: 'content'
                }
            })
            await wrapper.setProps({ separator: true })
        })
        it('should compute right class', function () {
            expect(wrapper.vm.classes).toBe('dl-list dl-list--separator')
        })
    })
    describe('When updating padding prop', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlList, {
                props: {},
                slots: {
                    default: 'content'
                }
            })
            await wrapper.setProps({ padding: true })
        })
        it('should compute right class', function () {
            expect(wrapper.vm.classes).toBe('dl-list dl-list--padding')
        })
    })
})
