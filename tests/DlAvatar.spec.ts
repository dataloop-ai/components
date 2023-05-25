import { mount } from '@vue/test-utils'
import { DlAvatar } from '../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

describe('DlAvatar', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlAvatar, {
                props: {
                    name: 'Alexandru Cojuhari'
                }
            })
        })
        it('should have the right props', () => {
            expect(wrapper.props().name).to.equal('Alexandru Cojuhari')
        })

        it('should compute right first letters', () => {
            const computedLetters = wrapper.vm.computedLetters
            expect(computedLetters).toBe('AC')
        })
    })

    describe('When updating name prop', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlAvatar, {
                props: {
                    name: 'Alexandru Cojuhari'
                }
            })
            await wrapper.setProps({ name: 'Elmondo' })
        })
        it('should compute right first letters', () => {
            const computedLetters = wrapper.vm.computedLetters
            expect(computedLetters).toBe('E')
        })
    })
})
