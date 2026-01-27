<template>
    <div :id="uuid" :class="identifierClass" class="container-wrapper">
        <label
            ref="container"
            :for="computedId"
            class="container"
            :class="{ disabled: disabled }"
            :tabindex="tabindex"
            :style="cssContainerVars"
            @click="onClick"
            @keydown="onKeydown"
            @keyup="onKeyup"
        >
            <span class="checkbox-wrapper" :style="cssSvgVars">
                <input
                    :id="computedId"
                    :value="value"
                    :checked="isTrue"
                    type="checkbox"
                    tabindex="-1"
                    :disabled="disabled"
                    :style="cssSvgVars"
                />
                <svg
                    class="check"
                    :class="{ active: isTrue }"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    :style="cssSvgVars"
                >
                    <path
                        d="M10.2 0H1.8C1.32261 0 0.864773 0.189642 0.527208 0.527208C0.189642 0.864773 0 1.32261 0 1.8V10.2C0 10.4364 0.0465583 10.6704 0.137017 10.8888C0.227475 11.1072 0.360062 11.3056 0.527208 11.4728C0.694353 11.6399 0.892784 11.7725 1.11117 11.863C1.32956 11.9534 1.56362 12 1.8 12H10.2C10.4364 12 10.6704 11.9534 10.8888 11.863C11.1072 11.7725 11.3056 11.6399 11.4728 11.4728C11.6399 11.3056 11.7725 11.1072 11.863 10.8888C11.9534 10.6704 12 10.4364 12 10.2V1.8C12 1.56362 11.9534 1.32956 11.863 1.11117C11.7725 0.892784 11.6399 0.694353 11.4728 0.527208C11.3056 0.360062 11.1072 0.227475 10.8888 0.137017C10.6704 0.0465583 10.4364 0 10.2 0ZM9.426 4.014L4.95 8.778C4.8932 8.83679 4.82515 8.88355 4.7499 8.91548C4.67465 8.94742 4.59375 8.96387 4.512 8.96387C4.43025 8.96387 4.34935 8.94742 4.2741 8.91548C4.19885 8.88355 4.1308 8.83679 4.074 8.778L2.586 7.2C2.52524 7.14431 2.47661 7.07669 2.44314 7.00138C2.40966 6.92606 2.39207 6.84465 2.39145 6.76223C2.39082 6.67981 2.40719 6.59815 2.43952 6.52234C2.47185 6.44652 2.51946 6.37818 2.57937 6.32158C2.63928 6.26497 2.71021 6.22132 2.78773 6.19334C2.86526 6.16536 2.94772 6.15365 3.02997 6.15894C3.11222 6.16424 3.1925 6.18642 3.26579 6.22411C3.33909 6.2618 3.40384 6.31418 3.456 6.378L4.512 7.5L8.55 3.2C8.66154 3.10272 8.8051 3.0501 8.95309 3.05225C9.10107 3.05441 9.24304 3.11118 9.35171 3.21166C9.46037 3.31214 9.52807 3.44923 9.54178 3.5966C9.5555 3.74396 9.51426 3.8912 9.426 4.01V4.014Z"
                    />
                </svg>
                <svg
                    v-if="hasIndeterminateValue"
                    class="check"
                    :class="{ active: isIndeterminate }"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    :style="cssSvgVars"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M2 0C0.895431 0 0 0.895431 0 2V10C0 11.1046 0.895431 12 2 12H10C11.1046 12 12 11.1046 12 10V2C12 0.895431 11.1046 0 10 0H2ZM3.75 5C3.33579 5 3 5.33579 3 5.75C3 6.16421 3.33579 6.5 3.75 6.5H8.25C8.66421 6.5 9 6.16421 9 5.75C9 5.33579 8.66421 5 8.25 5H3.75Z"
                    />
                </svg>
            </span>
            <span v-if="hasLabel" class="checkbox-label" :for="computedId">
                <slot>
                    {{ label }}
                </slot>
            </span>
        </label>
        <div v-if="hasSubLabel" :style="subLabelStyle" class="sub-text">
            <slot name="sub-label">
                <span>{{ subLabel }}</span>
            </slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRaw } from 'vue-demi'
import { getColor } from '../../../utils'
import { v4 } from 'uuid'
import { stopAndPrevent } from '../../../utils'

const ValueTypes = [Array, Boolean, String, Number, Object, Function]

export default defineComponent({
    name: 'DlCheckbox',
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        color: { type: String, default: 'dell-blue-500' },
        disabled: { type: Boolean, default: false },
        id: { type: [String, Number], default: null },
        modelValue: { type: ValueTypes, required: false, default: null },
        label: { default: null, type: String },
        subLabel: { type: String, default: null },
        toggleIndeterminate: { type: Boolean, default: false },
        indeterminateValue: { type: ValueTypes, default: null },
        value: { type: ValueTypes, default: null },
        falseValue: { type: ValueTypes, default: false },
        padding: { type: String, default: '0' },
        trueValue: { type: ValueTypes, default: true },
        tabindex: { type: String, default: '0' },
        subLabelSize: { type: String, default: '10px' }
    },
    emits: ['update:model-value', 'input', 'checked', 'unchecked'],
    data() {
        return {
            uuid: `dl-checkbox-${v4()}`
        }
    },
    computed: {
        identifierClass(): string {
            return `dl-checkbox-${this.label ?? ''}`.replace(/ /g, '-')
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
        hasIndeterminateValue(): boolean {
            return this.indeterminateValue !== null
        },
        isIndeterminate(): boolean {
            return !this.isTrue && !this.isFalse
        },
        cssContainerVars(): Record<string, string> {
            return {
                '--dl-checkbox-padding': this.padding
            }
        },
        cssSvgVars(): Record<string, string> {
            return {
                '--dl-active-color': this.getCurrentColor(),
                'min-width': '12px'
            }
        },
        hasLabel(): boolean {
            return !!this.label || !!this.$slots.default
        },
        hasSubLabel(): boolean {
            return !!this.subLabel || !!this.$slots['sub-label']
        },
        subLabelStyle(): Record<string, string> {
            return {
                'font-size': this.subLabelSize
            }
        }
    },
    methods: {
        getCurrentColor() {
            if (this.disabled) {
                return 'var(--dell-gray-500)'
            }
            return getColor(this.color, 'dell-blue-500')
        },
        onClick(e: Event) {
            if (e) {
                stopAndPrevent(e)
            }

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
                    if (this.isIndeterminate) {
                        newValue = this.trueValue
                    }
                    if (this.isTrue) {
                        newValue = this.falseValue
                    }
                    if (this.isFalse) {
                        newValue = this.toggleIndeterminate
                            ? this.indeterminateValue
                            : this.trueValue
                    }
                }

                // checking the opposites to predict the next value
                if (this.isTrue) {
                    this.$emit('unchecked', this.value)
                }
                if (this.isFalse) {
                    this.$emit('checked', this.value)
                }

                this.$emit('update:model-value', newValue, e)
                this.$emit('input', newValue)
            }
        },
        onKeydown(e: KeyboardEvent) {
            if (e.key === 'Enter' || e.key === ' ') {
                stopAndPrevent(e)
            }
        },
        onKeyup(e: KeyboardEvent) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.onClick(e as Event)
            }
        }
    }
})
</script>

<style scoped lang="scss">
.container-wrapper {
    display: flex;
    flex-direction: column;
}

.container {
    cursor: pointer;
    display: inline-flex;
    max-width: max-content;
    align-items: center;
    gap: 6px;
    padding: var(--dl-checkbox-padding);
    user-select: none;
}
.container.disabled {
    cursor: not-allowed;
    color: var(--dell-gray-500);
    & * {
        pointer-events: auto;
        color: var(--dell-gray-500);
    }
}
.checkbox-wrapper {
    display: flex;
    position: relative;
    width: 12px;
    height: 12px;
    border: 1px solid var(--dell-gray-300);
    border-radius: 2px;
    & svg {
        transition: fill 100ms cubic-bezier(0, 0, 0.2, 1) 0ms;
        overflow: visible;
        fill: transparent;
    }
    & .active {
        fill: var(--dl-active-color);
    }
}
input {
    appearance: none;
    margin: 0;
    position: absolute;
    width: 100%;
    height: 100%;
}

.sub-text {
    padding-left: var(--dl-checkbox-sub-label-left-padding, 20px);
    width: 80%;
    color: var(--dl-color-medium);
    word-break: break-all;
}

.label-wrapper {
    display: flex;
    flex-direction: column;
}

.checkbox-label {
    font-size: var(--dl-font-size-body);
    color: var(--dell-gray-800);
    overflow-wrap: break-word;
    width: 100%;
}
.check {
    position: absolute;
    margin: -1px 0 0 -1px;
    width: 120%;
    height: 120%;
}
</style>
