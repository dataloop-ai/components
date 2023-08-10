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
                    <div
                        class="json-query-menu"
                        style="margin-bottom: 10px"
                    >
                        <dl-select
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
                    />
                </div>
            </template>
            <template #footer>
                <div class="json-editor-footer">
                    <dl-button
                        :disabled="canDelete"
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
                            label="Search"
                            @click="$emit('search', stringifiedJSON)"
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
                        @click="() => {}"
                    >
                        Save
                    </dl-button>
                    <dl-button
                        :disabled="!newQueryName"
                        @click="() => {}"
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
                    <dl-button @click="() => {}">
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
    watch,
    PropType,
    toRefs,
    computed
} from 'vue-demi'
import { DlSelect } from '../../../DlSelect'
import { DlSelectOption } from '../../../DlSelect/types'
import { DlButton } from '../../../../basic'
import { DlDialogBox, DlDialogBoxHeader } from '../../../DlDialogBox'
import { DlJsonEditor } from '../../../DlJsonEditor'
import { DlTypography } from '../../../../essential'
import { DlInput } from '../../../DlInput'

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
    emits: ['update:modelValue', 'search', 'change', 'save', 'delete'],
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
            options.value.find((o) => o.value === json.value) ?? {
                label: 'New Query',
                value: json.value
            }
        )

        const canDelete = computed(
            () =>
                !options.value?.filter(
                    (q: DlSelectOption) => q.value === stringifiedJSON
                ).length
        )

        const alignJSON = () => {
            jsonEditor.value.format()
        }

        const onQuerySelect = (option: DlSelectOption) => {
            selectedOption.value = option
            stringifiedJSON.value = option.value
        }

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
            showDeleteDialog
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
