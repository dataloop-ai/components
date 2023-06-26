export enum DlCodeEditorTheme {
    Dark = 'atom-one-dark',
    Light = 'atom-one-light',
    ATOM_ONE_DARK = 'atom-one-dark',
    ATOM_ONE_LIGHT = 'atom-one-light',
    DRACULA = 'dracula',
    GITHUB = 'github',
    GITHUB_DARK = 'github-dark',
    VS = 'vs',
    VS_DARK = 'vs2015'
}

export interface DlCodeEditorOptions {
    fontSize?: number
    tabSpaces?: number
    textWrapping?: boolean
    hideHeader?: boolean
    hideCopyButton?: boolean
    lineNumbers?: boolean
    hideLanguage?: boolean
}
