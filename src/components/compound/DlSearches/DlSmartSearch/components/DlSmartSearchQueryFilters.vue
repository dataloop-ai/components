<!-- <template>
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
            required: true,
            type: Array as PropType<DlSelectOption[]>,
            default: () => [] as DlSelectOption[]
        }
    },
    emits: ['update:modelValue', 'search', 'update:json', 'save', 'delete'],
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

<style scoped lang="scss"></style> -->
