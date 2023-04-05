<template>
    <dl-tooltip
        :hide-delay="delay"
        :delay="200"
        background-color="dl-color-panel-background"
        color="dl-color-darker"
        :style="{
            border: '1px solid var(--dl-color-separator)',
            padding: 0
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
                    links
                </div>
            </div>
        </div>
    </dl-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlTooltip } from '../DlTooltip'
import DlIcon from '../DlIcon/DlIcon.vue'

export default defineComponent({
    name: 'DlSmartTooltip',
    components: { DlIcon, DlTooltip },
    props: {
        image: {
            type: Object,
            default: null
        },
        icon: {
            type: Object,
            default: null
        },
        position: {
            type: String,
            default: ''
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
        }
    }
})
</script>

<style lang="scss" scoped>
.smart-tooltip {
    width: 200px;
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
