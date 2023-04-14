<template>
    <div
        class="card"
        :style="{ width, height }"
    >
        <div
            v-if="icon"
            class="card--icon"
        >
            <dl-icon
                :icon="icon.src"
                :styles="icon?.styles"
                :size="icon?.size || '50px'"
                :color="icon?.color || 'var(--dl-color-darker)'"
            />
        </div>
        <div
            v-else-if="image"
            class="card--image"
        >
            <img
                :src="image.src"
                :style="image?.styles"
                :alt="image?.alt"
            >
        </div>
        <div class="card--content">
            <div>
                <div class="card--header">
                    <span class="card--header_title">{{ title }}</span>
                    <span class="card--header_shortcut">{{
                        keyboardShortcut
                    }}</span>
                </div>
                <span class="card--content_text">{{ text }}</span>
            </div>
            <div class="card--links">
                <div
                    v-for="(link, idx) in links"
                    :key="idx"
                    class="card--links_linkItem"
                >
                    <div class="card--links_linkItem_icon">
                        <dl-icon
                            v-if="link.icon"
                            :icon="link.icon"
                            size="12px"
                        />
                    </div>
                    <div class="card--links_linkItem_link">
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
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlIcon } from '../DlIcon'
import { DlLink } from '../DlLink'
import { IconItem, ImageItem, LinkItem } from './types'

export default defineComponent({
    name: 'DlCard',
    components: { DlLink, DlIcon },
    props: {
        image: {
            type: Object as PropType<ImageItem>,
            default: null
        },
        icon: {
            type: Object as PropType<IconItem>,
            default: null
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
        links: {
            type: Array as PropType<LinkItem[]>,
            default: () => Array as PropType<LinkItem[]>
        },
        height: {
            type: String,
            default: 'auto'
        },
        width: {
            type: String,
            default: '200px'
        }
    }
})
</script>

<style lang="scss" scoped>
.card {
    color: var(--dl-color-darker);
    background-color: var(--dl-color-panel-background);
    border: 1px solid var(--dl-color-separator);
    border-radius: 2px;
    pointer-events: auto;

    &--content {
        padding: 16px 10px;
        &_text {
            font-size: 12px;
            color: var(--dl-color-medium);
        }
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

        &_linkItem {
            margin-right: 15px;
            color: var(--dl-color-secondary);
            font-size: 10px;
            display: flex;
            align-items: center;

            &_icon {
                margin-right: 7px;
                vertical-align: middle;
            }

            &_link {
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
