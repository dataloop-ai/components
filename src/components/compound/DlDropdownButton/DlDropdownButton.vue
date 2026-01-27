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
            :style="mainButtonStyle"
            :label="label"
            :outlined="outlined"
            :size="size"
            :flat="flat"
            :disabled="disabled === true || disableMainButton === true"
            :max-width="maxWidth"
            :color="color"
            :icon="icon"
            :transform="transform"
            :text-color="textColor"
            no-wrap
            :aria-expanded="showing === true ? 'true' : 'false'"
            :aria-haspopup="true"
            :aria-disabled="
                disabled === true ||
                    (!split && disableMainButton === true) ||
                    disableDropdown === true
            "
            :overflow="overflow"
            :tooltip="tooltip"
            @click.capture="onClickHide"
        />
        <dl-button
            class="dl-button-dropdown__arrow-container"
            :style="buttonCSSStyles"
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
                    (!split && disableMainButton === true) ||
                    disableDropdown === true
            "
            :no-wrap="noWrap"
            :overflow="overflow"
            :tooltip="tooltip"
        >
            <div
                class="dl-button-dropdown--separator"
                :style="`
                    background-color: ${separatorColor}`"
            />
            <slot name="suffix-icon">
                <dl-icon
                    class="expand-icon"
                    :class="iconClass"
                    :icon="dropdownIcon"
                    :size="iconSize"
                    :color="getIconColor"
                    :tooltip="iconTooltip"
                    @click="onIconClicked"
                />
            </slot>
        </dl-button>
        <dl-menu
            ref="menuRef"
            v-model="menuModel"
            :menu-class="contentClass"
            :style="contentStyle"
            :cover="cover"
            fit-container
            :fit-content="fitContent"
            :persistent="persistent"
            :auto-close="autoClose"
            :anchor="menuAnchor"
            :self="menuSelf"
            :offset="menuOffset"
            :z-index="zIndex"
            separate-close-popup
            :disabled="disabled"
            :max-height="maxHeight"
            :max-width="menuMaxWidth"
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
                (split === false && disableMainButton === true) ||
                disableDropdown === true
        "
        :disabled="disabled === true || disableMainButton === true"
        :style="[mainButtonStyle, cssVars]"
        :no-wrap="props.noWrap"
        :tooltip="tooltip"
        :max-width="maxWidth"
        :hover-text-color="mainButtonHoverColor"
        :size="mainButtonFontSize"
        @click="onClick"
    >
        <div class="dl-button-dropdown--simple__title">
            <slot name="label">
                <span
                    :class="{
                        'dl-button-no-wrap': noWrap
                    }"
                    style="margin-right: 6px"
                >
                    {{ label }}
                </span>
            </slot>
            <slot name="suffix-icon">
                <dl-icon
                    :class="iconClass"
                    :icon="dropdownIcon"
                    :size="iconSize"
                    :color="getIconColor"
                    :tooltip="iconTooltip"
                    @click="onIconClicked"
                />
            </slot>
        </div>

        <dl-menu
            ref="menuRef"
            v-model="menuModel"
            :menu-class="contentClass"
            :style="contentStyle"
            :cover="cover"
            fit-container
            :fit-content="fitContent"
            :persistent="persistent"
            :auto-close="autoClose"
            :anchor="menuAnchor"
            :self="menuSelf"
            :offset="menuOffset"
            :z-index="zIndex"
            separate-close-popup
            :disabled="disabled"
            :max-height="maxHeight"
            :max-width="menuMaxWidth"
            :arrow-nav-items="arrowNavItems"
            @before-show="onBeforeShow"
            @show="onShow"
            @before-hide="onBeforeHide"
            @hide="onHide"
            @highlighted-item="setHighlightedIndex"
            @selected-item="handleSelectedItem"
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
    Ref,
    PropType,
    toRefs
} from 'vue-demi'
import { v4 } from 'uuid'
import { DlTextTransformOptions } from '../../shared/types'
import { getColor } from '../../../utils'
import { arrowNavigationEvents } from '../../../hooks/use-arrow-navigation'

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
        modelValue: Boolean,
        split: { type: Boolean, default: false },
        dropdownIcon: { type: String, default: 'icon-dl-down-chevron' },
        contentClass: { type: String, default: '' },
        contentStyle: { type: [Array, String, Object], default: '' },
        mainButtonStyle: { type: [Array, String, Object], default: '' },
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
        menuMaxWidth: { type: String, default: null },
        disableMainButton: Boolean,
        disableDropdown: Boolean,
        noIconAnimation: Boolean,
        disabled: Boolean,
        color: { type: String!, default: '' },
        inheritIconColor: Boolean,
        label: { type: String, default: '' },
        textColor: { type: String!, default: '' },
        size: { type: String, default: 'm' },
        contained: { type: Boolean, default: true },
        fluid: Boolean,
        icon: { type: String, required: false, default: '' },
        iconSize: { type: String, required: false, default: '20px' },
        iconTooltip: {
            type: String,
            required: false,
            default: null
        },
        flat: Boolean,
        transform: {
            type: String as PropType<DlTextTransformOptions>,
            default: 'default',
            validator: (value: DlTextTransformOptions): boolean =>
                Object.values(DlTextTransformOptions).includes(value)
        },
        outlined: Boolean,
        padding: { type: String, default: '5px' },
        fitContent: Boolean,
        noWrap: { type: Boolean, default: false, required: false },
        overflow: { type: Boolean, default: false, required: false },
        tooltip: { type: String, default: null, required: false },
        arrowNavItems: {
            type: Array as PropType<any[]>,
            default: () => [] as any[]
        },
        contentGap: {
            type: String,
            required: false,
            default: null
        },
        zIndex: {
            type: [String, Number],
            default: null
        },
        mainButtonHoverColor: {
            type: String,
            required: false,
            default: null
        },
        mainButtonFontSize: {
            type: String,
            required: false,
            default: 'm'
        }
    },
    emits: [
        'update:model-value',
        'update:model-value',
        'click',
        'icon-clicked',
        'before-show',
        'show',
        'before-hide',
        'hide',
        ...arrowNavigationEvents
    ],

    setup(props, { emit, slots }) {
        const vm = getCurrentInstance()
        const proxy = vm!.proxy!
        const { textColor } = toRefs(props)

        const showing = ref<boolean>(!!props.modelValue) as Ref<boolean>
        const menuRef = ref(null)

        const attributes = computed(() => {
            const acc: Record<string, string> = {
                'aria-expanded': showing.value === true ? 'true' : 'false',
                'aria-haspopup': 'true'
            }

            if (
                props.disabled === true ||
                (props.split === false && props.disableMainButton === true) ||
                props.disableDropdown === true
            ) {
                acc['aria-disabled'] = 'true'
            }

            return acc
        })

        const menuModel = computed({
            get: () => props.modelValue,
            set: (val) => emit('update:model-value', val)
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

        const buttonCSSStyles = computed(() => {
            return {
                '--dl-button-border-left': props.outlined
                    ? 'none'
                    : 'var(--dl-color-white)'
            }
        })

        const cssVars = computed(() => {
            return {
                '--justify-content': props.fluid
                    ? 'space-between'
                    : 'space-around',
                ...(props.contentGap && {
                    '--dl-button-content-gap': props.contentGap
                })
            }
        })

        watch(
            () => props.modelValue,
            (val) => {
                if (menuRef.value) {
                    ;(menuRef!.value as Record<string, Function>)[
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
            emit('update:model-value', true)
        }

        function onBeforeHide(e: Event) {
            showing.value = false
            emit('before-hide', e)
        }

        function onHide(e: Event) {
            emit('hide', e)
            emit('update:model-value', false)
        }

        function onClick(e: Event) {
            emit('click', e)
        }

        function onIconClicked(e: Event) {
            emit('icon-clicked', e)
        }

        function onClickHide(e: Event) {
            stop(e)
            hide(e)
            emit('click', e)
        }

        function toggle(evt: Event) {
            if (menuRef.value) {
                ;(menuRef.value as Record<string, Function>).toggle(evt)
            }
        }

        function show(evt?: Event) {
            if (menuRef.value) {
                ;(menuRef.value as Record<string, Function>).show(evt)
            }
        }

        function hide(evt?: any) {
            if (menuRef.value) {
                ;(menuRef.value as Record<string, Function>).hide(evt)
            }
        }
        const setHighlightedIndex = (value: any) => {
            emit('highlightedIndex', value)
        }
        const handleSelectedItem = (value: any) => {
            emit('selected-item', value)
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

        const getIconColor = computed(() => {
            if (props.inheritIconColor) {
                return null
            }

            if (props.disabled) {
                return 'dl-color-disabled'
            }

            if (props.textColor) {
                return props.textColor
            }

            if (props.outlined) {
                return 'dl-color-secondary'
            }

            if (props.flat) {
                return 'dl-color-darker'
            }

            if (props.color) {
                return props.color
            }

            return 'dl-color-white'
        })

        const separatorColor = computed<string>(() => {
            if (props.disabled) {
                return 'var(--dl-color-disabled)'
            }

            if (props.textColor) {
                return computedTextColor.value ?? 'var(--dl-color-white)'
            }

            if (props.outlined) {
                return 'var(--dl-color-secondary)'
            }

            return 'var(--dl-color-white)'
        })

        const computedTextColor = computed(() => getColor(textColor.value))

        return {
            uuid: `dl-dropdown-button-${v4()}`,
            identifierClass,
            iconClass,
            menuRef,
            attributes,
            buttonCSSStyles,
            showing,
            onBeforeShow,
            onBeforeHide,
            onShow,
            onHide,
            onClick,
            onIconClicked,
            onClickHide,
            toggle,
            show,
            hide,
            menuModel,
            props,
            setHighlightedIndex,
            handleSelectedItem,
            cssVars,
            getIconColor,
            computedTextColor,
            separatorColor
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
        width: 0.7px;
        height: 60%;
    }

    &--simple {
        ::v-deep .dl-button-no-wrap {
            padding-right: 8px;
        }
        &__title {
            display: flex;
            align-items: center;
            justify-content: var(--justify-content);
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
    height: fit-content;
    .dl-button-content {
        line-height: unset;
    }
}
</style>
