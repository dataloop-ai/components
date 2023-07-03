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
            :font-size="options.fontSize ? options.fontSize : dlFontSize"
            :tab-spaces="options.tabSpaces ? options.tabSpaces : 4"
            :wrap="!!options.textWrapping"
            :width="width"
            :height="height"
            :header="!options.hideHeader"
            :display-language="!options.hideLanguage"
            :copy-button="!options.hideCopyCode"
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
            }
        })

        return { code, languageTitle, dlFontSize, cssVars }
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
