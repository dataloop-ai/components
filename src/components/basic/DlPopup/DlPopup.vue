<template>
    <dl-menu
        ref="menuRef"
        v-bind="menuProps"
        :model-value="modelV"
        @click="handleClick"
        @escapekey="handleEscape"
        @before-show="handleBeforeShow"
        @before-hide="handleBeforeHide"
        @show="handleShow"
        @hide="handleHide"
        @update:model-value="updateModelValue"
    >
        <draggable-upper
            v-if="draggable"
            class="popup-dialog-upper"
            @move="movePopup"
        />
        <popup-header
            v-if="hasHeaderSlot || hasCloseButtonSlot || withCloseButton"
            :title="title"
            :additional-info="additionalInfo"
            :subtitle="subtitle"
            :with-close-button="withCloseButton"
            @close-button-click="handleCloseClick"
        >
            <template
                v-if="hasHeaderSlot"
                #header
            >
                <slot name="header" />
            </template>
            <template
                v-if="hasCloseButtonSlot"
                #close-button
            >
                <slot name="close-button" />
            </template>
        </popup-header>
        <div class="popup-content">
            <slot v-if="!isEmpty" />
            <dl-empty-state
                v-if="isEmpty && emptyStateProps"
                v-bind="emptyStateProps"
            >
                <template
                    v-for="(_, slot) in $slots"
                    #[slot]="props"
                >
                    <slot
                        :name="slot"
                        v-bind="props"
                    />
                </template>
            </dl-empty-state>
        </div>
        <div
            v-if="hasFooterSlot"
            class="popup-footer"
        >
            <slot name="footer" />
        </div>
    </dl-menu>
</template>

<script lang="ts">
import {
    defineComponent,
    getCurrentInstance,
    ref,
    watch,
    computed,
    PropType,
    Ref,
    toRef
} from 'vue-demi'

import { useAnchorProps } from '../../../hooks/use-anchor'
import {
    AnchorEvent,
    useModelToggleEmits,
    useModelToggleProps
} from '../../../hooks/use-model-toggle'
import { useTransitionProps } from '../../../hooks/use-transition'
import {
    validatePosition,
    validateOffset,
    setForcedPosition
} from '../../../utils/position-engine'
import DraggableUpper from './components/DraggableUpper.vue'
import PopupHeader from './components/PopupHeader.vue'
import { v4 } from 'uuid'
import { DlEmptyStateProps } from '../DlEmptyState/types'
import DlEmptyState from '../DlEmptyState/DlEmptyState.vue'
import { DlMenu } from '../../essential/DlMenu'

export default defineComponent({
    name: 'DlPopup',
    components: {
        PopupHeader,
        DraggableUpper,
        DlEmptyState,
        DlMenu
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        additionalInfo: { type: String, default: '' },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        withCloseButton: Boolean,
        draggable: Boolean,
        isEmpty: Boolean,
        emptyStateProps: {
            type: Object as PropType<DlEmptyStateProps>,
            default: null
        },

        ...useAnchorProps,
        ...useModelToggleProps,
        ...useTransitionProps,

        disabled: Boolean,
        persistent: Boolean,
        autoClose: Boolean,
        noRefocus: Boolean,
        fitContainer: Boolean,
        fitContent: Boolean,
        cover: Boolean,
        square: Boolean,
        anchor: {
            type: String,
            default: 'bottom middle',
            validator: validatePosition
        },
        self: {
            type: String,
            default: 'top middle',
            validator: validatePosition
        },
        offset: {
            type: Array,
            default: () => [0, 0],
            validator: validateOffset
        },
        scrollTarget: {
            type: String as PropType<Element | string>,
            default: null
        },
        touchPosition: Boolean,
        height: { type: String, default: 'auto' },
        width: { type: String, default: 'auto' },
        maxHeight: { type: String, default: 'auto' },
        maxWidth: { type: String, default: 'auto' },
        menuClass: {
            type: String,
            default: ''
        },
        arrowNavItems: {
            type: [String, Array, Object],
            default: () => [] as any[]
        },
        zIndex: {
            type: [Number, String],
            default: 'var(--dl-z-index-popup)'
        },
        /**
         * the % of the parent element that triggers the tooltips visibility
         * @default 0 - no hide occurs when trigger % is 0
         */
        triggerPercentage: {
            type: Number,
            default: 0
        }
    },
    emits: [...useModelToggleEmits, 'click', 'escapekey', 'close-button-click'],
    setup(props, { attrs, slots, emit }) {
        const vm = getCurrentInstance()

        const proxy = vm!.proxy!

        const menuRef: Ref<HTMLElement | null> = ref(null)

        const hasFooterSlot = computed(() => slots.footer !== undefined)

        const hasHeaderSlot = computed(() => slots.header !== undefined)

        const hasCloseButtonSlot = computed(
            () => slots['close-button'] !== undefined
        )

        const handleClick = (e: MouseEvent) => {
            emit('click', e)
        }

        const handleBeforeShow = (e: AnchorEvent) => {
            emit('before-show', e)
        }

        const handleBeforeHide = (e: AnchorEvent) => {
            emit('before-hide', e)
        }

        const handleShow = (e: AnchorEvent) => {
            emit('show', e)
        }

        const handleHide = (e: AnchorEvent) => {
            emit('hide', e)
        }

        const handleEscape = () => {
            emit('escapekey')
        }

        const handleCloseClick = () => {
            emit('update:model-value', false)
        }

        const updateModelValue = (val: boolean) => {
            emit('update:model-value', val)
        }

        const {
            draggable,
            additionalInfo,
            title,
            subtitle,
            withCloseButton,
            isEmpty,
            emptyStateProps,
            modelValue,
            ...menuProps
        } = props

        const modelV = toRef(props, 'modelValue')

        function movePopup(x: number, y: number) {
            const el = menuRef.value

            if (el === null) {
                return
            }

            setForcedPosition(
                {
                    el: (proxy.$refs.menuRef as any).innerRef,
                    offset: props.offset as number[],
                    anchorEl: (proxy as any).anchorEl as HTMLElement,
                    anchorOrigin: (proxy as any).anchorOrigin,
                    selfOrigin: (proxy as any).selfOrigin
                },
                {
                    top: y,
                    left: x
                }
            )
        }

        return {
            menuProps,
            modelV,
            handleCloseClick,
            uuid: (attrs.id as string)?.length
                ? (attrs.id as string)
                : `dl-popup-${v4()}`,
            hasCloseButtonSlot,
            hasFooterSlot,
            movePopup,
            hasHeaderSlot,
            menuRef,
            handleClick,
            handleEscape,
            handleBeforeShow,
            handleBeforeHide,
            handleShow,
            handleHide,
            updateModelValue
        }
    }
})
</script>

<style lang="scss" scoped>
.popup-dialog-upper {
    opacity: 0;
    position: absolute;
    top: 2px;
    cursor: pointer;
}
.popup-dialog-upper:hover {
    opacity: 1;
}

.popup-header {
    padding: var(--dl-popup-padding, 10px 0 16px 0);
}

.popup-content {
    max-width: 100%;
    padding: var(--dl-popup-padding, 16px 16px);
    height: 100%;
}

.popup-footer {
    padding: var(--dl-popup-padding, 20px 16px 16px);
}
</style>
