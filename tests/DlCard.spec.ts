import { mount } from '@vue/test-utils'
import { DlCard } from '../src/components'
import { describe, it, expect } from 'vitest'

describe('DlCard', () => {
    it('should render the component', async () => {
        const wrapper = mount(DlCard, {
            props: {
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
        })

        expect(wrapper.exists()).toBe(true)
        await wrapper.setProps({ width: '400px' })
        await wrapper.vm.$nextTick()
        expect((wrapper.element as HTMLElement).style.width).toEqual('400px')
        const linkItems = wrapper.findAll('.card--links_linkItem')
        expect(linkItems.length).toBe(2)
    })
})
