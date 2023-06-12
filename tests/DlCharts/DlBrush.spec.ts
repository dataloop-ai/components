import { beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DlBrush from '../../src/components/compound/DlCharts/components/DlBrush.vue'

describe('DlBrush', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlBrush, {
                props: {
                    maxRange: 12,
                    selectionColor: 'black'
                }
            })
        })
        it('should mount the canvas', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should the right maxRange prop', function () {
            expect(wrapper.vm.maxRange).toBe(12)
        })
        it('should the right selectionColor prop', function () {
            expect(wrapper.vm.selectionColor).toBe('black')
        })
    })
})
