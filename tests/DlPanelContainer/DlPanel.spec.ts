import { mount } from '@vue/test-utils'
import { DlPanel, DlPanelContainer } from '../../src'
import { describe, it, expect } from 'vitest'

// TODO: find how to attach to another component
describe('DlPanel', () => {
    it('check component props', () => {
        mount(DlPanel, {
            props: {
                resizable: true,
                collapsable: true
            },
            parentComponent: DlPanelContainer
        })
    })
})
