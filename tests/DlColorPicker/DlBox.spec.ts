import { mount } from '@vue/test-utils'
import { DlBox } from '../../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlColorPicker DlBox component', () => {
    describe('When mounting', () => {
        let wrapper: any
        const color = '0, 0, 0, 1'

        beforeAll(() => {
            wrapper = mount(DlBox, {
                props: {
                    name: 'RGB',
                    color
                }
            })
        })
        it('should mount the component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should have the right event', async function () {
            await wrapper.find('input').trigger('input')
            expect(wrapper.emitted()).toHaveProperty('input')
        })
        it('should have the right input color', function () {
            const event: any = wrapper.emitted('inputColor')

            expect(event[0][0]).toEqual(color)
        })
    })
})
