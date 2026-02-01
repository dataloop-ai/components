<template>
    <div ref="jsonEditorRef" class="json-editor" />
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    onMounted,
    PropType,
    ref,
    toRefs,
    watch,
    nextTick
} from 'vue-demi'
import {
    Content,
    ContentParseError,
    JSONEditor,
    JSONEditorPropsOptional,
    Mode,
    OnChangeStatus,
    TextContent
} from 'vanilla-jsoneditor'
import { debounce } from 'lodash'
import { stateManager } from '../../../StateManager'

export default defineComponent({
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        /**
         * The string to display and modify as JSON
         */
        modelValue: {
            required: false,
            type: String,
            default: '{}'
        },
        indentation: {
            required: false,
            type: Number,
            default: 2
        },
        readonly: {
            required: false,
            type: Boolean,
            default: false
        },
        mode: {
            required: false,
            type: String as PropType<Mode>,
            default: Mode.text
        }
    },
    emits: [
        'update:model-value',
        'align-text',
        'change',
        'content-error',
        'focus',
        'blur'
    ],
    setup(props, { emit }) {
        const { modelValue, indentation, readonly, mode } = toRefs(props)

        const jsonEditorRef = ref(null)
        const jsonEditor = ref<JSONEditor>(null as any)
        const innerUpdate = ref(false)

        watch(modelValue, (val) => {
            if (innerUpdate.value) {
                innerUpdate.value = false
                return
            }

            jsonEditor.value?.set({
                text: val
            })
        })

        watch(mode, (val) => {
            jsonEditor.value?.updateProps({
                mode: val,
                readOnly: val === Mode.tree
            })
        })

        const handleJSONChange = (
            content: Content,
            previousContent: Content,
            status: OnChangeStatus
        ) => {
            if (
                status.contentErrors &&
                (status.contentErrors as ContentParseError).isRepairable !==
                    undefined
            ) {
                if (!(status.contentErrors as ContentParseError).isRepairable) {
                    stateManager.logger.warn(
                        '[DlJsonEditor] Failed to parse JSON'
                    )
                }
                emit('content-error')
                return
            }

            if (
                (content as TextContent).text ===
                (previousContent as TextContent).text
            ) {
                return
            }

            innerUpdate.value = true
            emit('update:model-value', (content as TextContent).text)
            emit('change', (content as TextContent).text)
        }

        const debouncedHandleJSONChange = computed(() => {
            if (stateManager.disableDebounce) {
                return handleJSONChange
            }
            return debounce(handleJSONChange, 100)
        })

        const initJsonEditor = () => {
            const initialAttrs: JSONEditorPropsOptional = {
                onChange: debouncedHandleJSONChange.value,
                indentation: indentation.value,
                mode: mode.value,
                readOnly: readonly.value || mode.value === Mode.tree,
                mainMenuBar: false,
                navigationBar: false,
                statusBar: false,
                onFocus: () => {
                    emit('focus')
                },
                onBlur: () => {
                    emit('blur')
                }
            }

            // There is type instantiation issue with JSONEditor,
            // it gives excessively deep and possibly infinite error
            // @ts-ignore
            jsonEditor.value = new JSONEditor({
                target: jsonEditorRef.value
                    ? (jsonEditorRef.value as Element)
                    : document.createElement('div'),
                props: initialAttrs
            })

            jsonEditor.value?.set({
                text: modelValue.value
            })

            nextTick(() => {
                jsonEditor.value?.refresh()
            })
        }

        watch(readonly, (val) => {
            jsonEditor.value?.updateProps({
                readOnly: val || mode.value === Mode.tree
            })
        })

        const format = () => {
            try {
                const parsed = JSON.parse(modelValue.value)
                const formatted = JSON.stringify(
                    parsed,
                    null,
                    indentation.value
                )
                jsonEditor.value?.set({
                    text: formatted
                })
                emit('align-text')
            } catch (e) {
                stateManager.logger.warn(
                    '[DlJsonEditor] Failed to format document',
                    e
                )
                return
            }
        }

        onMounted(() => {
            initJsonEditor()
            emit('align-text')
        })

        const toObject = (): Object | null => {
            try {
                const parsed = JSON.parse(modelValue.value)
                return parsed
            } catch (e) {
                stateManager.logger.warn(
                    '[DlJsonEditor] Failed to format document',
                    e
                )
                return null
            }
        }

        return {
            jsonEditorRef,
            format,
            toObject,
            content: modelValue.value
        }
    }
})
</script>

<style lang="scss" scoped>
.json-editor {
    width: 100%;
    height: 100%;

    --jse-text-color: var(--dl-color-tooltip-background);
    --jse-delimiter-color: var(--dl-color-tooltip-background);
    --jse-key-color: var(--dl-json-editor-key-color);
    --jse-background-color: var(--dl-json-editor-background-color);
    --jse-value-color-boolean: var(--dl-json-editor-value-color-boolean);
    --jse-value-color-string: var(--dl-json-editor-value-color-string);
    --jse-value-color-number: var(--dl-json-editor-value-color-number);
    --jse-panel-background: var(--dl-json-editor-panel-background);
    --jse-panel-border: var(--dl-color-separator);
    --jse-main-border: 1px solid var(--dl-color-separator);
    --jse-error-color: var(--dell-red-500, #af0000);
    --jse-message-error-background: var(--jse-error-color);
    --jse-message-error-color: var(--dell-white, #fff);

    .jse-error {
        display: none !important;
    }
    .cm-gutters {
        display: none !important;
    }
}
</style>
