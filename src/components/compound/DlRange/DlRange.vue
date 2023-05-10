<template>
    <div
        :id="uuid"
        class="slider non-editable slider-content"
        :style="rangeStyles"
    >
        <div class="header">
            <div class="text capitalize">
                {{ text }}
            </div>
            <div class="right-container">
                <dl-button
                    flat
                    size="m"
                    :disabled="disabled || readonly"
                    data-test="reset-button"
                    @click="handleResetButtonClick"
                >
                    Reset
                </dl-button>
                <div class="value-container">
                    {{ resetValueString }}
                </div>
            </div>
        </div>
        <div class="slider-bar-container">
            <div
                ref="rootRef"
                class="slider-bar"
                v-bind="attributes"
                :aria-valuenow="attributeDisplayValue"
                data-test="slider-bar"
            >
                <div
                    v-touch-pan:horizontal.prevent.stop.mouse.mouseAllDir="
                        onTouchPan
                    "
                    class="track-container"
                    :class="{ readonly, disabled: disabled }"
                    data-test="track-container"
                    v-on="trackContainerEvents"
                >
                    <div
                        class="track"
                        :style="trackStyle"
                    >
                        <div
                            class="selection"
                            :style="selectionBarStyle"
                        />
                        <div
                            key="tmin"
                            ref="minThumbRef"
                            class="thumb"
                            :style="minThumbStyle"
                            data-test="min-thumb"
                            v-on="minEvents"
                        />
                        <div
                            key="tmax"
                            class="thumb"
                            :style="maxThumbStyle"
                            v-on="maxEvents"
                        />
                        <input
                            v-if="name !== null && disabled !== true"
                            type="hidden"
                            :name="name"
                            :value="displayValue"
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed, Ref } from 'vue-demi'
import useSlider, {
    SliderProps,
    useSliderProps,
    useSliderEmits
} from '../DlSlider/useSlider'
import { DlButton } from '../../basic'
import {
    stopAndPrevent,
    getColor,
    KEY_CODE,
    includes,
    between,
    isMobileOrTablet
} from '../../../utils'
import touchPanDirective from '../../../directives/TouchPan'
import * as rangeUtils from './utils'
import { v4 } from 'uuid'

type DlRangeModelValue = {
    min: number | null
    max: number | null
    both?: boolean
}

interface DlRangeProps extends SliderProps {
    modelValue: DlRangeModelValue
}

export default defineComponent({
    name: 'DlRange',
    components: {
        DlButton
    },
    directives: {
        touchPan: touchPanDirective as any // force any type cause of the vue version
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        ...useSliderProps,
        modelValue: {
            type: Object as () => DlRangeModelValue,
            default: (): { min: number; max: number } => ({
                min: null,
                max: null
            }),
            validator: (v: DlRangeModelValue) => 'min' in v && 'max' in v
        }
    },
    emits: useSliderEmits,
    setup(props, { emit }) {
        const { state, methods } = useSlider({
            updateValue,
            updatePosition,
            getDragging
        })

        const rootRef = ref(null)
        const curMinRatio = ref(0)
        const curMaxRatio = ref(0)
        const model = ref<DlRangeModelValue>({
            min: 0,
            max: 0
        })

        const displayValue = computed<string>(() => {
            return `${model.value.min}|${model.value.max}`
        })

        const attributeDisplayValue = computed<string>(() => {
            return `${props.modelValue.min}|${props.modelValue.max}`
        })

        const resetValueString = computed<string>(() => {
            return `${model.value.min} - ${model.value.max}`
        })

        function normalizeModel() {
            model.value.min =
                props.modelValue.min === null
                    ? props.min
                    : between(props.modelValue.min, props.min, props.max)

            model.value.max =
                props.modelValue.max === null
                    ? props.max
                    : between(props.modelValue.max, props.min, props.max)
        }

        watch(
            () =>
                `${props.modelValue.min}|${props.modelValue.max}|${props.min}|${props.max}`,
            normalizeModel
        )

        normalizeModel()

        const initialValue = {
            min:
                props.modelValue.min === null
                    ? props.min
                    : between(props.modelValue.min, props.min, props.max),
            max:
                props.modelValue.max === null
                    ? props.max
                    : between(props.modelValue.max, props.min, props.max)
        }

        const modelMinRatio = computed(() =>
            methods.convertModelToRatio(model.value.min)
        )

        const modelMaxRatio = computed(() =>
            methods.convertModelToRatio(model.value.max)
        )

        const ratioMin = computed(() =>
            state.active.value === true
                ? curMinRatio.value
                : modelMinRatio.value
        )

        const ratioMax = computed(() =>
            state.active.value === true
                ? curMaxRatio.value
                : modelMaxRatio.value
        )

        const selectionBarStyle = computed(() => {
            const acc = {
                left: `${100 * ratioMin.value}%`,
                width: `${100 * (ratioMax.value - ratioMin.value)}%`,
                color:
                    props.disabled !== true
                        ? getColor(props.color, 'dl-color-secondary')
                        : 'var(--dl-color-separator)'
            }
            return acc
        })

        const isMobile = isMobileOrTablet()

        const trackContainerEvents = computed(() => {
            if (state.editable.value !== true) {
                return {}
            }

            if (isMobile === true) {
                return { onClick: methods.onMobileClick }
            }

            const evt = { onMousedown: methods.onActivate }

            return evt
        })

        function getEvents(side: 'min' | 'max' | 'both') {
            return isMobile !== true && state.editable.value === true
                ? {
                      onFocus: () => {
                          state.focus.value = side
                      },
                      onBlur: methods.onBlur,
                      onKeydown,
                      onKeyup: methods.onKeyup
                  }
                : {}
        }

        const minThumbStyle = computed(() => ({
            width: props.thumbSize,
            height: props.thumbSize,
            left: `${100 * ratioMin.value}%`,
            backgroundColor:
                props.disabled !== true
                    ? getColor(props.color, 'dl-color-secondary')
                    : 'var(--dl-color-separator)',
            zIndex: state.focus.value === 'min' ? 2 : void 0
        }))

        const maxThumbStyle = computed(() => ({
            width: props.thumbSize,
            height: props.thumbSize,
            left: `${100 * ratioMax.value}%`,
            backgroundColor:
                props.disabled !== true
                    ? getColor(props.color, 'dl-color-secondary')
                    : 'var(--dl-color-separator)',
            zIndex: state.focus.value === 'max' ? 2 : void 0
        }))

        const minThumbRef = ref(null)

        const minEvents = computed(() => getEvents('min'))

        const maxEvents = computed(() => getEvents('max'))

        const onTouchPan = computed(() => {
            return state.editable.value ? methods.onPan : null
        })

        const trackStyle = computed(() => ({
            height: props.trackSize
        }))

        const rangeStyles = computed(() => ({
            '--text-color': getColor(props.textColor, 'dl-color-darker'),
            '--width': props.width,
            '--color': getColor(props.color, 'dl-color-secondary')
        }))

        function updateValue(change?: boolean) {
            rangeUtils.updateValue(
                {
                    min: model.value.min,
                    max: model.value.max
                },
                {
                    min: props.min,
                    max: props.max
                },
                emit,
                change
            )
        }

        function getDragging(event: any) {
            const { left, top, width, height } = (
                rootRef as Ref<HTMLElement | null>
            ).value!.getBoundingClientRect()

            const sensitivity =
                (minThumbRef as Ref<HTMLElement | null>).value!.offsetWidth /
                (2 * width)

            return rangeUtils.getDragging(
                event,
                {
                    left,
                    top,
                    width,
                    height
                },
                sensitivity,
                { min: model.value.min, max: model.value.max },
                {
                    min: modelMinRatio.value,
                    max: modelMaxRatio.value
                },
                methods.getDraggingRatio
            )
        }

        function updatePosition(
            event: MouseEvent,
            dragging = state.dragging.value
        ) {
            if (
                typeof dragging === 'boolean' ||
                typeof dragging === 'undefined'
            )
                return

            const {
                model: newModel,
                focus: newFocus,
                curRatio
            } = rangeUtils.updatePosition(
                event,
                dragging,
                methods.getDraggingRatio,
                methods.convertRatioToModel,
                methods.convertModelToRatio,
                {
                    min: props.min,
                    max: props.max,
                    snap: props.snap
                },
                {
                    step: state.step.value,
                    decimals: state.decimals.value
                },
                {
                    min: model.value.min,
                    max: model.value.max
                }
            )

            state.focus.value = newFocus
            model.value = newModel
            curMinRatio.value = curRatio.min
            curMaxRatio.value = curRatio.max
        }

        function onKeydown(evt: KeyboardEvent) {
            if (!includes(Object.values(KEY_CODE), Number(evt.code))) {
                return
            }

            if (typeof state.focus.value === 'boolean') return

            stopAndPrevent(evt)

            const { model: newModel } = rangeUtils.onKeydown(
                evt,
                {
                    step: state.step.value,
                    focus: state.focus.value as 'min' | 'max',
                    decimals: state.decimals.value
                },
                { min: props.min, max: props.max },
                { min: model.value.min, max: model.value.max }
            )

            model.value = newModel
            updateValue()
        }

        function handleResetButtonClick() {
            if (props.modelValue === initialValue) return

            model.value.min = initialValue.min!
            model.value.max = initialValue.max!
            emit('update:model-value', { ...model.value })
        }

        return {
            uuid: `dl-range-${v4()}`,
            resetValueString,
            attributeDisplayValue,
            displayValue,
            rangeStyles,
            attributes: state.attributes,
            minThumbStyle,
            maxThumbStyle,
            selectionBarStyle,
            trackContainerEvents,
            minEvents,
            maxEvents,
            trackStyle,
            onTouchPan,
            rootRef,
            minThumbRef,
            handleResetButtonClick
        }
    },
    template: 'dl-range'
})
</script>

<style scoped lang="scss">
@import '../DlSlider/sliderStyles.scss';

.value-container {
    padding-left: 10px;
    min-width: 38px;
    text-align: right;
}
</style>
