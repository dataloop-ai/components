<template>
    <dl-tooltip
        :hide-delay="delay"
        :delay="200"
        background-color="dl-color-panel-background"
        color="dl-color-darker"
        :anchor="anchor"
        :offset="offset"
        :self="self"
        :style="{
            border: '1px solid var(--dl-color-separator)',
            padding: 0,
            boxShadow: '0px 0px 28px -20px var(--dl-color-shadow)'
        }"
    >
        <div class="smart-tooltip">
            <div
                v-if="icon"
                class="smart-tooltip--icon"
            >
                <dl-icon
                    :icon="icon.src"
                    :styles="icon?.styles"
                    :size="icon?.size || '50px'"
                    :color="icon?.color || 'var(--dl-color-darker)'"
                />
            </div>
            <div
                v-else
                class="smart-tooltip--image"
            >
                <img
                    :src="image.src"
                    :style="image?.styles"
                    :alt="image?.alt"
                >
            </div>
            <div class="smart-tooltip--content">
                <div>
                    <div class="smart-tooltip--header">
                        <span class="smart-tooltip--header_title">{{
                            title
                        }}</span>
                        <span class="smart-tooltip--header_shortcut">{{
                            keyboardShortcut
                        }}</span>
                    </div>
                    <span>{{ text }}</span>
                </div>
                <div class="smart-tooltip--links">
                    <div
                        v-for="(link, idx) in links"
                        :key="idx"
                        class="smart-tooltip--links_link"
                    >
                        <dl-icon
                            v-if="link.icon"
                            :icon="link.icon"
                            size="12px"
                        />
                        <dl-link
                            :external="!!link.external"
                            :href="link.href"
                            :newtab="!!link.newtab"
                        >
                            {{ link.title }}
                        </dl-link>
                    </div>
                </div>
            </div>
        </div>
    </dl-tooltip>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlTooltip } from '../DlTooltip'
import { DlIcon } from '../DlIcon'
import { DlLink } from '../DlLink'
import { IconItem, ImageItem, LinkItem } from './types'
import {
    validateOffset,
    validatePosition
} from '../../../utils/position-engine'

export default defineComponent({
    name: 'DlSmartTooltip',
    components: { DlLink, DlIcon, DlTooltip },
    props: {
        image: {
            type: Object as PropType<ImageItem>,
            default: null
        },
        icon: {
            type: Object as PropType<IconItem>,
            default: null
        },
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
            default: () => [9, 9],
            validator: validateOffset
        },
        title: {
            type: String,
            default: ''
        },
        text: {
            type: String,
            default: ''
        },
        keyboardShortcut: {
            type: String,
            default: ''
        },
        delay: {
            type: Number,
            default: 2000
        },
        links: {
            type: Array as PropType<LinkItem[]>,
            default: () => Array as PropType<LinkItem[]>
        }
    }
})
</script>

<style lang="scss">
.smart-tooltip {
    width: 200px;
    pointer-events: auto;

    &--content {
        padding: 16px 10px;
    }

    &--header {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        &_title {
            color: var(--dl-color-darker);
            font-size: 14px;
            line-height: 16px;
            font-weight: 700;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        &_shortcut {
            color: #767676;
            font-size: 10px;
            line-height: 10px;
            border-radius: 2px;
            border: 1px solid #767676;
            padding: 4px;
            text-align: center;
            margin-bottom: 10px;
        }
    }
    &--links {
        margin-top: 16px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        &_link {
            margin-right: 15px;
            color: var(--dl-color-secondary);
            font-size: 10px;
            display: flex;
            align-items: center;

            i {
                margin-right: 7px;
                vertical-align: middle;
            }

            a {
                vertical-align: middle;
            }
        }
    }
    &--image {
        width: 200px;
        height: 100px;
        overflow: hidden;
        img {
            width: 100%;
        }
    }
    &--icon {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 34px;
        padding-bottom: 16px;
        color: var(--dl-color-darker);
    }
}
</style>
