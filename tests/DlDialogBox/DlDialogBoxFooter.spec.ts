import { DlDialogBoxFooter } from '../../src/components'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlDialogBoxHeader', () => {
    describe('When mounting', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlDialogBoxFooter, {
                slots: {
                    default: '<p>Default</p>'
                }
            })
        })

        it('will mount', () => {
            expect(wrapper.exists()).toBe(true)
        })
    })
})
