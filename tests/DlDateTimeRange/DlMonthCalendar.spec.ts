import { mount } from '@vue/test-utils'
import DlMonthCalendar from '../../src/components/compound/DlDateTime/DlDatePicker/components/DlMonthCalendar.vue'
import { describe, it, expect, afterAll, vi, beforeAll } from 'vitest'

const date = new Date(1990, 12, 1)

vi.useFakeTimers('modern' as any)
vi.setSystemTime(new Date(date))

describe('DlMonthCalendar', () => {
    describe('When emit events', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlMonthCalendar, {
                props: {
                    modelValue: date
                }
            })
        })

        it('should emit date on mousedown', () => {
            wrapper.vm.handleMousedown(0)
            expect(wrapper.emitted().mousedown).toEqual([[date]])
        })
        it('should emit date mouseenter', () => {
            wrapper.vm.handleMouseenter(0)
            expect(wrapper.emitted().mouseenter).toEqual([[date]])
        })
        it('should emit date on click', () => {
            wrapper.vm.handleClick(0)
            expect(wrapper.emitted()['update:model-value']).toEqual([
                [
                    {
                        from: date,
                        to: date
                    }
                ]
            ])
        })
    })

    afterAll(() => {
        vi.useRealTimers()
    })
})
