import { DlBadge } from '../src/components'
import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlBadge', () => {
    describe('When mounting', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlBadge, {
                props: {
                    align: 'top',
                    color: 'red',
                    textColor: 'green'
                }
            })
        })
        it('should right component styles', function () {
            expect(wrapper.vm.style.verticalAlign).toMatch('top')
            expect(wrapper.vm.style.aspectRatio).toMatch('1/1')
            expect(wrapper.vm.style['--dl-color-badge']).toMatch('red')
            expect(wrapper.vm.style['--dl-color-badge-text']).toMatch('green')
        })
    })
    describe('When updating multiline prop', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlBadge, {
                props: {
                    align: 'top',
                    color: 'red',
                    textColor: 'green'
                }
            })
            await wrapper.setProps({
                multiline: true,
                label: 'label'
            })
        })
        it('should compute right styles', function () {
            expect(wrapper.vm.style.aspectRatio).toMatch('')
            expect(wrapper.vm.style.padding).toMatch('3px 8px')
        })
    })
    describe('When updating styles prop', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlBadge, {
                props: {
                    align: 'top',
                    color: 'red',
                    textColor: 'green',
                    multiline: true,
                    label: 'label'
                }
            })
            await wrapper.setProps({
                rounded: true,
                transparent: true,
                outlined: true
            })
        })
        it('should right classes', function () {
            expect(wrapper.vm.classes).toMatch(
                `dl-badge flex inline items-center no-wrap dl-badge--multi-line bg-red text-green dl-badge--rounded dl-badge--transparent`
            )
        })
    })
})
