import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import { DlTypography } from '../src/components'

describe('DlTypography', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlTypography, {
                props: {
                    uppercase: true,
                    bold: false,
                    size: '30px'
                },
                slots: {
                    default: () => 'some'
                }
            })
        })
        it('should right dom node html', function () {
            expect(wrapper.html()).toBe(
                `<p data-v-50b0b5ef="" id="${wrapper.vm.uuid}" class="dl-typography first-letter-capitalized" style="font-weight: 400; --dl-typography-color-active: inherit; font-size: 30px;" uppercase="true">some</p>`
            )
        })
        describe('When change props', () => {
            beforeAll(async () => {
                await wrapper.setProps({ uppercase: false, bold: true })
            })
            it('should right dom node styles', function () {
                expect(wrapper.html()).toBe(
                    `<p data-v-50b0b5ef="" id="${wrapper.vm.uuid}" class="dl-typography first-letter-capitalized" style="font-weight: 500; --dl-typography-color-active: inherit; font-size: 30px;" uppercase="false">some</p>`
                )
            })
        })
    })
})
