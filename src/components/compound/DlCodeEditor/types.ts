export enum DlCodeEditorTheme {
    Dark = 'vs2015',
    Light = 'vs'
}

export interface DlCodeEditorOptions {
    fontSize?: number
    tabSpaces?: number
    textWrapping?: boolean
    hideHeader?: boolean
    hideCopyButton?: boolean
    lineNumbers?: boolean
}
