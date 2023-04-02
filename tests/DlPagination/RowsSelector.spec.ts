import { mount } from '@vue/test-utils'
import RowsSelector from '../../src/components/compound/DlPagination/components/RowsSelector.vue'
import { describe, it, expect } from 'vitest'

describe('RowsSelector', () => {
    const wrapper = mount(RowsSelector, {
        props: {
            modelValue: 10,
            options: [10, 25, 50],
            itemsName: 'items'
        }
    })

    it('should emit update of model value after option change', async () => {
        expect(wrapper.text()).toContain('items per page:')

        wrapper.vm.setSelectedItem(25)
        expect(wrapper.emitted()['update:modelValue'][0]).toBeTruthy()
    })
})
