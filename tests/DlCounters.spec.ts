import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { DlCounters } from '../src/components'

describe('DlCounters', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlCounters, {
                props: {
                    items: [
                        {
                            value: 123,
                            text: 'text',
                            subtext: 'subtext'
                        }
                    ],
                    small: true
                }
            })
        })
        it('should mount the component', function () {
            expect(wrapper.exists()).toBe(true)
        })
        it('should compute the correct classes when calling computeClass', function () {
            const className = 'demo'
            const expected = ['demo', 'demo--small']

            const result = wrapper.vm.computeClass(className)

            expected.forEach((item) => {
                expect(result).toContain(item)
            })
        })
    })
    describe('When set a 10 items', () => {
        beforeAll(() => {
            vi.spyOn(console, 'warn')
            mount(DlCounters, {
                props: {
                    items: [...Array(10)].map(() => ({
                        value: 10,
                        text: 'text',
                        subtext: 'subtext'
                    }))
                }
            })
        })
        it('should have a warn', function () {
            expect(console.warn).toHaveBeenCalled()
        })
    })
})
