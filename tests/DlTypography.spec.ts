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
                `<p data-v-50b0b5ef="" id="${wrapper.vm.uuid}" class="dl-typography" style="text-transform: uppercase; font-weight: 400; font-size: 30px;">some</p>`
            )
        })
        describe('When change props', () => {
            beforeAll(async () => {
                await wrapper.setProps({ uppercase: false, bold: true })
            })
            it('should right dom node styles', function () {
                expect(wrapper.html()).toBe(
                    `<p data-v-50b0b5ef="" id="${wrapper.vm.uuid}" class="dl-typography" style="text-transform: none; font-weight: bold; font-size: 30px;">some</p>`
                )
            })
        })
    })
})
