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
                    'dl-list-item-disabled': disabled
                },
                'row'
            ]"
            :style="cssItemVars"
            @click="onClick"
        >
            <slot name="prefix">
                <dl-item-section
                    v-if="startIcon"
                    side
                    style="display: flex"
                >
                    <dl-icon
                        :icon="startIconData.icon"
                        :color="startIconData.color"
                        :size="startIconData.size"
                    />
                </dl-item-section>
            </slot>
            <slot />
            <slot name="suffix">
                <dl-item-section
                    v-if="endIcon"
                    side
                    style="display: flex"
                >
                    <dl-icon
                        :icon="endIconData.icon"
                        :color="endIconData.color"
                        :size="endIconData.size"
                    />
                </dl-item-section>
            </slot>
        </div>
        <dl-separator v-if="separator" />
    </component>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue-demi'
import { DlItemSection } from '../../shared'
import { DlIcon, DlSeparator } from '../../essential'
import { itemHoverColor, itemActiveColor, itemCursor, itemColor } from './utils'
import { wave, waveTrigger } from '../../../utils'
import { v4 } from 'uuid'
import { isObject } from 'lodash'

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
        },
        startIcon: {
            type: Object as PropType<
                | {
                      icon: string
                      color?: string
                      size?: string
                  }
                | string
            >,
            default: null,
            validator: (value: any) => {
                if (value) {
                    if (isObject(value) as any) {
                        return value.icon && typeof value.icon === 'string'
                    } else {
                        return typeof value === 'string'
                    }
                }
                return true
            }
        },
        endIcon: {
            type: Object as PropType<
                | {
                      icon: string
                      color?: string
                      size?: string
                  }
                | string
            >,
            default: null,
            validator: (value: any) => {
                if (value) {
                    if (isObject(value) as any) {
                        return value.icon && typeof value.icon === 'string'
                    } else {
                        return typeof value === 'string'
                    }
                }
                return true
            }
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
        },
        startIconData(): { icon: string; color: string; size: string } {
            return Object.assign(
                { color: 'dl-color-darker', size: '16px' },
                isObject(this.startIcon)
                    ? this.startIcon
                    : { icon: this.startIcon }
            )
        },
        endIconData(): { icon: string; color: string; size: string } {
            return Object.assign(
                { color: 'dl-color-darker', size: '16px' },
                isObject(this.endIcon) ? this.endIcon : { icon: this.endIcon }
            )
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
