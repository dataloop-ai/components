import { mount } from '@vue/test-utils'
import { DlCard } from '../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlCard', () => {
    describe('When mounting', () => {
        let wrapper: any
        let linkItems: any

        beforeAll(() => {
            wrapper = mount(DlCard, {
                props
            })
            linkItems = wrapper.findAll('.card--links_linkItem')
        })
        it('should exist component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should right number of links', function () {
            expect(linkItems.length).toBe(2)
        })
    })
    describe('When change props', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlCard, {
                props
            })
            await wrapper.setProps({ width: '400px' })
        })
        it('should right styles', function () {
            expect((wrapper.element as HTMLElement).style.width).toEqual(
                '400px'
            )
        })
    })
})

const props = {
    text: 'Some text',
    image: {
        src: 'https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?fit=476%2C280&ssl=1'
    },
    title: 'Lorem ipsum',
    keyboardShortcut: 'Shift + E',
    links: [
        {
            icon: 'icon-dl-list-view',
            href: 'https://www.google.md/?hl=ru',
            title: 'Lorem',
            newtab: true,
            external: true
        },
        {
            href: '#test',
            title: 'Developers',
            icon: 'icon-dl-code'
        }
    ]
}
