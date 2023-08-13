<template>
    <!-- todo: Add support for saved queries-->
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
                    <div
                        class="json-query-menu"
                        style="margin-bottom: 10px"
                    >
                        <dl-select
                            disabled
                            :model-value="selectedOption"
                            width="200px"
                            :options="options"
                            placeholder="New Query"
                            @update:model-value="onQuerySelect"
                        />
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
                        :disabled="true || canDelete"
                        icon="icon-dl-delete"
                        label="Delete Query"
                        flat
                        color="secondary"
                        padding="0"
                        @click="showDeleteDialog = true"
                    />
                    <div class="json-editor-footer-actions">
                        <dl-button
                            disabled
                            style="margin-right: 14px"
                            outlined
                            label="Save As"
                            @click="showSaveDialog = true"
                        />
                        <dl-button
                            label="Search"
                            @click="search"
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
                        @click="saveQuery"
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
                    Are you sure you want to delete {{ selectedOption.label }}?
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
    onMounted,
    getCurrentInstance,
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
import { isEqual } from 'lodash'
import { registerToWindow } from '../../../../../utils'

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
            type: String
        },
        options: {
            required: false,
            type: Array as PropType<DlSelectOption[]>,
            default: () => [] as DlSelectOption[]
        }
    },
    emits: ['update:modelValue', 'search', 'change', 'update:options'],
    setup(props, { emit }) {
        const { modelValue, options, json } = toRefs(props)

        const isOpen = computed({
            get: () => modelValue.value,
            set: (val) => emit('update:modelValue', val)
        })

        const jsonEditor = ref<typeof DlJsonEditor>(null)
        const showSaveDialog = ref(false)
        const showDeleteDialog = ref(false)
        const stringifiedJSON = ref(json.value)
        const newQueryName = ref('')
        const selectedOption = ref<DlSelectOption>(
            options.value.find((o) => isEqual(o.value, json.value)) ?? {
                label: 'New Query',
                value: json.value
            }
        )

        const alignJSON = () => {
            jsonEditor.value.format()
        }

        const onQuerySelect = (option: DlSelectOption) => {
            selectedOption.value = option
            stringifiedJSON.value = option.value
        }

        const toObject = (json: string) => {
            try {
                return JSON.parse(json)
            } catch (e) {
                stateManager.logger.warn('DlSmartSearch - Invalid JSON', e)
                return null
            }
        }

        const search = () => {
            const parsed = toObject(stringifiedJSON.value)
            if (!parsed) return
            emit('search', parsed)
            isOpen.value = false
        }

        const onChange = (json: string) => {
            const parsed = toObject(json)
            if (!parsed) return
            emit('change', parsed)
        }

        const saveQuery = (searchAfterSave = false) => {
            const newOptions = options.value.concat([
                {
                    label: newQueryName.value,
                    value: stringifiedJSON.value
                }
            ])

            emit('update:options', newOptions)

            showSaveDialog.value = false
            nextTick(() => {
                if (searchAfterSave) {
                    search()
                }
            })
        }

        const canDelete = computed(
            () => selectedOption.value.label !== 'New Query'
        )

        const deleteQuery = () => {
            const newOptions = options.value.filter(
                (o: DlSelectOption) => o.value !== selectedOption.value.label
            )

            emit('update:options', newOptions)
            selectedOption.value = {
                label: 'New Query',
                value: '{}'
            }
            showDeleteDialog.value = false
        }

        watch(json, () => {
            stringifiedJSON.value = json.value
        })

        return {
            isOpen,
            jsonEditor,
            showSaveDialog,
            stringifiedJSON,
            selectedOption,
            canDelete,
            alignJSON,
            onQuerySelect,
            newQueryName,
            showDeleteDialog,
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
</style>
