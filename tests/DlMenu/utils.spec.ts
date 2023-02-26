import {
    handleClickOutside,
    getAnchorOrigin,
    handleWatcherEvents,
    setOffsetOnShow,
    avoidAutoCloseFn,
    updateUnwatchPosition,
    refocusTargetFn,
    conditionalHandler
} from '../../src/components/DlMenu/utils'
import { Ref } from 'vue-demi'
import { AnchorEvent } from '../../src/hooks/use-model-toggle'
import * as events from '../../src/utils/events'
import { ClickOutsideEvent } from '../../src/utils/click-outside'

const mockCallback = jest.fn()
const mockPropagation = jest.fn()

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
                handleWatcherEvents(true, jest.fn(), {})
            })

            it('should call removeEscapeKey', () => {
                handleWatcherEvents(false, jest.fn(), {})
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
                jest.spyOn(events, 'position').mockImplementation(() => ({
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
                                    click: () => jest.fn()
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
                                    click: () => jest.fn()
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
                    expect(updateUnwatchPosition(jest.fn())).toBe(undefined)
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
                                focus: jest.fn()
                            } as unknown as HTMLElement
                        )
                    ).toBe(null)
                })
            })
        })

        describe('conditionalHandler', () => {
            describe('boolean condition is given', () => {
                it('should return true', () => {
                    expect(conditionalHandler(true, jest.fn(), true)).toBe(true)
                })

                it('should return false', () => {
                    expect(conditionalHandler(false, jest.fn(), true)).toBe(
                        false
                    )
                })
            })
        })
    })
})
