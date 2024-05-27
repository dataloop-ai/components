<template>
    <div>
        <dl-dialog-box
            v-model="isOpen"
            :height="500"
            :width="800"
            style="--dl-dialog-box-footer-padding: 10px 16px"
        >
            <template #header>
                <dl-dialog-box-header
                    title="DQL Search"
                    :close-button="true"
                    @onClose="isOpen = false"
                />
            </template>
            <template #body>
                <div class="json-editor-layout">
                    <div class="json-query-menu" style="margin-bottom: 10px">
                        <dl-select
                            :model-value="selectedOption"
                            width="300px"
                            :options="selectOptions"
                            placeholder="New Query"
                            @update:model-value="onQuerySelect"
                        >
                            <template #selected="scope">
                                <span class="json-query-menu-option">
                                    {{ scope.opt ? scope.opt.label : '' }}
                                </span>
                            </template>
                            <template #option="scope">
                                <span class="json-query-menu-option">
                                    {{ scope.opt.label }}
                                </span>
                            </template>
                        </dl-select>
                        <dl-button
                            icon="icon-dl-align-left"
                            label="Align Left"
                            flat
                            color="secondary"
                            padding="0px 3px"
                            @click="alignJSON"
                        />
                    </div>
                    <dl-json-editor
                        ref="jsonEditor"
                        v-model="stringifiedJSON"
                        class="json-editor"
                        @change="onChange"
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
                        @click="showDeleteDialog = true"
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
                        style="margin-right: 5px"
                        @click="() => saveQuery(false)"
                    >
                        Save
                    </dl-button>
                    <dl-button
                        :disabled="!newQueryName"
                        @click="() => saveQuery(true)"
                    >
                        Save and Search
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
                <dl-typography
                    size="h3"
                    style="display: flex; justify-content: center"
                >
                    Are you sure you want to delete
                    {{ selectedOption.label }}?
                </dl-typography>
            </template>
            <template #footer>
                <div class="full-width flex justify-end">
                    <dl-button @click="deleteQuery"> Delete </dl-button>
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
import { DlButton } from '../../../../basic'
import { DlDialogBox, DlDialogBoxHeader } from '../../../DlDialogBox'
import { DlJsonEditor } from '../../../DlJsonEditor'
import { DlTypography } from '../../../../essential'
import { DlInput } from '../../../DlInput'
import { stateManager } from '../../../../../StateManager'
import { cloneDeep, isEqual, uniqBy } from 'lodash'
import { DlSmartSearchFilter } from '../types'

export default defineComponent({
    components: {
        DlDialogBox,
        DlDialogBoxHeader,
        DlJsonEditor,
        DlButton,
        DlSelect,
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
        'update:options',
        'save',
        'delete',
        'select'
    ],
    setup(props, { emit }) {
        const { modelValue, options, json, selectedFilter } = toRefs(props)

        const isOpen = computed({
            get: () => modelValue.value,
            set: (val) => emit('update:modelValue', val)
        })

        const currentQuery = ref<{ [key: string]: any }>(cloneDeep(json.value))
        const jsonEditor = ref<any>(null)
        const showSaveDialog = ref(false)
        const showDeleteDialog = ref(false)
        const newQueryName = ref('')

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
                (o: DlSelectOption) => o.label === selectedOption.value.label
            )
            const newOptions = options.value.filter(
                (o: DlSelectOption) => o.label !== selectedOption.value.label
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
            onQuerySelect,
            newQueryName,
            showDeleteDialog,
            selectOptions,
            search,
            onChange,
            saveQuery,
            deleteQuery
        }
    }
})
</script>

<style scoped lang="scss">
.json-editor-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.json-editor-footer,
.json-query-menu {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.json-editor {
    height: 100%;
}

.json-query-menu-option {
    white-space: nowrap;
    display: inline-block;
    width: 265px;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
