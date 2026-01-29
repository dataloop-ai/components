import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils'
import { DlIcon } from '../src'
import { isEqual } from 'lodash'
import { beforeAll, describe, expect, it } from 'vitest'

describe('DlIcon', () => {
    describe('When mounting', () => {
        let wrapper: any
        let i: any
        beforeAll(() => {
            wrapper = mount(DlIcon, {
                props: { icon: 'icon-dl-add', size: '40px', color: 'red' }
            })
            i = wrapper.find('i')
        })
        it('should exist component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should right styles', function () {
            expect(wrapper.props().icon).toBe('icon-dl-add')
            expect(wrapper.props().size).toBe('40px')
            expect(wrapper.props().color).toBe('red')
            expect(
                i.element.style.getPropertyValue('--dl-icon-font-size')
            ).toBe('40px')
        })
    })
    describe('When loading an icon with an svg source', () => {
        const props = {
            icon: 'mastercard',
            size: '50px',
            color: 'dl-color-secondary',
            styles: '',
            inline: false,
            svg: true,
            svgSource: '@dataloop-ai/icons/assets',
            tooltip: null,
            activeColor: null
        }
        let wrapper: VueWrapper<any>
        let image: DOMWrapper<SVGImageElement>

        beforeAll(async () => {
            wrapper = mount(DlIcon, {
                props
            })
        })

        it('will load', () => {
            expect(wrapper.exists()).toBe(true)
        })
        it('will have all props loaded correctly', () => {
            expect(isEqual(wrapper.props(), props)).toBe(true)
        })
    })
})
