<template>
    <button-group
        v-if="split"
        :id="uuid"
        :class="identifierClass"
        class="dl-btn-dropdown dl-btn-dropdown--split no-wrap dl-btn-item"
        :outlined="outlined"
        :flat="flat"
        :stretch="stretch"
    >
        <dl-button
            class="dl-btn-dropdown--current"
            :style="mainBtnStyle"
            :label="label"
            :outlined="outlined"
            :size="size"
            :flat="flat"
            :disabled="disabled === true || disableMainBtn === true"
            :max-width="maxWidth"
            :color="color"
            :icon="icon"
            :uppercase="uppercase"
            :text-color="textColor"
            no-wrap
            :aria-expanded="showing === true ? 'true' : 'false'"
            :aria-haspopup="true"
            :aria-disabled="
                disabled === true ||
                    (split === false && disableMainBtn === true) ||
                    disableDropdown === true
            "
            @click="onClickHide"
        />
        <dl-button
            class="dl-btn-dropdown__arrow-container"
            :style="btnCSSStyles"
            :disabled="disabled === true || disableDropdown === true"
            :outlined="outlined"
            :flat="flat"
            :size="size"
            :color="color"
            :text-color="textColor"
            :aria-expanded="showing"
            :aria-haspopup="true"
            :aria-disabled="
                disabled === true ||
                    (split === false && disableMainBtn === true) ||
                    disableDropdown === true
            "
        >
            <div
                class="dl-btn-dropdown--separator"
                :style="`
                    background-color: ${
                    disabled
                        ? 'var(--dl-color-disabled)'
                        : outlined && !textColor
                            ? 'var(--dl-color-secondary)'
                            : textColor || 'var(--dl-color-white)'
                }`"
            />
            <dl-icon
                class="expand-icon"
                :class="iconClass"
                :icon="dropdownIcon"
                :size="iconSize"
                :color="
                    disabled
                        ? 'dl-color-disabled'
                        : outlined && !textColor
                            ? 'dl-color-secondary'
                            : textColor || 'dl-color-white'
                "
            />
        </dl-button>
        <dl-menu
            ref="menuRef"
            v-model="menuModel"
            :class="contentClass"
            :style="contentStyle"
            :cover="cover"
            fit-container
            :fit-content="fitContent"
            :persistent="persistent"
            :auto-close="autoClose"
            :anchor="menuAnchor"
            :self="menuSelf"
            :offset="menuOffset"
            separate-close-popup
            :disabled="disabled"
            :max-height="maxHeight"
            @before-show="onBeforeShow"
            @show="onShow"
            @before-hide="onBeforeHide"
            @hide="onHide"
        >
            <slot />
        </dl-menu>
    </button-group>
    <dl-button
        v-else
        class="dl-btn-dropdown dl-btn-dropdown--simple"
        v-bind="$props"
        label=""
        :aria-expanded="showing"
        :aria-haspopup="true"
        :aria-disabled="
            disabled === true ||
                (split === false && disableMainBtn === true) ||
                disableDropdown === true
        "
        :disabled="disabled === true || disableMainBtn === true"
        :style="mainBtnStyle"
        no-wrap
        @click="onClick"
    >
        <div
            style="
                display: flex;
                align-items: center;
                justify-content: space-around;
            "
        >
            <span style="margin-right: 5px">
                {{ label }}
            </span>
            <dl-icon
                :class="iconClass"
                :icon="dropdownIcon"
                :size="iconSize"
                :color="
                    disabled
                        ? 'dl-color-disabled'
                        : outlined && !textColor
                            ? 'dl-color-secondary'
                            : textColor || 'dl-color-white'
                "
            />
        </div>

        <dl-menu
            ref="menuRef"
            v-model="menuModel"
            :class="contentClass"
            :style="contentStyle"
            :cover="cover"
            fit-container
            :fit-content="fitContent"
            :persistent="persistent"
            :auto-close="autoClose"
            :anchor="menuAnchor"
            :self="menuSelf"
            :offset="menuOffset"
            separate-close-popup
            :disabled="disabled"
            :max-height="maxHeight"
            @before-show="onBeforeShow"
            @show="onShow"
            @before-hide="onBeforeHide"
            @hide="onHide"
        >
            <slot />
        </dl-menu>
    </dl-button>
</template>

<script lang="ts">
import { DlButton } from '../../basic'
import ButtonGroup from './components/ButtonGroup.vue'
import { DlMenu, DlIcon } from '../../essential'
import { stop } from '../../../utils/events'
import {
    defineComponent,
    ref,
    computed,
    watch,
    onMounted,
    getCurrentInstance,
    Ref
} from 'vue-demi'
import { v4 } from 'uuid'

export default defineComponent({
    name: 'DlDropdownButton',
    components: {
        DlMenu,
        DlIcon,
        DlButton,
        ButtonGroup
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        'onUpdate:modelValue': [Function, Array],
        modelValue: Boolean,
        split: Boolean,
        dropdownIcon: { type: String, default: 'icon-dl-down-chevron' },
        contentClass: { type: [Array, String, Object], default: '' },
        contentStyle: { type: [Array, String, Object], default: '' },
        mainBtnStyle: { type: [Array, String, Object], default: '' },
        cover: Boolean,
        maxWidth: { type: String, default: null },
        maxHeight: { type: String, default: null },
        persistent: Boolean,
        stretch: Boolean,
        autoClose: Boolean,
        menuAnchor: {
            type: String,
            default: 'bottom end'
        },
        menuSelf: {
            type: String,
            default: 'top end'
        },
        menuOffset: { type: Array, default: () => [0, 0] },
        disableMainBtn: Boolean,
        disableDropdown: Boolean,
        noIconAnimation: Boolean,
        disabled: Boolean,
        color: { type: String!, default: '' },
        label: { type: String, default: '' },
        textColor: { type: String!, default: '' },
        size: { type: String, default: 'm' },
        contained: { type: Boolean, default: true },
        fluid: Boolean,
        icon: { type: String, required: false, default: '' },
        iconSize: { type: String, required: false, default: '20px' },
        flat: Boolean,
        uppercase: Boolean,
        outlined: Boolean,
        padding: { type: String, default: '5px' },
        fitContent: Boolean
    },
    emits: [
        'update:model-value',
        'update:modelValue',
        'click',
        'before-show',
        'show',
        'before-hide',
        'hide'
    ],

    setup(props, { emit }) {
        const vm = getCurrentInstance()
        const proxy = vm!.proxy!

        const showing = ref<boolean>(!!props.modelValue) as Ref<boolean>
        const menuRef = ref(null)

        const attributes = computed(() => {
            const acc: Record<string, string> = {
                'aria-expanded': showing.value === true ? 'true' : 'false',
                'aria-haspopup': 'true'
            }

            if (
                props.disabled === true ||
                (props.split === false && props.disableMainBtn === true) ||
                props.disableDropdown === true
            ) {
                acc['aria-disabled'] = 'true'
            }

            return acc
        })

        const menuModel = computed({
            get: () => props.modelValue,
            set: (val) => emit('update:modelValue', val)
        })

        const iconClass = computed(() => {
            return (
                'dl-btn-dropdown__arrow' +
                (showing.value === true && props.noIconAnimation === false
                    ? ' rotate-180'
                    : '') +
                (props.split === false
                    ? ' dl-btn-dropdown__arrow-container'
                    : '')
            )
        })

        const btnCSSStyles = computed(() => {
            return {
                '--dl-btn-border-left': props.outlined
                    ? 'none'
                    : 'var(--dl-color-white)'
            }
        })

        watch(
            () => props.modelValue,
            (val) => {
                if (menuRef.value) {
                    (menuRef!.value as Record<string, Function>)[
                        val ? 'show' : 'hide'
                    ]()
                }
            }
        )

        watch(() => props.split, hide)

        function onBeforeShow(e: Event) {
            showing.value = true
            emit('before-show', e)
        }

        function onShow(e: Event) {
            emit('show', e)
            emit('update:modelValue', true)
        }

        function onBeforeHide(e: Event) {
            showing.value = false
            emit('before-hide', e)
        }

        function onHide(e: Event) {
            emit('hide', e)
            emit('update:modelValue', false)
        }

        function onClick(e: Event) {
            emit('click', e)
        }

        function onClickHide(e: Event) {
            stop(e)
            hide(e)
            emit('click', e)
        }

        function toggle(evt: Event) {
            if (menuRef.value) {
                (menuRef.value as Record<string, Function>).toggle(evt)
            }
        }

        function show(evt?: Event) {
            if (menuRef.value) {
                (menuRef.value as Record<string, Function>).show(evt)
            }
        }

        function hide(evt?: any) {
            if (menuRef.value) {
                (menuRef.value as Record<string, Function>).hide(evt)
            }
        }

        onMounted(() => {
            if (props.modelValue) {
                show()
            }
        })

        const identifierClass = computed(() => {
            return `dl-dropdown-button-${props.label ?? ''}`.replaceAll(
                ' ',
                '-'
            )
        })

        return {
            uuid: `dl-dropdown-button-${v4()}`,
            identifierClass,
            iconClass,
            menuRef,
            attributes,
            btnCSSStyles,
            showing,
            onBeforeShow,
            onBeforeHide,
            onShow,
            onHide,
            onClick,
            onClickHide,
            toggle,
            show,
            hide,
            menuModel
        }
    }
})
</script>

<style scoped lang="scss">
.dl-btn-dropdown {
    padding-right: var(--dl-btn-padding-right) !important;
    &--split .dl-btn-dropdown__arrow-container {
        // padding: 0 4px;
        ::v-deep .dl-button {
            border-top-left-radius: 0 !important;
            border-left-width: 0 !important;
            border-bottom-left-radius: 0 !important;
            padding-right: 10px;
            padding-left: 10px;
            &:hover:enabled:not(:active),
            &:hover:enabled:active {
                border-top-left-radius: 0 !important;
                border-left-width: 0 !important;
                border-bottom-left-radius: 0 !important;
            }
            &:active:not(:disabled) {
                border-top-left-radius: 0 !important;
                border-left-width: 0 !important;
                border-bottom-left-radius: 0 !important;
            }
        }
    }

    &--separator {
        position: absolute;
        left: 0;
        width: 1px;
        height: 60%;
    }

    &--simple {
        ::v-deep .dl-button-no-wrap {
            padding-right: 8px;
        }
    }
    &__arrow {
        transition: transform 0.28s;
    }
    &--current {
        flex-grow: 1;
        ::v-deep .dl-button {
            border-top-right-radius: 0 !important;
            border-right-width: 0 !important;
            border-bottom-right-radius: 0 !important;
            &:hover:enabled:not(:active) {
                border-top-right-radius: 0 !important;
                border-right-width: 0 !important;
                border-bottom-right-radius: 0 !important;
            }
            &:active:not(:disabled) {
                border-top-right-radius: 0 !important;
                border-right-width: 0 !important;
                border-bottom-right-radius: 0 !important;
            }
        }
    }

    .expand-icon {
        display: flex !important;
        justify-content: center !important;
        align-items: center;
        color: var(--dl-color-medium);
        transition-property: transform, -webkit-transform;
        transition-duration: 0.28s, 0.28s;
        transition-timing-function: ease, ease;
        transition-delay: 0s, 0s;
        &.expanded {
            transform: rotate(180deg);
        }
    }
}
::v-deep .dl-button-no-wrap {
    flex-grow: 1;
}
</style>
