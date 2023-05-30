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
            align: 'center',
            bgImage: null,
            bgSize: '240px',
            icon: 'icon-dl-alert-filled',
            iconColor: 'dl-color-darker',
            iconSize: '40px',
            info: '',
            infoColor: 'dl-color-darker',
            infoSize: '14px',
            responsive: false,
            subtitle: '',
            subtitleColor: 'dl-color-medium',
            subtitleSize: '14px',
            title: 'Something Went Wrong',
            titleColor: 'dl-color-darker',
            titleSize: '20px'
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
            bgImage: 'url(random-image.org)'
        })

        expect(wrapper.props()).toStrictEqual({
            bgImage: 'url(random-image.org)',
            align: 'center',
            bgSize: '240px',
            icon: 'icon-dl-alert-filled',
            iconColor: 'dl-color-darker',
            iconSize: '40px',
            info: '',
            infoColor: 'dl-color-darker',
            infoSize: '14px',
            responsive: false,
            subtitle: '',
            subtitleColor: 'dl-color-medium',
            subtitleSize: '14px',
            title: 'Something Went Wrong',
            titleColor: 'dl-color-darker',
            titleSize: '20px'
        })

        expect(wrapper.vm.iconClassName).toBe('empty-state--icon')
        expect(wrapper.vm.titleClassName).toBe('empty-state--title')
        expect(wrapper.vm.subtitleClassName).toBe('empty-state--subtitle')
        expect(wrapper.vm.infoClassName).toBe('empty-state--info')
        expect(wrapper.vm.cssVars).toEqual({
            '--bg-image': 'url(random-image.org)',
            '--bg-size': '240px'
        })
    })
})
