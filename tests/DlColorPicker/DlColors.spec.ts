import { mount } from '@vue/test-utils'
import { DlColors } from '../../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlColorPicker DlColors component', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlColors, {
                props: {
                    colorsHistory: ['#FEFEFE', '#5D6084']
                }
            })
        })
        it('should mount the component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should the right event', async function () {
            await wrapper.find('li').trigger('click')
            expect(wrapper.emitted()).toHaveProperty('click')
        })
        it('should the selectColor event', function () {
            const event: any = wrapper.emitted('selectColor')
            expect(event).toHaveLength(1)
        })
    })
})
