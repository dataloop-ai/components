import { mount } from '@vue/test-utils'
import { DlLabel } from '../src'
import { describe, beforeAll, it, expect } from 'vitest'

describe('DlLabel', () => {
    describe('mounting', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlLabel, {
                props: {
                    text: 'test',
                    labelColor: 'red',
                    hint: 'info'
                }
            })
        })
        it('should set props', () => {
            expect(wrapper.props()).toStrictEqual({
                color: 'dl-color-darker',
                text: 'test',
                labelColor: 'red',
                hint: 'info'
            })
        })
    })
    describe('methods', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlLabel, {
                props: {
                    text: 'test',
                    labelColor: 'red',
                    hint: 'info'
                },
                slots: {
                    suffix: 'suffixSlot'
                }
            })
        })
        it('should expand suffix slot on mouseenter', () => {
            {
                wrapper.vm.handleMouseenterSuffix()
                expect(wrapper.vm.isExpanded).toBe(true)
            }
        })
        it('should set timer for unexpanding on mouseleave', () => {
            wrapper.vm.isExpanded = true
            wrapper.vm.handleMouseleave()
            expect(wrapper.vm.timer).toBeTruthy()
        })
    })
})
