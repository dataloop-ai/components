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
                @update:modelValue="debouncedInputModel"
                @dql-edit="jsonEditorModel = !jsonEditorModel"
            />
        </div>
        <div class="dl-smart-search__buttons">
            <div
                style="height: 28px"
                class="dl-smart-search__search-btn-wrapper"
            >
                <dl-button
                    icon="icon-dl-search"
                    :styles="{
                        height: '28px'
                    }"
                    :disabled="disabled"
                    @click="emitSearchQuery"
                />
            </div>

            <dl-button
                class="dl-smart-search__buttons--filters"
                shaded
                outlined
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
                        @filters-select="handleFiltersSelect"
                        @filters-delete="handleFiltersDelete"
                    />
                </dl-menu>
            </dl-button>
        </div>
        <dl-dialog-box
            v-model="jsonEditorModel"
            :height="500"
            :width="800"
            style="--dl-dialog-box-footer-padding: 10px 16px"
        >
            <template #header>
                <dl-dialog-box-header
                    title="DQL Search"
                    :close-button="true"
                    style="font-weight: 200"
                    @onClose="handleJsonEditorClose"
                />
            </template>
            <template #body>
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
                                padding="0px 3px"
                                @click="alignJsonText"
                            />
                        </div>
                        <dl-json-editor
                            v-model="jsonEditorQuery"
                            :prevent-update="preventUpdate"
                            @update-prevent="(val) => (preventUpdate = val)"
                            @align-text="alignJsonText"
                        />
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="json-editor__footer-menu">
                    <div class="json-editor__footer-delete">
                        <dl-button
                            :disabled="deleteButtonState"
                            icon="icon-dl-delete"
                            label="Delete Query"
                            flat
                            color="secondary"
                            padding="0"
                            @click="handleQueryRemove"
                        />
                    </div>
                    <div class="json-editor__footer-save">
                        <dl-button
                            style="margin-right: 14px"
                            outlined
                            label="Save As"
                            @click="saveQueryDialogBoxModel = true"
                        />
                        <dl-button
                            label="Search"
                            @click="handleJsonSearchButton"
                        />
                    </div>
                </div>
            </template>
        </dl-dialog-box>

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
        <dl-dialog-box
            v-model="saveQueryDialogBoxModel"
            style="--dl-dialog-box-footer-padding: 14px 17px"
        >
            <template #header>
                <dl-dialog-box-header
                    title="Save Query"
                    @onClose="saveQueryDialogBoxModel = false"
                />
            </template>
            <template #body>
                <dl-input
                    v-model="newQueryName"
                    title="Query name"
                    style="text-align: center"
                    placeholder="Type query name"
                />
            </template>
            <template #footer>
                <div class="dl-smart-search__buttons--save">
                    <dl-button
                        :disabled="!newQueryName"
                        outlined
                        @click="handleSaveQuery"
                    >
                        Save
                    </dl-button>
                    <dl-button
                        :disabled="!newQueryName"
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
import {
    defineComponent,
    PropType,
    ref,
    nextTick,
    toRef,
    onMounted,
    watch
} from 'vue-demi'
import { DlTypography, DlMenu } from '../../../essential'
import { DlButton } from '../../../basic'
import { DlSelect } from '../../DlSelect'
import { DlInput } from '../../DlInput'
import { DlDialogBox, DlDialogBoxHeader } from '../../DlDialogBox'
import { DlJsonEditor } from '../../DlJsonEditor'

import DlSmartSearchInput from './components/DlSmartSearchInput.vue'
import DlSmartSearchFilters from './components/DlSmartSearchFilters.vue'

import {
    useSuggestions,
    Schema,
    Alias,
    removeBrackets
} from '../../../../hooks/use-suggestions'
import { Filters, Query, ColorSchema, SearchStatus } from './types'
import {
    replaceWithAliases,
    revertAliases,
    replaceWithJsDates,
    createColorSchema
} from './utils/utils'
import { v4 } from 'uuid'
import { parseSmartQuery, stringifySmartQuery } from '../../../../utils'
import { debounce, isEqual } from 'lodash'

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
        DlMenu,
        DlSelect
    },
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
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
            type: Object as PropType<Filters>,
            default: () => ({} as Filters)
        },
        disabled: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: '450px'
        },
        /**
         * If true, the validation will be a closed set based on the schema provided
         */
        strict: {
            type: Boolean,
            default: false
        }
    },
    emits: ['save-query', 'remove-query', 'search-query', 'update:modelValue'],
    setup(props, { emit }) {
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
        const oldInputQuery = ref('')
        const jsonEditorQuery = ref('{}')
        const newQuery = ref('')
        const preventUpdate = ref(false)
        const selectedOption = ref({
            label: 'New Query',
            value: ''
        })

        const strictRef = toRef(props, 'strict')

        const { suggestions, error, findSuggestions } = useSuggestions(
            props.schema,
            props.aliases,
            { strict: strictRef }
        )

        const handleInputModel = (value: string) => {
            inputModel.value = value
            const json = toJSON(removeBrackets(value))
            if (!isEqual(json, props.modelValue)) {
                emit('update:modelValue', json)
            }
            const stringified = JSON.stringify(json)
            const newQuery = replaceWithAliases(stringified, props.aliases)
            activeQuery.value.query = newQuery
            nextTick(() => {
                findSuggestions(value)
            })
            isQuerying.value = false
            oldInputQuery.value = value
        }

        const debouncedInputModel = debounce(handleInputModel, 300)

        const isValidJSON = (item: string | Object): boolean => {
            let value = typeof item !== 'string' ? JSON.stringify(item) : item
            try {
                value = JSON.parse(value)
            } catch (e) {
                return false
            }

            return typeof value === 'object' && value !== null
        }

        const toJSON = (value: string) => {
            const json = parseSmartQuery(
                replaceWithJsDates(value) ?? inputModel.value
            )

            return isValidJSON(json) ? json : inputModel.value
        }

        const setFocused = (value: boolean) => {
            isFocused.value = value
            findSuggestions(inputModel.value)

            if (value) {
                inputModel.value = oldInputQuery.value
                isQuerying.value = false
            }
            if (!value && !error) {
                toJSON(inputModel.value)
            }
        }

        const modelRef: any = toRef(props, 'modelValue')
        watch(modelRef, (val: any) => {
            if (val) {
                const currModel = parseSmartQuery(activeQuery.value.query)
                if (isEqual(val, currModel)) {
                    return
                }
                const stringQuery = stringifySmartQuery(val)
                if (stringQuery !== inputModel.value.trim()) {
                    debouncedInputModel(stringQuery)
                }
            }
        })

        onMounted(() => {
            if (props.modelValue) {
                const stringQuery = stringifySmartQuery(props.modelValue)
                debouncedInputModel(stringQuery)
            }
        })

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
            oldInputQuery,
            jsonEditorQuery,
            newQuery,
            preventUpdate,
            selectedOption,
            handleInputModel,
            debouncedInputModel,
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
        defineStyleModel(): Record<string, string> {
            return createColorSchema(
                this.colorSchema,
                this.aliases
            ) as any as Record<string, string>
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
        stringQuery(): string {
            return this.isQuerying || this.inputModel === ''
                ? this.activeQuery.name
                : this.inputModel
        },
        deleteButtonState(): boolean {
            return !this.filters?.saved?.filter(
                (q: Query) => q.name === this.activeQuery?.name
            ).length
        },
        selectOptions(): Record<string, string>[] {
            const options: Record<string, string>[] = [
                {
                    label: 'New Query',
                    value: '{}'
                }
            ]

            const filters = this.filters?.saved ?? []
            for (const filter of filters) {
                options.push({
                    label: filter.name,
                    value: filter.query
                })
            }

            return options
        }
    },
    watch: {
        jsonEditorModel() {
            const json = JSON.stringify(
                this.toJSON(removeBrackets(this.inputModel))
            )
            const newQuery = replaceWithAliases(json, this.aliases)
            if (newQuery && newQuery !== '{}') {
                this.jsonEditorQuery = newQuery
            }
            this.alignJsonText()
        },
        jsonEditorQuery(val) {
            if (
                this.activeQuery.name === 'New Query' ||
                this.activeQuery.name === ''
            ) {
                this.newQuery = val
            }
        }
    },
    mounted() {
        const observer = new ResizeObserver((entries) => {
            this.searchBarWidth = `${entries[0].contentRect.width}px`
        })
        observer.observe(this.$refs.inputWrapper as HTMLElement)
    },
    methods: {
        handleQueryRemove() {
            this.filtersModel = false
            this.removeQueryDialogBoxModel = true
        },
        handleSaveQuery(performSearch: boolean) {
            this.activeQuery = {
                name: this.newQueryName || this.activeQuery.name,
                query: this.jsonEditorQuery
            }
            if (performSearch === true) {
                this.emitSaveQuery()
                this.emitSearchQuery()
                const newQuery = revertAliases(
                    stringifySmartQuery(JSON.parse(this.activeQuery.query)),
                    this.aliases
                )
                this.inputModel = newQuery
                this.oldInputQuery = newQuery
                this.jsonEditorModel = false
            } else {
                this.emitSaveQuery()
            }
        },
        handleJsonSearchButton() {
            this.jsonEditorModel = false
            this.activeQuery.query = this.jsonEditorQuery
            this.setQueryInput()
            this.$emit('search-query', this.activeQuery, this.stringQuery)
        },
        handleFiltersDelete(currentTab: string, query: Query) {
            this.activeQuery = query
            this.currentTab = currentTab
            this.removeQueryDialogBoxModel = true
            this.filtersModel = false
        },
        handleFiltersSelect(currentTab: string, query: Query) {
            this.activeQuery = { ...query }
            const stringQuery = revertAliases(
                stringifySmartQuery(JSON.parse(query.query)),
                this.aliases
            )
            this.oldInputQuery = stringQuery
            this.inputModel = stringQuery
            this.currentTab = currentTab
            this.filtersModel = false
        },
        handleJsonEditorClose() {
            this.jsonEditorModel = false
            this.newQuery = ''
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
            this.selectedOption = {
                label: 'New Query',
                value: '{}'
            }
            this.activeQuery.query = this.newQuery
            this.jsonEditorQuery = this.newQuery || '{}'
            this.removeQueryDialogBoxModel = false
        },
        emitSaveQuery() {
            if (!this.activeQuery) return
            if (this.newQueryName !== '')
                this.activeQuery.name = this.newQueryName
            this.$emit('save-query', { ...this.activeQuery }, this.currentTab)
            this.saveQueryDialogBoxModel = false
            this.newQueryName = ''
        },
        setQueryInput(query?: string) {
            const stringQuery = revertAliases(
                stringifySmartQuery(
                    JSON.parse(query || this.activeQuery.query)
                ),
                this.aliases
            )
            this.inputModel = stringQuery
            this.oldInputQuery = stringQuery
        },
        updateActiveQuery(option: Record<string, string>) {
            this.preventUpdate = true
            const isNewQuery =
                option.label === 'New Query' || option.label === ''
            this.activeQuery = {
                name: option.label,
                query: isNewQuery ? this.newQuery : this.activeQuery.query
            }
            this.preventUpdate = false
            this.jsonEditorQuery = isNewQuery
                ? this.newQuery || '{}'
                : option.value
            this.alignJsonText()
        },
        alignJsonText() {
            try {
                this.preventUpdate = false
                this.jsonEditorQuery = JSON.stringify(
                    JSON.parse(this.jsonEditorQuery),
                    null,
                    2
                )
            } catch (err) {}
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
        display: flex;
        align-items: center;
        margin-left: 8px;
        margin-top: 1px;
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
