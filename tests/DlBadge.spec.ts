import { DlBadge } from '../src/components'
import { mount } from '@vue/test-utils'

describe('DlBadge', () => {
    it('should pass the props to the badge styles', async () => {
        const wrapper = mount(DlBadge, {
            props: {
                align: 'top',
                color: 'red',
                textColor: 'green'
            }
        })
        expect(wrapper.vm.style.verticalAlign).toMatch('top')
        expect(wrapper.vm.style.aspectRatio).toMatch('1/1')
        expect(wrapper.vm.style['--dl-color-badge']).toMatch('red')
        expect(wrapper.vm.style['--dl-color-badge-text']).toMatch('green')
        await wrapper.setProps({
            multiline: true,
            label: 'label'
        })
        expect(wrapper.vm.style.aspectRatio).toMatch('')
        expect(wrapper.vm.style.padding).toMatch('3px 8px')
        await wrapper.setProps({
            rounded: true,
            transparent: true,
            outlined: true
        })
        expect(wrapper.vm.classes).toMatch(
            `dl-badge flex inline items-center no-wrap dl-badge--multi-line bg-red text-green dl-badge--rounded dl-badge--transparent`
        )
    })
})
