<template>
    <div>
        <div
            v-if="show"
            :id="uuid"
            ref="rootRef"
            class="root"
            :style="rootStyle"
            data-test="root"
        >
            <div>
                <dl-icon
                    data-test="icon"
                    :style="iconStyle"
                    :icon="icon"
                    :color="iconColor"
                    :size="iconSize"
                />
                <span class="text" :style="textStyle">
                    <slot v-if="!text" />
                    <span v-else>
                        {{ text }}
                    </span>
                </span>
            </div>
            <div
                v-if="closable"
                class="close-button"
                data-test="close-button"
                :style="closeButtonStyle"
            >
                <dl-icon
                    class="close-button-icon"
                    data-test="close-button-icon"
                    icon="icon-dl-close"
                    color="dell-gray-800"
                    size="16px"
                    @click="handleClose"
                />
            </div>
        </div>
        <dl-dialog-box
            v-model="showConfirmDialog"
            :width="400"
            data-test="confirm-dialog"
        >
            <template #header>
                <dl-dialog-box-header
                    :title="props.confirmCloseHeader"
                    @onClose="handleCancelDismiss"
                />
            </template>
            <template #body>
                <p class="confirm-message">
                    {{ props.confirmCloseMessage }}
                </p>
            </template>
            <template #footer>
                <dl-dialog-box-footer>
                    <dl-button
                        outlined
                        label="Cancel"
                        data-test="cancel-button"
                        @click="handleCancelDismiss"
                    />
                    <dl-button
                        label="Dismiss"
                        data-test="dismiss-button"
                        @click="handleConfirmDismiss"
                    />
                </dl-dialog-box-footer>
            </template>
        </dl-dialog-box>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import {
    computed,
    defineComponent,
    nextTick,
    onMounted,
    Ref,
    ref,
    toRefs,
    watch
} from 'vue-demi'
import { getColor, includes } from '../../../utils'
import { DlIcon } from '../../essential'
import { DlButton } from '../DlButton'
import {
    DlDialogBox,
    DlDialogBoxHeader,
    DlDialogBoxFooter
} from '../../compound/DlDialogBox'
import { DlAlertType } from './types'

const typeToIconMap: Record<DlAlertType, string> = {
    info: 'icon-dl-info-filled',
    success: 'icon-dl-approve-filled',
    warning: 'icon-dl-alert-filled',
    error: 'icon-dl-error-filled'
}

const typeToIconColorMap: Record<DlAlertType, string> = {
    info: 'dell-blue-500',
    success: 'dell-green-500',
    warning: 'dell-yellow-600',
    error: 'dell-red-500'
}

const typeToBackgroundMap: Record<DlAlertType, string> = {
    info: 'dell-blue-200',
    success: 'dell-green-200',
    warning: 'dell-yellow-200',
    error: 'dell-red-200'
}

export default defineComponent({
    name: 'DlAlert',
    components: {
        DlIcon,
        DlButton,
        DlDialogBox,
        DlDialogBoxHeader,
        DlDialogBoxFooter
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            required: true,
            validator: (value: string) =>
                includes(['info', 'success', 'warning', 'error'], value)
        },
        textColor: {
            type: String,
            default: 'dl-color-darker'
        },
        iconSize: {
            type: String,
            default: '16px'
        },
        fluid: {
            type: Boolean,
            default: false
        },
        closable: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: null
        },
        padding: {
            type: String,
            default: null
        },
        confirmClose: {
            type: Boolean,
            default: false
        },
        confirmCloseHeader: {
            type: String,
            default: 'Are you sure?'
        },
        confirmCloseMessage: {
            type: String,
            default: ''
        }
    },
    emits: ['update:model-value', 'dismiss'],
    setup(props, { emit }) {
        const { padding, modelValue, type } = toRefs(props)
        const show = ref(modelValue.value)
        const icon = computed(() => typeToIconMap[type.value as DlAlertType])
        const iconColor = computed(
            () => typeToIconColorMap[type.value as DlAlertType]
        )
        const textStyle = computed(() => ({
            color: getColor(props.textColor, 'dl-color-darker')
        }))

        const rootRef = ref(null)
        const rootStyle = ref()
        const iconStyle = ref()
        const closeButtonStyle = ref()
        const showConfirmDialog = ref(false)

        onMounted(() => {
            normalizeStyles(props.fluid)
        })

        watch(modelValue, (val) => {
            show.value = val
        })

        watch(type, (val) => {
            type.value = val as DlAlertType
        })

        watch(
            [
                () => props.fluid,
                () => props.text,
                () => props.closable,
                () => props.type,
                () => props.padding
            ],
            ([fluid]) => {
                normalizeStyles(fluid)
            }
        )

        function normalizeStyles(fluid?: boolean) {
            nextTick(() => {
                const rootElement = (rootRef as Ref<HTMLElement | null>).value
                if (!rootElement) {
                    return
                }

                const { height } = rootElement.getBoundingClientRect()
                const iconS: Record<string, any> = {
                    display: 'flex'
                }
                const rootS: Record<string, any> = {
                    backgroundColor: getColor(
                        typeToBackgroundMap[type.value as DlAlertType]
                    )
                }
                if (height > 46) {
                    iconS.alignSelf = 'flex-start'
                } else {
                    iconS.alignSelf = 'center'
                }
                if (fluid === true) {
                    rootS.width = '100%'
                } else {
                    rootS.width = 'fit-content'
                }

                if (padding.value) {
                    rootS['--dl-alert-padding'] = padding.value
                }

                iconStyle.value = iconS
                rootStyle.value = rootS
                closeButtonStyle.value = iconS
            })
        }

        function handleClose() {
            if (props.confirmClose) {
                showConfirmDialog.value = true
            } else {
                closeAlert()
            }
        }

        function closeAlert() {
            show.value = false
            emit('update:model-value', false)
        }

        function handleConfirmDismiss() {
            showConfirmDialog.value = false
            closeAlert()
            emit('dismiss')
        }

        function handleCancelDismiss() {
            showConfirmDialog.value = false
        }

        return {
            uuid: `dl-alert-${v4()}`,
            rootRef,
            show,
            icon,
            iconColor,
            rootStyle,
            iconStyle,
            closeButtonStyle,
            textStyle,
            showConfirmDialog,
            props,
            handleClose,
            handleConfirmDismiss,
            handleCancelDismiss
        }
    },
    template: 'dl-alert'
})
</script>

<style scoped lang="scss">
.root {
    display: inline-flex;
    flex-direction: row;
    justify-content: space-between;
    min-height: 36px;
    border-radius: 2px;
    box-sizing: border-box;

    > div {
        display: flex;
        flex-direction: row;
        padding: var(--dl-alert-padding, 10px 16px);
    }

    .text {
        padding-left: 10px;
        font-size: var(--dl-font-size-body);
        line-height: normal;
        align-self: center;
        word-break: break-word;
    }

    .close-button {
        padding-right: 10px;
        padding-left: 10px;
        align-items: var(--dl-alert-align-button, start);
    }

    .icon-dl-close:hover {
        cursor: pointer;
    }

    .close-button-icon:hover {
        cursor: pointer;
    }
}

.confirm-message {
    margin: 0;
    color: var(--dell-gray-800);
    font-size: var(--dl-font-size-body);
    line-height: 1.5;
}
</style>
