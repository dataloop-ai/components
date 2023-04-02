import { mount } from '@vue/test-utils'
import { DlPreview } from '../../src/components'
import { describe, it, expect, vi } from 'vitest'

describe('DlColorPicker DlPreview component', () => {
    it('should mount the component and watch the prop update', async () => {
        const wrapper = mount(DlPreview, {
            props: {
                color: '#123456'
            }
        })

        expect(wrapper.exists()).toBe(true)

        const watcherSpy = vi.spyOn(wrapper.vm, 'renderColor')

        await wrapper.setProps({ color: '#666666' })

        expect(watcherSpy).toHaveBeenCalled()
    })
})
