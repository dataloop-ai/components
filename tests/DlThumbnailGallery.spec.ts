import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeAll } from 'vitest'
import { DlThumbnailGallery } from '../src'
import { DlThumbnail } from '../src/components/compound/DlThumbnailGallery/types'

const images: DlThumbnail[] = []
for (let i = 0; i < 20; i++) {
    images.push({
        name: `Image ${i}`,
        src: `https://picsum.photos/1000/800?random=${i}`,
        status: ''
    })
}

describe('DlThumbnailGallery', () => {
    const wrapper = mount(DlThumbnailGallery)
    describe('when mounting', () => {
        it('should mount with default props', () => {
            expect(wrapper.vm.visibleThumbnails).toBe(10)
            expect(wrapper.vm.aspectRatio).toMatch('default')
        })
    })
    describe('mouse events', () => {
        beforeAll(() => {
            wrapper.setProps({
                images,
                aspectRatio: 'full-with-padding'
            })
        })
        it('should navigate back and forth', () => {
            expect(wrapper.vm.currentImages[0]).toEqual(images[0])
            wrapper.vm.navigateForward()
            expect(wrapper.vm.currentImages[0]).toEqual(
                images[wrapper.vm.visibleThumbnails]
            )
            wrapper.vm.navigateBackward()
            expect(wrapper.vm.currentImages[0]).toEqual(images[0])
        })
    })
    describe('thumbnail behaviour', () => {
        const invalid = 'error'
        beforeAll(() => {
            wrapper.setProps({
                invalidImage: invalid,
                aspectRatio: 'full'
            })
        })
        it('should fallback on custom image on error', () => {
            const event = { target: { src: '' } }
            wrapper.vm.handleImageError(event)
            expect(event.target.src).toMatch(invalid)
        })
        it('should return status icon', () => {
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
})
