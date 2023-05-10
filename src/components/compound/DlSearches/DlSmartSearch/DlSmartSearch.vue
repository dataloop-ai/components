<template>
    <div
        :class="identifierClass"
        class="dl-smart-search"
        :style="cssVars"
    >
        <div
            ref="inputWrapper"
            class="dl-smart-search__input-wrapper"
        >
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
                :search-bar-width="searchBarWidth"
                :default-width="width"
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
                    size="l"
                    :disabled="disabled"
                    @click="emitSearchQuery"
                />
            </div>

            <dl-button
                class="dl-smart-search__buttons--filters"
                text-color="dl-color-secondary"
                flat
                size="s"
            >
                Saved Filters
                <dl-menu
                    v-model="filtersModel"
                    :offset="[0, 5]"
                    anchor="bottom middle"
                    self="top middle"
                >
                    <dl-smart-search-filters
                        :filters="filters"
                        @filters-search="emitFiltersSearch"
                        @filters-save="emitFiltersSave"
                        @filters-delete="emitFiltersDelete"
                    />
                </dl-menu>
            </dl-button>
        </div>
        <dl-json-editor
            :model-value="jsonEditorModel"
            :query="activeQuery"
            :queries="filters.saved"
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
import DlSmartSearchFilters from './components/DlSmartSearchFilters.vue'
import { DlJsonEditor } from '../../DlJsonEditor'
import { DlDialogBox, DlDialogBoxHeader } from '../../DlDialogBox'
import { DlInput } from '../../DlInput'
import { DlTypography, DlMenu } from '../../../essential'
import { DlButton } from '../../../basic'
import {
    useSuggestions,
    Schema,
    Alias,
    removeBrackets
} from '../../../../hooks/use-suggestions'
import { Filters, Query, ColorSchema, SearchStatus } from './types'
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
        DlInput,
        DlSmartSearchFilters,
        DlMenu
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
            type: Array as PropType<Filters[]>,
            default: () => [] as Filters[]
        },
        disabled: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: '450px'
        }
    },
    emits: ['save-query', 'remove-query', 'search-query'],
    setup(props) {
        const inputModel = ref('')
        const jsonEditorModel = ref(false)
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
            currentTab,
            searchBarWidth,
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
        cssVars(): Record<string, string> {
            return {
                '--dl-search-max-width': this.isFocused ? '100%' : this.width
            }
        },
        defineStyleModel(): object {
            return createColorSchema(this.colorSchema, this.aliases)
        },
        computedStatus(): SearchStatus {
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
        },
        stringQuery() {
            return this.isQuerying || this.inputModel === ''
                ? this.activeQuery.name
                : this.inputModel
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
    mounted() {
        const observer = new ResizeObserver((entries) => {
            this.searchBarWidth = `${entries[0].contentRect.width}px`
        })
        observer.observe(this.$refs.inputWrapper as HTMLElement)
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
            this.$emit('search-query', this.activeQuery, this.stringQuery)
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
        emitFiltersSave(currentTab: string, query: Query) {
            this.activeQuery = query
            this.currentTab = currentTab
            this.saveQueryDialogBoxModel = true
            this.filtersModel = false
        },
        emitFiltersDelete(currentTab: string, query: Query) {
            this.activeQuery = query
            this.currentTab = currentTab
            this.removeQueryDialogBoxModel = true
            this.filtersModel = false
        },
        emitFiltersSearch(currentTab: string, query: Query) {
            console.log('dsn')
            this.activeQuery = query
            this.currentTab = currentTab
            this.emitSearchQuery()
            this.filtersModel = false
        },
        emitSearchQuery() {
            this.$emit('search-query', this.activeQuery, this.stringQuery)
        },
        emitRemoveQuery() {
            if (!this.activeQuery) return
            this.$emit(
                'remove-query',
                this.activeQuery,
                this.currentTab,
                this.inputModel
            )
            this.removeQueryDialogBoxModel = false
        },
        emitSaveQuery() {
            if (!this.activeQuery) return
            if (this.newQueryName !== '')
                this.activeQuery.name = this.newQueryName
            this.$emit('save-query', { ...this.activeQuery }, this.currentTab)
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

    &__inner {
        display: flex;
        height: 28px;
    }

    &__input-wrapper {
        flex-grow: 1;
        width: 100%;
        max-width: var(--dl-search-max-width);
        transition: max-width 0.3s ease-out;
    }

    &__buttons {
        margin: 2px 5px;
        display: flex;
        align-items: center;
        &--filters {
            min-width: fit-content;
            border: 1px solid var(--dl-color-secondary);
            border-radius: 3px;
            box-sizing: border-box;
            display: flex;
            margin: 0px 5px;
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

    &__search-label {
        font-size: 10px;
        margin-left: 4px;
        margin-top: 4px;
        color: gray;
        position: relative;
        word-break: break-all;
    }
}
</style>
