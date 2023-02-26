<template>
    <component
        :is="as"
        :id="uuid"
        class="list-item-wrapper"
    >
        <hr
            class="separator"
            :class="{ 'separator--visible': bordered }"
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
            <dl-item-section
                v-if="startIcon"
                side
            >
                <dl-icon
                    :icon="startIcon"
                    :color="startIconColor"
                    :size="startIconSize"
                />
            </dl-item-section>
            <slot />
            <dl-item-section
                v-if="endIcon"
                side
            >
                <dl-icon
                    :icon="endIcon"
                    :color="endIconColor"
                    :size="endIconSize"
                />
            </dl-item-section>
        </div>
    </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import DlItemSection from '../DlItemSection.vue'
import DlIcon from '../DlIcon.vue'
import {
    itemHoverColor,
    itemActiveColor,
    itemCursor,
    itemBorder,
    itemColor
} from './utils'
import { wave, waveTrigger } from '../../utils'
import { v4 } from 'uuid'

export default defineComponent({
    name: 'DlListItem',
    components: {
        DlItemSection,
        DlIcon
    },
    directives: {
        wave,
        waveTrigger
    },
    props: {
        disabled: Boolean,
        clickable: Boolean,
        bordered: Boolean,
        withWave: Boolean,
        startIcon: { type: String, required: false, default: '' },
        endIcon: { type: String, required: false, default: '' },
        as: {
            type: String,
            default: 'div'
        },
        startIconColor: {
            type: String,
            required: false,
            default: 'dl-color-darker'
        },
        endIconColor: {
            type: String,
            required: false,
            default: 'dl-color-darker'
        },
        startIconSize: {
            type: String,
            default: '12px'
        },
        endIconSize: {
            type: String,
            default: '12px'
        },
        height: { type: String, default: null, required: false },
        padding: { type: String, default: null, required: false }
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
                '--dl-list-item-border': itemBorder(this.bordered),
                '--dl-list-item-color': itemColor(this.disabled),
                '--dl-list-item-height': this.height ?? '28px',
                '--dl-list-item-padding': this.padding ?? '0px 10px'
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
}

.dl-list-item {
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
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
        margin: 5px 0;
    }
}

.dl-list-spaced {
    margin: 5px 0;
}

.dl-list-item-disabled {
    color: var(--dl-color-disabled) !important;
    & > div > i::before {
        color: var(--dl-color-disabled) !important;
    }
}
</style>
