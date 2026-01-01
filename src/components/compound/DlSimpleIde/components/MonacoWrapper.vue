<template>
    <div ref="editorContainer" class="dl-monaco-wrapper" />
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    onMounted,
    onBeforeUnmount,
    watch,
    PropType,
    toRefs
} from 'vue-demi'
import loader from '@monaco-editor/loader'
import type * as Monaco from 'monaco-editor'

export default defineComponent({
    name: 'MonacoWrapper',
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        language: {
            type: String,
            default: 'javascript'
        },
        theme: {
            type: String as PropType<
                'vs' | 'vs-dark' | 'hc-black' | 'hc-light'
            >,
            default: 'vs'
        },
        readonly: {
            type: Boolean,
            default: false
        },
        fontSize: {
            type: Number,
            default: 14
        },
        tabSize: {
            type: Number,
            default: 4
        },
        wordWrap: {
            type: String as PropType<
                'off' | 'on' | 'wordWrapColumn' | 'bounded'
            >,
            default: 'off'
        },
        minimap: {
            type: Boolean,
            default: true
        },
        lineNumbers: {
            type: String as PropType<'on' | 'off' | 'relative' | 'interval'>,
            default: 'on'
        }
    },
    emits: ['update:model-value', 'change', 'save', 'ready'],
    setup(props, { emit }) {
        const editorContainer = ref<HTMLElement | null>(null)
        let editor: Monaco.editor.IStandaloneCodeEditor | null = null
        let monaco: typeof Monaco | null = null
        const {
            modelValue,
            language,
            theme,
            readonly,
            fontSize,
            tabSize,
            wordWrap,
            minimap,
            lineNumbers
        } = toRefs(props)

        const initEditor = async () => {
            if (!editorContainer.value) return

            try {
                monaco = await loader.init()

                editor = monaco.editor.create(editorContainer.value, {
                    value: modelValue.value,
                    language: language.value,
                    theme: theme.value,
                    readOnly: readonly.value,
                    fontSize: fontSize.value,
                    tabSize: tabSize.value,
                    wordWrap: wordWrap.value,
                    minimap: { enabled: minimap.value },
                    lineNumbers: lineNumbers.value,
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    renderWhitespace: 'selection',
                    folding: true,
                    foldingStrategy: 'indentation',
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    scrollbar: {
                        vertical: 'auto',
                        horizontal: 'auto',
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10
                    },
                    padding: { top: 10 }
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
        watch(language, (newLanguage) => {
            if (editor && monaco) {
                const model = editor.getModel()
                if (model) {
                    monaco.editor.setModelLanguage(model, newLanguage)
                }
            }
        })

        // Watch for theme changes
        watch(theme, (newTheme) => {
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

        // Watch for other option changes
        watch([fontSize, tabSize, wordWrap, minimap, lineNumbers], () => {
            if (editor) {
                editor.updateOptions({
                    fontSize: fontSize.value,
                    tabSize: tabSize.value,
                    wordWrap: wordWrap.value,
                    minimap: { enabled: minimap.value },
                    lineNumbers: lineNumbers.value
                })
            }
        })

        onMounted(() => {
            initEditor()
        })

        onBeforeUnmount(() => {
            if (editor) {
                editor.dispose()
                editor = null
            }
        })

        const focus = () => {
            editor?.focus()
        }

        const getEditor = () => editor

        const setValue = (value: string) => {
            editor?.setValue(value)
        }

        const getValue = () => editor?.getValue() || ''

        return {
            editorContainer,
            focus,
            getEditor,
            setValue,
            getValue
        }
    }
})
</script>

<style scoped lang="scss">
.dl-monaco-wrapper {
    width: 100%;
    height: 100%;
    min-height: 200px;
}
</style>
