import { mount } from '@vue/test-utils'
import { DlSaturation } from '../../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlColorPicker DlSaturation component', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlSaturation)
        })
        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })
    })
})
