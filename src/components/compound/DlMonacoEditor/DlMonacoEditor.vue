<template>
    <div
        class="dl-monaco-editor-wrapper"
        :class="{
            'dl-monaco-editor-wrapper--bordered': bordered,
            'dl-monaco-editor-wrapper--dark': isDarkTheme
        }"
        :style="cssVars"
    >
        <!-- Header -->
        <div v-if="!options.hideHeader" class="dl-monaco-editor__header">
            <div class="dl-monaco-editor__header-left">
                <span
                    v-if="!options.hideLanguage"
                    class="dl-monaco-editor__language"
                >
                    {{ displayLanguage }}
                </span>
                <span v-if="title" class="dl-monaco-editor__title">
                    {{ title }}
                </span>
            </div>
            <div class="dl-monaco-editor__header-right">
                <dl-button
                    v-if="!options.hideCopyButton"
                    icon="icon-dl-copy"
                    icon-color="dl-color-medium"
                    size="14px"
                    flat
                    round
                    tooltip="Copy to clipboard"
                    @click="copyToClipboard"
                />
            </div>
        </div>

        <!-- Monaco Editor Container -->
        <div ref="editorContainer" class="dl-monaco-editor__container" />
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    computed,
    watch,
    onMounted,
    onBeforeUnmount,
    PropType,
    toRefs
} from 'vue-demi'
import loader from '@monaco-editor/loader'
import type * as Monaco from 'monaco-editor'
import {
    DlMonacoEditorTheme,
    DlMonacoEditorOptions,
    getMonacoTheme,
    getLanguageTitle,
    normalizeLanguage
} from './types'
import { DlButton } from '../../basic'

export default defineComponent({
    name: 'DlMonacoEditor',
    components: {
        DlButton
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        /**
         * The code content (v-model)
         */
        modelValue: {
            type: String as PropType<string>,
            default: ''
        },
        /**
         * Width of the editor
         */
        width: {
            type: [String, Number] as PropType<string | number>,
            default: '100%'
        },
        /**
         * Height of the editor
         */
        height: {
            type: [String, Number] as PropType<string | number>,
            default: '100%'
        },
        /**
         * Programming language for syntax highlighting
         */
        language: {
            type: String as PropType<string>,
            default: 'javascript'
        },
        /**
         * Color theme
         */
        theme: {
            type: String as PropType<DlMonacoEditorTheme | string>,
            default: DlMonacoEditorTheme.Light
        },
        /**
         * Read-only mode
         */
        readonly: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        /**
         * Show border around editor
         */
        bordered: {
            type: Boolean as PropType<boolean>,
            default: true
        },
        /**
         * Title to display in header
         */
        title: {
            type: String as PropType<string>,
            default: null
        },
        /**
         * Editor options
         */
        options: {
            type: Object as PropType<DlMonacoEditorOptions>,
            default: () => ({} as DlMonacoEditorOptions)
        }
    },
    emits: ['update:model-value', 'change', 'save', 'ready'],
    setup(props, { emit }) {
        const {
            modelValue,
            language,
            theme,
            readonly,
            options,
            width,
            height
        } = toRefs(props)

        const editorContainer = ref<HTMLElement | null>(null)
        let editor: Monaco.editor.IStandaloneCodeEditor | null = null
        let monaco: typeof Monaco | null = null

        // Computed styles
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

        const cssVars = computed(() => ({
            '--dl-monaco-editor-width': styleWidth.value,
            '--dl-monaco-editor-height': styleHeight.value
        }))

        const monacoTheme = computed(() => getMonacoTheme(theme.value))

        const isDarkTheme = computed(() => monacoTheme.value === 'vs-dark')

        const displayLanguage = computed(() => getLanguageTitle(language.value))

        const normalizedLanguage = computed(() =>
            normalizeLanguage(language.value)
        )

        const fontSize = computed(() => {
            if (options.value.fontSize) {
                return options.value.fontSize
            }
            return 14
        })

        // Initialize Monaco Editor
        const initEditor = async () => {
            if (!editorContainer.value) return

            try {
                monaco = await loader.init()

                editor = monaco.editor.create(editorContainer.value, {
                    value: modelValue.value,
                    language: normalizedLanguage.value,
                    theme: monacoTheme.value,
                    readOnly: readonly.value,
                    fontSize: fontSize.value,
                    tabSize: options.value.tabSpaces || 4,
                    wordWrap: options.value.textWrapping ? 'on' : 'off',
                    lineNumbers:
                        options.value.lineNumbers !== false ? 'on' : 'off',
                    minimap: {
                        enabled: options.value.minimap !== false
                    },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    scrollBeyondLastColumn: 0,
                    renderWhitespace: 'selection',
                    folding: true,
                    foldingStrategy: 'indentation',
                    suggestOnTriggerCharacters:
                        options.value.autoComplete !== false,
                    quickSuggestions: options.value.autoComplete !== false,
                    scrollbar: {
                        vertical: 'auto',
                        horizontal: 'auto',
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10,
                        alwaysConsumeMouseWheel: false
                    },
                    padding: { top: 10, bottom: 10 },
                    fixedOverflowWidgets: true
                })

                // Listen to content changes
                editor.onDidChangeModelContent(() => {
                    const value = editor?.getValue() || ''
                    emit('update:model-value', value)
                    emit('change', value)
                })

                // Add save command (Ctrl/Cmd + S)
                editor.addCommand(
                    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                    () => {
                        emit('save', editor?.getValue() || '')
                    }
                )

                emit('ready', editor)
            } catch (error) {
                console.error('Failed to initialize Monaco Editor:', error)
            }
        }

        // Watch for external value changes
        watch(modelValue, (newValue) => {
            if (editor && newValue !== editor.getValue()) {
                editor.setValue(newValue)
            }
        })

        // Watch for language changes
        watch(normalizedLanguage, (newLanguage) => {
            if (editor && monaco) {
                const model = editor.getModel()
                if (model) {
                    monaco.editor.setModelLanguage(model, newLanguage)
                }
            }
        })

        // Watch for theme changes
        watch(monacoTheme, (newTheme) => {
            if (monaco) {
                monaco.editor.setTheme(newTheme)
            }
        })

        // Watch for readonly changes
        watch(readonly, (newReadonly) => {
            if (editor) {
                editor.updateOptions({ readOnly: newReadonly })
            }
        })

        // Watch for option changes
        watch(
            options,
            (newOptions) => {
                if (editor) {
                    editor.updateOptions({
                        fontSize: newOptions.fontSize || 14,
                        tabSize: newOptions.tabSpaces || 4,
                        wordWrap: newOptions.textWrapping ? 'on' : 'off',
                        lineNumbers:
                            newOptions.lineNumbers !== false ? 'on' : 'off',
                        minimap: { enabled: newOptions.minimap !== false }
                    })
                }
            },
            { deep: true }
        )

        onMounted(() => {
            initEditor()
        })

        onBeforeUnmount(() => {
            if (editor) {
                editor.dispose()
                editor = null
            }
        })

        // Copy to clipboard
        const copyToClipboard = async () => {
            try {
                const content = editor?.getValue() || modelValue.value
                await navigator.clipboard.writeText(content)
                // Could emit a success event or show a toast
            } catch (error) {
                console.error('Failed to copy to clipboard:', error)
            }
        }

        // Public methods
        const focus = () => editor?.focus()
        const getEditor = () => editor
        const setValue = (value: string) => editor?.setValue(value)
        const getValue = () => editor?.getValue() || ''
        const formatDocument = () => {
            editor?.getAction('editor.action.formatDocument')?.run()
        }

        return {
            editorContainer,
            cssVars,
            isDarkTheme,
            displayLanguage,
            copyToClipboard,
            focus,
            getEditor,
            setValue,
            getValue,
            formatDocument
        }
    }
})
</script>

<style scoped lang="scss">
.dl-monaco-editor-wrapper {
    width: var(--dl-monaco-editor-width, 100%);
    min-width: 200px;
    height: var(--dl-monaco-editor-height, 100%);
    display: flex;
    flex-direction: column;
    background: var(--dl-color-bg);
    overflow: hidden;
    box-sizing: border-box;

    &--bordered {
        border: 1px solid var(--dl-color-separator);
        border-radius: 2px;
    }

    &--dark {
        background: #1e1e1e;

        .dl-monaco-editor__header {
            background: #252526;
            border-bottom-color: #3c3c3c;
        }

        .dl-monaco-editor__language,
        .dl-monaco-editor__title {
            color: #cccccc;
        }
    }
}

.dl-monaco-editor {
    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 12px;
        background: var(--dl-color-panel-background);
        border-bottom: 1px solid var(--dl-color-separator);
        min-height: 34px;
        box-sizing: border-box;
        flex-shrink: 0;
    }

    &__header-left {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    &__header-right {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    &__language {
        font-size: 12px;
        font-weight: 500;
        color: var(--dl-color-darker);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    &__title {
        font-size: 12px;
        color: var(--dl-color-medium);
    }

    &__container {
        flex: 1 1 auto;
        min-height: 100px;
        min-width: 0;
        overflow: hidden;
    }
}
</style>
