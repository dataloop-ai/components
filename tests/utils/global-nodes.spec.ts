import {
    createGlobalNode,
    removeGlobalNode,
    changeGlobalNodesTarget
} from '../../src/utils/global-nodes'
import { describe, it, expect, vi } from 'vitest'

describe('global-nodes', () => {
    describe('createGlobalNode', () => {
        describe('should add node', () => {
            it('should return object', () => {
                expect(typeof createGlobalNode()).toBe('object')
            })
        })

        describe('should add node with id', () => {
            it('should return object', () => {
                expect(typeof createGlobalNode('test')).toBe('object')
            })
        })
    })

    describe('removeGlobalNode', () => {
        describe('should remove node', () => {
            it('should return undefined', () => {
                expect(
                    removeGlobalNode({
                        remove: vi.fn()
                    } as unknown as HTMLElement)
                ).toBe(undefined)
            })
        })
    })

    describe('changeGlobalNodesTarget', () => {
        describe('should udpate node', () => {
            it('should return undefined', () => {
                expect(
                    changeGlobalNodesTarget(document.createElement('div'))
                ).toBe(undefined)
            })
        })
    })

    describe('changeGlobalNodesTarget', () => {
        describe('should udpate body node', () => {
            it('should return undefined', () => {
                expect(
                    changeGlobalNodesTarget(document.body as HTMLElement)
                ).toBe(undefined)
            })
        })
    })
})
