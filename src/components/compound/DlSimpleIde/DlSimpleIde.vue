<template>
    <div
        class="dl-simple-ide"
        :class="{
            'dl-simple-ide--dark': isDarkTheme
        }"
        :style="cssVars"
    >
        <!-- File Explorer Panel -->
        <div
            v-if="showExplorer"
            class="dl-simple-ide__explorer"
            :style="{ width: `${explorerWidth}px` }"
        >
            <file-explorer
                :files="internalFiles"
                :selected-id="activeFile?.file.id || ''"
                :title="explorerTitle"
                :allow-create="options.allowCreate"
                :allow-delete="options.allowDelete"
                :allow-rename="options.allowRename"
                :show-open-folder="showOpenFolderButton"
                @select="handleFileSelect"
                @toggle="handleFolderToggle"
                @create-file="$emit('create-file')"
                @create-folder="$emit('create-folder')"
                @open-folder="handleOpenFolder"
                @delete="handleDelete"
                @rename="handleRename"
            />
        </div>

        <!-- Resizer -->
        <div
            v-if="showExplorer"
            class="dl-simple-ide__resizer"
            @mousedown="startResize"
        />

        <!-- Editor Panel -->
        <div class="dl-simple-ide__editor-panel">
            <!-- Tabs -->
            <file-tabs
                v-if="openFiles.length > 0"
                :open-files="openFiles"
                :active-file-id="activeFile?.file.id || ''"
                @select="setActiveFile"
                @close="closeFile"
            />

            <!-- Editor or Empty State -->
            <div class="dl-simple-ide__editor-container">
                <template v-if="activeFile">
                    <monaco-wrapper
                        ref="monacoRef"
                        v-model="activeFile.content"
                        :language="activeFile.file.language || 'plaintext'"
                        :theme="computedTheme.editorTheme"
                        :readonly="activeFile.file.readonly || readonly"
                        :font-size="options.fontSize"
                        :tab-size="options.tabSize"
                        :word-wrap="options.wordWrap"
                        :minimap="options.minimap"
                        :line-numbers="options.lineNumbers"
                        @change="handleContentChange"
                        @save="handleSave"
                        @ready="handleEditorReady"
                    />
                </template>
                <div v-else class="dl-simple-ide__empty">
                    <dl-icon
                        icon="icon-dl-code"
                        size="48px"
                        class="dl-simple-ide__empty-icon"
                    />
                    <p class="dl-simple-ide__empty-text">
                        {{ emptyText }}
                    </p>
                    <p class="dl-simple-ide__empty-hint">
                        Select a file from the explorer to start editing
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    PropType,
    ref,
    computed,
    watch,
    toRefs,
    onMounted
} from 'vue-demi'
import {
    FileNode,
    OpenFile,
    DlSimpleIdeOptions,
    DlSimpleIdeTheme,
    DlSimpleIdeThemes,
    defaultIdeOptions,
    getLanguageFromFileName,
    FileNodeWithHandle,
    isFileSystemAccessSupported,
    openLocalDirectory,
    loadDirectoryChildren,
    loadFileContent,
    FileSystemApiConfig,
    loadDirectoryFromApi,
    loadFileContentFromApi
} from './types'
import FileExplorer from './components/FileExplorer.vue'
import FileTabs from './components/FileTabs.vue'
import MonacoWrapper from './components/MonacoWrapper.vue'
import { DlIcon } from '../../essential'

export default defineComponent({
    name: 'DlSimpleIde',
    components: {
        FileExplorer,
        FileTabs,
        MonacoWrapper,
        DlIcon
    },
    props: {
        /** Array of file/folder nodes */
        files: {
            type: Array as PropType<FileNode[]>,
            required: true
        },
        /** Theme name or custom theme object */
        theme: {
            type: [String, Object] as PropType<string | DlSimpleIdeTheme>,
            default: 'dark'
        },
        /** IDE options */
        options: {
            type: Object as PropType<DlSimpleIdeOptions>,
            default: () => ({ ...defaultIdeOptions })
        },
        /** Whether the editor is readonly */
        readonly: {
            type: Boolean,
            default: false
        },
        /** Show file explorer panel */
        showExplorer: {
            type: Boolean,
            default: true
        },
        /** Title for the explorer panel */
        explorerTitle: {
            type: String,
            default: 'Explorer'
        },
        /** Text to show when no file is open */
        emptyText: {
            type: String,
            default: 'No file is open'
        },
        /** Width of the component */
        width: {
            type: [String, Number] as PropType<string | number>,
            default: '100%'
        },
        /** Height of the component */
        height: {
            type: [String, Number] as PropType<string | number>,
            default: '600px'
        },
        /** Show open folder button to load local files */
        showOpenFolderButton: {
            type: Boolean,
            default: true
        },
        /**
         * Path to load files from (requires apiConfig or backend support)
         * e.g., "/Users/mohammedgalia/Dataloop/dtlpy"
         */
        path: {
            type: String,
            default: ''
        },
        /**
         * API configuration for loading files from a backend server
         * If not provided and running in dev mode, uses the built-in local file server
         */
        apiConfig: {
            type: Object as PropType<FileSystemApiConfig>,
            default: () => ({
                baseUrl: '',
                listEndpoint: '/__local-files/list',
                readEndpoint: '/__local-files/read'
            })
        },
        /**
         * Auto-load the path on mount
         */
        autoLoad: {
            type: Boolean,
            default: true
        }
    },
    emits: [
        'file-select',
        'file-open',
        'file-close',
        'file-change',
        'file-save',
        'folder-toggle',
        'create-file',
        'create-folder',
        'delete',
        'rename',
        'editor-ready',
        'folder-opened',
        'error'
    ],
    setup(props, { emit }) {
        const {
            files,
            theme,
            options,
            width,
            height,
            path,
            apiConfig,
            autoLoad
        } = toRefs(props)

        const monacoRef = ref<InstanceType<typeof MonacoWrapper> | null>(null)
        const openFiles = ref<OpenFile[]>([])
        const activeFile = ref<OpenFile | null>(null)
        const explorerWidth = ref(options.value.explorerWidth || 250)
        const isResizing = ref(false)
        const localFiles = ref<FileNodeWithHandle[]>([])
        const apiFiles = ref<FileNode[]>([])
        const isLoadingFile = ref(false)
        const isLoadingDirectory = ref(false)
        const currentApiConfig = ref<FileSystemApiConfig | null>(null)

        // Use apiFiles > localFiles > props.files
        const internalFiles = computed(() => {
            if (apiFiles.value.length > 0) return apiFiles.value
            if (localFiles.value.length > 0) return localFiles.value
            return files.value
        })

        const computedTheme = computed<DlSimpleIdeTheme>(() => {
            if (typeof theme.value === 'string') {
                return DlSimpleIdeThemes[theme.value] || DlSimpleIdeThemes.dark
            }
            return theme.value
        })

        const isDarkTheme = computed(() => {
            return ['vs-dark', 'hc-black'].includes(
                computedTheme.value.editorTheme
            )
        })

        const cssVars = computed(() => ({
            '--dl-simple-ide-width':
                typeof width.value === 'number'
                    ? `${width.value}px`
                    : width.value,
            '--dl-simple-ide-height':
                typeof height.value === 'number'
                    ? `${height.value}px`
                    : height.value
        }))

        const findFileById = (
            id: string,
            nodes: FileNode[] = files.value
        ): FileNode | null => {
            for (const node of nodes) {
                if (node.id === id) return node
                if (node.children) {
                    const found = findFileById(id, node.children)
                    if (found) return found
                }
            }
            return null
        }

        /**
         * Load files from a path using the API
         */
        const loadFromPath = async (
            dirPath: string,
            config?: FileSystemApiConfig
        ) => {
            const cfg = config || apiConfig.value
            if (!cfg) {
                emit(
                    'error',
                    new Error(
                        'apiConfig is required to load files from a path. Please provide an API configuration.'
                    )
                )
                return
            }

            isLoadingDirectory.value = true
            currentApiConfig.value = cfg

            try {
                const loadedFiles = await loadDirectoryFromApi(dirPath, cfg)
                if (loadedFiles.length > 0) {
                    apiFiles.value = loadedFiles
                    localFiles.value = []
                    openFiles.value = []
                    activeFile.value = null
                    emit('folder-opened', loadedFiles)
                }
            } catch (error) {
                emit('error', error)
            } finally {
                isLoadingDirectory.value = false
            }
        }

        const handleOpenFolder = async () => {
            if (!isFileSystemAccessSupported()) {
                emit(
                    'error',
                    new Error(
                        'File System Access API is not supported in this browser. Please use Chrome, Edge, or another Chromium-based browser.'
                    )
                )
                return
            }

            try {
                const loadedFiles = await openLocalDirectory()
                if (loadedFiles.length > 0) {
                    localFiles.value = loadedFiles
                    apiFiles.value = []
                    // Close all open files when loading a new directory
                    openFiles.value = []
                    activeFile.value = null
                    emit('folder-opened', loadedFiles)
                }
            } catch (error) {
                emit('error', error)
            }
        }

        const handleFileSelect = async (node: FileNode) => {
            emit('file-select', node)

            if (node.type === 'file') {
                await openFile(node)
            }
        }

        const openFile = async (node: FileNode) => {
            // Check if file is already open
            const existingOpen = openFiles.value.find(
                (f) => f.file.id === node.id
            )

            if (existingOpen) {
                activeFile.value = existingOpen
            } else {
                // Determine language if not set
                if (!node.language) {
                    node.language = getLanguageFromFileName(node.name)
                }

                // Load content lazily
                let content = node.content || ''
                const nodeWithHandle = node as FileNodeWithHandle
                const nodeWithApi = node as FileNode & {
                    _apiConfig?: FileSystemApiConfig
                }

                if (content === '') {
                    isLoadingFile.value = true
                    try {
                        // Try local file system first
                        if (nodeWithHandle.fileHandle) {
                            content = await loadFileContent(nodeWithHandle)
                        }
                        // Then try API
                        else if (
                            nodeWithApi._apiConfig ||
                            currentApiConfig.value
                        ) {
                            const cfg =
                                nodeWithApi._apiConfig ||
                                currentApiConfig.value!
                            content = await loadFileContentFromApi(
                                node.path,
                                cfg
                            )
                        }
                        node.content = content
                    } catch (error) {
                        emit('error', error)
                    } finally {
                        isLoadingFile.value = false
                    }
                }

                const newOpen: OpenFile = {
                    file: node,
                    isDirty: false,
                    content
                }
                openFiles.value.push(newOpen)
                activeFile.value = newOpen
                emit('file-open', node)
            }
        }

        const setActiveFile = (node: FileNode) => {
            const openFile = openFiles.value.find((f) => f.file.id === node.id)
            if (openFile) {
                activeFile.value = openFile
            }
        }

        const closeFile = (node: FileNode) => {
            const index = openFiles.value.findIndex(
                (f) => f.file.id === node.id
            )
            if (index === -1) return

            const closedFile = openFiles.value[index]
            openFiles.value.splice(index, 1)

            // If we're closing the active file, switch to another one
            if (activeFile.value?.file.id === node.id) {
                if (openFiles.value.length > 0) {
                    // Try to open the file at the same index, or the previous one
                    const newIndex = Math.min(index, openFiles.value.length - 1)
                    activeFile.value = openFiles.value[newIndex]
                } else {
                    activeFile.value = null
                }
            }

            emit('file-close', closedFile)
        }

        const handleFolderToggle = async (node: FileNode) => {
            node.isExpanded = !node.isExpanded

            // Load children lazily
            const nodeWithHandle = node as FileNodeWithHandle
            const nodeWithApi = node as FileNode & {
                _apiConfig?: FileSystemApiConfig
            }

            if (
                node.isExpanded &&
                (!node.children || node.children.length === 0)
            ) {
                try {
                    // Try local file system first
                    if (nodeWithHandle.directoryHandle) {
                        const children = await loadDirectoryChildren(
                            nodeWithHandle
                        )
                        node.children = children
                    }
                    // Then try API
                    else if (nodeWithApi._apiConfig || currentApiConfig.value) {
                        const cfg =
                            nodeWithApi._apiConfig || currentApiConfig.value!
                        const children = await loadDirectoryFromApi(
                            node.path,
                            cfg
                        )
                        node.children = children
                    }
                } catch (error) {
                    emit('error', error)
                }
            }

            emit('folder-toggle', node)
        }

        const handleContentChange = (content: string) => {
            if (activeFile.value) {
                const originalContent = activeFile.value.file.content || ''
                activeFile.value.isDirty = content !== originalContent
                emit('file-change', {
                    file: activeFile.value.file,
                    content,
                    isDirty: activeFile.value.isDirty
                })
            }
        }

        const handleSave = (content: string) => {
            if (activeFile.value) {
                activeFile.value.file.content = content
                activeFile.value.isDirty = false
                emit('file-save', {
                    file: activeFile.value.file,
                    content
                })
            }
        }

        const handleDelete = (node: FileNode) => {
            // Close the file if it's open
            if (node.type === 'file') {
                closeFile(node)
            }
            emit('delete', node)
        }

        const handleRename = (node: FileNode, newName: string) => {
            emit('rename', { node, newName })
        }

        const handleEditorReady = (editor: any) => {
            emit('editor-ready', editor)
        }

        // Resizer functionality
        const startResize = (event: MouseEvent) => {
            isResizing.value = true
            const startX = event.clientX
            const startWidth = explorerWidth.value

            const onMouseMove = (e: MouseEvent) => {
                if (!isResizing.value) return
                const diff = e.clientX - startX
                explorerWidth.value = Math.max(
                    150,
                    Math.min(500, startWidth + diff)
                )
            }

            const onMouseUp = () => {
                isResizing.value = false
                document.removeEventListener('mousemove', onMouseMove)
                document.removeEventListener('mouseup', onMouseUp)
            }

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
        }

        // Auto-save functionality
        let autoSaveTimeout: number | null = null
        watch(
            () => activeFile.value?.content,
            () => {
                if (options.value.autoSave && activeFile.value?.isDirty) {
                    if (autoSaveTimeout) {
                        clearTimeout(autoSaveTimeout)
                    }
                    autoSaveTimeout = window.setTimeout(() => {
                        if (activeFile.value) {
                            handleSave(activeFile.value.content)
                        }
                    }, options.value.autoSaveDelay || 1000)
                }
            }
        )

        // Public methods
        const getOpenFiles = () => openFiles.value
        const getActiveFile = () => activeFile.value
        const focus = () => monacoRef.value?.focus()
        const saveActiveFile = () => {
            if (activeFile.value) {
                handleSave(activeFile.value.content)
            }
        }
        const clearLocalFiles = () => {
            localFiles.value = []
            apiFiles.value = []
            openFiles.value = []
            activeFile.value = null
            currentApiConfig.value = null
        }

        // Auto-load from path on mount
        onMounted(() => {
            if (autoLoad.value && path.value && apiConfig.value) {
                loadFromPath(path.value, apiConfig.value)
            }
        })

        // Watch for path changes
        watch([path, apiConfig], ([newPath, newConfig]) => {
            if (newPath && newConfig) {
                loadFromPath(newPath, newConfig)
            }
        })

        return {
            monacoRef,
            openFiles,
            activeFile,
            explorerWidth,
            internalFiles,
            computedTheme,
            isDarkTheme,
            cssVars,
            handleFileSelect,
            handleFolderToggle,
            handleContentChange,
            handleSave,
            handleDelete,
            handleRename,
            handleEditorReady,
            handleOpenFolder,
            setActiveFile,
            closeFile,
            startResize,
            // Public methods
            getOpenFiles,
            getActiveFile,
            focus,
            saveActiveFile,
            openFile,
            clearLocalFiles,
            openLocalDirectory: handleOpenFolder,
            loadFromPath,
            isLoadingDirectory
        }
    }
})
</script>

<style scoped lang="scss">
.dl-simple-ide {
    display: flex;
    width: var(--dl-simple-ide-width);
    height: var(--dl-simple-ide-height);
    border: 1px solid var(--dl-color-separator);
    border-radius: 4px;
    overflow: hidden;
    background: var(--dl-color-panel-background);

    &--dark {
        --dl-color-bg: #1e1e1e;
        --dl-color-panel-background: #252526;
        --dl-color-separator: #3c3c3c;
        --dl-color-hover: #2a2d2e;
        --dl-color-darker: #cccccc;
        --dl-color-medium: #858585;
        --dl-color-secondary: #0e639c;
        --dl-color-warning: #cca700;
    }

    &__explorer {
        flex-shrink: 0;
        height: 100%;
        overflow: hidden;
    }

    &__resizer {
        width: 4px;
        cursor: col-resize;
        background: transparent;
        transition: background-color 0.15s ease;

        &:hover {
            background: var(--dl-color-secondary);
        }
    }

    &__editor-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
        overflow: hidden;
    }

    &__editor-container {
        flex: 1;
        overflow: hidden;
    }

    &__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 40px;
        text-align: center;
    }

    &__empty-icon {
        color: var(--dl-color-disabled);
        margin-bottom: 16px;
        opacity: 0.5;
    }

    &__empty-text {
        font-size: 16px;
        color: var(--dl-color-darker);
        margin: 0 0 8px 0;
    }

    &__empty-hint {
        font-size: 13px;
        color: var(--dl-color-medium);
        margin: 0;
    }
}
</style>
