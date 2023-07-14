import { mount } from '@vue/test-utils'
import { DlLabel } from '../src'
import { describe, beforeAll, it, expect } from 'vitest'

describe('DlLabel', () => {
    describe('mounting', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlLabel, {
                props: {
                    text: 'test',
                    labelColor: 'red',
                    hint: 'info'
                }
            })
        })
        it('should set props', () => {
            expect(wrapper.props()).toStrictEqual({
                color: 'dl-color-darker',
                text: 'test',
                labelColor: 'red',
                hint: 'info',
                suffix: null,
                prefix: null,
                fluid: false
            })
        })
    })
})
