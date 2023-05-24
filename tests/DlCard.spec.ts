import { mount, shallowMount } from '@vue/test-utils'
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
    describe('Enable Shopify props', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlCard, {
                props
            })
            await wrapper.setProps({ shopify: true })
            await expect(wrapper.vm.shopify).toBe(true)
        })
        it('should have card--content__shopify-title class', async () => {
            expect(wrapper.find('.card--content__shopify-title').exists()).toBe(
                true
            )
        })
        it('should have card--content__shopify-chips class', async () => {
            expect(wrapper.find('.card--content__shopify-chips').exists()).toBe(
                true
            )
        })
        it('should have card__shopify-description class', async () => {
            expect(wrapper.find('.card__shopify-description').exists()).toBe(
                true
            )
        })
        it('should have card__shopify-description__text class', async () => {
            expect(
                wrapper.find('.card__shopify-description__text').exists()
            ).toBe(true)
        })
        it('should have card--image__link-icon class', async () => {
            const iconLink = {
                icon: 'icon-dl-link',
                color: 'black',
                backgroundColor: 'grey',
                size: '12px',
                link: 'https://dataloop.ai/',
                circle: {
                    size: '20px',
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            }
            await wrapper.setProps({ iconLink })
            await expect(wrapper.vm.iconLink).toStrictEqual(iconLink)
            expect(wrapper.find('.card--image__link-icon').exists()).toBe(true)
        })
        it('shouldn`t have card--image__link-icon class', async () => {
            const iconLink = {}
            await wrapper.setProps({ iconLink })
            await expect(wrapper.vm.iconLink).toStrictEqual(iconLink)

            expect(wrapper.classes('card')).toBe(true)
            expect(wrapper.find('.card--image__link-icon').exists()).toBe(false)
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
    ],
    shopify: false,
    zoomMode: false,
    cardId: 2,
    width: '180px',
    iconLink: {
        icon: 'icon-dl-link',
        color: 'black',
        backgroundColor: 'grey',
        size: '12px',
        link: 'https://dataloop.ai/',
        circle: {
            size: '20px',
            color: 'rgba(255, 255, 255, 0.8)'
        }
    },
    shopifyTitle: 'shopifyTitle',
    chipsItems: [
        {
            label: 'A',
            color: '#BECB5D',
            textColor: 'black'
        },
        {
            label: 'Lemon',
            color: '#FFDA3A',
            textColor: 'black'
        }
    ],
    innerIcons: [
        {
            icon: 'icon-dl-related-filled',
            color: ''
        },
        {
            icon: 'icon-dl-alert-filled',
            color: 'red'
        }
    ],
    shopifyDescription: 'shopifyDescriptionSecond',
    coloredStrip: 'dl-color-negative',
    styles: {},
    height: 'auto',
    icon: ''
}
