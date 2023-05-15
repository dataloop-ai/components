import { cloneDeep } from 'lodash'
import { between, includes, KEY_CODE } from '../../../utils'
import { Dragging, dragType } from '../DlSlider/useSlider'

type RangeValue = {
    min: number
    max: number
}

export function updateValue(
    state: RangeValue,
    props: RangeValue,
    emitFn: (...args: any[]) => any,
    change?: boolean
) {
    emitFn('update:model-value', cloneDeep(state))

    if (change === true) {
        emitFn('change', cloneDeep(state))
    }
}

type RangeBindings = {
    left: number
    top: number
    width: number
    height: number
}

export function getDragging(
    event: any,
    bindings: RangeBindings,
    sensitivity: number,
    state: RangeValue,
    stateRatio: RangeValue,
    getDraggingRatioFn: (event: MouseEvent, dragging: Dragging) => number
): Dragging {
    const { left, top, width, height } = bindings

    const dragging = {
        left,
        top,
        width,
        height,
        valueMin: state.min,
        valueMax: state.max,
        ratioMin: stateRatio.min,
        ratioMax: stateRatio.max
    } as unknown as Dragging

    const ratio = getDraggingRatioFn(event, dragging)

    if (ratio < dragging.ratioMin + sensitivity) {
        dragging.type = dragType.MIN
    } else if (ratio < dragging.ratioMax - sensitivity) {
        dragging.type =
            dragging.ratioMax - ratio < ratio - dragging.ratioMin
                ? dragType.MAX
                : dragType.MIN
    } else {
        dragging.type = dragType.MAX
    }

    return dragging
}

export function updatePosition(
    event: MouseEvent,
    dragging: Dragging,
    getDraggingRatioFn: (event: MouseEvent, dragging: Dragging) => number,
    convertRatioToModelFn: (ratio: number) => number,
    convertModelToRatioFn: (model: number) => number,
    props: {
        min: number
        max: number
        snap: boolean
    },
    state: {
        step: number
        decimals: number
    },
    model: {
        min: number | null
        max: number | null
    }
): {
    model: RangeValue
    focus: 'min' | 'max'
    curRatio: RangeValue
} {
    let pos: {
        minR: number
        maxR: number
        min: number
        max: number
    }

    let focus: 'min' | 'max'
    let curRatio: RangeValue

    const ratio = getDraggingRatioFn(event, dragging)
    const localModel = convertRatioToModelFn(ratio)

    switch (dragging.type) {
        case dragType.MIN:
            if (ratio <= dragging.ratioMax) {
                pos = {
                    minR: ratio,
                    maxR: dragging.ratioMax,
                    min: localModel,
                    max: dragging.valueMax
                }
                focus = 'min'
            } else {
                pos = {
                    minR: dragging.ratioMax,
                    maxR: ratio,
                    min: dragging.valueMax,
                    max: localModel
                }
                focus = 'max'
            }
            break

        case dragType.MAX:
            if (ratio >= dragging.ratioMin) {
                pos = {
                    minR: dragging.ratioMin,
                    maxR: ratio,
                    min: dragging.valueMin,
                    max: localModel
                }
                focus = 'max'
            } else {
                pos = {
                    minR: ratio,
                    maxR: dragging.ratioMin,
                    min: localModel,
                    max: dragging.valueMin
                }
                focus = 'min'
            }
            break
    }

    const newModel =
        model.min === null || model.max === null
            ? { min: pos!.min || props.min, max: pos!.max || props.max }
            : { min: pos!.min, max: pos!.max }

    if (props.snap !== true || state.step === 0) {
        curRatio = {
            min: pos!.minR,
            max: pos!.maxR
        }
    } else {
        curRatio = {
            min: convertModelToRatioFn(model.min!),
            max: convertModelToRatioFn(model.max!)
        }
    }

    return {
        model: newModel,
        // @ts-ignore
        focus,
        curRatio
    }
}

export function onKeydown(
    evt: KeyboardEvent,
    state: {
        step: number
        focus: 'min' | 'max'
        decimals: number
    },
    props: RangeValue,
    model: RangeValue
): { model: RangeValue } {
    const stepVal =
        (includes([KEY_CODE.PGDOWN, KEY_CODE.PGUP], Number(evt.code))
            ? 10
            : 1) * state.step

    const offset =
        (includes(
            [KEY_CODE.PGDOWN, KEY_CODE.LEFT, KEY_CODE.DOWN],
            Number(evt.code)
        )
            ? -1
            : 1) * stepVal

    const which: 'min' | 'max' = state.focus

    const newModel = {
        ...model,
        [which]: between(
            parseFloat((model[which] + offset).toFixed(state.decimals)),
            which === 'min' ? props.min : model.min,
            which === 'max' ? props.max : model.max
        )
    }

    return {
        model: newModel
    }
}
