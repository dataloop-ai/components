<template>
    <div
        class="code-editor"
        :style="cssVars"
    >
        <div class="grid grid-cols-2 code-editor__sdk">
            <div class="text-left">
                <dl-typography
                    size="12px"
                    color="color-dl-darker"
                >
                    SDK Script
                </dl-typography>
            </div>
            <div class="text-right">
                <DlButton
                    flat
                    icon="icon-dl-copy"
                    size="20px"
                    color="secondary"
                    round
                    @click="navigatorClipboard"
                />
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
    computed
} from 'vue-demi'
import { DlButton } from '../../basic'
import { DlTypography } from '../../essential'

import * as monaco from 'monaco-editor'
import { editor } from 'monaco-editor'
import { editorProps } from './types'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

import dlThemeLight from './theme.light.json'
import dlThemeDark from './theme.dark.json' // add support for this. for now its a clone of the light theme.

import IStandaloneThemeData = editor.IStandaloneThemeData

monaco.editor.defineTheme(
    'dl-theme-light',
    dlThemeLight as IStandaloneThemeData
)
monaco.editor.setTheme('dl-theme-light')

export default defineComponent({
    name: 'DlCodeEditor',
    components: {
        DlTypography,
        DlButton
    },
    props: editorProps,
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
                theme: props.theme,
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
