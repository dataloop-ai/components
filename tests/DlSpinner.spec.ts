import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { DlSpinner } from '../src/components'

describe('DLSpinner', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlSpinner)
        })
        it('should exist component', function () {
            expect(wrapper.exists()).toBe(true)
        })
    })
})
