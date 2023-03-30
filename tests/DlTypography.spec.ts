import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { DlTypography } from '../src/components'

describe.only('DlTypography', () => {
    it('should compute values properly', async () => {
        const wrapper = mount(DlTypography, {
            props: {
                uppercase: true,
                bold: false,
                size: '30px'
            },
            slots: {
                default: () => 'some'
            }
        })

        expect(wrapper.html()).toBe(
            `<p data-v-50b0b5ef="" id="${wrapper.vm.uuid}" class="dl-typography dl-typography--30px" style="text-transform: uppercase; font-weight: 400; font-size: 30px;">some</p>`
        )

        await wrapper.setProps({ uppercase: false, bold: true })

        expect(wrapper.html()).toBe(
            `<p data-v-50b0b5ef="" id="${wrapper.vm.uuid}" class="dl-typography dl-typography--30px" style="text-transform: none; font-weight: bold; font-size: 30px;">some</p>`
        )
    })
})
