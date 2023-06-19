export enum DlCodeEditorTheme {
    VS = 'vs',
    VSDark = 'vs-dark',
    HCBlack = 'hc-black',
    DLThemeLight = 'dl-theme-light',
    DLThemeDark = 'dl-theme-dark'
}

type FoldingStrategy = 'auto' | 'indentation'
type RenderLineHighlight = 'all' | 'line' | 'none' | 'gutter'
type lineDecorationsWidth = 'number' | 'string'
type lineNumbers = 'on' | 'off' | 'relative' | 'interval'
type wordWrap = 'on' | 'off' | 'wordWrapColumn' | 'bounded'

export interface DlCodeEditorOptions {
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
    fontSize?: number
    scrollBeyondLastLine?: boolean
    overviewRulerBorder?: boolean
    overviewRulerLanes?: number
    wordWrap?: wordWrap
}
