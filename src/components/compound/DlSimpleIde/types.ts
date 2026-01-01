export interface FileNode {
    /** Unique identifier for the file/folder */
    id: string
    /** Display name of the file/folder */
    name: string
    /** Type of node - file or folder */
    type: 'file' | 'folder'
    /** File path relative to root */
    path: string
    /** Children nodes (for folders) */
    children?: FileNode[]
    /** Whether the folder is expanded */
    isExpanded?: boolean
    /** File content (only for files) */
    content?: string
    /** Programming language for syntax highlighting */
    language?: string
    /** Custom icon override */
    icon?: string
    /** Whether the file/folder is readonly */
    readonly?: boolean
}

export interface OpenFile {
    /** File node reference */
    file: FileNode
    /** Whether the file has unsaved changes */
    isDirty: boolean
    /** Current content in editor */
    content: string
}

export interface DlSimpleIdeTheme {
    name: string
    editorTheme: 'vs' | 'vs-dark' | 'hc-black' | 'hc-light'
}

export const DlSimpleIdeThemes: Record<string, DlSimpleIdeTheme> = {
    light: {
        name: 'Light',
        editorTheme: 'vs'
    },
    dark: {
        name: 'Dark',
        editorTheme: 'vs-dark'
    },
    highContrastDark: {
        name: 'High Contrast Dark',
        editorTheme: 'hc-black'
    },
    highContrastLight: {
        name: 'High Contrast Light',
        editorTheme: 'hc-light'
    }
}

export interface DlSimpleIdeOptions {
    /** Font size for the editor */
    fontSize?: number
    /** Tab size in spaces */
    tabSize?: number
    /** Enable word wrap */
    wordWrap?: 'off' | 'on' | 'wordWrapColumn' | 'bounded'
    /** Enable minimap */
    minimap?: boolean
    /** Enable line numbers */
    lineNumbers?: 'on' | 'off' | 'relative' | 'interval'
    /** Enable auto save */
    autoSave?: boolean
    /** Auto save delay in ms */
    autoSaveDelay?: number
    /** Width of the file explorer panel */
    explorerWidth?: number
    /** Allow creating new files */
    allowCreate?: boolean
    /** Allow deleting files */
    allowDelete?: boolean
    /** Allow renaming files */
    allowRename?: boolean
}

/**
 * Configuration for loading files from an API endpoint
 */
export interface FileSystemApiConfig {
    /** Base URL of the API (e.g., 'http://localhost:3000/api') */
    baseUrl: string
    /** Endpoint to list directory contents (receives `path` query param) */
    listEndpoint?: string
    /** Endpoint to read file content (receives `path` query param) */
    readEndpoint?: string
    /** Custom headers for API requests */
    headers?: Record<string, string>
}

/**
 * Expected response format from the list directory API
 */
export interface FileSystemApiListResponse {
    files: {
        name: string
        type: 'file' | 'folder'
        path: string
        size?: number
        modified?: string
    }[]
}

/**
 * Expected response format from the read file API
 */
export interface FileSystemApiReadResponse {
    content: string
    path: string
    name: string
}

/**
 * Load directory listing from API
 */
export async function loadDirectoryFromApi(
    path: string,
    config: FileSystemApiConfig
): Promise<FileNode[]> {
    const endpoint = config.listEndpoint || '/files/list'
    const url = `${config.baseUrl}${endpoint}?path=${encodeURIComponent(path)}`

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...config.headers
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to load directory: ${response.statusText}`)
        }

        const data: FileSystemApiListResponse = await response.json()

        return data.files.map(
            (file, index) =>
                ({
                    id: file.path || `${path}/${file.name}`,
                    name: file.name,
                    type: file.type,
                    path: file.path || `${path}/${file.name}`,
                    language:
                        file.type === 'file'
                            ? getLanguageFromFileName(file.name)
                            : undefined,
                    isExpanded: false,
                    children: file.type === 'folder' ? [] : undefined,
                    // Store config for lazy loading
                    _apiConfig: config
                } as FileNode & { _apiConfig?: FileSystemApiConfig })
        )
    } catch (error) {
        console.error('Failed to load directory from API:', error)
        throw error
    }
}

/**
 * Load file content from API
 */
export async function loadFileContentFromApi(
    path: string,
    config: FileSystemApiConfig
): Promise<string> {
    const endpoint = config.readEndpoint || '/files/read'
    const url = `${config.baseUrl}${endpoint}?path=${encodeURIComponent(path)}`

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...config.headers
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to read file: ${response.statusText}`)
        }

        const data: FileSystemApiReadResponse = await response.json()
        return data.content
    } catch (error) {
        console.error('Failed to read file from API:', error)
        throw error
    }
}

export const defaultIdeOptions: DlSimpleIdeOptions = {
    fontSize: 14,
    tabSize: 4,
    wordWrap: 'off',
    minimap: true,
    lineNumbers: 'on',
    autoSave: false,
    autoSaveDelay: 1000,
    explorerWidth: 250,
    allowCreate: true,
    allowDelete: true,
    allowRename: true
}

/** Language mapping for file extensions */
export const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    rb: 'ruby',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    php: 'php',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'scss',
    less: 'less',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    markdown: 'markdown',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    vue: 'html',
    svelte: 'html',
    txt: 'plaintext'
}

export function getLanguageFromFileName(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || ''
    return languageMap[ext] || 'plaintext'
}

export function getFileIcon(node: FileNode): string {
    if (node.icon) return node.icon

    if (node.type === 'folder') {
        return node.isExpanded ? 'icon-dl-folder-open' : 'icon-dl-folder-filled'
    }

    const ext = node.name.split('.').pop()?.toLowerCase() || ''

    const iconMap: Record<string, string> = {
        js: 'icon-dl-code',
        jsx: 'icon-dl-code',
        ts: 'icon-dl-code',
        tsx: 'icon-dl-code',
        py: 'icon-dl-code',
        json: 'icon-dl-json',
        html: 'icon-dl-code',
        css: 'icon-dl-code',
        scss: 'icon-dl-code',
        md: 'icon-dl-markdown',
        vue: 'icon-dl-code',
        svg: 'icon-dl-picture',
        png: 'icon-dl-picture',
        jpg: 'icon-dl-picture',
        jpeg: 'icon-dl-picture',
        gif: 'icon-dl-picture'
    }

    return iconMap[ext] || 'icon-dl-file-filled'
}

/** File handle reference for File System Access API */
export interface FileNodeWithHandle extends FileNode {
    /** File handle for reading content lazily */
    fileHandle?: FileSystemFileHandle
    /** Directory handle for reading children lazily */
    directoryHandle?: FileSystemDirectoryHandle
}

/**
 * Check if File System Access API is supported
 */
export function isFileSystemAccessSupported(): boolean {
    return 'showDirectoryPicker' in window
}

/**
 * Open a directory picker and return the file tree
 */
export async function openLocalDirectory(): Promise<FileNodeWithHandle[]> {
    if (!isFileSystemAccessSupported()) {
        throw new Error(
            'File System Access API is not supported in this browser'
        )
    }

    try {
        const dirHandle = await (window as any).showDirectoryPicker()
        return await readDirectory(dirHandle, '')
    } catch (error: any) {
        if (error.name === 'AbortError') {
            // User cancelled the picker
            return []
        }
        throw error
    }
}

/**
 * Read a directory recursively and return FileNode array
 */
async function readDirectory(
    dirHandle: FileSystemDirectoryHandle,
    parentPath: string
): Promise<FileNodeWithHandle[]> {
    const entries: FileNodeWithHandle[] = []

    for await (const entry of (dirHandle as any).values()) {
        const path = parentPath
            ? `${parentPath}/${entry.name}`
            : `/${entry.name}`

        if (entry.kind === 'file') {
            const fileHandle = entry as FileSystemFileHandle
            entries.push({
                id: path,
                name: entry.name,
                type: 'file',
                path,
                language: getLanguageFromFileName(entry.name),
                fileHandle,
                content: undefined // Will be loaded lazily
            })
        } else if (entry.kind === 'directory') {
            const subDirHandle = entry as FileSystemDirectoryHandle
            // Don't read children immediately - will be loaded when expanded
            entries.push({
                id: path,
                name: entry.name,
                type: 'folder',
                path,
                isExpanded: false,
                directoryHandle: subDirHandle,
                children: [] // Will be loaded lazily when expanded
            })
        }
    }

    // Sort: folders first, then alphabetically
    return entries.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
        return a.name.localeCompare(b.name)
    })
}

/**
 * Load children of a directory node lazily
 */
export async function loadDirectoryChildren(
    node: FileNodeWithHandle
): Promise<FileNodeWithHandle[]> {
    if (!node.directoryHandle) {
        return (node.children as FileNodeWithHandle[]) || []
    }

    return await readDirectory(node.directoryHandle, node.path)
}

/**
 * Load file content lazily from a file handle
 */
export async function loadFileContent(
    node: FileNodeWithHandle
): Promise<string> {
    if (node.content !== undefined) {
        return node.content
    }

    if (!node.fileHandle) {
        return ''
    }

    try {
        const file = await node.fileHandle.getFile()
        const content = await file.text()
        return content
    } catch (error) {
        console.error('Failed to read file:', error)
        return ''
    }
}
