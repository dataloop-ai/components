<template>
    <div
        :id="uuid"
        class="dl-switch-wrapper"
        :style="`height: ${size}px; margin: ${margin}; ${
            fluid ? 'justify-content: space-between;' : ''
        }`"
    >
        <label
            v-if="hasLeftLabel"
            class="left dl-switch-label"
            :for="computedId"
            :style="cssLabelVars"
        >
            <slot name="left-label">
                {{ leftLabel }}
            </slot>
        </label>
        <span
            class="dl-switch-container"
            :style="`max-height: ${size}px;`"
        >
            <input
                :id="computedId"
                ref="input"
                :disabled="disabled"
                type="checkbox"
                :checked="isTrue"
                class="dl-switch-checkbox"
                :style="cssVars"
                @change="handleChange"
            >
            <label
                :for="computedId"
                class="dl-switch"
                :style="[cssSwitchVars, cssLabelVars]"
            />
        </span>
        <label
            v-if="hasRightLabel"
            class="right dl-switch-label"
            :for="computedId"
            :style="cssLabelVars"
        >
            <slot name="right-label">
                {{ rightLabel }}
            </slot>
        </label>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRaw, nextTick } from 'vue-demi'
import { debounce } from 'lodash'
import { v4 } from 'uuid'
import {
    calculateBorderRadius,
    calculateCircleRadius,
    calculateMargin,
    calculateActiveMarginLeft,
    calculateWidth,
    stopAndPrevent,
    getColor
} from '../../../utils'

const Any = [Array, Boolean, String, Number, Object]

export default defineComponent({
    name: 'DlSwitch',
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        color: {
            type: String,
            default: 'dl-color-secondary'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        id: { type: [String, Number], default: null },
        margin: {
            type: String,
            default: '0'
        },
        modelValue: { type: Any, required: false, default: null },
        labelProps: {
            type: Object as PropType<{ fontSize: number; color: string }>,
            default: () => ({
                fontSize: 12,
                color: 'dl-color-darker'
            })
        },
        leftLabel: {
            default: null,
            type: String
        },
        rightLabel: {
            default: null,
            type: String
        },
        size: {
            type: Number,
            default: 12
        },
        value: { type: Any, default: null },
        falseValue: { type: Any, default: false },
        trueValue: { type: Any, default: true },
        tabindex: { type: String, default: '0' },
        fluid: { type: Boolean, default: false }
    },
    emits: ['update:model-value', 'toggle', 'click', 'change'],
    data() {
        return {
            uuid: `dl-switch-${v4()}`
        }
    },
    computed: {
        identifierClass(): string {
            return `dl-switch-${
                this.leftLabel ?? this.rightLabel ?? ''
            }`.replaceAll(' ', '-')
        },
        computedId(): string {
            return `${this.id || v4()}`
        },
        modelIsArray(): boolean {
            return this.value !== null && Array.isArray(this.modelValue)
        },
        index(): number {
            const value = toRaw(this.value)
            return this.modelIsArray
                ? (this.modelValue as any[]).findIndex(
                      (opt) => toRaw(opt) === value
                  )
                : -1
        },
        isTrue(): boolean {
            return this.modelIsArray
                ? this.index > -1
                : toRaw(this.modelValue) === toRaw(this.trueValue)
        },
        isFalse(): boolean {
            return this.modelIsArray
                ? this.index === -1
                : toRaw(this.modelValue) === toRaw(this.falseValue)
        },
        hasLeftLabel(): boolean {
            return !!this.leftLabel || !!this.$slots['left-label']
        },
        hasRightLabel(): boolean {
            return !!this.rightLabel || !!this.$slots['right-label']
        },
        cssVars(): Record<string, string> {
            return {
                '--dl-checkbox-height': `${this.size}px`,
                '--dl-checkbox-width': `${calculateWidth(this.size)}px`
            }
        },
        cssLabelVars(): Record<string, string> {
            return {
                '--dl-color-label': getColor(this.labelProps.color),
                '--dl-label-font-size': `${this.labelProps.fontSize || 12}px`,
                '--dl-checkbox-bg': getColor(this.color),
                '--dl-checked-after': `${calculateActiveMarginLeft(
                    this.size
                )}px`
            }
        },
        cssSwitchVars(): Record<string, string> {
            return {
                '--dl-switch-width': `${calculateWidth(this.size)}px`,
                '--dl-switch-height': `${this.size}px`,
                '--dl-switch-border-radius': `${calculateBorderRadius(
                    this.size
                )}px`,
                '--dl-switch-margin': `${calculateMargin(this.size)}px`,
                '--dl-switch-after-height': `${calculateCircleRadius(
                    this.size
                )}px`,
                '--dl-switch-after-width': `${calculateCircleRadius(
                    this.size
                )}px`
            }
        }
    },
    watch: {
        isTrue() {
            // todo: what the hell ?
            debounce(() => {
                nextTick(() => {
                    (this.$refs.input as HTMLInputElement).checked =
                        this.isTrue
                })
            }, 100)
        }
    },
    methods: {
        handleChange(e: Event) {
            if (e) {
                stopAndPrevent(e)
            }

            (e.target as HTMLInputElement).checked = this.isTrue

            if (!this.disabled) {
                let newValue: any | any[]
                if (Array.isArray(this.modelValue)) {
                    newValue = this.isFalse
                        ? [...this.modelValue, this.value]
                        : this.modelValue.filter(
                              (element) => element !== this.value
                          )
                } else {
                    newValue = this.modelValue
                    if (this.isTrue) {
                        newValue = this.falseValue
                    }
                    if (this.isFalse) {
                        newValue = this.trueValue
                    }
                }

                this.$emit('update:model-value', newValue, e)
                this.$emit('toggle', newValue)
                this.$emit('click', newValue)
                this.$emit('change', newValue)
            }
        }
    }
})
</script>

<style scoped lang="scss">
.dl-switch-wrapper {
    display: flex;
    align-items: center;
}
.dl-switch-container {
    position: relative;
}
.dl-switch-checkbox {
    appearance: none;
    width: var(--dl-checkbox-width);
    height: var(--dl-checkbox-height);
    margin: 0;
    &:disabled + label {
        opacity: 0.6;
        cursor: not-allowed;
    }
    &:checked + label {
        background-color: var(--dl-checkbox-bg);
        &::after {
            margin-left: var(--dl-checked-after);
        }
    }
}

.dl-switch {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--dl-switch-width);
    height: var(--dl-switch-height);
    border-radius: var(--dl-switch-border-radius);
    background-color: #b3b3b3;
    transition: background-color 0.2s;
    cursor: pointer;
    &::after {
        content: '';
        display: block;
        border-radius: 50%;
        width: var(--dl-switch-after-width);
        height: var(--dl-switch-after-height);
        margin: var(--dl-switch-margin);
        background-color: rgba(255, 255, 255, 0.5);
        transition: 0.2s;
    }
}
.dl-switch-label {
    font-size: var(--dl-label-font-size);
    color: var(--dl-color-label);
    line-height: 1;
}
.right {
    padding-left: 10px;
}

.left {
    padding-right: 10px;
}
</style>
