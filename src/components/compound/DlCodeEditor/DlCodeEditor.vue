<template>
    <div
        class="dl-code-editor-wrapper"
        :style="cssVars"
    >
        <code-editor
            v-model="code"
            class="dl-code-editor"
            :line-nums="!!options.lineNumbers"
            :languages="[[language, languageTitle]]"
            :read-only="readonly"
            :theme="theme"
            :font-size="styleFontSize"
            :tab-spaces="options.tabSpaces ? options.tabSpaces : 4"
            :wrap="!!options.textWrapping"
            :width="styleWidth"
            :height="styleHeight"
            :header="!options.hideHeader"
            :display-language="!options.hideLanguage"
            :copy-button="!options.hideCopyButton"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, toRef } from 'vue-demi'
import { DlCodeEditorTheme, DlCodeEditorOptions } from './types'
import CodeEditor from './components/CodeEditor.vue'

export default defineComponent({
    name: 'DlCodeEditor',
    components: {
        CodeEditor
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            type: String as PropType<string>,
            default: ''
        },
        width: {
            type: [String, Number] as PropType<string | number>,
            default: '100%'
        },
        height: {
            type: [String, Number] as PropType<string | number>,
            default: '100%'
        },
        language: {
            type: String as PropType<string>,
            default: 'javascript'
        },
        theme: {
            required: false,
            type: String as PropType<DlCodeEditorTheme>,
            default: DlCodeEditorTheme.Light
        },
        readonly: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        title: {
            type: String,
            default: null
        },
        options: {
            type: Object as PropType<DlCodeEditorOptions>,
            default: () => ({} as DlCodeEditorOptions)
        }
    },
    emits: ['update:model-value', 'change'],
    setup(props, { emit }) {
        const modelRef = toRef(props, 'modelValue')

        const code = computed({
            get() {
                return modelRef.value
            },
            set(value) {
                emit('update:model-value', value)
                emit('change', value)
            }
        })

        const languageTitle = computed(() => {
            switch (props.language.toLowerCase()) {
                case 'python':
                    return 'Python'
                case 'javascript':
                    return 'JavaScript'
                case 'typescript':
                    return 'TypeScript'
                case 'py':
                    return 'Python'
                case 'js':
                    return 'JavaScript'
                default:
                    return (
                        props.language.charAt(0).toUpperCase() +
                        props.language.slice(1)
                    )
            }
        })

        const dlFontSize = `12px`

        const cssVars = computed(() => {
            return {
                '--dl-code-editor-header-border-bottom': !props.options
                    ?.lineNumbers
                    ? `1px solid var(--dl-color-separator)`
                    : `none`
            } as Record<string, any>
        })

        const styleWidth = computed(() => {
            if (typeof props.width === 'number') {
                return `${props.width}px`
            }
            return props.width
        })
        const styleHeight = computed(() => {
            if (typeof props.height === 'number') {
                return `${props.height}px`
            }
            return props.height
        })
        const styleFontSize = computed(() => {
            if (!props.options.fontSize) {
                return dlFontSize
            }
            const frontSize = props.options.fontSize
            if (typeof frontSize === 'number') {
                return `${frontSize}px`
            }
            return frontSize
        })

        return {
            code,
            languageTitle,
            dlFontSize,
            cssVars,
            styleHeight,
            styleWidth,
            styleFontSize
        }
    }
})
</script>
<style scoped lang="scss">
.dl-code-editor-wrapper {
    border: 1px solid var(--dl-color-separator);
    border-radius: 2px;
}
</style>

<style lang="scss">
.dl-code-editor-wrapper {
    .dl-code-editor {
        .header {
            border-bottom: var(--dl-code-editor-header-border-bottom);
        }
        textarea {
            color: var(--dl-code-editor-text-area-color);
        }
    }
}
</style>
