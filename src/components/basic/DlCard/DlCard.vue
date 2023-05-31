<template>
    <div
        class="card"
        :style="[{ width, height }, computedStyles]"
    >
        <div
            v-if="icon && !isEmpty"
            class="card--icon"
        >
            <dl-icon
                :icon="icon.src"
                :styles="iconStyles"
                :size="iconSize"
                :color="iconColor"
            />
        </div>
        <div
            v-else-if="image && !isEmpty"
            class="card--image"
        >
            <img
                :src="image.src"
                :style="imageStyles"
                :alt="imageAlt"
            >
        </div>
        <div
            v-if="!isEmpty"
            class="card--content"
        >
            <div>
                <slot
                    v-if="!!$slots.header"
                    name="header"
                />
                <div
                    v-else
                    class="card--header"
                >
                    <span class="card--header_title">{{ title }}</span>
                    <span class="card--header_shortcut">{{
                        keyboardShortcut
                    }}</span>
                </div>
                <slot
                    v-if="!!$slots.content"
                    name="content"
                />
                <span
                    v-else
                    class="card--content_text"
                >{{ text }}</span>
            </div>
            <slot
                v-if="!!$slots.footer"
                name="footer"
            />
            <div
                v-else
                class="card--links"
            >
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
        <dl-empty-state
            v-if="isEmpty"
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
</template>

<script lang="ts">
import { isString } from 'lodash'
import { defineComponent, PropType } from 'vue-demi'
import { stringStyleToRecord } from '../../../utils'
import DlEmptyState from '../DlEmptyState/DlEmptyState.vue'
import { Props } from '../DlEmptyState/types'
import { DlIcon } from '../../essential/DlIcon'
import { DlLink } from '../../essential/DlLink'
import { IconItem, ImageItem, LinkItem } from './types'

export default defineComponent({
    name: 'DlCard',
    components: { DlLink, DlIcon, DlEmptyState },
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
        },
        styles: {
            type: [Object, String],
            default: null
        },
        isEmpty: Boolean,
        emptyStateProps: {
            type: Object as PropType<Props>,
            default: () => {}
        }
    },
    computed: {
        computedStyles(): Record<string, string> {
            return isString(this.styles)
                ? stringStyleToRecord(this.styles)
                : this.styles
        },
        iconStyles(): string {
            return this.icon?.styles ?? ''
        },
        iconSize(): string {
            return this.icon?.size ?? '50px'
        },
        iconColor(): string {
            return this.icon?.color ?? 'var(--dl-color-darker)'
        },
        imageStyles(): string {
            return this.image?.styles ?? ''
        },
        imageAlt(): string {
            return this.image?.alt ?? ''
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
    box-shadow: 0px 5px 15px 0px var(--dl-color-shadow);

    &--content {
        padding: 16px;
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
