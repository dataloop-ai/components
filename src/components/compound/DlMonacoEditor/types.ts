/**
 * Theme options for DlMonacoEditor
 * Maps the existing DlCodeEditorTheme values to Monaco themes
 */
export enum DlMonacoEditorTheme {
    // Same as DlCodeEditorTheme for compatibility
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

/**
 * Options for DlMonacoEditor
 * Same interface as DlCodeEditorOptions for compatibility
 */
export interface DlMonacoEditorOptions {
    /** Font size in pixels */
    fontSize?: number
    /** Tab size in spaces */
    tabSpaces?: number
    /** Enable text wrapping */
    textWrapping?: boolean
    /** Hide the header bar */
    hideHeader?: boolean
    /** Hide the copy button */
    hideCopyButton?: boolean
    /** Show line numbers */
    lineNumbers?: boolean
    /** Hide language display */
    hideLanguage?: boolean
    /** Enable minimap (Monaco specific) */
    minimap?: boolean
    /** Enable autocomplete (Monaco specific) */
    autoComplete?: boolean
}

/**
 * Map theme names to Monaco editor themes
 */
export function getMonacoTheme(theme: string): 'vs' | 'vs-dark' | 'hc-black' {
    switch (theme) {
        case 'atom-one-dark':
        case 'dracula':
        case 'github-dark':
        case 'vs2015':
            return 'vs-dark'
        case 'atom-one-light':
        case 'github':
        case 'vs':
        default:
            return 'vs'
    }
}

/**
 * Get display title for language
 */
export function getLanguageTitle(language: string): string {
    const titles: Record<string, string> = {
        javascript: 'JavaScript',
        typescript: 'TypeScript',
        python: 'Python',
        py: 'Python',
        js: 'JavaScript',
        ts: 'TypeScript',
        html: 'HTML',
        css: 'CSS',
        scss: 'SCSS',
        json: 'JSON',
        yaml: 'YAML',
        markdown: 'Markdown',
        md: 'Markdown',
        sql: 'SQL',
        shell: 'Shell',
        bash: 'Bash',
        java: 'Java',
        csharp: 'C#',
        cpp: 'C++',
        c: 'C',
        go: 'Go',
        rust: 'Rust',
        php: 'PHP',
        ruby: 'Ruby',
        swift: 'Swift',
        kotlin: 'Kotlin',
        xml: 'XML',
        vue: 'Vue'
    }
    return (
        titles[language.toLowerCase()] ||
        language.charAt(0).toUpperCase() + language.slice(1)
    )
}

/**
 * Normalize language name to Monaco language ID
 */
export function normalizeLanguage(language: string): string {
    const languageMap: Record<string, string> = {
        js: 'javascript',
        ts: 'typescript',
        py: 'python',
        md: 'markdown',
        yml: 'yaml',
        sh: 'shell',
        bash: 'shell',
        zsh: 'shell'
    }
    return languageMap[language.toLowerCase()] || language.toLowerCase()
}
