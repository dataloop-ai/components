<template>
    <div class="dl-smart-search" :style="cssVars">
        <div ref="inputWrapper" class="dl-smart-search__input-wrapper">
            <dl-smart-search-input
                ref="smartSearchInput"
                v-model="queryObject"
                style="margin-bottom: 0px"
                :width="width"
                :status="status"
                :aliases="aliases"
                :schema="schema"
                :color-schema="colorSchema"
                :strict="strict"
                :placeholder="placeholder"
                :disabled="disabled"
                @focus="isFocused = true"
                @blur="isFocused = false"
                @search="emitSearchQuery"
                @error="$emit('error', $event)"
                @clear="$emit('clear')"
            />
        </div>
        <div class="dl-smart-search__buttons">
            <slot name="buttons">
                <div style="display: flex; align-items: center">
                    <div
                        style="height: 28px"
                        class="dl-smart-search__search-btn-wrapper"
                    >
                        <dl-button
                            label="Search"
                            :styles="{
                                height: '28px'
                            }"
                            :disabled="disabled"
                            @click="$emit('search', queryObject)"
                        />
                    </div>
                    <div
                        style="height: 28px"
                        class="dl-smart-search__search-btn-wrapper"
                    >
                        <dl-button
                            label="DQL Editor"
                            :styles="{
                                height: '28px',
                                'min-width': 'max-content'
                            }"
                            :disabled="disabled"
                            flat
                            text-color="var(--dl-color-darker)"
                            color="var(--dl-color-darker)"
                            @click="showJSONEditor = true"
                        />
                    </div>

                    <slot name="extra-actions" />
                </div>
            </slot>
        </div>
        <dl-smart-search-json-editor-dialog
            v-model="showJSONEditor"
            :json="modelValue"
            :options="selectOptions"
            @search="handleJSONSearch"
            @change="handleJSONChange"
        />
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, computed, toRefs } from 'vue-demi'
import { DlButton } from '../../../basic'
import { DlSmartSearchInput, DlSmartSearchJsonEditorDialog } from './components'
import { Schema, Alias } from '../../../../hooks/use-suggestions'
import { ColorSchema, SearchStatus, DlSmartSearchFilter } from './types'
import { v4 } from 'uuid'
import { stateManager } from '../../../../StateManager'

export default defineComponent({
    components: {
        DlSmartSearchInput,
        DlSmartSearchJsonEditorDialog,
        DlButton
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        },
        status: {
            type: Object as PropType<SearchStatus>,
            default: () => ({ type: 'info', message: '' })
        },
        schema: {
            type: Object as PropType<Schema>,
            default: () => ({})
        },
        aliases: {
            type: Array as PropType<Alias[]>,
            default: () => [] as Alias[]
        },
        colorSchema: {
            type: Object as PropType<ColorSchema>,
            default: () => ({
                fields: 'var(--dl-color-secondary)',
                operators: 'var(--dl-color-positive)',
                keywords: 'var(--dl-color-medium)'
            })
        },
        filters: {
            type: Array as PropType<DlSmartSearchFilter[]>,
            default: () => [] as DlSmartSearchFilter[]
        },
        disabled: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: '250px'
        },
        /**
         * If true, the validation will be a closed set based on the schema provided
         */
        strict: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: ''
        }
    },
    emits: [
        'save-filter',
        'remove-filter',
        'update:model-value',
        'search',
        'error',
        'clear'
    ],
    setup(props, { emit }) {
        //#region props
        const { modelValue, filters, width } = toRefs(props)
        //#endregion

        //#region data
        // todo: more cleanup
        const inputModel = ref('')
        const jsonEditorModel = ref(false)
        const showJSONEditor = ref(false)
        const searchBarWidth = ref('100%')

        const activeQuery = ref({
            name: 'New Query',
            query: ''
        })
        const filtersModel = ref(false)
        const removeQueryDialogBoxModel = ref(false)
        const saveQueryDialogBoxModel = ref(false)
        const newQueryName = ref('')
        const isFocused = ref(false)
        const isQuerying = ref(false)
        const currentTab = ref('saved')
        const oldInputQuery = ref('')
        const jsonEditorQuery = ref('{}')
        const newQuery = ref('')
        const preventUpdate = ref(false)
        const selectedOption = ref({
            label: 'New Query',
            value: ''
        })
        //#endregion

        //#region computed
        const cssVars = computed(() => ({
            '--dl-smart-search-max-width': isFocused.value
                ? '100%'
                : width.value
        }))

        const queryObject = computed({
            get() {
                return modelValue.value
            },
            set(val) {
                emit('update:model-value', val)
            }
        })

        const selectOptions = computed<DlSmartSearchFilter[]>(
            () => filters.value ?? []
        )
        //#endregion

        //#region methods
        const toObject = (query: string) => {
            if (typeof query !== 'string') {
                return query
            }

            try {
                return JSON.parse(query)
            } catch (e) {
                stateManager.logger.warn(
                    'DlSmartSearch - Invalid JSON in DQL Editor',
                    e
                )
                return null
            }
        }

        const emitSearchQuery = (value?: { [key: string]: any }) => {
            emit('search', value ?? queryObject.value)
        }

        const handleJSONSearch = (query: string) => {
            const json = toObject(query)
            if (!json) return
            queryObject.value = json
            emitSearchQuery(json)
        }

        const handleJSONChange = (val: string) => {
            const json = toObject(val)
            if (!json) return
            queryObject.value = json
        }
        //#endregion

        return {
            uuid: `dl-smart-search-${v4()}`,
            queryObject,
            inputModel,
            jsonEditorModel,
            activeQuery,
            filtersModel,
            removeQueryDialogBoxModel,
            saveQueryDialogBoxModel,
            newQueryName,
            isFocused,
            isQuerying,
            currentTab,
            searchBarWidth,
            oldInputQuery,
            jsonEditorQuery,
            newQuery,
            preventUpdate,
            selectedOption,
            cssVars,
            selectOptions,
            emitSearchQuery,
            showJSONEditor,
            handleJSONSearch,
            handleJSONChange
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-smart-search {
    display: flex;
    width: 100%;
    align-items: center;
    /* Margin for the absolute text */
    margin-bottom: 15px;

    &__inner {
        display: flex;
        height: 28px;
    }

    &__input-wrapper {
        flex-grow: 1;
        width: 100%;
        max-width: var(--dl-smart-search-max-width);
        transition: max-width 0.3s ease-out;
    }

    &__buttons {
        display: flex;
        align-items: center;
        height: 100%;
        margin-left: 8px;
        &--filters {
            min-width: fit-content;
            border-radius: 3px;
            box-sizing: border-box;
            display: flex;
            margin: 0px 8px 0px 16px;
        }
        &--save {
            display: flex;
            width: 100%;
            justify-content: flex-end;
            align-items: center;
        }
        &--save > * {
            margin: 0px 10px;
        }
    }

    &__search-btn-wrapper {
        display: flex;
        align-items: center;
    }
}
.json-editor__footer {
    &-menu {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    &-delete {
        align-items: center;
        display: flex;
        & > * {
            margin-bottom: 6px;
        }
    }
}
.json-query {
    height: 100%;
}
.json-editor-layout {
    height: 90%;
}
.json-query-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
</style>
