<template>
    <div
        :class="identifierClass"
        class="dl-smart-search"
        :style="cssVars"
    >
        <div class="dl-smart-search__input-wrapper">
            <dl-smart-search-input
                :status="computedStatus"
                :style-model="defineStyleModel"
                :with-save-button="true"
                :with-search-icon="true"
                :with-screen-button="true"
                :disabled="disabled"
                :model-value="inputModel"
                :expanded-input-height="expandedInputHeight"
                :suggestions="suggestions"
                @save="saveQueryDialogBoxModel = true"
                @focus="setFocused"
                @update:modelValue="handleInputModel"
                @dql-edit="jsonEditorModel = !jsonEditorModel"
            />
        </div>
        <div class="dl-smart-search__buttons">
            <div class="dl-smart-search__search-btn-wrapper">
                <dl-button
                    icon="icon-dl-search"
                    size="m"
                    :disabled="disabled"
                    @click="emitSearchQuery"
                />
            </div>
        </div>
        <dl-json-editor
            :model-value="jsonEditorModel"
            :query="activeQuery"
            :queries="savedQueries"
            @update:modelValue="jsonEditorModel = $event"
            @save="saveQueryDialogBoxModel = true"
            @remove="handleQueryRemove"
            @search="handleQuerySearchEditor"
        />
        <dl-dialog-box v-model="removeQueryDialogBoxModel">
            <template #header>
                <dl-dialog-box-header
                    title="Delete Query"
                    @onClose="removeQueryDialogBoxModel = false"
                />
            </template>
            <template #body>
                <dl-typography
                    size="h3"
                    style="display: flex; justify-content: center"
                >
                    Are you sure you want to delete {{ activeQuery.name }}?
                </dl-typography>
            </template>
            <template #footer>
                <div class="full-width flex justify-end">
                    <dl-button @click="emitRemoveQuery">
                        Delete
                    </dl-button>
                </div>
            </template>
        </dl-dialog-box>
        <dl-dialog-box v-model="saveQueryDialogBoxModel">
            <template #header>
                <dl-dialog-box-header
                    title="Save Query"
                    @onClose="saveQueryDialogBoxModel = false"
                />
            </template>
            <template #body>
                <dl-input
                    v-model="newQueryName"
                    style="text-align: center"
                    placeholder="Type query name"
                />
            </template>
            <template #footer>
                <div class="dl-smart-search__buttons--save">
                    <dl-button @click="handleSaveQuery">
                        Save
                    </dl-button>
                    <dl-button
                        padding="10px"
                        @click="handleSaveQuery(true)"
                    >
                        Save and Search
                    </dl-button>
                </div>
            </template>
        </dl-dialog-box>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue-demi'
import DlSmartSearchInput from './components/DlSmartSearchInput.vue'
import { DlJsonEditor } from '../../DlJsonEditor'
import { DlDialogBox, DlDialogBoxHeader } from '../../DlDialogBox'
import { DlInput } from '../../DlInput'
import { DlTypography } from '../../../essential'
import { DlButton } from '../../../basic'
import {
    useSuggestions,
    Schema,
    Alias,
    removeBrackets
} from '../../../../hooks/use-suggestions'
import { Filter, Query, ColorSchema, SearchStatus } from './types'
import {
    replaceAliases,
    replaceWithJsDates,
    createColorSchema
} from './utils/utils'
import { v4 } from 'uuid'
import { parseSmartQuery } from '../../../../utils'

export default defineComponent({
    components: {
        DlSmartSearchInput,
        DlDialogBox,
        DlDialogBoxHeader,
        DlJsonEditor,
        DlButton,
        DlTypography,
        DlInput
    },
    props: {
        status: {
            type: Object as PropType<SearchStatus>,
            default: () => ({ type: 'info', message: '' })
        },
        schema: {
            type: Object as PropType<Schema>,
            default: () => {}
        },
        aliases: {
            type: Array as PropType<Alias[]>,
            default: () => [] as Alias[]
        },
        colorSchema: {
            type: Object as PropType<ColorSchema>,
            default: () => ({
                fields: 'blue',
                operators: 'darkgreen',
                keywords: 'bold'
            })
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        expandedInputHeight: {
            type: String,
            default: '327px'
        },
        savedFilterKey: {
            type: String,
            default: 'saved'
        },
        filters: {
            type: Array as PropType<Filter[]>,
            default: () => [] as Filter[]
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    emits: ['save-query', 'remove-query', 'search-query'],
    setup(props) {
        const inputModel = ref('')
        const jsonEditorModel = ref(false)

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

        let oldInputQuery = ''

        const { suggestions, error, findSuggestions } = useSuggestions(
            props.schema,
            props.aliases
        )

        const handleInputModel = (value: string) => {
            inputModel.value = value
            const json = JSON.stringify(toJSON(removeBrackets(value)))
            activeQuery.value.query = replaceAliases(json, props.aliases)
            findSuggestions(value)
            isQuerying.value = false
            oldInputQuery = value
        }

        const toJSON = (value: string) => {
            return parseSmartQuery(
                replaceWithJsDates(value) ?? inputModel.value
            )
        }

        const setFocused = (value: boolean) => {
            isFocused.value = value
            findSuggestions(inputModel.value)

            if (value) {
                inputModel.value = oldInputQuery
                isQuerying.value = false
            }
            if (!value && !error) {
                toJSON(inputModel.value)
            }
        }

        return {
            uuid: `dl-smart-search-${v4()}`,
            inputModel,
            jsonEditorModel,
            activeQuery,
            filtersModel,
            removeQueryDialogBoxModel,
            saveQueryDialogBoxModel,
            suggestions,
            error,
            newQueryName,
            isFocused,
            isQuerying,
            handleInputModel,
            setFocused,
            findSuggestions,
            toJSON
        }
    },
    computed: {
        identifierClass(): string {
            return `dl-smart-search`
        },
        savedQueries(): Query[] {
            return (
                this.filters.find(
                    (filter: Filter) => filter.name === this.savedFilterKey
                ) || {
                    queries: []
                }
            ).queries
        },
        cssVars(): Record<string, string> {
            return {
                '--dl-search-max-width': this.isFocused ? '100%' : '450px'
            }
        },
        defineStyleModel(): object {
            return createColorSchema(this.colorSchema, this.aliases)
        },
        computedStatus(): SearchStatus {
            if (this.isFocused) return
            if (this.isQuerying) return
            if (!this.error && this.inputModel !== '') {
                return {
                    type: 'success',
                    message: ''
                }
            } else if (this.error === 'warning') {
                return {
                    type: 'warning',
                    message: 'The query is not supported technically.'
                }
            } else if (this.inputModel === '') {
                return this.status
            }
            return {
                type: 'error',
                message: this.error
            }
        }
    },
    watch: {
        isLoading(val) {
            this.inputModel = `Query "${this.activeQuery.name}" ${
                val ? 'is running' : ''
            }`
            this.isQuerying = true
        }
    },
    methods: {
        handleQueryRemove(query: Query) {
            this.filtersModel = false
            this.activeQuery = query
            this.removeQueryDialogBoxModel = true
        },
        handleQuerySearchEditor(query: Query) {
            this.filtersModel = false
            this.activeQuery = query
            this.$emit('search-query', this.activeQuery)
        },
        handleSaveQuery(performSearch: boolean) {
            if (performSearch) {
                this.emitSaveQuery()
                this.emitSearchQuery()
                this.jsonEditorModel = false
            } else {
                this.emitSaveQuery()
            }
        },
        emitSearchQuery() {
            this.$emit('search-query', this.activeQuery)
        },
        emitRemoveQuery() {
            if (!this.activeQuery) return
            this.$emit('remove-query', this.activeQuery)
            this.removeQueryDialogBoxModel = false
        },
        emitSaveQuery() {
            if (!this.activeQuery) return
            if (this.newQueryName !== '')
                this.activeQuery.name = this.newQueryName
            this.$emit('save-query', { ...this.activeQuery })
            this.saveQueryDialogBoxModel = false
            this.newQueryName = ''
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-smart-search {
    display: flex;
    width: 100%;

    &__input-wrapper {
        width: 100%;
        max-width: var(--dl-search-max-width);
        transition: max-width 0.3s ease-out;
    }

    &__buttons {
        display: flex;
        margin: 0px 5px;
        align-items: flex-start;

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

        ::v-deep .dl-button {
            padding: 4px;
        }
    }

    &__filters-btn-wrapper {
        display: flex;
        align-items: center;

        ::v-deep .dl-button {
            padding: 0;
            font-size: 12px;
            width: 110px;
        }
    }
}
</style>
