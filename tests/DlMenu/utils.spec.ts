import {
    handleClickOutside,
    getAnchorOrigin,
    handleWatcherEvents,
    setOffsetOnShow,
    avoidAutoCloseFn,
    updateUnwatchPosition,
    refocusTargetFn,
    conditionalHandler
} from '../../src/components/essential/DlMenu/utils'
import { Ref } from 'vue-demi'
import { describe, it, expect, vi } from 'vitest'
import { AnchorEvent } from '../../src/hooks/use-model-toggle'
import * as events from '../../src/utils/events'
import { ClickOutsideEvent } from '../../src/utils/click-outside'

const mockCallback = vi.fn()
const mockPropagation = vi.fn()

const event: Partial<AnchorEvent> | any = {
    stopPropagation: mockPropagation,
    type: 'touchstart',
    target: { classList: ['dl-dialog__backdrop'] }
}

describe('DlMenu utils', () => {
    describe('handleClickOutside', () => {
        describe('when persistent = false, showing = true', () => {
            it('should return "true"', () => {
                expect(
                    handleClickOutside(event as AnchorEvent, {
                        persistent: false,
                        showing: true,
                        fn: mockCallback
                    })
                ).toBe(true)
            })
        })
    })
    describe('getAnchorOrigin', () => {
        describe('when anchor prop is given', () => {
            it('should return "left top"', () => {
                expect(getAnchorOrigin('top start', true)).toStrictEqual({
                    horizontal: 'left',
                    vertical: 'top'
                })
            })
        })
    })

    describe('handleWatcherEvents', () => {
        describe('boolean value is given', () => {
            it('should call addEscapeKey', () => {
                handleWatcherEvents(true, vi.fn(), {})
            })

            it('should call removeEscapeKey', () => {
                handleWatcherEvents(false, vi.fn(), {})
            })
        })
    })

    describe('setOffsetOnShow', () => {
        describe('if contextMenu is given', () => {
            it('should return empty object', () => {
                expect(
                    setOffsetOnShow(new TouchEvent('touchstart'), {
                        contextMenu: true,
                        touchPosition: true,
                        absoluteOffset: {},
                        anchorEl: {
                            value: {
                                getBoundingClientRect: () => ({
                                    top: 10,
                                    left: 10
                                })
                            }
                        } as Ref<HTMLElement>
                    })
                ).toStrictEqual({})
            })
        })

        describe('if contextMenu is given and position is defined', () => {
            it('should return top/left = 10', () => {
                vi.spyOn(events, 'position').mockImplementation(() => ({
                    top: 20,
                    left: 20
                }))

                expect(
                    setOffsetOnShow(new TouchEvent('touchstart'), {
                        contextMenu: true,
                        touchPosition: true,
                        absoluteOffset: {},
                        anchorEl: {
                            value: {
                                getBoundingClientRect: () => ({
                                    top: 10,
                                    left: 10
                                })
                            }
                        } as Ref<HTMLElement>
                    })
                ).toStrictEqual({ top: 10, left: 10 })
            })
        })

        describe('avoidAutoCloseFn', () => {
            describe('boolean value is given', () => {
                it('should return false', () => {
                    expect(
                        avoidAutoCloseFn(false, {
                            avoidAutoClose: false,
                            autoClose: false,
                            innerRef: {
                                value: {
                                    click: () => vi.fn()
                                }
                            } as unknown as Ref<HTMLElement>
                        })
                    ).toBe(false)
                })

                it('should return true', () => {
                    expect(
                        avoidAutoCloseFn(true, {
                            avoidAutoClose: false,
                            autoClose: true,
                            innerRef: {
                                value: {
                                    click: () => vi.fn()
                                }
                            } as unknown as Ref<HTMLElement>
                        })
                    ).toBe(true)
                })
            })
        })

        describe('updateUnwatchPosition', () => {
            describe('function prop is given', () => {
                it('should be called prop function', () => {
                    expect(updateUnwatchPosition(vi.fn())).toBe(undefined)
                })
            })
        })

        describe('refocusTargetFn', () => {
            describe('dlClickOutside prop is given', () => {
                it('should be called focus function', () => {
                    expect(
                        refocusTargetFn(
                            new Event('click') as ClickOutsideEvent,
                            {
                                focus: vi.fn()
                            } as unknown as HTMLElement
                        )
                    ).toBe(null)
                })
            })
        })

        describe('conditionalHandler', () => {
            describe('boolean condition is given', () => {
                it('should return true', () => {
                    expect(conditionalHandler(true, vi.fn(), true)).toBe(true)
                })

                it('should return false', () => {
                    expect(conditionalHandler(false, vi.fn(), true)).toBe(false)
                })
            })
        })
    })
})
