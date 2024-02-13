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
                `<p data-v-50b0b5ef="" id="${wrapper.vm.uuid}" class="dl-typography first-letter-capitalized" style="font-weight: 400; font-size: 30px;" uppercase="true">some</p>`
            )
        })
        describe('When change props', () => {
            beforeAll(async () => {
                await wrapper.setProps({ uppercase: false, bold: true })
            })
            it('should right dom node styles', function () {
                expect(wrapper.html()).toBe(
                    `<p data-v-50b0b5ef="" id="${wrapper.vm.uuid}" class="dl-typography first-letter-capitalized" style="font-weight: bold; font-size: 30px;" uppercase="false">some</p>`
                )
            })
        })

        describe('When rendering typography content', () => {
            describe('When rendering markdown content', () => {
                it('should render typography markdown content correctly', () => {
                    const wrapper = mount(DlTypography, {
                        props: { markdown: true, variant: 'div' },
                        slots: {
                            default: () => '# Typography content'
                        }
                    })

                    expect(wrapper.find('div.dl-mark-down').exists()).toBe(true)

                    const h1Element = wrapper
                        .find('div.dl-mark-down')
                        .find('h1')

                    expect(h1Element.exists()).toBe(true)
                    expect(h1Element.text()).toBe('Typography content')
                })
            })
            describe('When rendering plaintext content', () => {
                it('should render pre tag with centered plain text content correctly', () => {
                    const wrapper = mount(DlTypography, {
                        props: { variant: 'pre' },
                        slots: {
                            default: () => 'Typography content'
                        }
                    })

                    const preElement = wrapper.find('pre')
                    expect(preElement.exists()).toBe(true)

                    expect(preElement.classes()).toContain('dl-typography--pre')
                })
            })
        })
    })
})
