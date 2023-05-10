<template>
    <button-group
        v-if="split"
        :id="uuid"
        :class="identifierClass"
        class="dl-button-dropdown dl-button-dropdown--split no-wrap dl-button-item"
        :outlined="outlined"
        :flat="flat"
        :stretch="stretch"
    >
        <dl-button
            class="dl-button-dropdown--current"
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
            :overflow="overflow"
            :tooltip="tooltip"
            @click="onClickHide"
        />
        <dl-button
            class="dl-button-dropdown__arrow-container"
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
            :no-wrap="noWrap"
            :overflow="overflow"
            :tooltip="tooltip"
        >
            <div
                class="dl-button-dropdown--separator"
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
        class="dl-button-dropdown dl-button-dropdown--simple"
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
        :no-wrap="props.noWrap"
        :tooltip="tooltip"
        :max-width="maxWidth"
        @click="onClick"
    >
        <div class="dl-button-dropdown--simple__title">
            <span
                :class="{
                    'dl-button-no-wrap': noWrap
                }"
                style="margin-right: 5px"
            >
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
            :arrow-nav-items="arrowNavItems"
            @before-show="onBeforeShow"
            @show="onShow"
            @before-hide="onBeforeHide"
            @hide="onHide"
            @highlightedIndex="setHighlightedIndex"
            @handleSelectedItem="handleSelectedItem"
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
        fitContent: Boolean,
        noWrap: { type: Boolean, default: false, required: false },
        overflow: { type: Boolean, default: false, required: false },
        tooltip: { type: String, default: null, required: false },
        arrowNavItems: {
            type: [String, Array, Object],
            default: () => [] as any[]
        }
    },
    emits: [
        'update:model-value',
        'update:modelValue',
        'click',
        'before-show',
        'show',
        'before-hide',
        'hide',
        'highlightedIndex',
        'handleSelectedItem'
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
                'dl-button-dropdown__arrow' +
                (showing.value === true && props.noIconAnimation === false
                    ? ' rotate-180'
                    : '') +
                (props.split === false
                    ? ' dl-button-dropdown__arrow-container'
                    : '')
            )
        })

        const btnCSSStyles = computed(() => {
            return {
                '--dl-button-border-left': props.outlined
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
        const setHighlightedIndex = (value: any) => {
            emit('highlightedIndex', value)
        }
        const handleSelectedItem = (value: any) => {
            emit('handleSelectedItem', value)
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
            menuModel,
            props,
            setHighlightedIndex,
            handleSelectedItem
        }
    }
})
</script>

<style scoped lang="scss">
.dl-button-no-wrap {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.dl-button-dropdown {
    padding-right: var(--dl-button-padding-right) !important;
    &--split .dl-button-dropdown__arrow-container {
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
        &__title {
            display: flex;
            align-items: center;
            justify-content: space-around;
            text-align: center;
            padding: 0;
            flex: 10000 1 0%;
            flex-wrap: nowrap;
            line-height: 1;
            z-index: 0;
            user-select: none !important;
            min-width: 1.5em;
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
<style lang="scss">
.dl-button-dropdown {
    .dl-button-content {
        line-height: unset;
    }
}
</style>
