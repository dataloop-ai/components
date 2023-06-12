import { mount } from '@vue/test-utils'
import { DlPreview } from '../../src/components'
import { describe, it, expect, vi, beforeAll } from 'vitest'

describe('DlColorPicker DlPreview component', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlPreview, {
                props: {
                    color: '#123456'
                }
            })
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
    })
    describe('When set color', () => {
        let wrapper: any
        let watcherSpy: any

        beforeAll(async () => {
            wrapper = mount(DlPreview, {
                props: {
                    color: '#123456'
                }
            })
            watcherSpy = vi.spyOn(wrapper.vm, 'renderColor')
            await wrapper.setProps({ color: '#666666' })
        })
        it('should the right watcher', function () {
            expect(watcherSpy).toHaveBeenCalled()
        })
    })
})
