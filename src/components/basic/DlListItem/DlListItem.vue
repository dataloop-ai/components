<template>
    <component
        :is="type"
        :id="uuid"
        class="list-item-wrapper"
    >
        <div
            v-wave="!disabled && withWave"
            :class="[
                {
                    'dl-list-item': true,
                    'dl-list-item-disabled': disabled,
                    'dl-list-spaced': bordered
                },
                'row'
            ]"
            :style="cssItemVars"
            @click="onClick"
        >
            <slot name="prefix" />
            <slot />
            <slot name="suffix" />
        </div>
        <dl-separator v-if="separator" />
    </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlItemSection } from '../../shared'
import { DlIcon, DlSeparator } from '../../essential'
import { itemHoverColor, itemActiveColor, itemCursor, itemColor } from './utils'
import { wave, waveTrigger } from '../../../utils'
import { v4 } from 'uuid'

export default defineComponent({
    name: 'DlListItem',
    components: {
        DlItemSection,
        DlSeparator,
        DlIcon
    },
    directives: {
        wave,
        waveTrigger
    },
    props: {
        disabled: Boolean,
        clickable: Boolean,
        separator: Boolean,
        withWave: Boolean,
        type: {
            type: String,
            default: 'div'
        },
        height: { type: String, default: null, required: false },
        padding: { type: String, default: null, required: false },
        highlighted: {
            type: Boolean
        }
    },
    emits: ['click'],
    data() {
        return {
            uuid: `dl-list-item-${v4()}`
        }
    },
    computed: {
        isClickable(): boolean {
            return this.clickable && !this.disabled
        },
        cssItemVars(): Record<string, string> {
            return {
                '--dl-list-item-hover': itemHoverColor(this.isClickable),
                '--dl-list-item-active': itemActiveColor(this.isClickable),
                '--dl-list-item-cursor': itemCursor(
                    this.isClickable,
                    this.disabled
                ),
                '--dl-list-item-color': itemColor(this.disabled),
                '--dl-list-item-height': this.height ?? '28px',
                '--dl-list-item-padding': this.padding ?? '0px 10px',
                '--dl-list-item-bg-color': this.highlighted
                    ? 'var(--dl-color-fill-hover)'
                    : 'transparent'
            }
        }
    },
    methods: {
        onClick(e: MouseEvent) {
            if (this.isClickable) {
                this.$emit('click', e)
            }
        }
    }
})
</script>

<style scoped lang="scss">
.list-item-wrapper {
    width: 100%;
    border-left: var(--dl-list-item-border-left);
    margin-bottom: 4px;
}

.dl-list-item {
    -webkit-tap-highlight-color: transparent;
    background-color: var(--dl-list-item-bg-color);
    outline: 0px;
    border: 0px;
    margin: 0px;
    width: 100%;
    border-radius: 0px;
    cursor: var(--dl-list-item-cursor);
    user-select: none;
    vertical-align: middle;
    appearance: none;
    color: var(--dl-list-item-color);
    display: flex;
    -webkit-box-flex: 1;
    flex-grow: 1;
    -webkit-box-pack: start;
    flex-wrap: nowrap;
    justify-content: flex-start;
    -webkit-box-align: center;
    align-items: center;
    position: relative;
    text-decoration: none;
    min-width: 0px;
    box-sizing: border-box;
    text-align: left;
    min-height: var(--dl-list-item-height);
    height: 100%;
    padding: var(--dl-list-item-padding);
    font-size: var(--dl-font-size-body);
    line-height: 14px;
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    &:hover {
        background-color: var(--dl-list-item-hover);
    }
    &:active {
        background-color: var(--dl-list-item-active);
    }
}

.separator {
    border: none;
    border-top: 1px solid var(--dl-color-separator);
    display: none;
    &--visible {
        display: block;
    }
}

.dl-list-item-disabled {
    color: var(--dl-color-disabled) !important;
    & > div > i::before {
        color: var(--dl-color-disabled) !important;
    }
}
</style>
