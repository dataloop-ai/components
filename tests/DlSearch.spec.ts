import { mount } from '@vue/test-utils'
import { DlSearch } from '../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlSearch component', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlSearch)
        })
        it('should mount the component', function () {
            expect(wrapper.exists()).toBe(true)
        })
    })
})
