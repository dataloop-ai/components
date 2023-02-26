import { mount } from '@vue/test-utils'
import { DlTr } from '../../src/components'

describe('DlTr', () => {
    it('should compute right class name', async () => {
        const wrapper = mount(DlTr, {
            props: {}
        })

        let trClasses = ''

        trClasses = wrapper.vm.trClasses
        expect(trClasses).toBe('dl-tr')

        await wrapper.setProps({ props: { header: true } })
        trClasses = wrapper.vm.trClasses
        expect(wrapper.vm.trClasses).toBe('dl-tr')

        await wrapper.setProps({ props: { _trClass: 'styled' } })
        trClasses = wrapper.vm.trClasses
        expect(wrapper.vm.trClasses).toBe('dl-tr styled')

        await wrapper.setProps({ noHover: true })
        trClasses = wrapper.vm.trClasses
        expect(wrapper.vm.trClasses).toBe('dl-tr styled dl-tr--no-hover')
    })
})
