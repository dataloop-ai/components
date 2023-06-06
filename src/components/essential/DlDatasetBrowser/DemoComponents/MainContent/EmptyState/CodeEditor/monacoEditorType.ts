import type { PropType } from 'vue-demi'
export type CodeEditorTheme = 'vs' | 'hc-black' | 'vs-dark' | 'dl-theme-light'
export type FoldingStrategy = 'auto' | 'indentation'
export type RenderLineHighlight = 'all' | 'line' | 'none' | 'gutter'
export type lineDecorationsWidth = 'number' | 'string'
export type lineNumbers = 'on' | 'off' | 'relative' | 'interval'
export type wordWrap = 'on' | 'off' | 'wordWrapColumn' | 'bounded'

export interface CodeEditorOptions {
    glyphMargin?: boolean
    codeLens?: boolean
    automaticLayout?: boolean
    foldingStrategy?: FoldingStrategy
    renderLineHighlight?: RenderLineHighlight
    selectOnLineNumbers?: boolean
    minimap?: {
        enabled?: boolean
    }
    lineNumbers: lineNumbers
    lineNumbersMinChars?: number
    lineDecorationsWidth?: lineDecorationsWidth
    readOnly?: boolean
    fontSize?: number
    scrollBeyondLastLine?: boolean
    overviewRulerBorder?: boolean
    overviewRulerLanes?: number
    wordWrap?: wordWrap
}

export const editorProps = {
    modelValue: {
        type: String as PropType<string>,
        default: ''
    },
    width: {
        type: [String, Number] as PropType<string | number>,
        default: '485px'
    },
    height: {
        type: [String, Number] as PropType<string | number>,
        default: '547px'
    },
    language: {
        type: String as PropType<string>,
        default: 'javascript'
    },
    theme: {
        type: String as PropType<CodeEditorTheme>,
        validator(value: string): boolean {
            return ['vs', 'hc-black', 'vs-dark', 'dl-theme-light'].includes(
                value
            )
        },
        default: 'dl-theme-light'
    },
    options: {
        type: Object as PropType<CodeEditorOptions>,
        default: () => ({
            glyphMargin: false,
            codeLens: false,
            automaticLayout: false,
            foldingStrategy: 'indentation',
            renderLineHighlight: 'line',
            minimap: {
                enabled: false
            },
            readOnly: false,
            fontSize: 16,
            scrollBeyondLastLine: false,
            overviewRulerBorder: false,
            overviewRulerLanes: 0,
            lineNumbers: 'off'
        })
    }
}
