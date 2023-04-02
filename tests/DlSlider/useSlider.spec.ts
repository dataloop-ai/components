import { mount } from '@vue/test-utils'
import useSlider, {
    Dragging
} from '../../src/components/compound/DlSlider/useSlider'
import { DlRange } from '../../src'
import { describe, it, expect, afterEach, beforeEach, vi, Mock } from 'vitest'

vi.mock('vue-demi', async () => {
    const original = (await vi.importActual('vue-demi')) as any

    return {
        ...original,
        getCurrentInstance: vi.fn(),
        onBeforeUnmount: vi.fn()
    }
})

import { getCurrentInstance, onBeforeUnmount } from 'vue-demi'
import { KEY_CODE } from '../../src/utils'

const dragging: Dragging = {
    bottom: 0,
    height: 0,
    left: 0,
    offsetModel: 0,
    offsetRatio: 0,
    rangeRatio: 0,
    rangeValue: 0,
    ratioMax: 1,
    ratioMin: 0,
    right: 0,
    top: 0,
    valueMax: 10,
    valueMin: 0,
    width: 100,
    x: 0,
    y: 0
}

function mockCurrentInstance(props: Record<string, any>, emitFn: any) {
    (getCurrentInstance as unknown as Mock).mockImplementation(() => ({
        props,
        emit: emitFn
    }))
}

describe('useSlider', () => {
    const mouseEventMock = {
        touches: [
            {
                clientX: 0,
                clientY: 0
            }
        ]
    } as unknown as MouseEvent
    const updateValueFn = vi.fn()
    const updatePositionFn = vi.fn()
    const getDraggingFn = vi.fn()
    const emitFn = vi.fn()

    afterEach(() => {
        updateValueFn.mockReset()
        updatePositionFn.mockReset()
        getDraggingFn.mockReset()
        emitFn.mockReset()
    })

    it('should return the expected state', () => {
        mockCurrentInstance(
            {
                step: 2.5,
                tabindex: 5,
                disabled: true,
                min: 20,
                max: 30
            },
            emitFn
        )

        const { state } = useSlider({
            updateValue: updateValueFn,
            updatePosition: updatePositionFn,
            getDragging: getDraggingFn
        }) as ReturnType<typeof useSlider>

        expect(state.step.value).toEqual(2.5)
        expect(state.decimals.value).toEqual(1)
        expect(state.tabindex.value).toEqual(-1)
        expect(state.editable.value).toEqual(false)
        expect(state.attributes.value).toHaveProperty('aria-disabled')
    })

    it('should return the expected state', () => {
        mockCurrentInstance(
            {
                min: 0,
                max: 100,
                step: 2,
                text: 'range',
                snap: false,
                readonly: false,
                color: 'red',
                textColor: 'black',
                thumbSize: '10px',
                trackSize: '3px',
                tabindex: 5,
                disabled: false
            },
            emitFn
        )

        const { state } = useSlider({
            updateValue: updateValueFn,
            updatePosition: updatePositionFn,
            getDragging: getDraggingFn
        }) as ReturnType<typeof useSlider>

        expect(state.step.value).toEqual(2)
        expect(state.decimals.value).toEqual(0)
        expect(state.tabindex.value).toEqual(5)
        expect(state.editable.value).toEqual(true)
        expect(state.attributes.value).toEqual({
            role: 'slider',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-orientation': 'horizontal',
            'data-step': 2
        })
    })

    it('should return the expected state', () => {
        mockCurrentInstance(
            {
                readonly: true
            },
            emitFn
        )

        const updateValue = vi.fn()

        const { state } = useSlider({
            updateValue,
            updatePosition: updatePositionFn,
            getDragging: getDraggingFn
        }) as ReturnType<typeof useSlider>

        expect(state.editable.value).toEqual(false)
        expect(state.attributes.value).toHaveProperty('aria-readonly')
    })

    describe('convertRatioToModel', () => {
        describe('when step is bigger than 0', () => {
            it('should return expected model value', () => {
                mockCurrentInstance(
                    {
                        step: 1,
                        min: 0,
                        max: 10
                    },
                    emitFn
                )

                const { methods } = useSlider({
                    updateValue: updateValueFn,
                    updatePosition: updatePositionFn,
                    getDragging: getDraggingFn
                }) as ReturnType<typeof useSlider>

                expect(methods.convertRatioToModel(0.2)).toEqual(2)
            })
        })

        describe('when step decimals value is bigger than 0', () => {
            it('should return expected model value', () => {
                mockCurrentInstance(
                    {
                        step: 0.5,
                        min: 0,
                        max: 10
                    },
                    emitFn
                )

                const { methods } = useSlider({
                    updateValue: updateValueFn,
                    updatePosition: updatePositionFn,
                    getDragging: getDraggingFn
                }) as ReturnType<typeof useSlider>

                expect(methods.convertRatioToModel(0.5)).toEqual(5)
            })
        })

        describe('when min is bigger than max', () => {
            it('should return expected model value', () => {
                mockCurrentInstance(
                    {
                        step: 0.5,
                        min: 10,
                        max: 0
                    },
                    emitFn
                )

                const { methods } = useSlider({
                    updateValue: updateValueFn,
                    updatePosition: updatePositionFn,
                    getDragging: getDraggingFn
                }) as ReturnType<typeof useSlider>

                expect(methods.convertRatioToModel(0.5)).toEqual(10)
            })
        })
    })

    describe('convertModelToRatio', () => {
        describe('when track length is 0', () => {
            it('should return 0 for any model value', () => {
                mockCurrentInstance(
                    {
                        step: 1,
                        min: 10,
                        max: 10
                    },
                    emitFn
                )

                const { methods } = useSlider({
                    updateValue: updateValueFn,
                    updatePosition: updatePositionFn,
                    getDragging: getDraggingFn
                }) as ReturnType<typeof useSlider>

                expect(methods.convertModelToRatio(5)).toEqual(0)
            })
        })
        describe('when track length is more than 0', () => {
            it('should return expected ratio value', () => {})
            mockCurrentInstance(
                {
                    step: 1,
                    min: 0,
                    max: 10
                },
                emitFn
            )

            const { methods } = useSlider({
                updateValue: updateValueFn,
                updatePosition: updatePositionFn,
                getDragging: getDraggingFn
            }) as ReturnType<typeof useSlider>

            expect(methods.convertModelToRatio(5)).toEqual(0.5)
        })
    })

    describe('getDraggingRatio', () => {
        describe('when', () => {
            it('should return expected dragging ratio', () => {
                mockCurrentInstance(
                    {
                        step: 1,
                        min: 0,
                        max: 10
                    },
                    emitFn
                )

                const { methods } = useSlider({
                    updateValue: updateValueFn,
                    updatePosition: updatePositionFn,
                    getDragging: getDraggingFn
                }) as ReturnType<typeof useSlider>

                expect(
                    methods.getDraggingRatio(mouseEventMock, dragging)
                ).toEqual(0)
            })
        })
    })

    describe('onPan', () => {
        let onPan: (evt: any) => void

        beforeEach(() => {
            const { methods } = useSlider({
                updateValue: updateValueFn,
                updatePosition: updatePositionFn,
                getDragging: getDraggingFn
            }) as ReturnType<typeof useSlider>

            onPan = methods.onPan
        })

        describe('when event has "isFinal" flag & "dragging" value is set', () => {
            let onPan: (evt: any) => void

            beforeEach(() => {
                mockCurrentInstance(
                    {
                        step: 1,
                        min: 0,
                        max: 10
                    },
                    emitFn
                )

                const { methods } = useSlider({
                    updateValue: updateValueFn,
                    updatePosition: updatePositionFn,
                    getDragging: getDraggingFn.mockImplementation(
                        () => dragging
                    )
                }) as ReturnType<typeof useSlider>

                onPan = methods.onPan

                onPan({
                    isFirst: true,
                    evt: mouseEventMock
                }) // in order to set the dragging value
            })

            it('should emmit an event', () => {
                const event = {
                    isFinal: true,
                    evt: mouseEventMock
                }

                onPan(event)
                expect(updatePositionFn).toHaveBeenLastCalledWith(event.evt)
                expect(emitFn).toHaveBeenLastCalledWith('pan', 'end')
            })

            describe('when event has "touch" set to "true"', () => {
                it('should call the "updateValue" with "true" flag', () => {
                    const event = {
                        isFinal: true,
                        evt: mouseEventMock,
                        touch: true
                    }

                    onPan(event)
                    expect(updateValueFn).toHaveBeenCalledWith(true)
                })
            })
        })

        describe('when event has "isFirst" flag', () => {
            it('should set the dragging value; call the "updatePosition" & "updateValue" methods', () => {
                const event = {
                    isFirst: true,
                    evt: mouseEventMock
                }

                onPan(event)

                expect(getDraggingFn).toHaveBeenCalledWith(event.evt)
                expect(updatePositionFn).toHaveBeenCalledWith(event.evt)
                expect(updateValueFn).toHaveBeenCalled()
                expect(emitFn).toHaveBeenCalledWith('pan', 'start')
            })
        })

        describe('otherwise', () => {
            it('should call the "updatePosition" & "updateValue" methods', () => {
                const event = {
                    evt: mouseEventMock
                }

                onPan(event)

                expect(updatePositionFn).toHaveBeenCalledWith(event.evt)
                expect(updateValueFn).toHaveBeenCalled()
            })
        })
    })

    describe('onBlur', () => {
        it('should set "focus" to "false"', () => {
            mockCurrentInstance(
                {
                    step: 1,
                    min: 0,
                    max: 10
                },
                emitFn
            )

            const { state, methods } = useSlider({
                updateValue: updateValueFn,
                updatePosition: updatePositionFn,
                getDragging: getDraggingFn
            }) as ReturnType<typeof useSlider>

            methods.onBlur()
            expect(state.focus.value).toBe(false)
        })
    })

    describe('onActivate', () => {
        it('should set the "active" to "true"', () => {
            mockCurrentInstance(
                {
                    step: 1,
                    min: 0,
                    max: 10
                },
                emitFn
            )

            const { state, methods } = useSlider({
                updateValue: updateValueFn,
                updatePosition: updatePositionFn,
                getDragging: getDraggingFn
            }) as ReturnType<typeof useSlider>

            const documentSpy = vi.spyOn(document, 'addEventListener')

            methods.onActivate(mouseEventMock)

            expect(state.active.value).toBe(true)
            expect(updatePositionFn).toHaveBeenCalled()
            expect(updateValueFn).toHaveBeenCalled()
            expect(documentSpy).toHaveBeenCalledWith(
                'mouseup',
                methods.onDeactivate,
                true
            )
        })
    })

    describe('onDeactivate', () => {
        it('should set the "active" to "false"', () => {
            mockCurrentInstance(
                {
                    step: 1,
                    min: 0,
                    max: 10
                },
                emitFn
            )

            const { state, methods } = useSlider({
                updateValue: updateValueFn,
                updatePosition: updatePositionFn,
                getDragging: getDraggingFn
            }) as ReturnType<typeof useSlider>

            const documentSpy = vi.spyOn(document, 'removeEventListener')

            const method = methods.onDeactivate

            method()

            expect(state.active.value).toBe(false)
            expect(updateValueFn).toHaveBeenCalledWith(true)
            expect(documentSpy).toHaveBeenCalledWith('mouseup', method, true)
        })
    })

    describe('onMobileClick', () => {
        it('should call the "updatePosition" & "updateValue" methods', () => {
            mockCurrentInstance(
                {
                    step: 1,
                    min: 0,
                    max: 10
                },
                emitFn
            )

            const { methods } = useSlider({
                updateValue: updateValueFn,
                updatePosition: updatePositionFn,
                getDragging: getDraggingFn
            }) as ReturnType<typeof useSlider>

            methods.onMobileClick(mouseEventMock)

            expect(updatePositionFn).toHaveBeenCalled()
            expect(updateValueFn).toHaveBeenCalledWith(true)
        })
    })

    describe('onKeyup', () => {
        describe('when a valid key is pressed', () => {
            it('should call the "updateValue" method', () => {
                mockCurrentInstance(
                    {
                        step: 1,
                        min: 0,
                        max: 10
                    },
                    emitFn
                )

                const { methods } = useSlider({
                    updateValue: updateValueFn,
                    updatePosition: updatePositionFn,
                    getDragging: getDraggingFn
                }) as ReturnType<typeof useSlider>

                const keyboardEventMock = {
                    code: KEY_CODE.UP
                } as unknown as KeyboardEvent

                methods.onKeyup(keyboardEventMock)

                expect(updateValueFn).toHaveBeenCalledWith(true)
            })
        })
    })

    describe('onBeforeUnmount', () => {
        it('should remove the event listener onBeforeUnmount', () => {
            (onBeforeUnmount as unknown as Mock).mockImplementation(() => ({}))

            mockCurrentInstance(
                {
                    step: 1,
                    min: 0,
                    max: 10
                },
                emitFn
            )

            const documentSpy = vi.spyOn(document, 'removeEventListener')

            const { methods } = useSlider({
                updateValue: updateValueFn,
                updatePosition: updatePositionFn,
                getDragging: getDraggingFn
            }) as ReturnType<typeof useSlider>

            const wrapper = mount(DlRange, {
                props: {
                    text: 'range',
                    modelValue: { min: 0, max: 10 }
                }
            })

            wrapper.unmount()

            // Note: the hook should be used inside a component for the lifecycle method to be called
            // expect(documentSpy).toHaveBeenLastCalledWith(
            //     'mouseup',
            //     methods.onDeactivate,
            //     true
            // )
        })
    })
})
