import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { DlThumbnail, DlThumbnailGallery } from '../src'

const images: DlThumbnail[] = []
for (let i = 0; i < 20; i++) {
    images.push({
        name: `Image ${i}`,
        src: `https://picsum.photos/1000/800?random=${i}`,
        status: ''
    })
}

describe('DlThumbnailGallery', () => {
    it('should mount with default props', () => {
        const wrapper = mount(DlThumbnailGallery, {
            props: {
                images,
                modelValue: images[0]
            }
        })
        expect(wrapper.vm.visibleThumbnails).toBe(10)
        expect(wrapper.vm.aspectRatio).toMatch('default')
    })
    it('should navigate back and forth', () => {
        const wrapper = mount(DlThumbnailGallery, {
            props: {
                images,
                aspectRatio: 'full-with-padding'
            }
        })
        expect(wrapper.vm.currentImages[0]).toEqual(images[0])
        wrapper.vm.navigateForward()
        expect(wrapper.vm.currentImages[0]).toEqual(
            images[wrapper.vm.visibleThumbnails]
        )
        wrapper.vm.navigateBackward()
        expect(wrapper.vm.currentImages[0]).toEqual(images[0])
    })
    it('should fallback on custom image on error', () => {
        const invalid = 'error'
        const wrapper = mount(DlThumbnailGallery, {
            props: {
                invalidImage: invalid,
                aspectRatio: 'full'
            }
        })
        const event = { target: { src: '' } }
        wrapper.vm.handleImageError(event)
        expect(event.target.src).toMatch(invalid)
    })
    it('should return status icon', () => {
        const wrapper = mount(DlThumbnailGallery)
        expect(wrapper.vm.getStatusIcon('approve')).toMatch(
            'icon-dl-approve-filled'
        )
        expect(wrapper.vm.getStatusIcon('discard')).toMatch(
            'icon-dl-discard-filled'
        )
        expect(wrapper.vm.getStatusIcon('issue')).toMatch(
            'icon-dl-alert-filled'
        )
    })
})
