<template>
    <div class="json-editor-layout">
        <div class="json-query">
            <div class="json-query-menu">
                <dl-select
                    :model-value="selectedOption"
                    width="200px"
                    :options="selectOptions"
                    placeholder="New Query"
                    @update:model-value="updateActiveQuery"
                />
                <dl-button
                    icon="icon-dl-align-left"
                    label="Align Left"
                    flat
                    color="secondary"
                    @click="alignText"
                />
            </div>
            <div
                ref="jsonEditorRef"
                class="json-editor"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { JSONEditor, JSONValue, Mode } from 'vanilla-jsoneditor'
import { debounce } from 'lodash'
import { Query } from './types'
import { DlSelect } from '../DlSelect'
import { DlButton } from '../../basic'

interface JSONContent {
    json: JSONValue
    text: string
}

export default defineComponent({
    components: {
        DlSelect,
        DlButton
    },
    props: {
        query: {
            type: Object as PropType<Query>,
            default: () =>
                ({
                    name: 'New Query',
                    query: null
                } as Query)
        },
        queries: {
            type: Array as PropType<Query[]>,
            default: () => [] as Query[]
        },
        newQuery: {
            type: String,
            default: null
        }
    },
    emits: ['update-json-query', 'update-query', 'update-new-query'],
    data() {
        return {
            preventOnChange: false,
            preventUpdate: false,
            jsonEditor: {} as JSONEditor,
            activeQuery: this.query,
            selectedOption: {
                label: this.query?.name,
                value: this.query?.query
            }
        }
    },
    computed: {
        selectOptions(): Record<string, string>[] {
            return [
                {
                    label: 'New Query',
                    value: ''
                },
                ...this.queries.map((q: Query) => ({
                    label: q.name,
                    value: q.query
                }))
            ]
        }
    },
    watch: {
        queries() {
            this.resetEditor()
        },
        activeQuery(val) {
            if (!this.preventUpdate) {
                this.$emit('update-query', val)
                this.setJsonText(val)
            }
            this.$emit('update-json-query', val)
            this.preventUpdate = false
        }
    },
    mounted() {
        this.initJsonEditor()
    },
    methods: {
        updateActiveQuery(option: Record<string, string>) {
            this.preventUpdate = true
            this.activeQuery = {
                name: option.label,
                query: option.value
            }
            this.jsonEditor?.destroy()
            this.initJsonEditor()
            this.setJsonText(this.activeQuery)
        },
        alignText() {
            if (!(this.jsonEditor.get && this.jsonEditor.get())) return
            try {
                const parsed = JSON.parse(
                    (
                        this.jsonEditor.get &&
                        (this.jsonEditor?.get() as JSONContent)
                    )?.text
                )
                const newText = JSON.stringify(parsed, null, 2)
                this.jsonEditor?.set({ text: newText })
            } catch (error) {}
        },
        resetEditor() {
            if (this.jsonEditor.set) {
                this.jsonEditor.set({
                    text: '{}'
                })
            }
            this.selectedOption = {
                label: 'New Query',
                value: ''
            }
        },
        setJsonText(val: Query) {
            this.jsonEditor?.set({
                text: val.query || this.newQuery
            })
            if (!val.query) this.activeQuery.query = this.newQuery
            this.alignText()
            this.selectedOption = {
                label: val.name,
                value: val.query
            }
        },
        initJsonEditor() {
            const initialAttrs: any = {
                onChange: debounce(
                    (updatedContent: { text: string; json: any }) => {
                        if (this.preventOnChange) {
                            this.preventOnChange = false
                            return
                        }
                        this.activeQuery = {
                            name: this.activeQuery
                                ? this.activeQuery.name
                                : 'New Query',
                            query: updatedContent.text
                        }
                        this.$emit('update-new-query', updatedContent.text)
                        this.preventUpdate = true
                    },
                    100
                ),
                mode: Mode.text,
                mainMenuBar: false,
                navigationBar: false,
                statusBar: false,
                ...(this.activeQuery !== undefined && {
                    content: {
                        text: this.activeQuery?.query
                            ? this.activeQuery.query
                            : '{}'
                    }
                })
            }

            // There is type instantiation issue with JSONEditor,
            // it gives excessively deep and possibly infinite error
            // @ts-ignore
            this.jsonEditor = new JSONEditor({
                target: this.$refs.jsonEditorRef
                    ? (this.$refs.jsonEditorRef as Element)
                    : document.createElement('div'),
                props: initialAttrs
            })
            this.alignText()
        }
    }
})
</script>

<style lang="scss" scoped>
.json-editor {
    --jse-text-color: var(--dl-color-tooltip-background);
    --jse-delimiter-color: var(--dl-color-tooltip-background);
    --jse-key-color: var(--dl-color-negative);
    --jse-background-color: var(--dl-color-tooltip-text);
    --jse-value-color-boolean: #ae6307;
    --jse-value-color-string: #337433;
    .jse-error {
        display: none !important;
    }
    .cm-gutters {
        display: none !important;
    }
}

.json-query-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
</style>
