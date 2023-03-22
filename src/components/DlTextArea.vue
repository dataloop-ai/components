<template>
    <div
        :id="uuid"
        class="container"
        :style="cssVars"
    >
        <textarea
            ref="textarea"
            :value="modelValue"
            class="textarea"
            :placeholder="placeholder"
            :maxlength="maxLength"
            :disabled="disabled"
            :class="!enableResize ? 'textarea-disable-resize' : ''"
            @input="onChange"
            @focus="onFocus"
            @blur="onBlur"
        />
        <span v-show="showCounter">
            {{ modelValue.length
            }}{{ maxLength && maxLength > 0 ? `/${maxLength}` : null }}
        </span>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlTextArea',
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
        }
    },
    emits: ['input', 'focus', 'blur', 'update:model-value'],
    data() {
        return {
            uuid: `dl-text-area-${v4()}`
        }
    },
    computed: {
        cssVars(): Record<string, string> {
            return {
                '--dl-textarea-width': this.width || 'auto'
            }
        }
    },
    methods: {
        onChange(e: any) {
            this.$emit('input', e.target.value, e)
            this.$emit('update:model-value', e.target.value)
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
    width: max-content;
    max-width: 100%;
}

.textarea {
    background: none;
    border: 1px solid var(--dl-color-separator);
    border-radius: 2px;
    padding: 10px;
    font-family: 'Roboto', sans-serif;
    font-size: var(--dl-font-size-body);
    width: var(--dl-textarea-width);
    min-width: 100px;
    max-width: 100%;
    min-height: 80px;
    max-height: 120px;
    outline: none;
    color: var(--dl-color-darker);

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

    &-disable-resize {
        resize: none;
    }
}

span {
    margin-top: 3px;
    font-size: var(--dl-font-size-body);
    color: var(--dl-color-darker);
}
</style>
