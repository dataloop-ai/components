import { mount } from '@vue/test-utils'
import DlCardSidebar from '../../src/components/DlDateTimeRange/DlCardSidebar.vue'

const daySidebar = [
    {
        title: 'Today',
        key: 'today'
    },
    {
        title: 'Yesterday',
        key: 'yesterday'
    }
]

jest.useFakeTimers('modern')
jest.setSystemTime(new Date(1990, 12, 1))

describe('DlCardSidebar', () => {
    it('should emit an option upon clicking it', () => {
        const wrapper = mount(DlCardSidebar)
        wrapper.setProps({
            options: daySidebar,
            currentOption: daySidebar[0]
        })

        wrapper.vm.handleClick('today')
        expect(wrapper.emitted().click).toEqual([['today']])
    })

    afterAll(() => {
        jest.useRealTimers()
    })
})
