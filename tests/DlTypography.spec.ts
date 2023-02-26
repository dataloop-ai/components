import { mount } from '@vue/test-utils'
import { DlTypography } from '../src/'

describe('DlTypography', () => {
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
            `<p id="${wrapper.vm.uuid}" class="dl-typography dl-typography--30px" style="text-transform: uppercase; font-weight: 400; font-size: 30px;">some</p>`
        )

        await wrapper.setProps({ uppercase: false, bold: true })

        expect(wrapper.html()).toBe(
            `<p id="${wrapper.vm.uuid}" class="dl-typography dl-typography--30px" style="text-transform: none; font-weight: bold; font-size: 30px;">some</p>`
        )
    })
})
