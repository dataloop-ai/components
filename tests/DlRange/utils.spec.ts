import {
    updateValue,
    getDragging,
    updatePosition,
    onKeydown
} from '../../src/components/DlRange/utils'
import { Dragging, dragType } from '../../src/components/DlSlider/useSlider'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { KEY_CODE } from '../../src/utils'

describe('DlRange utils', () => {
    describe('updateValue', () => {
        const emitFn = vi.fn()

        beforeEach(() => {
            emitFn.mockReset()
        })

        describe('when the "state" is different from the "props"', () => {
            it('should emit an "update:model-value" event', () => {
                updateValue(
                    {
                        min: 5,
                        max: 10
                    },
                    {
                        min: 0,
                        max: 10
                    },
                    emitFn
                )

                expect(emitFn).toHaveBeenCalledWith('update:model-value', {
                    min: 5,
                    max: 10
                })
            })
        })

        describe('when the "change" flag is "true"', () => {
            it('should emit an "change" event', () => {
                updateValue(
                    {
                        min: 0,
                        max: 10
                    },
                    {
                        min: 0,
                        max: 10
                    },
                    emitFn,
                    true
                )
                expect(emitFn).toHaveBeenCalledWith('change', {
                    min: 0,
                    max: 10
                })
            })
        })
    })

    describe('getDragging', () => {
        const event = vi.fn()
        const getDraggingRatioFn = vi.fn()
        const boundings = {
            left: 10,
            top: 5,
            width: 100,
            height: 5
        }

        const state = {
            min: 0,
            max: 10
        }

        const stateRatio = {
            min: 0,
            max: 1
        }

        describe('when dragging ratio is less than min ratio + sensitivity', () => {
            it('should set the dragging type to "MIN"', () => {
                getDraggingRatioFn.mockImplementation(() => 0.4)
                const sensitivity = 0.6
                const dragging = getDragging(
                    event,
                    boundings,
                    sensitivity,
                    state,
                    stateRatio,
                    getDraggingRatioFn
                )

                expect(dragging.type).toBe(dragType.MIN)
            })
        })

        describe('when dragging ratio is less than max ratio - sensitivity', () => {
            describe('when max ratio - ratio < ratio - min ratio', () => {
                it('should change the dragging type to "MAX"', () => {
                    getDraggingRatioFn.mockImplementation(() => 0.6)
                    const sensitivity = 0.4

                    const dragging = getDragging(
                        event,
                        boundings,
                        sensitivity,
                        state,
                        stateRatio,
                        getDraggingRatioFn
                    )

                    expect(dragging.type).toBe(dragType.MAX)
                })
            })
        })

        describe('in other cases', () => {
            it('should set the dragging type to "MAX"', () => {
                const sensitivity = 0.5

                const dragging = getDragging(
                    event,
                    boundings,
                    sensitivity,
                    state,
                    stateRatio,
                    getDraggingRatioFn
                )

                expect(dragging.type).toBe(dragType.MAX)
            })
        })
    })

    describe('updatePosition', () => {
        const mouseEventMock = {
            touches: [
                {
                    clientX: 0,
                    clientY: 0
                }
            ]
        } as unknown as MouseEvent

        const getDraggingRatioFn = vi.fn()
        const convertRatioToModelFn = vi.fn()
        const convertModelToRatioFn = vi.fn()

        const min = 0
        const max = 10

        convertModelToRatioFn.mockImplementation(
            (val) => (val - min) / (max - min)
        )

        describe('when dragging type is "MIN" and ratio <= max ratio', () => {
            const dragging = {
                left: 10,
                top: 5,
                width: 100,
                height: 5,
                valueMin: 0,
                valueMax: 10,
                ratioMin: 0,
                ratioMax: 1,
                type: dragType.MIN
            } as Dragging

            it('should change the "model" value & set "focus" to "min"', () => {
                getDraggingRatioFn.mockImplementation(() => 0.5)
                convertRatioToModelFn.mockImplementation(() => 5)

                const { focus, model, curRatio } = updatePosition(
                    mouseEventMock,
                    dragging,
                    getDraggingRatioFn,
                    convertRatioToModelFn,
                    convertModelToRatioFn,
                    {
                        min,
                        max,
                        snap: false
                    },
                    {
                        step: 1,
                        decimals: 0
                    },
                    {
                        min: 0,
                        max: 10
                    }
                )

                expect(focus).toBe('min')
                expect(model).toEqual({
                    min: 5,
                    max: 10
                })
                expect(curRatio).toEqual({
                    min: 0.5,
                    max: 1
                })
            })
        })

        describe('when dragging type is "MIN" and ratio > max ratio', () => {
            const dragging = {
                left: 10,
                top: 5,
                width: 100,
                height: 5,
                valueMin: 0,
                valueMax: 5,
                ratioMin: 0,
                ratioMax: 0.5,
                type: dragType.MIN
            } as Dragging

            it('should change the "model" value & set "focus" to "max"', () => {
                getDraggingRatioFn.mockImplementation(() => 1)
                convertRatioToModelFn.mockImplementation(() => 10)

                const { focus, model, curRatio } = updatePosition(
                    mouseEventMock,
                    dragging,
                    getDraggingRatioFn,
                    convertRatioToModelFn,
                    convertModelToRatioFn,
                    {
                        min,
                        max,
                        snap: false
                    },
                    {
                        step: 1,
                        decimals: 0
                    },
                    {
                        min: 0,
                        max: 5
                    }
                )

                expect(focus).toBe('max')
                expect(model).toEqual({
                    min: 5,
                    max: 10
                })
                expect(curRatio).toEqual({
                    min: 0.5,
                    max: 1
                })
            })
        })

        describe('when dragging type is "MAX" and ratio >= min ratio', () => {
            const dragging = {
                left: 10,
                top: 5,
                width: 100,
                height: 5,
                valueMin: 0,
                valueMax: 2,
                ratioMin: 0,
                ratioMax: 0.2,
                type: dragType.MAX
            } as Dragging

            it('should change the "model" value & set "focus" to "max"', () => {
                getDraggingRatioFn.mockImplementation(() => 0.2)
                convertRatioToModelFn.mockImplementation(() => 2)

                const { focus, model, curRatio } = updatePosition(
                    mouseEventMock,
                    dragging,
                    getDraggingRatioFn,
                    convertRatioToModelFn,
                    convertModelToRatioFn,
                    {
                        min: 0,
                        max: 10,
                        snap: true
                    },
                    {
                        step: 1,
                        decimals: 0
                    },
                    {
                        min: 0,
                        max: 2
                    }
                )

                expect(focus).toBe('max')
                expect(model).toEqual({
                    min: 0,
                    max: 2
                })
                expect(curRatio).toEqual({
                    min: 0,
                    max: 0.2
                })
            })
        })

        describe('when dragging type is "MAX" and ratio < min ratio', () => {
            const dragging = {
                left: 10,
                top: 5,
                width: 100,
                height: 5,
                valueMin: 2,
                valueMax: 5,
                ratioMin: 0.2,
                ratioMax: 0.5,
                type: dragType.MAX
            } as Dragging

            it('should change the "model" value & set "focus" to "min"', () => {
                getDraggingRatioFn.mockImplementation(() => 0.1)
                convertRatioToModelFn.mockImplementation(() => 1)

                const { focus, model, curRatio } = updatePosition(
                    mouseEventMock,
                    dragging,
                    getDraggingRatioFn,
                    convertRatioToModelFn,
                    convertModelToRatioFn,
                    {
                        min: 0,
                        max: 10,
                        snap: true
                    },
                    {
                        step: 1,
                        decimals: 0
                    },
                    {
                        min: 1,
                        max: 2
                    }
                )

                expect(focus).toBe('min')
                expect(model).toEqual({
                    min: 1,
                    max: 2
                })
                expect(curRatio).toEqual({
                    min: 0.1,
                    max: 0.2
                })
            })
        })
    })

    describe('onKeydown', () => {
        describe('when the key is "PGDOWN" or "PGUP" & focus is "min"', () => {
            it('should increment the min value by 10', () => {
                const keyboardEventMock = {
                    code: KEY_CODE.PGUP
                } as unknown as KeyboardEvent

                const { model } = onKeydown(
                    keyboardEventMock,
                    {
                        decimals: 0,
                        focus: 'min',
                        step: 1
                    },
                    {
                        min: 0,
                        max: 100
                    },
                    { min: 0, max: 10 }
                )

                expect(model).toEqual({ min: 10, max: 10 })
            })
        })

        describe('when the key is "PGDOWN" or "PGUP" & focus is "max"', () => {
            it('should increment the max value by 10', () => {
                const keyboardEventMock = {
                    code: KEY_CODE.PGUP
                } as unknown as KeyboardEvent

                const { model } = onKeydown(
                    keyboardEventMock,
                    {
                        decimals: 0,
                        focus: 'max',
                        step: 1
                    },
                    {
                        min: 0,
                        max: 100
                    },
                    { min: 0, max: 10 }
                )

                expect(model).toEqual({ min: 0, max: 20 })
            })
        })

        describe('when the key is "PGDOWN", "LEFT", "DOWN" & focus is "max"', () => {
            it('should decrement the max value by 10', () => {
                const keyboardEventMock = {
                    code: KEY_CODE.PGDOWN
                } as unknown as KeyboardEvent

                const { model } = onKeydown(
                    keyboardEventMock,
                    {
                        decimals: 0,
                        focus: 'max',
                        step: 1
                    },
                    {
                        min: 0,
                        max: 100
                    },
                    { min: 0, max: 30 }
                )

                expect(model).toEqual({ min: 0, max: 20 })
            })
        })
    })
})
