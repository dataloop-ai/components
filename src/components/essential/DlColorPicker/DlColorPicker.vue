<template>
    <div
        :id="uuid"
        class="hu-color-picker"
    >
        <div class="color-set">
            <Saturation
                ref="saturation"
                :color="rgbString"
                :hsv="hsv"
                :size="hueHeight"
                @selectSaturation="selectSaturation"
                @updateSaturation="updateSaturation"
            />
            <Hue
                ref="hue"
                :hsv="hsv"
                :width="hueWidth"
                :height="hueHeight"
                @selectHue="selectHue"
                @updateHue="updateHue"
            />
            <Alpha
                ref="alpha"
                :color="rgbString"
                :rgba="rgba"
                :width="hueWidth"
                :height="hueHeight"
                @selectAlpha="selectAlpha"
                @updateAlpha="updateAlpha"
            />
        </div>
        <div
            :style="{ height: previewHeight + 'px' }"
            class="color-show"
        >
            <Preview
                :color="rgbaString"
                :width="180"
                :height="previewHeight"
            />
        </div>
        <Box
            name="HEX"
            :color="modelHex"
            @inputColor="inputHex"
        />
        <Box
            name="RGBA"
            :color="modelRgba"
            @inputColor="inputRgba"
        />
        <Colors
            :color="rgbaString"
            :default-colors="defaultColors"
            :colors-history="colorsHistory"
            @selectColor="selectColor"
        />
    </div>
</template>

<script lang="ts">
import Saturation from './DlSaturation.vue'
import Hue from './DlHue.vue'
import Alpha from './DlAlpha.vue'
import Preview from './DlPreview.vue'
import Box from './DlBox.vue'
import Colors from './DlColors.vue'
import { defineComponent, PropType } from 'vue-demi'
import { rgb2hex, setColorValue } from './utils'
import { NewColor } from './types'
import { defaultColors } from './constants'
import { debounce, isEqual } from 'lodash'
import { v4 } from 'uuid'

export default defineComponent({
    name: 'DlColorPicker',
    components: {
        Saturation,
        Hue,
        Alpha,
        Preview,
        Box,
        Colors
    },
    props: {
        color: {
            type: String,
            default: '#000000'
        },
        defaultColors: {
            type: Array as PropType<string[]>,
            default: () => defaultColors
        },
        colorsHistory: {
            type: Array as PropType<string[]>,
            //@ts-ignore
            default: () => []
        }
    },
    emits: ['changeColor', 'updateColor'],
    data() {
        const initialColor = {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
            h: 0,
            s: 0,
            v: 0
        }
        return {
            uuid: `dl-color-picker-${v4()}`,
            hueWidth: 14,
            hueHeight: 132,
            previewHeight: 28,
            modelRgba: '',
            modelHex: '',
            ...initialColor,
            prevUpdatedColor: {
                ...initialColor
            }
        }
    },
    computed: {
        rgba(): { r: number; g: number; b: number; a: number } {
            return {
                r: this.r,
                g: this.g,
                b: this.b,
                a: this.a
            }
        },
        hsv(): { h: number; s: number; v: number } {
            return {
                h: this.h,
                s: this.s,
                v: this.v
            }
        },
        rgbString(): string {
            return `rgb(${this.r}, ${this.g}, ${this.b})`
        },
        rgbaStringShort(): string {
            return `${this.r}, ${this.g}, ${this.b}, ${this.a}`
        },
        rgbaString(): string {
            return `rgba(${this.rgbaStringShort})`
        },
        hexString(): string {
            return rgb2hex(this.rgba, true)
        }
    },
    created() {
        Object.assign(this, setColorValue(this.color))
        this.setText()

        this.$watch('rgba', () => {
            const changeColorPayload: NewColor = {
                rgba: this.rgba,
                hsv: this.hsv,
                hex: this.modelHex
            }

            this.$emit('changeColor', changeColorPayload)
        })
    },
    methods: {
        selectSaturation(color: string) {
            const { r, g, b, h, s, v } = setColorValue(color)
            Object.assign(this, { r, g, b, h, s, v })
            this.setText()
        },
        selectHue(color: string) {
            const { r, g, b, h, s, v } = setColorValue(color)
            Object.assign(this, { r, g, b, h, s, v })
            this.setText()
            this.$nextTick(() => {
                (
                    this.$refs.saturation as InstanceType<typeof Saturation>
                ).renderColor()
                ;(
                    this.$refs.saturation as InstanceType<typeof Saturation>
                ).renderSlide()
            })
        },
        selectAlpha(a: number) {
            this.a = a
            this.setText()
        },
        inputHex(color: string) {
            const { r, g, b, a, h, s, v } = setColorValue(color)
            Object.assign(this, { r, g, b, a, h, s, v })
            this.modelHex = color
            this.modelRgba = this.rgbaStringShort
            this.$nextTick(() => {
                (
                    this.$refs.saturation as InstanceType<typeof Saturation>
                ).renderColor()
                ;(
                    this.$refs.saturation as InstanceType<typeof Saturation>
                ).renderSlide()
                ;(this.$refs.hue as InstanceType<typeof Hue>).renderSlide()
            })
        },
        inputRgba(color: string) {
            const { r, g, b, a, h, s, v } = setColorValue(color)
            Object.assign(this, { r, g, b, a, h, s, v })
            this.modelHex = this.hexString
            this.modelRgba = color
            this.$nextTick(() => {
                (
                    this.$refs.saturation as InstanceType<typeof Saturation>
                ).renderColor()
                ;(
                    this.$refs.saturation as InstanceType<typeof Saturation>
                ).renderSlide()
                ;(this.$refs.hue as InstanceType<typeof Hue>).renderSlide()
            })
        },
        setText() {
            this.modelHex = this.hexString
            this.modelRgba = this.rgbaStringShort
        },
        selectColor(color: string) {
            const { r, g, b, a, h, s, v } = setColorValue(color)
            this.updateColor({ r, g, b, a, h, s, v })
            Object.assign(this, { r, g, b, a, h, s, v })
            this.setText()
            this.$nextTick(() => {
                (
                    this.$refs.saturation as InstanceType<typeof Saturation>
                ).renderColor()
                ;(
                    this.$refs.saturation as InstanceType<typeof Saturation>
                ).renderSlide()
                ;(this.$refs.hue as InstanceType<typeof Hue>).renderSlide()
            })
        },
        updateColor: debounce(function (
            color: ReturnType<typeof setColorValue>
        ) {
            // @ts-ignore
            if (isEqual(color, this.prevUpdatedColor)) {
                return
            }

            const { r, g, b, a, h, s, v } = color
            // @ts-ignore
            this.$emit('updateColor', {
                rgba: {
                    r,
                    g,
                    b,
                    a
                },
                hsv: { h, s, v },
                hex: rgb2hex({ r, g, b }, true)
            })

            // @ts-ignore
            this.prevUpdatedColor = color
        },
        300),
        updateSaturation(color: string) {
            this.updateColor(setColorValue(color))
        },
        updateHue(color: string) {
            this.updateColor(setColorValue(color))
        },
        updateAlpha(value: number) {
            this.updateColor({
                r: this.r,
                g: this.g,
                b: this.b,
                a: value,
                h: this.h,
                s: this.s,
                v: this.v
            })
        }
    }
})
</script>

<style scoped lang="scss">
.hu-color-picker {
    width: 180px;
    padding: 10px;
    background: var(--dl-color-shadow);
    border-radius: 2px;
    box-shadow: 0px 3px 6px 0px rgba(16, 30, 115, 0.15);
    z-index: 1;
    text-align: left;
    canvas {
        vertical-align: top;
    }
    .color-set {
        display: flex;
    }
    .color-show {
        margin-top: 11px;
        display: flex;
    }
}
</style>
