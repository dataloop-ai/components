<template>
    <div class="monaco-editor-demo">
        <h2>DlMonacoEditor Demo</h2>
        <p class="demo-description">
            Drop-in replacement for DlCodeEditor with Monaco Editor (VS Code's
            editor)
        </p>

        <!-- Controls -->
        <div class="controls">
            <dl-select
                v-model="selectedLanguage"
                :options="languageOptions"
                label="Language"
                width="150px"
            />
            <dl-select
                v-model="selectedTheme"
                :options="themeOptions"
                label="Theme"
                width="150px"
            />
            <dl-checkbox v-model="showLineNumbers" label="Line Numbers" />
            <dl-checkbox v-model="showMinimap" label="Minimap" />
            <dl-checkbox v-model="readonly" label="Readonly" />
            <dl-checkbox v-model="bordered" label="Bordered" />
        </div>

        <!-- Monaco Editor -->
        <div class="editor-container">
            <dl-monaco-editor
                v-model="code"
                :language="selectedLanguage.value"
                :theme="selectedTheme.value"
                :readonly="readonly"
                :bordered="bordered"
                :options="editorOptions"
                width="100%"
                height="400px"
                @change="onCodeChange"
                @save="onSave"
            />
        </div>

        <!-- Comparison with DlCodeEditor -->
        <div class="comparison">
            <h3>Same API as DlCodeEditor</h3>
            <p>
                Just replace <code>dl-code-editor</code> with
                <code>dl-monaco-editor</code>:
            </p>
            <pre class="code-example">{{ usageExample }}</pre>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue-demi'
import {
    DlMonacoEditor,
    DlMonacoEditorTheme
} from '../components/compound/DlMonacoEditor'
import { DlSelect } from '../components/compound/DlSelect'
import { DlCheckbox } from '../components/essential'

export default defineComponent({
    name: 'DlMonacoEditorDemo',
    components: {
        DlMonacoEditor,
        DlSelect,
        DlCheckbox
    },
    setup() {
        const code = ref(`// Welcome to DlMonacoEditor!
// A drop-in replacement for DlCodeEditor with Monaco (VS Code's editor)

function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

const result = greet('World');
console.log(result);

// Features:
// - Full IntelliSense
// - Syntax highlighting for 50+ languages
// - Code folding
// - Find and replace
// - Minimap
// - And much more!
`)

        const languageOptions = [
            { label: 'JavaScript', value: 'javascript' },
            { label: 'TypeScript', value: 'typescript' },
            { label: 'Python', value: 'python' },
            { label: 'HTML', value: 'html' },
            { label: 'CSS', value: 'css' },
            { label: 'JSON', value: 'json' },
            { label: 'Markdown', value: 'markdown' },
            { label: 'SQL', value: 'sql' },
            { label: 'YAML', value: 'yaml' },
            { label: 'Shell', value: 'shell' }
        ]
        const selectedLanguage = ref(languageOptions[1])

        const themeOptions = [
            { label: 'Light', value: DlMonacoEditorTheme.Light },
            { label: 'Dark', value: DlMonacoEditorTheme.Dark },
            { label: 'VS', value: DlMonacoEditorTheme.VS },
            { label: 'VS Dark', value: DlMonacoEditorTheme.VS_DARK },
            { label: 'GitHub', value: DlMonacoEditorTheme.GITHUB },
            { label: 'GitHub Dark', value: DlMonacoEditorTheme.GITHUB_DARK },
            { label: 'Dracula', value: DlMonacoEditorTheme.DRACULA }
        ]
        const selectedTheme = ref(themeOptions[1])

        const showLineNumbers = ref(true)
        const showMinimap = ref(true)
        const readonly = ref(false)
        const bordered = ref(true)

        const editorOptions = computed(() => ({
            lineNumbers: showLineNumbers.value,
            minimap: showMinimap.value,
            fontSize: 14,
            tabSpaces: 4
        }))

        const onCodeChange = (newCode: string) => {
            console.log('Code changed, length:', newCode.length)
        }

        const onSave = (content: string) => {
            console.log('Save triggered (Ctrl+S)')
            alert('Save triggered! Check console for content.')
        }

        const usageExample = `<!-- Before (DlCodeEditor) -->
<dl-code-editor
    v-model="code"
    language="typescript"
    theme="atom-one-dark"
    :options="{ lineNumbers: true }"
/>

<!-- After (DlMonacoEditor) - Same API! -->
<dl-monaco-editor
    v-model="code"
    language="typescript"
    theme="atom-one-dark"
    :options="{ lineNumbers: true }"
/>`

        return {
            code,
            languageOptions,
            selectedLanguage,
            themeOptions,
            selectedTheme,
            showLineNumbers,
            showMinimap,
            readonly,
            bordered,
            editorOptions,
            onCodeChange,
            onSave,
            usageExample
        }
    }
})
</script>

<style scoped lang="scss">
.monaco-editor-demo {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;

    h2 {
        margin-bottom: 8px;
        color: var(--dl-color-darker);
    }

    .demo-description {
        color: var(--dl-color-medium);
        margin-bottom: 20px;
    }

    .controls {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
        align-items: center;
        flex-wrap: wrap;
    }

    .editor-container {
        margin-bottom: 30px;
        width: 100%;
    }

    .comparison {
        background: var(--dl-color-bg);
        padding: 20px;
        border-radius: 4px;
        border: 1px solid var(--dl-color-separator);

        h3 {
            margin: 0 0 12px 0;
            color: var(--dl-color-darker);
        }

        p {
            margin: 0 0 12px 0;
            color: var(--dl-color-medium);

            code {
                background: var(--dl-color-panel-background);
                padding: 2px 6px;
                border-radius: 3px;
                font-family: monospace;
            }
        }

        .code-example {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 16px;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 13px;
            line-height: 1.5;
            margin: 0;
        }
    }
}
</style>
