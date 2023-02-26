import { mount } from '@vue/test-utils'
import { DlAvatar } from '../src/components'

describe('DlAvatar', () => {
    it('should compute right first letters', async () => {
        const wrapper = mount(DlAvatar, {
            props: {
                name: 'Alexandru Cojuhari'
            }
        })

        let computedLetters = ''

        computedLetters = wrapper.vm.computedLetters
        expect(computedLetters).toBe('AC')

        await wrapper.setProps({ name: 'Elmondo' })
        computedLetters = wrapper.vm.computedLetters
        expect(computedLetters).toBe('E')
    })
})
