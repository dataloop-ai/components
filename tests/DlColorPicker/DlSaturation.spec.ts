import { mount } from '@vue/test-utils'
import { DlSaturation } from '../../src/components/DlColorPicker'

describe('DlColorPicker DlSaturation component', () => {
    it('should mount the component', async () => {
        const wrapper = mount(DlSaturation)

        expect(wrapper.exists()).toBe(true)
    })
})
