import { mount } from '@vue/test-utils'
import { DlTd } from '../../src/components'

describe('DlTd', () => {
    it('should compute right class name', async () => {
        const wrapper = mount(DlTd, {
            props: {}
        })

        expect(wrapper.vm.classes).toBe('dl-td')
        expect(wrapper.vm.styles).toBe('')

        await wrapper.setProps({ autoWidth: true })
        expect(wrapper.vm.classes).toBe('dl-td dl-table--col-auto-width')

        await wrapper.setProps({ noHover: true })
        expect(wrapper.vm.classes).toBe(
            'dl-td dl-table--col-auto-width dl-td--no-hover'
        )

        await wrapper.setProps({ bgColor: 'red' })
        expect(wrapper.vm.styles).toBe('background: red')

        expect(wrapper.vm.hasEllipsis).toBe(false)
    })
})
