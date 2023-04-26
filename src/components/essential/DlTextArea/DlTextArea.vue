<template>
    <div
        :id="uuid"
        class="container"
        :style="cssVars"
    >
        <textarea
            ref="textarea"
            :value="modelValue"
            :class="textareaClasses"
            :placeholder="placeholder"
            :maxlength="maxLength"
            :disabled="disabled"
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
            <span v-show="showCounter">
                {{ modelValue.length
                }}{{ maxLength && maxLength > 0 ? `/${maxLength}` : null }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { DlInfoErrorMessage } from '../../shared'
import { defineComponent, computed, ref } from 'vue-demi'
import { useSizeObserver } from '../../../hooks/use-size-observer'

export default defineComponent({
    name: 'DlTextArea',
    components: {
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
        }
    },
    emits: ['input', 'focus', 'blur', 'update:model-value', 'keydown'],
    setup(props) {
        const uuid = ref(`dl-text-area-${v4()}`)
        const textarea = ref(null)

        const { borderBoxSize } = useSizeObserver(textarea)

        const cssVars = computed(() => {
            return {
                '--dl-textarea-max-width': props.width || 'auto',
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
    methods: {
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
    padding: 20px 20px 20px 0px;
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
    min-height: 80px;
    max-height: 120px;
    outline: none;
    color: var(--dl-color-darker);
    box-sizing: border-box;

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
