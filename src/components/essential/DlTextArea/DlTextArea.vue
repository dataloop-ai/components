<template>
    <div
        :id="uuid"
        class="container"
        :class="rootContainerClasses"
        :style="cssVars"
    >
        <div class="dl-textarea__header">
            <div
                v-show="!!title.length || !!tooltip.length"
                class="dl-textarea__title-container"
            >
                <label v-show="!!title.length" class="dl-textarea__title">
                    {{ title }}
                    <span v-show="required" :class="asteriskClasses"> *</span>
                    {{ !required && optional ? ' (Optional)' : null }}
                </label>
                <span v-show="!!tooltip.length">
                    <dl-icon
                        class="dl-textarea__tooltip-icon"
                        icon="icon-dl-info"
                        size="12px"
                    />
                    <dl-tooltip>
                        {{ tooltip }}
                    </dl-tooltip>
                </span>
            </div>
            <div
                v-show="!!topMessage.length"
                class="dl-textarea__top-message-container"
            >
                <dl-info-error-message
                    v-show="!!topMessage.length"
                    position="above"
                    :value="topMessage"
                />
            </div>
            <span v-show="showClearButton" class="dl-textarea__clear-button">
                <dl-button
                    ref="input-clear-button"
                    icon="icon-dl-close"
                    size="m"
                    text-color="dl-color-darker"
                    flat
                    fluid
                    @click="onClear"
                />
                <dl-tooltip v-if="clearButtonTooltip"> Remove text </dl-tooltip>
            </span>
        </div>
        <textarea
            ref="textarea"
            :value="modelValue"
            :class="textareaClasses"
            :placeholder="placeholder"
            :maxlength="maxLength"
            :disabled="disabled"
            :readonly="readonly"
            @input="onChange"
            @keydown="onKeydown"
            @focus="onFocus"
            @blur="onBlur"
        />
        <div
            v-if="bottomMessage || showCounter"
            class="dl-textarea--bottom-container"
        >
            <dl-info-error-message
                v-if="!!infoMessage.length && !error && !warning"
                position="below"
                :value="infoMessage"
            />
            <dl-info-error-message
                v-if="error && !!errorMessage && !!errorMessage.length"
                position="below"
                error
                :value="errorMessage"
            />
            <dl-info-error-message
                v-if="
                    warning &&
                        !!warningMessage &&
                        !!warningMessage.length &&
                        !error
                "
                position="below"
                warning
                :value="warningMessage"
            />
            <span
                v-if="showCounter && maxLength && maxLength > 0"
                class="dl-text-input__counter"
            >
                {{ characterCounter }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { DlInfoErrorMessage } from '../../shared'
import { defineComponent, computed, ref } from 'vue-demi'
import { useSizeObserver } from '../../../hooks/use-size-observer'
//todo: this can cause issues
import { DlIcon } from '../'
import { DlTooltip } from '../../shared'
import DlButton from '../../basic/DlButton/DlButton.vue'

export default defineComponent({
    name: 'DlTextArea',
    components: {
        DlButton,
        DlTooltip,
        DlIcon,
        DlInfoErrorMessage
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        maxLength: {
            type: Number,
            default: null
        },
        width: {
            type: String,
            default: 'auto'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: ''
        },
        showCounter: {
            type: Boolean,
            default: false
        },
        enableResize: {
            type: Boolean,
            default: false
        },
        infoMessage: {
            type: String,
            default: ''
        },
        errorMessage: {
            type: String,
            default: ''
        },
        error: {
            type: Boolean,
            default: false
        },
        warningMessage: {
            type: String,
            default: ''
        },
        warning: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        tooltip: {
            type: String,
            default: ''
        },
        optional: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        topMessage: {
            type: String,
            default: ''
        },
        hideClearButton: {
            type: Boolean,
            default: false
        },
        clearButtonTooltip: {
            type: Boolean,
            default: false
        },
        dense: Boolean,
        redAsterisk: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        counterReverse: {
            type: Boolean,
            default: false
        },
        maxHeight: {
            type: String,
            default: '120px'
        },
        minHeight: {
            type: String,
            default: '80px'
        }
    },
    emits: ['input', 'focus', 'blur', 'clear', 'update:model-value', 'keydown'],
    setup(props) {
        const uuid = ref(`dl-text-area-${v4()}`)
        const textarea = ref(null)

        const { borderBoxSize } = useSizeObserver(textarea)

        const cssVars = computed(() => {
            return {
                '--dl-textarea-max-width': props.width || 'auto',
                '--dl-textarea-max-height': props.maxHeight,
                '--dl-textarea-min-height': props.minHeight,
                '--dl-textarea-width':
                    borderBoxSize.value?.[0].inlineSize + 'px' || '100%'
            }
        })

        const bottomMessage = computed(() => {
            return (
                !!props.infoMessage?.length ||
                !!props.errorMessage?.length ||
                !!props.warningMessage?.length
            )
        })

        const textareaClasses = computed(() => {
            const classes = ['dl-textarea']
            if (props.error) {
                classes.push('dl-textarea--error')
            } else if (props.warning) {
                classes.push('dl-textarea--warning')
            }

            if (!props.enableResize) {
                classes.push('dl-textarea--disable-resize')
            }

            return classes
        })

        return {
            uuid,
            cssVars,
            bottomMessage,
            textareaClasses,
            textarea
        }
    },
    computed: {
        showClearButton(): boolean {
            return (
                !this.hideClearButton &&
                !this.disabled &&
                !this.readonly &&
                !!this.modelValue
            )
        },
        asteriskClasses(): string[] {
            const classes = ['dl-textarea__asterisk']

            if (this.redAsterisk) {
                classes.push('dl-textarea__asterisk--red')
            }

            return classes
        },
        rootContainerClasses(): string[] {
            const classes = []
            if (this.dense) {
                classes.push('dl-textarea--dense')
            }
            return classes
        },
        textareaLength(): number {
            return `${this.modelValue}`.length
        },
        characterCounter(): string {
            if (!this.maxLength) {
                return ''
            }

            const chars = this.counterReverse
                ? this.maxLength - this.textareaLength
                : this.textareaLength

            return `${chars}/${this.maxLength}`
        }
    },
    methods: {
        onClear(e: any): void {
            this.$emit('clear', this.modelValue)
            this.$emit('input', '', e)
            this.$emit('update:model-value', '')

            const inputRef = this.$refs.textarea as HTMLInputElement
            inputRef.value = ''
            inputRef.focus()
        },
        onChange(e: any) {
            this.$emit('input', e.target.value, e)
            this.$emit('update:model-value', e.target.value)
        },
        onKeydown(e: KeyboardEvent) {
            this.$emit('keydown', e)
        },
        onFocus(e: InputEvent) {
            this.$emit('focus', e)
        },
        onBlur(e: InputEvent) {
            this.$emit('blur', e)
        },
        focus() {
            const inputRef = this.$refs.textarea as HTMLTextAreaElement
            inputRef.focus()
        },
        blur() {
            const inputRef = this.$refs.textarea as HTMLTextAreaElement
            inputRef.blur()
        }
    }
})
</script>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
    max-width: var(--dl-textarea-max-width);
}

.dl-textarea {
    background: none;
    border: 1px solid var(--dl-color-separator);
    border-radius: 2px;
    padding: 10px;
    font-family: 'Roboto', sans-serif;
    font-size: var(--dl-font-size-body);
    width: 100%;
    min-width: 100px;
    max-width: 100%;
    min-height: var(--dl-textarea-min-height);
    max-height: var(--dl-textarea-max-height);
    outline: none;
    color: var(--dl-color-darker);
    box-sizing: border-box;
    &--dense {
        padding: 0;
    }
    &__asterisk {
        color: var(--dl-color-medium);
        font-size: var(--dl-font-size-body);
        user-select: none;
        &--red {
            color: var(--dl-color-negative);
        }
    }
    &__clear-button {
        position: absolute;
        bottom: -25px;
        right: 0;
    }
    &__header {
        position: relative;
        width: var(--dl-textarea-width);
    }
    &__title-container {
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        text-align: start;
    }
    &__title {
        color: var(--dl-color-medium);
        font-size: var(--dl-font-size-body);
        text-align: left;
        margin-right: 5px;
        white-space: nowrap;
    }
    &__tooltip-icon {
        color: var(--dl-color-medium);
    }
    &__top-message-container {
        display: flex;
        margin-bottom: 10px;
        text-align: start;
    }
    &:hover {
        border-color: var(--dl-color-hover);
    }

    &:focus {
        border-color: var(--dl-color-secondary);
    }

    &:disabled {
        border-color: var(--dl-color-disabled);
        color: var(--dl-color-disabled);
        cursor: not-allowed;
        user-select: none;
    }
    &:readonly {
        border-color: var(--dl-color-separator);
        cursor: text;
        &:hover {
            border-color: var(--dl-color-separator) !important;
        }
    }
    &::placeholder {
        color: var(--dl-color-lighter);
        opacity: 1;
    }

    &:disabled::placeholder {
        color: rgba(0, 0, 0, 0);
    }

    &--disable-resize {
        resize: none;
    }

    &--error {
        border-color: var(--dl-color-negative);
        &:hover {
            border-color: var(--dl-color-separator) !important;
        }
    }

    &--warning {
        border-color: var(--dl-color-warning);
        &:hover {
            border-color: var(--dl-color-separator) !important;
        }
    }

    &--bottom-container {
        display: flex;
        justify-content: space-between;
        text-align: left;
        width: var(--dl-textarea-width);
    }
}

span {
    margin-top: 3px;
    font-size: var(--dl-font-size-body);
    color: var(--dl-color-darker);
}
</style>
