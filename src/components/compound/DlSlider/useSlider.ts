import {
    ref,
    computed,
    onBeforeUnmount,
    getCurrentInstance,
    Ref
} from 'vue-demi'

import { useFormProps, FormProps } from '../../../hooks/useForm'

import { includes, keyCodes, between, position } from '../../../utils'

export interface SliderProps extends FormProps {
    text: string
    width: string
    min: number
    max: number
    step: number
    snap: boolean
    color: string
    textColor: string
    thumbSize: string
    trackSize: string
    readonly: boolean
    disabled: boolean
    tabindex: number | string
}

export type Dragging = {
    left: number
    top: number
    right?: number
    width: number
    height: number
    bottom?: number
    ratioMin: number
    ratioMax: number
    valueMin: number
    valueMax: number
    x?: number
    y?: number
    offsetRatio?: number
    rangeRatio?: number
    offsetModel?: number
    rangeValue?: number
    type?: (typeof dragType)[keyof typeof dragType]
}

export const dragType = {
    MIN: 0,
    RANGE: 1,
    MAX: 2
}

export const useSliderProps = {
    ...useFormProps,
    text: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: '100%'
    },
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 100
    },
    innerMin: Number,
    innerMax: Number,
    step: {
        type: Number,
        default: 1,
        validator: (v: number) => v >= 0
    },
    snap: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: 'dl-color-secondary'
    },
    textColor: {
        type: String,
        default: 'dl-color-darker'
    },
    thumbSize: {
        type: String,
        default: '10px'
    },
    trackSize: {
        type: String,
        default: '3px'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    readonly: {
        type: Boolean,
        default: false
    },
    tabindex: {
        type: [String, Number],
        default: '0'
    }
}

export const useSliderEmits = ['pan', 'change', 'update:model-value']

export default function ({
    updateValue,
    updatePosition,
    getDragging
}: {
    updateValue: Function
    updatePosition: Function
    getDragging: Function
}) {
    const { props, emit }: { props: any; emit: any } = getCurrentInstance()!

    const active: Ref<boolean> = ref(false)
    const focus: Ref<'min' | 'max' | 'both' | boolean> = ref(false)
    const dragging: Ref<Dragging | boolean | undefined> = ref(false)

    const editable = computed(
        () =>
            props.disabled !== true &&
            props.readonly !== true &&
            props.min < props.max
    )

    const innerMin = computed(() =>
        isNaN(props.innerMin) === true || props.innerMin < props.min
            ? props.min
            : props.innerMin
    )
    const innerMax = computed(() =>
        isNaN(props.innerMax) === true || props.innerMax > props.max
            ? props.max
            : props.innerMax
    )

    const decimals = computed(
        () => (String(props.step).trim().split('.')[1] || '').length
    )
    const step = computed(() => (props.step === 0 ? 1 : props.step))
    const tabindex = computed(() =>
        editable.value === true ? props.tabindex || 0 : -1
    )

    const trackLen = computed(() => props.max - props.min)

    const minRatio = computed(() => convertModelToRatio(props.min))
    const maxRatio = computed(() => convertModelToRatio(props.max))

    const attributes: Record<string, any> = computed(() => {
        const acc: Record<string, any> = {
            role: 'slider',
            'aria-valuemin': props.min,
            'aria-valuemax': props.max,
            'aria-orientation': 'horizontal',
            'data-step': props.step
        }

        if (props.disabled === true) {
            acc['aria-disabled'] = 'true'
        } else if (props.readonly === true) {
            acc['aria-readonly'] = 'true'
        }

        return acc
    })

    function convertRatioToModel(ratio: number) {
        const { min, max, step } = props

        let model = min + ratio * (max - min)

        if (step > 0) {
            const modulo = (model - min) % step
            model +=
                (Math.abs(modulo) >= step / 2
                    ? (modulo < 0 ? -1 : 1) * step
                    : 0) - modulo
        }

        if (decimals.value > 0) {
            model = parseFloat(model.toFixed(decimals.value))
        }

        return between(model, min, max)
    }

    function convertModelToRatio(model: number) {
        return trackLen.value === 0 ? 0 : (model - props.min) / trackLen.value
    }

    function getDraggingRatio(evt: MouseEvent, dragging: Dragging | boolean) {
        const pos = position(evt)
        const val = between(
            (pos.left - (dragging as Dragging).left) /
                (dragging as Dragging).width,
            0,
            1
        )

        return between(val, minRatio.value, maxRatio.value)
    }

    function onPan(event: any) {
        if (event.isFinal === true) {
            if (dragging.value) {
                updatePosition(event.evt)
                // only if touch, because we also have mousedown/up:
                if (event.touch === true) {
                    updateValue(true)
                }
                dragging.value = null
                emit('pan', 'end')
            }
            active.value = false
            focus.value = false
        } else if (event.isFirst === true) {
            dragging.value = getDragging(event.evt)
            updatePosition(event.evt)
            updateValue()
            active.value = true
            emit('pan', 'start')
        } else {
            updatePosition(event.evt)
            updateValue()
        }
    }

    function onBlur() {
        focus.value = false
    }

    function onActivate(evt: any) {
        updatePosition(evt, getDragging(evt))
        updateValue()

        active.value = true

        document.addEventListener('mouseup', onDeactivate, true)
    }

    function onDeactivate() {
        active.value = false

        updateValue(true)
        onBlur()

        document.removeEventListener('mouseup', onDeactivate, true)
    }

    function onMobileClick(evt: any) {
        updatePosition(evt, getDragging(evt))
        updateValue(true)
    }

    function onKeyup(evt: KeyboardEvent) {
        if (includes(keyCodes, Number(evt.code))) {
            updateValue(true)
        }
    }

    onBeforeUnmount(() => {
        document.removeEventListener('mouseup', onDeactivate, true)
    })

    return {
        state: {
            active,
            focus,
            dragging,
            editable,
            tabindex,
            attributes,
            step,
            decimals,
            innerMin,
            innerMax
        },

        methods: {
            onActivate,
            onDeactivate,
            onMobileClick,
            onBlur,
            onKeyup,
            convertRatioToModel,
            convertModelToRatio,
            getDraggingRatio,
            onPan
        }
    }
}
