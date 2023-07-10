<template>
    <div @click="stopPropagationEvent">
        <DlButton
            flat
            icon-color="dl-color-darker"
            icon="icon-dl-edit"
            size="s"
            round
            @click="openModal"
        />
        <dl-dialog-box
            ref="modalOne"
            v-model="isOpenedModal"
        >
            <template #header>
                <dl-dialog-box-header
                    title="Description"
                    @onClose="closeModal"
                />
            </template>
            <template #body>
                <dl-text-area
                    v-model="descriptionValueComputed"
                    required
                    show-counter
                    enable-resize
                    placeholder="Type an item description"
                    :max-length="1000"
                    clear-button-tooltip
                    :error-message="errorMessage"
                    @focus="onFocusTextarea"
                    @blur="textAreaFocused = false"
                />
            </template>
            <template #footer>
                <dl-dialog-box-footer>
                    <dl-button
                        :disabled="isDisabledApplyButton"
                        @click="updateDescription"
                    >
                        Apply
                    </dl-button>
                </dl-dialog-box-footer>
            </template>
        </dl-dialog-box>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    computed,
    onMounted,
    watch,
    toRef
} from 'vue-demi'
import { DlButton, DlTextArea } from '../../../../components'
import DlDialogBox from '../../../compound/DlDialogBox/DlDialogBox.vue'
import DlDialogBoxHeader from '../../../compound/DlDialogBox/components/DlDialogBoxHeader.vue'
import DlDialogBoxFooter from '../../../compound/DlDialogBox/components/DlDialogBoxFooter.vue'

export default defineComponent({
    name: 'DescriptionModal',
    components: {
        DlButton,
        DlDialogBox,
        DlDialogBoxHeader,
        DlDialogBoxFooter,
        DlTextArea
    },
    props: {
        description: {
            type: String,
            default: ''
        }
    },
    emits: ['onSubmit'],
    setup(props, ctx) {
        const isOpenedModal = ref<boolean>(false)
        const textAreaValue = ref<string>('')
        const textAreaFocused = ref<boolean>(false)
        const errorMessage = ref<string>('')
        const isDisabledApplyButton = ref<boolean>(true)
        const MIN_LENGTH = 3
        const descriptionRef = toRef(props, 'description')

        const openModal = (): void => {
            isOpenedModal.value = true
        }
        const closeModal = (): void => {
            isOpenedModal.value = false
        }
        const updateDescription = (): void => {
            ctx.emit('onSubmit', textAreaValue.value)
            closeModal()
        }
        const onFocusTextarea = (): void => {
            textAreaFocused.value = true
        }
        const descriptionValueComputed = computed<string>({
            get() {
                return descriptionRef.value
            },
            set(value) {
                textAreaValue.value = value
            }
        })
        const stopPropagationEvent: any = (event: MouseEvent) => {
            event.stopPropagation()
        }
        watch(textAreaValue, (value) => {
            isDisabledApplyButton.value = value.length < MIN_LENGTH
        })
        onMounted(() => {
            isDisabledApplyButton.value =
                descriptionValueComputed.value?.length <= 1
        })

        return {
            isOpenedModal,
            openModal,
            closeModal,
            textAreaValue,
            textAreaFocused,
            errorMessage,
            isDisabledApplyButton,
            updateDescription,
            onFocusTextarea,
            descriptionValueComputed,
            stopPropagationEvent
        }
    }
})
</script>

<style scoped></style>
