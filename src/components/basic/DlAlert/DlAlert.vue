<template>
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
            <span
                class="text"
                :style="textStyle"
            ><slot v-if="!text" /> <span v-else> {{ text }}</span></span>
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
                color="dl-color-darker"
                size="12px"
                @click="handleClose"
            />
        </div>
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
    watch
} from 'vue-demi'
import { getColor, includes } from '../../../utils'
import { DlIcon } from '../../essential'
import { DlAlertType } from './types'

const typeToIconMap: Record<DlAlertType, string> = {
    info: 'icon-dl-info-filled',
    success: 'icon-dl-approve-filled',
    warning: 'icon-dl-alert-filled',
    error: 'icon-dl-error-filled'
}

const typeToIconColorMap: Record<DlAlertType, string> = {
    info: 'dl-color-info',
    success: 'dl-color-positive',
    warning: 'dl-color-warning',
    error: 'dl-color-negative'
}

const typeToBackgroundMap: Record<DlAlertType, string> = {
    info: 'dl-color-info-background',
    success: 'dl-color-positive-background',
    warning: 'dl-color-warning-background',
    error: 'dl-color-negative-background'
}

export default defineComponent({
    name: 'DlAlert',
    components: {
        DlIcon
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
        }
    },
    emits: ['update:model-value'],
    setup(props, { emit }) {
        const show = ref(props.modelValue)
        const type = props.type as DlAlertType
        const typeIcon = typeToIconMap[type]
        const icon = computed(() => typeToIconMap[type])
        const iconColor = computed(() => typeToIconColorMap[type])
        const textStyle = computed(() => ({
            color: getColor(props.textColor, 'dl-color-darker')
        }))

        const rootRef = ref(null)
        const rootStyle = ref()
        const iconStyle = ref()
        const closeButtonStyle = ref()

        onMounted(() => {
            normalizeStyles(props.fluid)
        })

        watch(
            () => props.modelValue,
            (val) => {
                show.value = val
            }
        )

        watch(
            [() => props.fluid, () => props.text, () => props.closable],
            ([fluid]) => {
                normalizeStyles(fluid)
            }
        )

        function normalizeStyles(fluid?: boolean) {
            nextTick(() => {
                const { height } = (
                    rootRef as Ref<HTMLElement | null>
                ).value!.getBoundingClientRect()
                const iconS: Record<string, any> = {
                    display: 'flex'
                }
                const rootS: Record<string, any> = {
                    backgroundColor: getColor(typeToBackgroundMap[type])
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
                iconStyle.value = iconS
                rootStyle.value = rootS
                closeButtonStyle.value = iconS
            })
        }

        function handleClose() {
            show.value = false
            emit('update:model-value', false)
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
            handleClose
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
        padding: 10px 16px;
    }

    .text {
        padding-left: 10px;
        font-size: var(--dl-font-size-body);
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
</style>
