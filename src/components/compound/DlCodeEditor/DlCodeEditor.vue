<template>
    <div
        class="code-editor"
        :style="cssVars"
    >
        <div class="grid grid-cols-2 code-editor__sdk">
            <div class="text-left">
                <slot name="title">
                    <dl-typography
                        size="12px"
                        color="color-dl-darker"
                    >
                        {{ title }}
                    </dl-typography>
                </slot>
            </div>
            <div class="text-right">
                <slot name="actions">
                    <DlButton
                        flat
                        icon="icon-dl-copy"
                        size="20px"
                        color="secondary"
                        round
                        @click="navigatorClipboard"
                    />
                </slot>
            </div>
        </div>
        <div
            ref="codeEditorBox"
            class="code-editor-box"
        />
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    onBeforeUnmount,
    ref,
    watch,
    computed,
    PropType
} from 'vue-demi'
import { DlButton } from '../../basic'
import { DlTypography } from '../../essential'

import * as monaco from 'monaco-editor'
import { editor } from 'monaco-editor'
import { DlCodeEditorOptions, DlCodeEditorTheme } from './types'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

import dlThemeLight from './theme.light.json'
import dlThemeDark from './theme.dark.json' // add support for this. for now its a clone of the light theme.

import IStandaloneThemeData = editor.IStandaloneThemeData

monaco.editor.defineTheme(
    DlCodeEditorTheme.DLThemeLight,
    dlThemeLight as IStandaloneThemeData
)
monaco.editor.defineTheme(
    DlCodeEditorTheme.DLThemeDark,
    dlThemeDark as IStandaloneThemeData
)

monaco.editor.setTheme(DlCodeEditorTheme.DLThemeLight)

export default defineComponent({
    name: 'DlCodeEditor',
    components: {
        DlTypography,
        DlButton
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
            default: null
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
            default: () => ({
                glyphMargin: false,
                codeLens: false,
                automaticLayout: false,
                foldingStrategy: 'indentation',
                renderLineHighlight: 'line',
                minimap: {
                    enabled: false
                },
                fontSize: 16,
                scrollBeyondLastLine: false,
                overviewRulerBorder: false,
                overviewRulerLanes: 0,
                lineNumbers: 'off'
            })
        }
    },
    emits: ['update:model-value', 'change', 'editor-mounted'],
    setup(props, { emit }) {
        // @ts-ignore // needed to type the window
        window.MonacoEnvironment = {
            getWorker(_: any, label: string) {
                if (label === 'json') {
                    return new JsonWorker()
                }
                if (label === 'css' || label === 'scss' || label === 'less') {
                    return new CssWorker()
                }
                if (
                    label === 'html' ||
                    label === 'handlebars' ||
                    label === 'razor'
                ) {
                    return new HtmlWorker()
                }
                if (label === 'typescript' || label === 'javascript') {
                    return new TsWorker()
                }
                return new EditorWorker()
            }
        }

        let editor: monaco.editor.IStandaloneCodeEditor
        const codeEditorBox = ref(null)

        const theme = props.theme ?? 'dl-theme-light'

        const init = () => {
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
                {
                    noSemanticValidation: true,
                    noSyntaxValidation: false
                }
            )
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.ES2020,
                allowNonTsExtensions: true
            })

            editor = monaco.editor.create(codeEditorBox.value, {
                value: props.modelValue,
                language: props.language,
                theme,
                readOnly: props.readonly,
                ...props.options
            })

            editor.onDidChangeModelContent(() => {
                const content = editor.getValue()
                const value = editor.getValue()
                emit('update:model-value', value)
                emit('change', value)
                console.log('Editor content:', content)
            })
            emit('editor-mounted', editor)
        }

        const navigatorClipboard = () => {
            navigator.clipboard.writeText(editor.getValue())
            alert('Copied the text: ' + editor.getValue())
        }

        watch(
            () => props.modelValue,
            (newValue) => {
                if (editor) {
                    const value = editor.getValue()
                    if (newValue !== value) {
                        editor.setValue(newValue)
                    }
                }
            }
        )
        watch(
            () => props.options,
            (newValue) => {
                editor.updateOptions(newValue)
            },
            { deep: true }
        )

        watch(
            () => props.readonly,
            (newValue) => {
                editor.updateOptions({ readOnly: newValue })
            }
        )

        // @ts-ignore
        watch(window.DlComponents.isDark, (dark: boolean) => {
            editor.updateOptions({ theme: dark ? 'vs-dark' : 'dl-theme-light' })
        })

        watch(
            () => props.language,
            (newValue) => {
                monaco.editor.setModelLanguage(editor.getModel()!, newValue)
            }
        )

        const cssVars = computed(() => {
            return {
                '--dl-code-editor-width': props.width,
                '--dl-code-editor-height': props.height
            }
        })

        onMounted(() => {
            init()
        })

        onBeforeUnmount(() => {
            editor.dispose()
        })

        return { codeEditorBox, props, cssVars, navigatorClipboard }
    }
})
</script>
<style scoped lang="scss">
.code-editor {
    width: var(--dl-code-editor-width);
    border: 1px solid var(--dl-color-separator);
    border-radius: 2px;

    &__sdk {
        padding: 10px;
    }

    .code-editor-box {
        width: var(--dl-code-editor-width);
        height: var(--dl-code-editor-height);
        text-align: left;
    }
    .code-editor-box-language {
    }
}
</style>
