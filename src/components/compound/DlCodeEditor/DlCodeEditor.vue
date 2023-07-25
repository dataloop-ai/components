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
import { defineComponent, computed, PropType, toRefs } from 'vue-demi'
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
        const { modelValue, language, options, height, width } = toRefs(props)
        const dlFontSize = `12px`

        const code = computed({
            get() {
                return modelValue.value as string
            },
            set(value) {
                emit('update:model-value', value)
                emit('change', value)
            }
        })

        const languageTitle = computed(() => {
            switch (language.value.toLowerCase()) {
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
                        language.value.charAt(0).toUpperCase() +
                        language.value.slice(1)
                    )
            }
        })

        const cssVars = computed(() => {
            return {
                '--dl-code-editor-header-border-bottom': !options.value
                    ?.lineNumbers
                    ? `1px solid var(--dl-color-separator)`
                    : `none`,
                '--dl-colde-editor-width': styleWidth.value,
                '--dl-colde-editor-height': styleHeight.value
            } as Record<string, any>
        })

        const styleWidth = computed(() => {
            if (typeof width.value === 'number') {
                return `${width.value}px`
            }
            return width.value
        })
        const styleHeight = computed(() => {
            if (typeof height.value === 'number') {
                return `${height.value}px`
            }
            return height.value
        })
        const styleFontSize = computed(() => {
            if (!options.value.fontSize) {
                return dlFontSize
            }
            const frontSize = options.value.fontSize
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
    width: var(--dl-colde-editor-width, fit-content);
    height: var(--dl-colde-editor-height, fit-content);
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
        .line-nums {
            flex-grow: 1;
        }
    }
}
</style>
