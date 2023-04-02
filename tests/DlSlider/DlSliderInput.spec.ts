import { mount } from '@vue/test-utils'
import { DlSliderInput } from '../../src/components/compound/DlSlider/components'
import { describe, it, expect } from 'vitest'

describe('DlSliderInput', () => {
    it('should behave accordingly', async () => {
        const wrapper = mount(DlSliderInput, {
            props: {
                min: -10,
                max: 10,
                modelValue: 0
            }
        })

        const _sliderInput = 'input[type="number"]'

        expect(wrapper.find(_sliderInput).exists()).toBe(true)

        const sliderInput = wrapper.find(_sliderInput)

        await sliderInput.setValue('')
        expect(wrapper.emitted()['update:model-value']).not.toBeDefined()

        await sliderInput.setValue('1')

        expect(wrapper.emitted()['update:model-value'][0]).toEqual([1])
    })
})
