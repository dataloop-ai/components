<template>
    <div
        :id="uuid"
        role="tab"
        :tabindex="disabled ? -1 : tabindex"
        flat
        :class="classNames"
        :style="cssFontSize"
        @click="onClick"
        @keydown="onKeydown"
        @keyup="onKeyup"
    >
        {{ label }}
        <span>
            <dl-icon
                v-if="showTooltip"
                :size="iconSize"
                :inline="false"
                icon="icon-dl-info"
                class="info-icon"
                color="dl-color-lighter"
            />
            <dl-tooltip v-if="showTooltip === true">
                {{ tooltip }}
            </dl-tooltip>
        </span>
    </div>
</template>
<script lang="ts">
import { DlTooltip } from '../../../shared'
import { DlIcon } from '../../../essential'
import { defineComponent } from 'vue-demi'
import { stopAndPrevent } from '../../../../utils'
import { v4 } from 'uuid'

export default defineComponent({
    name: 'DlTab',
    components: {
        DlTooltip,
        DlIcon
    },
    props: {
        label: { type: String, required: true },
        name: { type: String, required: true },
        isActive: { type: Boolean, default: false },
        noCaps: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        vertical: { type: Boolean, default: false },
        showTooltip: { type: Boolean, default: false },
        tooltip: { type: String, default: null },
        tabindex: { type: String, default: '0' },
        fontSize: { type: String, default: '18px' }
    },
    emits: ['click'],
    data() {
        return {
            uuid: `dl-tab-${v4()}`
        }
    },
    computed: {
        iconSize(): string {
            const fontSize = parseInt(this.fontSize)
            return `${fontSize - 2 < 0 ? 0 : fontSize - 6}px`
        },
        cssFontSize(): Record<string, string> {
            return {
                '--dl-tab-font-size': this.fontSize
            }
        },
        classNames(): string {
            let classes = 'dl-tab'

            if (this.vertical) {
                classes = classes + ' dl-tab--vertical'
            } else {
                classes = classes + ' dl-tab--simple'
            }

            if (this.isActive) {
                classes = classes + ' dl-tab--active'
            }

            if (this.disabled) {
                classes = classes + ' dl-tab--disabled'
            }
            return classes
        }
    },
    methods: {
        onClick(e: Event) {
            if (!this.disabled) {
                this.$emit('click', this.name, e)
            }
        },
        onKeydown(e: KeyboardEvent) {
            if (e.key === 'Enter' || e.key === ' ') {
                stopAndPrevent(e)
            }
        },
        onKeyup(e: KeyboardEvent) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.onClick(e as Event)
            }
        }
    }
})
</script>
<style scoped lang="scss">
.dl-tab {
    padding: 12px 16px;
    color: var(--dl-color-lighter);
    transition: all 200ms;
    display: flex;
    align-items: center;
    justify-content: center;
    &--active {
        color: var(--dl-color-secondary);
        border-color: var(--dl-color-secondary) !important;
        cursor: default;
    }
    &--simple {
        font-size: var(--dl-tab-font-size);
        border-bottom: 1px solid var(--dl-color-separator);
        &.active {
            border-color: var(--dl-color-secondary);
        }
    }
    &--vertical {
        padding: 5px 10px;
        font-size: var(--dl-tab-font-size);
        line-height: 14px;
        border-color: var(--dl-color-separator) !important;
        &:not(:last-child) {
            border-right: 1px solid var(--dl-color-separator);
        }
    }
    &--disabled {
        cursor: not-allowed;
        color: var(--dl-color-disabled);
        border-color: var(--dl-color-separator) !important;
        &:hover {
            color: var(--dl-color-disabled) !important;
        }
    }
    &:hover {
        color: var(--dl-color-hover);
        border-color: var(--dl-color-hover);
    }
    cursor: pointer;
    flex-grow: 1;
}
.info-icon {
    margin: 0px 5px;
}
</style>
