<template>
    <div
        class="slider-bar"
        :aria-valuenow="model"
        v-bind="attributes"
        data-test="slider"
    >
        <div
            v-touch-pan:horizontal.stop.mouse.mouseAllDir="onTouchPan"
            v-bind="trackContainerAttrs"
            class="track-container"
            :class="{ readonly, disabled: disabled }"
            data-test="track-container"
            v-on="trackContainerEvents"
        >
            <div class="track" :style="trackStyle" data-test="track">
                <div class="selection" :style="selectionBarStyle" />
                <div class="thumb" :style="thumbStyle" data-test="thumb">
                    <input
                        v-if="name !== null && disabled !== true"
                        type="hidden"
                        :name="name"
                        :value="model"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import {
    KEY_CODE,
    getColor,
    includes,
    stopAndPrevent,
    position,
    keyCodes,
    between,
    isMobileOrTablet
} from '../../../../utils'
import touchPanDirective from '../../../../directives/TouchPan'

export default defineComponent({
    name: 'DlSliderBase',
    directives: {
        touchPan: touchPanDirective as any // force any type cause of the vue version
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        width: {
            type: String,
            default: '100%'
        },
        color: {
            type: String,
            default: 'dl-color-secondary'
        },
        snap: {
            type: Boolean,
            default: false
        },
        step: {
            type: Number,
            default: 1,
            validator: (v: number) => v >= 0
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        readonly: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        modelValue: {
            type: Number,
            required: true
        },
        thumbSize: {
            type: String,
            default: '10px'
        },
        trackSize: {
            type: String,
            default: '3px'
        },
        tabindex: {
            type: [String, Number],
            default: '0'
        },
        name: {
            type: String,
            default: null
        }
    },
    emits: ['update:model-value', 'change', 'pan'],
    data(): {
        model: number
        curRatio: number
        active: boolean
        dragging?: DOMRect
    } {
        return {
            model: this.modelValue,
            curRatio: 0,
            active: false
        }
    },
    computed: {
        isMobile(): boolean {
            return isMobileOrTablet()
        },
        modelRatio(): number {
            return this.convertModelToRatio(this.model)
        },
        ratio(): number {
            return this.active === true ? this.curRatio : this.modelRatio
        },
        selectionBarStyle(): Record<string, any> {
            return {
                left: `${100 * this.minRation}%`,
                width: `${100 * (this.ratio - this.minRation)}%`,
                color:
                    this.disabled !== true
                        ? getColor(this.color, 'dl-color-secondary')
                        : 'var(--dl-color-disabled-slider)'
            }
        },
        thumbStyle(): Record<string, any> {
            return {
                width: this.thumbSize,
                height: this.thumbSize,
                left: `${100 * this.ratio}%`,
                backgroundColor:
                    this.disabled !== true
                        ? getColor(this.color, 'dl-color-secondary')
                        : 'var(--dl-color-separator)'
            }
        },
        trackContainerEvents(): Record<string, any> {
            if (this.editable !== true) {
                return {}
            }

            return this.isMobile === true
                ? { click: this.onMobileClick }
                : {
                      mousedown: this.onActivate,
                      keydown: this.onKeydown,
                      keyup: this.onKeyup
                  }
        },
        trackContainerAttrs(): Record<string, any> {
            return {
                tabindex: this.isMobile !== true ? this.computedTabindex : null
            }
        },
        editable(): boolean {
            return (
                this.disabled !== true &&
                this.readonly !== true &&
                this.min < this.max
            )
        },
        computedDecimals(): number {
            return (String(this.step).trim().split('.')[1] || '').length
        },
        computedStep(): number {
            return this.step === 0 ? 1 : this.step
        },
        computedTabindex(): string | number {
            return this.editable === true ? this.tabindex || 0 : -1
        },
        trackLen(): number {
            return this.max - this.min
        },
        minRation(): number {
            return this.convertModelToRatio(this.min)
        },
        maxRatio(): number {
            return this.convertModelToRatio(this.max)
        },
        attributes(): Record<string, any> {
            const acc: Record<string, any> = {
                role: 'slider',
                'aria-valuemin': this.min,
                'aria-valuemax': this.max,
                'aria-orientation': 'horizontal',
                'data-step': this.step
            }

            if (this.disabled === true) {
                acc['aria-disabled'] = 'true'
            } else if (this.readonly === true) {
                acc['aria-readonly'] = 'true'
            }

            return acc
        },
        trackStyle(): Record<string, any> {
            return {
                height: this.trackSize
            }
        },
        onTouchPan(): Function | null {
            return this.editable ? this.onPan : null
        }
    },
    watch: {
        modelValue() {
            this.model = this.modelValue
        }
    },
    beforeUnmount() {
        document.removeEventListener(
            'mouseup',
            this.onDeactivate as EventListener, // eslint-disable-line no-undef
            true
        )
    },
    methods: {
        updateValue(change?: boolean) {
            if (this.model !== this.modelValue) {
                this.$emit('update:model-value', this.model)
            }

            if (change === true) {
                this.$emit('change', this.model)
            }
        },
        getDragging(evt?: MouseEvent) {
            return this.$el.getBoundingClientRect()
        },
        updatePosition(event: MouseEvent, dragging?: DOMRect) {
            const ratio = this.getDraggingRatio(
                event,
                dragging || this.dragging!
            )

            this.model = this.convertRatioToModel(ratio)
            this.curRatio =
                this.snap !== true || this.computedStep === 0
                    ? ratio
                    : this.convertModelToRatio(this.model)
        },
        onKeydown(evt: KeyboardEvent) {
            if (!includes(keyCodes, Number(evt.code))) return

            stopAndPrevent(evt)

            const step =
                (includes([KEY_CODE.PGDOWN, KEY_CODE.PGUP], Number(evt.code))
                    ? 10
                    : 1) * this.computedStep
            const offset =
                (includes(
                    [KEY_CODE.PGDOWN, KEY_CODE.LEFT, KEY_CODE.DOWN],
                    Number(evt.code)
                )
                    ? -1
                    : 1) * step

            this.model = between(
                parseFloat(
                    (this.model + offset).toFixed(this.computedDecimals)
                ),
                this.min,
                this.max
            )

            this.updateValue()
        },
        convertRatioToModel(ratio: number) {
            let model = this.min + ratio * (this.max - this.min)

            if (this.step > 0) {
                const modulo = (model - this.min) % this.step
                model +=
                    (Math.abs(modulo) >= this.step / 2
                        ? (modulo < 0 ? -1 : 1) * this.step
                        : 0) - modulo
            }

            if (this.computedDecimals > 0) {
                model = parseFloat(model.toFixed(this.computedDecimals))
            }

            return between(model, this.min, this.max)
        },
        convertModelToRatio(model: number) {
            return this.trackLen === 0 ? 0 : (model - this.min) / this.trackLen
        },
        getDraggingRatio(evt: MouseEvent, dragging: DOMRect) {
            const pos = position(evt)
            const val = between(
                (pos.left - dragging.left) / dragging.width,
                0,
                1
            )

            return between(val, this.minRation, this.maxRatio)
        },
        onActivate(evt: MouseEvent) {
            console.log('hiihihihihihih')
            this.updatePosition(evt, this.getDragging(evt))
            this.updateValue()

            this.active = true

            document.addEventListener('mouseup', this.onDeactivate, true)
        },
        onDeactivate() {
            this.active = false

            this.updateValue(true)

            document.removeEventListener('mouseup', this.onDeactivate, true)
        },
        onMobileClick(evt: any) {
            this.updatePosition(evt, this.getDragging(evt))
            this.updateValue(true)
        },

        onKeyup(evt: KeyboardEvent) {
            if (includes(keyCodes, Number(evt.code))) {
                this.updateValue(true)
            }
        },
        onPan(event: any): void {
            if (event.isFinal === true) {
                if (this.dragging) {
                    this.updatePosition(event.evt)
                    if (event.touch === true) {
                        this.updateValue(true)
                    }
                    this.dragging = null
                    this.$emit('pan', 'end')
                }
                this.active = false
            } else if (event.isFirst === true) {
                this.dragging = this.getDragging(event.evt)
                this.updatePosition(event.evt)
                this.updateValue()
                this.active = true
                this.$emit('pan', 'start')
            } else {
                this.updatePosition(event.evt)
                this.updateValue()
            }
        }
    },
    template: 'dl-slider-base'
})
</script>

<style scoped lang="scss">
@import '../sliderStyles.scss';
</style>
