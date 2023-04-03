<template>
    <div
        ref="rootRef"
        class="slider-bar"
        v-bind="attributes"
        :aria-valuenow="attributeDisplayValue"
        data-test="slider-bar"
        :style="rangeStyles"
    >
        <div
            v-touch-pan:horizontal.prevent.stop.mouse.mouseAllDir="onTouchPan"
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
                <brush-thumb
                    key="tmin"
                    ref="minThumbRef"
                    class="thumb"
                    :icon-size="iconSize"
                    icon="icon-dl-two-lines"
                    icon-color="dl-color-text-buttons"
                    :style="minThumbStyle"
                    data-test="min-thumb"
                />

                <brush-thumb
                    key="tmax"
                    ref="maxThumbRef"
                    class="thumb"
                    :icon-size="iconSize"
                    icon="icon-dl-two-lines"
                    icon-color="dl-color-text-buttons"
                    :style="maxThumbStyle"
                    data-test="max-thumb"
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
</template>

<script lang="ts">
import { ref, computed, watch, defineComponent } from 'vue-demi'

import useSlider, {
    useSliderProps,
    useSliderEmits,
    dragType,
    Dragging
} from '../../components/compound/DlSlider/useSlider'

import { between, isMobileOrTablet, getColor } from '../../utils'
import BrushThumb from './BrushThumb.vue'
import touchPanDirective from '../../directives/TouchPan'

export default defineComponent({
    name: 'DlBrushBar',
    directives: {
        touchPan: touchPanDirective as any // force any type cause of the vue version
    },
    components: {
        BrushThumb
    },
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: {
        ...useSliderProps,
        modelValue: {
            type: Object,
            default: () =>
                ({ min: null, max: null } as {
                    min: number | null
                    max: number | null
                }),
            validator: (v: Object) => 'min' in v && 'max' in v
        },

        dragRange: Boolean,
        dragOnlyRange: Boolean,
        trackColor: {
            type: String,
            default: 'dl-color-panel-background'
        },
        selectionColor: {
            type: String,
            default: 'dl-color-chart-brush'
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
        const model = ref({ min: 0, max: 0 })

        function normalizeModel() {
            model.value.min =
                props.modelValue.min === null
                    ? state.innerMin.value
                    : between(
                          props.modelValue.min,
                          state.innerMin.value,
                          state.innerMax.value
                      )

            model.value.max =
                props.modelValue.max === null
                    ? state.innerMax.value
                    : between(
                          props.modelValue.max,
                          state.innerMin.value,
                          state.innerMax.value
                      )
        }

        const iconSize = computed(() => {
            return 0.25 * parseInt(props.thumbSize) + 'px'
        })

        watch(
            () =>
                `${props.modelValue.min}|${props.modelValue.max}|${state.innerMin.value}|${state.innerMax.value}`,
            normalizeModel
        )

        normalizeModel()

        const isMobile = computed(() => isMobileOrTablet())

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
                width: `${100 * (ratioMax.value - ratioMin.value)}%`
            }

            return acc
        })

        const trackContainerEvents = computed(() => {
            if (state.editable.value !== true) {
                return {}
            }

            if (isMobile.value) {
                return { onClick: methods.onMobileClick }
            }

            const evt = { onMousedown: methods.onActivate }

            if (props.dragRange === true || props.dragOnlyRange === true) {
                Object.assign(evt, {
                    onFocus: () => {
                        state.focus.value = 'both'
                    },
                    onBlur: methods.onBlur
                })
            }

            return evt
        })

        const trackStyle = computed(() => ({
            height: props.trackSize,
            '--track-color': getColor(props.trackColor),
            '--selection-color': getColor(props.selectionColor)
        }))

        const onTouchPan = computed(() => {
            return state.editable.value ? methods.onPan : null
        })

        const minThumbRef = ref(null)

        const attributeDisplayValue = computed<string>(() => {
            return `${props.modelValue.min}|${props.modelValue.max}`
        })

        const displayValue = computed<string>(() => {
            return `${model.value.min}|${model.value.max}`
        })

        const rangeStyles = computed(() => ({
            '--dl-track-width': 0.25 * parseInt(props.thumbSize) + 'px',
            '--text-color': getColor(props.textColor, 'dl-color-darker'),
            '--width': props.width,
            '--color': getColor(props.color, 'dl-color-secondary'),
            width: props.width
        }))

        const minThumbStyle = computed(() => ({
            width: 0.5 * parseInt(props.thumbSize) + 'px',
            height: props.thumbSize,
            left: `${100 * ratioMin.value}%`,
            zIndex: state.focus.value === 'min' ? 2 : void 0
        }))

        const maxThumbStyle = computed(() => ({
            width: 0.5 * parseInt(props.thumbSize) + 'px',
            height: props.thumbSize,
            left: `${100 * ratioMax.value}%`,
            zIndex: state.focus.value === 'max' ? 2 : void 0
        }))

        function updateValue(change = false) {
            if (
                model.value.min !== props.modelValue.min ||
                model.value.max !== props.modelValue.max
            ) {
                emit('update:model-value', { ...model.value })
            }
            if (change) {
                emit('change', { ...model.value })
            }
        }

        function getDragging(event: MouseEvent) {
            const { left, top, width, height } =
                rootRef.value.getBoundingClientRect()
            const sensitivity =
                props.dragOnlyRange === true
                    ? 0
                    : minThumbRef.value.$el.offsetWidth / (2 * width)

            const dragging: Dragging = {
                left,
                top,
                width,
                height,
                valueMin: model.value.min,
                valueMax: model.value.max,
                ratioMin: modelMinRatio.value,
                ratioMax: modelMaxRatio.value
            }

            const ratio = methods.getDraggingRatio(event, dragging)

            if (
                props.dragOnlyRange !== true &&
                ratio < dragging.ratioMin + sensitivity
            ) {
                dragging.type = dragType.MIN
            } else if (
                props.dragOnlyRange === true ||
                ratio < dragging.ratioMax - sensitivity
            ) {
                if (props.dragRange === true || props.dragOnlyRange === true) {
                    dragging.type = dragType.RANGE
                    Object.assign(dragging, {
                        offsetRatio: ratio,
                        offsetModel: methods.convertRatioToModel(ratio),
                        rangeValue: dragging.valueMax - dragging.valueMin,
                        rangeRatio: dragging.ratioMax - dragging.ratioMin
                    })
                } else {
                    dragging.type =
                        dragging.ratioMax - ratio < ratio - dragging.ratioMin
                            ? dragType.MAX
                            : dragType.MIN
                }
            } else {
                dragging.type = dragType.MAX
            }

            return dragging
        }

        function updatePosition(
            event: MouseEvent,
            dragging = state.dragging.value
        ) {
            let pos
            const ratio = methods.getDraggingRatio(event, dragging)
            const localModel = methods.convertRatioToModel(ratio)

            switch ((dragging as Dragging).type) {
                case dragType.MIN:
                    if (ratio <= (dragging as Dragging).ratioMax) {
                        pos = {
                            minR: ratio,
                            maxR: (dragging as Dragging).ratioMax,
                            min: localModel,
                            max: (dragging as Dragging).valueMax
                        }
                        state.focus.value = 'min'
                    } else {
                        pos = {
                            minR: (dragging as Dragging).ratioMax,
                            maxR: ratio,
                            min: (dragging as Dragging).valueMax,
                            max: localModel
                        }
                        state.focus.value = 'max'
                    }
                    break

                case dragType.MAX:
                    if (ratio >= (dragging as Dragging).ratioMin) {
                        pos = {
                            minR: (dragging as Dragging).ratioMin,
                            maxR: ratio,
                            min: (dragging as Dragging).valueMin,
                            max: localModel
                        }
                        state.focus.value = 'max'
                    } else {
                        pos = {
                            minR: ratio,
                            maxR: (dragging as Dragging).ratioMin,
                            min: localModel,
                            max: (dragging as Dragging).valueMin
                        }
                        state.focus.value = 'min'
                    }
                    break

                case dragType.RANGE:
                    const ratioDelta =
                        ratio - (dragging as Dragging).offsetRatio
                    const minR = between(
                        (dragging as Dragging).ratioMin + ratioDelta,
                        0,
                        1 - (dragging as Dragging).rangeRatio
                    )
                    const modelDelta =
                        localModel - (dragging as Dragging).offsetModel
                    const min = between(
                        (dragging as Dragging).valueMin + modelDelta,
                        props.min,
                        props.max - (dragging as Dragging).rangeValue
                    )

                    pos = {
                        minR,
                        maxR: minR + (dragging as Dragging).rangeRatio,
                        min: parseFloat(min.toFixed(state.decimals.value)),
                        max: parseFloat(
                            (min + (dragging as Dragging).rangeValue).toFixed(
                                state.decimals.value
                            )
                        )
                    }

                    state.focus.value = 'both'
                    break
            }

            model.value =
                model.value.min === null || model.value.max === null
                    ? { min: pos.min || props.min, max: pos.max || props.max }
                    : { min: pos.min, max: pos.max }

            if (props.snap !== true || props.step === 0) {
                curMinRatio.value = pos.minR
                curMaxRatio.value = pos.maxR
            } else {
                curMinRatio.value = methods.convertModelToRatio(model.value.min)
                curMaxRatio.value = methods.convertModelToRatio(model.value.max)
            }
        }

        return {
            attributeDisplayValue,
            displayValue,
            rangeStyles,
            attributes: state.attributes,
            minThumbStyle,
            maxThumbStyle,
            selectionBarStyle,
            trackContainerEvents,
            trackStyle,
            onTouchPan,
            rootRef,
            minThumbRef,
            iconSize
        }
    }
})
</script>

<style scoped lang="scss">
.slider-bar {
    position: relative;
    width: 100%;
    cursor: grab;
    display: inline-flex;
    flex-wrap: nowrap;
    flex-direction: column;
    opacity: 1;

    & .track-container {
        cursor: grab;
        outline: 0;
        width: 100%;
        max-width: var(--width);

        & .track {
            height: 2px;
            width: inherit;
            position: relative;
            outline: none;
            background-color: var(--track-color);
            border: 1px solid var(--dl-color-separator);
            border-radius: 3px;

            & .selection {
                background: var(--selection-color);
                border-radius: inherit;
                width: 100%;
                height: 100%;
                position: absolute;
            }

            & .thumb {
                z-index: 1;
                outline: 0;
                transition: transform 0.18s ease-out, fill 0.18s ease-out,
                    stroke 0.18s ease-out;
                top: 50%;
                transform: scale(1) translate(-50%, -50%);
                position: absolute;
                user-select: none;
                &:nth-child(odd) {
                    border-radius: 0px 3px 3px 0px;
                }
                &:nth-child(even) {
                    border-radius: 3px 0px 0px 3px;
                }
            }
        }
    }
}
</style>
