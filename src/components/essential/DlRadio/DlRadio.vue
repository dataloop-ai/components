<template>
    <div
        :id="uuid"
        :class="identifierClass"
        class="container-wrapper"
    >
        <label
            :for="computedId"
            class="container"
            :class="{ disabled: disabled }"
            :tabindex="tabindex"
            :style="cssContainerVars"
            @click="onClick"
            @keydown="onKeydown"
            @keyup="onKeyup"
        >
            <span class="radio-wrapper">
                <input
                    :id="computedId"
                    :value="value"
                    :checked="isChecked"
                    type="radio"
                    tabindex="-1"
                    :disabled="disabled"
                >
                <svg
                    class="radio-border"
                    :style="cssSvgVars"
                >
                    <path
                        d="M6 0C4.4087 0 2.8826 0.632144 1.75739 1.75736C0.632167 2.88258 0 4.4087 0 6C0 7.5913 0.632167 9.11742 1.75739 10.2426C2.8826 11.3679 4.4087 12 6 12C7.5913 12 9.11743 11.3679 10.2426 10.2426C11.3679 9.11742 12 7.5913 12 6C12 4.4087 11.3679 2.88258 10.2426 1.75736C9.11743 0.632144 7.5913 0 6 0ZM6 10.846C4.71476 10.846 3.48217 10.3354 2.57336 9.42664C1.66456 8.51784 1.15402 7.28524 1.15402 6C1.15402 5.36361 1.27935 4.73346 1.52289 4.14552C1.76642 3.55757 2.12337 3.02336 2.57336 2.57336C3.02336 2.12337 3.55759 1.76641 4.14554 1.52288C4.73348 1.27935 5.36361 1.154 6 1.154C6.63639 1.154 7.26655 1.27935 7.85449 1.52288C8.44244 1.76641 8.97667 2.12337 9.42667 2.57336C9.87666 3.02336 10.2336 3.55757 10.4771 4.14552C10.7207 4.73346 10.846 5.36361 10.846 6C10.846 7.28524 10.3355 8.51784 9.42667 9.42664C8.51787 10.3354 7.28524 10.846 6 10.846Z"
                    />
                </svg>
                <svg
                    class="radio-check"
                    :style="cssSvgVars"
                >
                    <path
                        d="M6 9C7.65685 9 9 7.65685 9 6C9 4.34315 7.65685 3 6 3C4.34315 3 3 4.34315 3 6C3 7.65685 4.34315 9 6 9Z"
                    />
                </svg>
            </span>
            <span
                v-if="hasLabel"
                class="radio-label"
                :for="computedId"
            >
                <slot>
                    {{ label }}
                </slot>
            </span>
        </label>
        <div
            v-if="subLabel"
            :style="subLabelStyle"
            class="sub-text"
        >
            <span> {{ subLabel }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { stopAndPrevent, getColor } from '../../../utils/index'
import { v4 } from 'uuid'

export default defineComponent({
    name: 'DlRadio',
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        color: { type: String, default: null },
        disabled: { type: Boolean, default: false },
        id: { type: [String, Number], default: null },
        label: { type: String, default: null },
        padding: { type: String, default: '0' },
        modelValue: {
            type: [String, Number, Boolean],
            required: false,
            default: null
        },
        value: { type: [String, Number, Boolean], required: true },
        tabindex: { type: String, default: '0' },
        subLabel: { type: String, default: '' },
        subLabelSize: { type: String, default: '10px' }
    },
    emits: ['update:model-value'],
    data() {
        return {
            uuid: `dl-radio-${v4()}`
        }
    },
    computed: {
        identifierClass(): string {
            return `dl-radio-${this.label ?? ''}`.replaceAll(' ', '-')
        },
        computedId(): string {
            return `${this.$props.id || v4()}`
        },
        hasLabel(): boolean {
            return !!this.$props.label || !!this.$slots.default
        },
        isChecked(): boolean {
            return this.$props.modelValue === this.$props.value
        },
        cssSvgVars(): Record<string, string | number> {
            return {
                '--dl-radio-color': this.getCurrentColor(),
                '--dl-check-dot-scale': this.isChecked ? 1 : 0
            }
        },
        cssContainerVars(): Record<string, string> {
            return {
                '--dl-radio-padding': this.padding
            }
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
                return 'var(--dl-color-disabled)'
            }
            if (this.isChecked) {
                return getColor(this.color, 'dl-color-secondary')
            }
            return 'var(--dl-color-separator)'
        },
        onClick(e: Event) {
            if (e) {
                stopAndPrevent(e)
            }

            if (!this.$props.disabled) {
                this.$emit('update:model-value', this.$props.value, e)
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
    },
    template: 'dl-radio'
})
</script>

<style scoped lang="scss">
.container {
    cursor: pointer;
    display: inline-flex;
    max-width: max-content;
    gap: 6px;
    align-items: center;
    padding: var(--dl-radio-padding);
    user-select: none;
}
.container.disabled {
    cursor: not-allowed;
    color: var(--dl-color-disabled);
    & * {
        pointer-events: none;
        color: var(--dl-color-disabled);
    }
}
.radio-wrapper {
    display: flex;
    position: relative;
    width: 12px;
    height: 12px;
    & svg {
        transition: all 150ms cubic-bezier(0, 0, 0.2, 1) 0ms;
        overflow: visible;
        fill: var(--dl-radio-color);
    }
}
input {
    position: absolute;
    opacity: 0;
    margin: 0;
    width: 100%;
    height: 100%;
}
.radio-label {
    font-size: var(--dl-font-size-body);
    color: var(--dl-color-darker);
}
.radio-border {
    position: absolute;
    width: 100%;
    height: 100%;
}
.radio-check {
    transition: transform 150ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    transform: scale(var(--dl-check-dot-scale));
    width: 100%;
    height: 100%;
}
.label-wrapper {
    display: flex;
    flex-direction: column;
}
.sub-text {
    margin-left: 5%;
    width: 80%;
    color: var(--dl-color-medium);
    word-break: break-all;
}
</style>
