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
        it('should right styles', async () => {
            expect(
                wrapper.element.style.getPropertyValue('--dl-card-width')
            ).toBe('400px')
        })
    })
    describe('Enable Interactive props', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlCard, {
                props
            })
            await wrapper.setProps({ interactive: true })
        })
        it('should change the interactive prop value', async () => {
            await expect(wrapper.vm.interactive).toBe(true)
        })
        it('should have card--content__interactive-title class', async () => {
            expect(
                wrapper.find('.card--content__interactive-title').exists()
            ).toBe(true)
        })
        it('should have card--content__interactive-chips class', async () => {
            expect(
                wrapper.find('.card--content__interactive-chips').exists()
            ).toBe(true)
        })
        it('should have card__interactive-description class', async () => {
            expect(
                wrapper.find('.card__interactive-description').exists()
            ).toBe(true)
        })
        it('should have card__interactive-description__text class', async () => {
            expect(
                wrapper.find('.card__interactive-description__text').exists()
            ).toBe(true)
        })
    })
})

const props = {
    text: 'Some text',
    image: {
        src: 'https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?fit=476%2C280&ssl=1',
        link: {
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
    },
    title: 'Lorem ipsum',
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
    interactive: false,
    zoom: false,
    cardId: 2,
    width: '180px',
    tags: [
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
    hints: [
        {
            icon: 'icon-dl-related-filled',
            color: ''
        },
        {
            icon: 'icon-dl-alert-filled',
            color: 'red'
        }
    ],
    description: 'descriptioooon',
    indicatorColor: 'dl-color-negative',
    styles: {},
    height: 'auto',
    icon: ''
}
