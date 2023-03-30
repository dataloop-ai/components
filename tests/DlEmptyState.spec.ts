import { mount } from '@vue/test-utils'
import { DlEmptyState } from '../src/'
import { describe, it, expect } from 'vitest'

describe('DlEmptyState', () => {
    it('testing DlEmptyState functionality', async () => {
        const wrapper = mount(DlEmptyState, {
            props: {}
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.props()).toStrictEqual({
            bgImage: null,
            bgSize: '240px',
            icon: 'icon-dl-alert-filled',
            iconClass: '',
            iconColor: 'dl-color-darker',
            iconSize: '40px',
            info: '',
            infoClass: '',
            infoColor: 'dl-color-darker',
            subtitle: '',
            subtitleClass: '',
            subtitleColor: 'dl-color-medium',
            title: 'Something Went Wrong',
            titleClass: '',
            titleColor: 'dl-color-darker'
        })

        expect(wrapper.vm.iconClassName).toBe('empty-state--icon')
        expect(wrapper.vm.titleClassName).toBe('empty-state--title')
        expect(wrapper.vm.subtitleClassName).toBe('empty-state--subtitle')
        expect(wrapper.vm.infoClassName).toBe('empty-state--info')
        expect(wrapper.vm.cssVars).toEqual({
            '--bg-image': null,
            '--bg-size': '240px'
        })

        await wrapper.setProps({
            bgImage: 'url(random-image.org)',
            iconClass: 'icon',
            titleClass: 'title',
            subtitleClass: 'subtitle',
            infoClass: 'info'
        })

        expect(wrapper.props()).toStrictEqual({
            bgImage: 'url(random-image.org)',
            bgSize: '240px',
            icon: 'icon-dl-alert-filled',
            iconClass: 'icon',
            iconColor: 'dl-color-darker',
            iconSize: '40px',
            info: '',
            infoClass: 'info',
            infoColor: 'dl-color-darker',
            subtitle: '',
            subtitleClass: 'subtitle',
            subtitleColor: 'dl-color-medium',
            title: 'Something Went Wrong',
            titleClass: 'title',
            titleColor: 'dl-color-darker'
        })

        expect(wrapper.vm.iconClassName).toBe('empty-state--icon icon')
        expect(wrapper.vm.titleClassName).toBe('empty-state--title title')
        expect(wrapper.vm.subtitleClassName).toBe(
            'empty-state--subtitle subtitle'
        )
        expect(wrapper.vm.infoClassName).toBe('empty-state--info info')
        expect(wrapper.vm.cssVars).toEqual({
            '--bg-image': 'url(random-image.org)',
            '--bg-size': '240px'
        })
    })
})
