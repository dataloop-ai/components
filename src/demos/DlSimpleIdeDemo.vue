<template>
    <div class="simple-ide-demo">
        <h2>DlSimpleIde Demo</h2>

        <!-- Controls -->
        <div class="controls">
            <dl-select
                v-model="selectedTheme"
                :options="themeOptions"
                label="Theme"
                width="150px"
            />
            <dl-checkbox v-model="showExplorer" label="Show Explorer" />
            <dl-checkbox v-model="showMinimap" label="Show Minimap" />
            <dl-checkbox v-model="readonly" label="Readonly" />
        </div>

        <!-- Path Loading Section -->
        <div class="path-section">
            <p class="path-section__note">
                Enter a local directory path to load files directly:
            </p>
            <div class="path-section__inputs">
                <dl-input
                    v-model="directoryPath"
                    placeholder="e.g., /Users/mohammedgalia/Dataloop/dtlpy"
                    width="400px"
                    @keydown.enter="loadPath"
                />
                <dl-button
                    label="Load Path"
                    :disabled="!directoryPath"
                    @click="loadPath"
                />
            </div>
            <p class="path-section__tip">
                💡 Tip: You can also just pass the path as a prop:
                <code
                >&lt;dl-simple-ide
                    path="/Users/mohammedgalia/Dataloop/dtlpy" /&gt;</code
                >
            </p>
        </div>

        <!-- IDE Component -->
        <dl-simple-ide
            ref="ideRef"
            :files="files"
            path="/Users/mohammedgalia/Dataloop/dtlpy"
            :theme="selectedTheme.value"
            :options="ideOptions"
            :show-explorer="showExplorer"
            :readonly="readonly"
            :show-open-folder-button="true"
            height="500px"
            @file-select="onFileSelect"
            @file-open="onFileOpen"
            @file-close="onFileClose"
            @file-save="onFileSave"
            @file-change="onFileChange"
            @delete="onDelete"
            @rename="onRename"
            @create-file="onCreateFile"
            @create-folder="onCreateFolder"
            @folder-opened="onFolderOpened"
            @error="onError"
        />

        <!-- Event Log -->
        <div class="event-log">
            <h4>Event Log:</h4>
            <div class="log-entries">
                <div
                    v-for="(entry, index) in eventLog"
                    :key="index"
                    class="log-entry"
                >
                    {{ entry }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue-demi'
import { DlSimpleIde, FileNode } from '../components/compound/DlSimpleIde'
import { DlSelect } from '../components/compound/DlSelect'
import { DlCheckbox } from '../components/essential'
import { DlInput } from '../components/compound/DlInput'
import { DlButton } from '../components/basic'

export default defineComponent({
    name: 'DlSimpleIdeDemo',
    components: {
        DlSimpleIde,
        DlSelect,
        DlCheckbox,
        DlInput,
        DlButton
    },
    setup() {
        const ideRef = ref<InstanceType<typeof DlSimpleIde> | null>(null)
        const eventLog = ref<string[]>([])
        const showExplorer = ref(true)
        const showMinimap = ref(true)
        const readonly = ref(false)
        const directoryPath = ref('')
        const loadedPath = ref('')

        const loadPath = () => {
            if (directoryPath.value) {
                // Just set the path - the component will auto-load it
                loadedPath.value = directoryPath.value
            }
        }

        const themeOptions = [
            { label: 'Dark', value: 'dark' },
            { label: 'Light', value: 'light' },
            { label: 'High Contrast Dark', value: 'highContrastDark' },
            { label: 'High Contrast Light', value: 'highContrastLight' }
        ]
        const selectedTheme = ref(themeOptions[0])

        const ideOptions = computed(() => ({
            fontSize: 14,
            tabSize: 4,
            wordWrap: 'off' as const,
            minimap: showMinimap.value,
            lineNumbers: 'on' as const,
            autoSave: false,
            explorerWidth: 250,
            allowCreate: true,
            allowDelete: true,
            allowRename: true
        }))

        // Sample file structure
        const files = ref<FileNode[]>([
            {
                id: '1',
                name: 'src',
                type: 'folder',
                path: '/src',
                isExpanded: true,
                children: [
                    {
                        id: '2',
                        name: 'components',
                        type: 'folder',
                        path: '/src/components',
                        isExpanded: true,
                        children: [
                            {
                                id: '3',
                                name: 'Button.vue',
                                type: 'file',
                                path: '/src/components/Button.vue',
                                language: 'html',
                                content: `<template>
    <button class="dl-button" @click="handleClick">
        <slot>{{ label }}</slot>
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
        label: {
            type: String,
            default: 'Click me'
        }
    },
    methods: {
        handleClick() {
            this.$emit('click')
        }
    }
}
<\/script>

<style scoped>
.dl-button {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
}
</style>`
                            },
                            {
                                id: '4',
                                name: 'Input.tsx',
                                type: 'file',
                                path: '/src/components/Input.tsx',
                                language: 'typescript',
                                content: `import React, { useState } from 'react';

interface InputProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export const Input: React.FC<InputProps> = ({
    placeholder = 'Enter text...',
    value: initialValue = '',
    onChange
}) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange?.(newValue);
    };

    return (
        <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            className="dl-input"
        />
    );
};`
                            }
                        ]
                    },
                    {
                        id: '5',
                        name: 'utils',
                        type: 'folder',
                        path: '/src/utils',
                        isExpanded: false,
                        children: [
                            {
                                id: '6',
                                name: 'helpers.ts',
                                type: 'file',
                                path: '/src/utils/helpers.ts',
                                language: 'typescript',
                                content: `/**
 * Utility functions for common operations
 */

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 11);
}`
                            },
                            {
                                id: '7',
                                name: 'api.ts',
                                type: 'file',
                                path: '/src/utils/api.ts',
                                language: 'typescript',
                                content: `const BASE_URL = 'https://api.example.com';

interface RequestConfig {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
}

export async function request<T>(
    endpoint: string,
    config: RequestConfig = {}
): Promise<T> {
    const { method = 'GET', body, headers = {} } = config;
    
    const response = await fetch(\`\${BASE_URL}\${endpoint}\`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: body ? JSON.stringify(body) : undefined
    });
    
    if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    return response.json();
}`
                            }
                        ]
                    },
                    {
                        id: '8',
                        name: 'main.ts',
                        type: 'file',
                        path: '/src/main.ts',
                        language: 'typescript',
                        content: `import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');

console.log('Application started!');`
                    },
                    {
                        id: '9',
                        name: 'App.vue',
                        type: 'file',
                        path: '/src/App.vue',
                        language: 'html',
                        content: `<template>
    <div id="app">
        <header>
            <nav>
                <router-link to="/">Home</router-link>
                <router-link to="/about">About</router-link>
            </nav>
        </header>
        <main>
            <router-view />
        </main>
        <footer>
            <p>&copy; 2024 My Application</p>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'App'
}
<\/script>

<style>
#app {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    flex: 1;
    padding: 20px;
}
</style>`
                    }
                ]
            },
            {
                id: '10',
                name: 'package.json',
                type: 'file',
                path: '/package.json',
                language: 'json',
                content: `{
    "name": "my-project",
    "version": "1.0.0",
    "description": "A sample project",
    "main": "dist/index.js",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "test": "vitest",
        "lint": "eslint src --ext .ts,.vue"
    },
    "dependencies": {
        "vue": "^3.3.0",
        "vue-router": "^4.2.0",
        "pinia": "^2.1.0"
    },
    "devDependencies": {
        "vite": "^4.4.0",
        "typescript": "^5.0.0",
        "@vitejs/plugin-vue": "^4.2.0"
    }
}`
            },
            {
                id: '11',
                name: 'README.md',
                type: 'file',
                path: '/README.md',
                language: 'markdown',
                content: `# My Project

A sample project demonstrating the DlSimpleIde component.

## Features

- File explorer with tree view
- Monaco editor integration
- Syntax highlighting for multiple languages
- Tab-based file management

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## License

MIT`
            },
            {
                id: '12',
                name: 'styles.css',
                type: 'file',
                path: '/styles.css',
                language: 'css',
                content: `/* Global Styles */

:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --background-color: #f5f5f5;
    --text-color: #333333;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.btn {
    display: inline-block;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background-color: darken(var(--primary-color), 10%);
}`
            }
        ])

        const addLog = (message: string) => {
            const timestamp = new Date().toLocaleTimeString()
            eventLog.value.unshift(`[${timestamp}] ${message}`)
            if (eventLog.value.length > 10) {
                eventLog.value.pop()
            }
        }

        const onFileSelect = (node: FileNode) => {
            addLog(`File selected: ${node.name}`)
        }

        const onFileOpen = (node: FileNode) => {
            addLog(`File opened: ${node.name}`)
        }

        const onFileClose = (data: any) => {
            addLog(`File closed: ${data.file.name}`)
        }

        const onFileSave = (data: any) => {
            addLog(`File saved: ${data.file.name}`)
        }

        const onFileChange = (data: any) => {
            addLog(`File changed: ${data.file.name} (dirty: ${data.isDirty})`)
        }

        const onDelete = (node: FileNode) => {
            addLog(`Delete requested: ${node.name}`)
        }

        const onRename = (data: any) => {
            addLog(`Rename requested: ${data.node.name} -> ${data.newName}`)
        }

        const onCreateFile = () => {
            addLog('Create file requested')
        }

        const onCreateFolder = () => {
            addLog('Create folder requested')
        }

        const onFolderOpened = (loadedFiles: any[]) => {
            addLog(`Local folder opened with ${loadedFiles.length} items`)
        }

        const onError = (error: Error) => {
            addLog(`Error: ${error.message}`)
        }

        return {
            ideRef,
            files,
            eventLog,
            showExplorer,
            showMinimap,
            readonly,
            themeOptions,
            selectedTheme,
            ideOptions,
            directoryPath,
            loadedPath,
            loadPath,
            onFileSelect,
            onFileOpen,
            onFileClose,
            onFileSave,
            onFileChange,
            onDelete,
            onRename,
            onCreateFile,
            onCreateFolder,
            onFolderOpened,
            onError
        }
    }
})
</script>

<style scoped lang="scss">
.simple-ide-demo {
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;

    h2 {
        margin-bottom: 20px;
        color: var(--dl-color-darker);
    }

    .controls {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
        align-items: center;
        flex-wrap: wrap;
    }

    .path-section {
        margin-bottom: 20px;
        padding: 16px;
        background: var(--dl-color-bg);
        border: 1px solid var(--dl-color-separator);
        border-radius: 4px;

        &__note {
            font-size: 13px;
            color: var(--dl-color-darker);
            margin-bottom: 12px;
        }

        &__inputs {
            display: flex;
            gap: 12px;
            align-items: flex-end;
            flex-wrap: wrap;
        }

        &__tip {
            margin-top: 12px;
            font-size: 12px;
            color: var(--dl-color-medium);

            code {
                background: var(--dl-color-panel-background);
                padding: 2px 6px;
                border-radius: 3px;
                font-family: monospace;
                font-size: 11px;
            }
        }
    }

    .event-log {
        margin-top: 20px;
        padding: 16px;
        background: var(--dl-color-bg);
        border: 1px solid var(--dl-color-separator);
        border-radius: 4px;

        h4 {
            margin-bottom: 12px;
            color: var(--dl-color-darker);
        }

        .log-entries {
            max-height: 150px;
            overflow-y: auto;
        }

        .log-entry {
            font-family: monospace;
            font-size: 12px;
            padding: 4px 0;
            color: var(--dl-color-medium);
            border-bottom: 1px solid var(--dl-color-separator);

            &:last-child {
                border-bottom: none;
            }
        }
    }
}
</style>
