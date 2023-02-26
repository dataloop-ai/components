<template>
    <div class="json-editor-layout">
        <dl-dialog-box
            :model-value="modelValue"
            :width="800"
        >
            <template #header>
                <dl-dialog-box-header
                    title="DQL Search"
                    :close-button="true"
                    style="font-weight: 200"
                    @onClose="$emit('update:modelValue', false)"
                />
            </template>
            <template #body>
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
                    <dl-typography
                        style="margin-top: 5px"
                        variant="p"
                        color="red"
                    >
                        {{ message }}
                    </dl-typography>
                </div>
            </template>
            <template #footer>
                <div class="footer-menu">
                    <div class="footer-delete">
                        <dl-button
                            :disabled="deleteButtonState"
                            icon="icon-dl-delete"
                            label="Delete Query"
                            flat
                            color="secondary"
                            @click="$emit('remove', activeQuery)"
                        />
                    </div>
                    <div class="footer-save">
                        <dl-button
                            :disabled="message !== ''"
                            outlined
                            label="Save As"
                            @click="save"
                        />
                        <dl-button
                            :disabled="message !== ''"
                            label="Search"
                            @click="$emit('search', activeQuery)"
                        />
                    </div>
                </div>
            </template>
        </dl-dialog-box>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { JSONEditor, JSONValue, Mode } from 'vanilla-jsoneditor'
import { debounce } from 'lodash'
import { Query } from './types'
import DlDialogBox from '../DlDialogBox/DlDialogBox.vue'
import DlDialogBoxHeader from '../DlDialogBox/DlDialogBoxHeader.vue'
import DlSelect from '../DlSelect/DlSelect.vue'
import DlButton from '../DlButton/DlButton.vue'
import DlTypography from '../DlTypography.vue'

interface JSONContent {
    json: JSONValue
    text: string
}

export default defineComponent({
    components: {
        DlDialogBox,
        DlDialogBoxHeader,
        DlSelect,
        DlButton,
        DlTypography
    },
    props: {
        modelValue: { type: Boolean, default: false },
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
        }
    },
    emits: ['update:modelValue', 'save', 'remove'],
    data() {
        return {
            preventOnChange: false,
            preventUpdate: false,
            jsonEditor: {} as JSONEditor,
            activeQuery: this.query,
            selectedOption: {
                label: this.query?.name,
                value: this.query?.query
            },
            message: ''
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
        },
        deleteButtonState(): boolean {
            return !this.queries.filter(
                (q: Query) => q.name === this.activeQuery?.name
            ).length
        }
    },
    watch: {
        modelValue(value) {
            this.$nextTick(() => {
                if (value) this.initJsonEditor()
                else this.jsonEditor?.destroy()
                this.activeQuery = this.query
            })
        },
        queries() {
            this.resetEditor()
        },
        query(val) {
            this.$nextTick(() => {
                if (val.name === 'New Query') return
                this.selectedOption = {
                    label: val.name,
                    value: val.query
                }
                if (val.query && this.jsonEditor.set) {
                    this.jsonEditor.set({
                        text: val.query
                    })
                }
                this.alignText()
            })
        },
        activeQuery(val) {
            try {
                if (val.query) JSON.parse(val.query)
                this.message = ''
            } catch {
                this.message = 'Invalid Query.'
            }
        }
    },
    mounted() {
        this.initJsonEditor()
    },
    methods: {
        updateActiveQuery(option: Record<string, string>) {
            this.activeQuery = {
                name: option.label,
                query: option.value
            }
            this.jsonEditor?.destroy()
            this.initJsonEditor()
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
        },
        save() {
            this.$emit(
                'save',
                this.activeQuery
                    ? this.activeQuery
                    : {
                          name: 'New Query',
                          query: (this.jsonEditor?.get() as any).text || ''
                      }
            )
        }
    }
})
</script>

<style lang="scss">
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

.footer-save button {
    margin: 0px 10px;
}

.footer-menu {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
</style>
