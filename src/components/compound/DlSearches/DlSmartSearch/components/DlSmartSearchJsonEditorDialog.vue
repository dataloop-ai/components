<template>
    <div>
        <dl-dialog-box
            v-model="isOpen"
            :height="500"
            :width="800"
            style="--dl-dialog-box-footer-padding: 10px 16px; --dl-dialog-box-content-padding: 0"
        >
            <template #header>
                <dl-dialog-box-header
                    title="DQL Editor"
                    :close-button="true"
                    @onClose="isOpen = false"
                />
            </template>
            <template #body>
                <div class="json-editor-layout">
                    <div class="json-query-menu">
                        <dl-select
                            :model-value="selectedOption"
                            ref="jsonQueryMenu"
                            width="300px"
                            :options="selectOptions"
                            placeholder="New Query"
                            searchable
                            size="m"
                            after-options-padding="0"
                            no-options-padding="0"
                            menu-style="overflow-y: hidden;"
                            @update:model-value="onQuerySelect"
                        >
                            <template #selected="scope">
                                <span class="json-query-menu-selected">
                                    {{ scope.opt ? scope.opt.label : '' }}
                                </span>
                            </template>
                            <template #option="scope">
                                <div
                                    v-if="selectOptions.length < 2"
                                    class="json-query-menu-no-option"
                                    disabled
                                    style="cursor: default !important; padding: 14px 0 10px 0;"
                                >
                                    No Saved Queries
                                </div>
                                <div v-else class="json-query-menu-option">
                                    <div class="json-query-menu-option-label">
                                        {{ scope.opt.label }}
                                    </div>
                                    <dl-icon
                                        v-if="scope.opt.label !== 'New Query'"
                                        icon="icon-dl-delete"
                                        color="dl-color-negative"
                                        class="json-query-menu-option-delete"
                                        @click.stop="onDelete(scope.opt)"
                                    >
                                        <dl-tooltip>Delete</dl-tooltip>
                                    </dl-icon>
                                </div>
                            </template>
                            <template #after-options>
                                <dl-separator
                                    style="margin: 0 0 2px 0 !important"
                                    type="horizontal"
                                />
                                <dl-button
                                    icon="icon-dl-save"
                                    flat
                                    fluid
                                    secondary
                                    size="s"
                                    label="Save Query"
                                    class="json-query-menu-save-button"
                                    @click="onSave"
                                />
                            </template>
                            <template #no-options>
                                <div class="json-query-menu-no-option">
                                    No Results Found
                                </div>
                                <dl-separator
                                    style="margin: 0 0 2px 0 !important"
                                    type="horizontal"
                                />
                                <dl-button
                                    icon="icon-dl-save"
                                    flat
                                    fluid
                                    secondary
                                    size="s"
                                    label="Save Query"
                                    class="json-query-menu-save-button"
                                    @click="onSave"
                                />
                            </template>
                        </dl-select>
                        <div>
                            <dl-button
                                icon="icon-dl-align-left"
                                tooltip="Align Left"
                                flat
                                color="secondary"
                                padding="0px 3px"
                                :disabled="alignDisabled"
                                @click="alignJSON"
                            />
                            <dl-button
                                icon="icon-dl-copy"
                                tooltip="Copy"
                                flat
                                color="secondary"
                                padding="0px 3px"
                                :disabled="alignDisabled"
                                @click="copyJSON"
                            />
                        </div>
                    </div>
                    <dl-json-editor
                        ref="jsonEditor"
                        v-model="stringifiedJSON"
                        class="json-editor"
                        @change="onChange"
                        @content-error="onContentError"
                    />
                </div>
            </template>
            <template #footer>
                <div class="json-editor-footer">
                    <dl-button
                        :disabled="!hasActiveFilter"
                        icon="icon-dl-delete"
                        label="Delete Query"
                        flat
                        color="secondary"
                        padding="0"
                        @click="optionToDelete = selectedOption"
                    />
                    <div class="json-editor-footer-actions">
                        <dl-button
                            style="margin-right: 14px"
                            outlined
                            label="Save As"
                            @click="showSaveDialog = true"
                        />
                        <dl-button
                            :label="
                                hasActiveFilter ? 'Save & Search' : 'Search'
                            "
                            @click="
                                () => (hasActiveFilter ? saveQuery() : search())
                            "
                        />
                    </div>
                </div>
            </template>
        </dl-dialog-box>

        <!-- SAVE DIALOG -->
        <dl-dialog-box
            v-model="showSaveDialog"
            style="--dl-dialog-box-footer-padding: 14px 17px"
        >
            <template #header>
                <dl-dialog-box-header
                    title="Save Query"
                    @onClose="showSaveDialog = false"
                />
            </template>
            <template #body>
                <dl-input
                    v-model="newQueryName"
                    :red-asterisk="true"
                    :required="true"
                    title="Query Name"
                    placeholder="Insert query name"
                />
            </template>
            <template #footer>
                <div class="dl-smart-search__buttons--save">
                    <dl-button
                        :disabled="!newQueryName"
                        @click="() => saveQuery(false)"
                    >
                        Save
                    </dl-button>
                </div>
            </template>
        </dl-dialog-box>

        <!-- Delete dialog -->
        <dl-dialog-box v-model="showDeleteDialog">
            <template #header>
                <dl-dialog-box-header
                    title="Delete Query"
                    @onClose="showDeleteDialog = false"
                />
            </template>
            <template #body>
                <dl-typography size="h5">
                    Are you sure you want to permanently delete the following query?
                    <br />
                    {{ optionToDelete.label }}
                    <br />
                    <br />
                    This action cannot be undone.
                </dl-typography>
            </template>
            <template #footer>
                <div class="full-width flex justify-end">
                    <dl-button @click="deleteQuery">
                        Delete
                    </dl-button>
                </div>
            </template>
        </dl-dialog-box>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    PropType,
    toRefs,
    computed,
    nextTick,
    watch
} from 'vue-demi'
import { DlSelect } from '../../../DlSelect'
import { DlSelectOption } from '../../../DlSelect/types'
import { DlSeparator } from '../../../../essential/DlSeparator'
import { DlButton } from '../../../../basic'
import { DlDialogBox, DlDialogBoxHeader } from '../../../DlDialogBox'
import { DlJsonEditor } from '../../../DlJsonEditor'
import { DlTooltip } from '../../../../shared/DlTooltip'
import { DlTypography, DlIcon } from '../../../../essential'
import { DlInput } from '../../../DlInput'
import { stateManager } from '../../../../../StateManager'
import { cloneDeep, isEqual, uniqBy } from 'lodash'
import { DlSmartSearchFilter } from '../types'

export default defineComponent({
    components: {
        DlDialogBox,
        DlDialogBoxHeader,
        DlIcon,
        DlJsonEditor,
        DlButton,
        DlSelect,
        DlSeparator,
        DlTooltip,
        DlTypography,
        DlInput
    },
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: {
        modelValue: {
            required: false,
            type: Boolean,
            default: false
        },
        json: {
            required: true,
            type: Object as PropType<Record<string, any>>
        },
        options: {
            required: false,
            type: Array as PropType<DlSelectOption[]>,
            default: () => [] as DlSelectOption[]
        },
        selectedFilter: {
            required: false,
            type: String,
            default: null
        }
    },
    emits: [
        'update:modelValue',
        'search',
        'change',
        'copied',
        'update:options',
        'save',
        'delete',
        'select'
    ],
    methods: {
        onDelete(option: DlSelectOption) {
            const select = this.$refs['jsonQueryMenu'] as InstanceType<typeof DlSelect>
            select?.closeMenu()
            this.optionToDelete = option
        },
        onSave() {
            const select = this.$refs['jsonQueryMenu'] as InstanceType<typeof DlSelect>
            select?.closeMenu()
            this.showSaveDialog = true
        }
    },
    setup(props, { emit }) {
        const { modelValue, options, json, selectedFilter } = toRefs(props)

        const isOpen = computed({
            get: () => modelValue.value,
            set: (val) => emit('update:modelValue', val)
        })

        const currentQuery = ref<{ [key: string]: any }>(cloneDeep(json.value))
        const jsonEditor = ref<any>(null)
        const showSaveDialog = ref(false)
        const optionToDelete = ref<DlSelectOption>(null)
        const showDeleteDialog = computed<boolean>({
            get: () => !!optionToDelete.value,
            set: (val) => {
                if (!val) {
                    optionToDelete.value = null
                }
            }
        })
        const newQueryName = ref('')
        const alignDisabled = ref(false)

        const selectOptions = computed<DlSelectOption[]>(() => {
            return uniqBy(
                [
                    {
                        label: 'New Query',
                        value: cloneDeep(json.value ?? {})
                    }
                ].concat(options.value),
                'label'
            )
        })
        const selectedOption = ref<DlSelectOption>(
            options.value.find((o) => isEqual(o.value, currentQuery.value)) ?? {
                label: 'New Query',
                value: currentQuery.value
            }
        )

        watch(
            selectedFilter,
            () => {
                selectedOption.value = options.value.find(
                    (o) => o.label === selectedFilter.value
                ) ?? {
                    label: 'New Query',
                    value: currentQuery.value
                }

                if (selectedOption.value.label !== 'New Query') {
                    currentQuery.value = cloneDeep(selectedOption.value.value)
                }
            },
            { immediate: true }
        )

        const alignJSON = () => {
            jsonEditor.value?.format()
        }

        const copyJSON = async () => {
            await navigator.clipboard.writeText(stringifiedJSON.value)
            emit('copied')
        }

        const onQuerySelect = (option: DlSelectOption) => {
            if (option.label === selectedOption.value.label) {
                return
            }

            selectedOption.value = cloneDeep(option)
            currentQuery.value = cloneDeep(option.value)
            nextTick(() => {
                alignJSON()
                // wtf oa ?
                nextTick(() => {
                    alignJSON()
                })
            })
            emit('select', option)
        }

        const stringifiedJSON = computed<string>({
            get: () => JSON.stringify(currentQuery.value),
            set: (val) => {
                currentQuery.value = toObject(val)
            }
        })

        const toObject = (json: string) => {
            try {
                return JSON.parse(json)
            } catch (e) {
                stateManager.logger.warn('DlSmartSearch - Invalid JSON', e)
                return null
            }
        }

        const search = () => {
            if (!currentQuery.value) return
            emit('search', currentQuery.value)
            isOpen.value = false
        }

        const onChange = (json: string) => {
            const parsed = toObject(json)
            if (!parsed) return
            emit('change', parsed)
            alignDisabled.value = false
        }

        const onContentError = () => {
            alignDisabled.value = true
        }

        const saveQuery = (searchAfterSave = false) => {
            const updateOldFilter =
                hasActiveFilter.value && newQueryName.value === ''
            let toSave: DlSmartSearchFilter = updateOldFilter
                ? selectedOption.value
                : ({} as DlSmartSearchFilter)
            toSave = Object.assign({}, toSave, {
                label: updateOldFilter
                    ? selectedOption.value.label
                    : newQueryName.value,
                value: currentQuery.value
            })

            const newOptions = options.value.concat([toSave])

            emit('save', toSave)
            emit('update:options', newOptions)

            showSaveDialog.value = false
            newQueryName.value = ''
            nextTick(() => {
                if (searchAfterSave) {
                    search()
                }
            })
        }

        const hasActiveFilter = computed(
            () => selectedOption.value.label !== 'New Query'
        )

        const deleteQuery = () => {
            const toDelete = options.value.find(
                (o: DlSelectOption) => o.label === optionToDelete.value.label
            )
            const newOptions = options.value.filter(
                (o: DlSelectOption) => o.label !== optionToDelete.value.label
            )

            emit('delete', toDelete)
            emit('update:options', newOptions)
            selectedOption.value = {
                label: 'New Query',
                value: {}
            }
            currentQuery.value = {}
            showDeleteDialog.value = false
        }

        watch(json, () => {
            currentQuery.value = cloneDeep(json.value)
            nextTick(() => {
                alignJSON()
            })
        })
        watch(isOpen, () => {
            nextTick(() => {
                alignJSON()
            })
        })

        return {
            isOpen,
            jsonEditor,
            showSaveDialog,
            stringifiedJSON,
            selectedOption,
            hasActiveFilter,
            alignJSON,
            copyJSON,
            onQuerySelect,
            newQueryName,
            alignDisabled,
            optionToDelete,
            showDeleteDialog,
            selectOptions,
            search,
            onChange,
            onContentError,
            saveQuery,
            deleteQuery
        }
    }
})
</script>

<style scoped>
.json-editor-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.json-editor-footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.json-query-menu {
    display: flex;
    align-items: center;
    background-color: var(--dl-color-fill);
    justify-content: space-between;
    padding: 6px 16px;
}
.json-editor {
    height: calc(100% - 40px);
    --jse-main-border: none;
}

.json-query-menu-option {
    display: flex;
    flex-direction: row;
}
.json-query-menu-option-label,
.json-query-menu-selected {
    padding-top: 3px;
    white-space: nowrap;
    display: inline-block;
    width: 265px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.json-query-menu-option:hover .json-query-menu-option-label {
    margin-right: 6px;
    width: 255px;
}
.json-query-menu-option-delete {
    overflow-x: hidden;
    width: 0;
}
.json-query-menu-option:hover .json-query-menu-option-delete {
    border-radius: 4px;
    overflow-x: visible;
    padding: 4px;
    width: auto;
}
.json-query-menu-option-delete:hover {
    background-color: var(--dl-color-fill-secondary);
}
.json-query-menu-option-delete:active {
    background-color: var(--dl-color-negative-background);
}
.json-query-menu-no-option {
    display: flex;
    padding: 20px 0;
    flex-direction: column;
    align-items: center;
    align-self: stretch;
}
.json-query-menu-save-button:hover {
    background-color: var(--dl-color-fill-secondary);
}
.dl-smart-search__buttons--save {
    text-align: right;
    width: 100%;
}
</style>
