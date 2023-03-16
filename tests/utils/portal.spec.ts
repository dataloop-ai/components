import {
    getPortalVm,
    closePortalMenus,
    closePortals
} from '../../src/utils/portal'
import { describe, it, expect, vi } from 'vitest'

describe('portal', () => {
    describe('getPortalVm', () => {
        describe('should find portal node', () => {
            it('should return undefined', () => {
                expect(getPortalVm(document.createElement('div'))).toBe(
                    undefined
                )
            })
        })
    })

    describe('closePortalMenus', () => {
        describe('should close menus', () => {
            it('should return undefined if no vm has no parent', () => {
                expect(
                    closePortalMenus(
                        {
                            $props: {
                                separateClosePopup: true
                            },
                            hide: vi.fn(),
                            $options: {
                                name: 'DlMenu'
                            }
                        },
                        new Event('click')
                    )
                ).toBe(undefined)
            })

            it('should return object if no vm has _dlPortalInnerRef and has no parent', () => {
                expect(
                    typeof closePortalMenus(
                        {
                            __dlPortalInnerRef: {},
                            $props: {
                                separateClosePopup: false
                            },
                            hide: vi.fn(),
                            $options: {
                                name: 'DlAnyComponent'
                            }
                        },
                        new Event('click')
                    )
                ).toBe('object')
            })
        })
    })

    describe('closePortals', () => {
        describe('should close portal', () => {
            it('should return undefined if no vm provided', () => {
                expect(closePortals(null, new Event('click'), 0)).toBe(
                    undefined
                )
            })

            it('should return undefined if vm has no __dlPortalInnerRef', () => {
                expect(closePortals({}, new Event('click'), 0)).toBe(undefined)
            })

            it('should decrement deepth if has __dlPortalInnerRef', () => {
                let deepth = 2
                expect(
                    closePortals(
                        {
                            __dlPortalInnerRef: vi.fn(),
                            hide: vi.fn(),
                            $options: {
                                name: 'empty'
                            }
                        },
                        new Event('click'),
                        deepth
                    )
                ).toBe(undefined)

                expect(deepth).toBe(deepth--)
            })

            it('should return undefined if vm has __dlPortalInnerRef and prop name is DlMenu', () => {
                expect(
                    closePortals(
                        {
                            __dlPortalInnerRef: vi.fn(),
                            hide: vi.fn(),
                            $options: {
                                name: 'DlMenu'
                            }
                        },
                        new Event('click'),
                        0
                    )
                ).toBe(undefined)
            })
        })
    })

    // describe('changeGlobalNodesTarget', () => {
    //     describe('should udpate body node', () => {
    //         it('should return undefined', () => {
    //             expect(
    //                 changeGlobalNodesTarget(document.body as HTMLElement)
    //             ).toBe(undefined)
    //         })
    //     })
    // })
})
