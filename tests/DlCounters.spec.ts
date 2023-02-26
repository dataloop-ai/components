import { mount } from '@vue/test-utils'
import { DlCounters } from '../src/components'

describe('DlCounters component', () => {
    it('should mount the component', async () => {
        const wrapper = mount(DlCounters)

        expect(wrapper.exists()).toBe(true)
    })

    it('should compute the correct classes when calling computeClass', () => {
        const wrapper = mount(DlCounters, {
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

        expect(wrapper.exists()).toBe(true)

        const className = 'demo'
        const expected = ['demo', 'demo--small']

        const result = wrapper.vm.computeClass(className)

        expected.forEach((item) => {
            expect(result).toContain(item)
        })
    })

    it('should throw error when the item limit is exceeded', () => {
        jest.spyOn(console, 'warn')

        mount(DlCounters, {
            props: {
                items: [...Array(10)].map(() => ({
                    value: 10,
                    text: 'text',
                    subtext: 'subtext'
                }))
            }
        })

        expect(console.warn).toHaveBeenCalled()
    })
})
