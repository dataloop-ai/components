<template>
    <div class="dl-file-tabs">
        <div ref="tabsContainer" class="dl-file-tabs__container">
            <div
                v-for="file in openFiles"
                :key="file.file.id"
                class="dl-file-tabs__tab"
                :class="{
                    'dl-file-tabs__tab--active': file.file.id === activeFileId,
                    'dl-file-tabs__tab--dirty': file.isDirty
                }"
                @click="$emit('select', file.file)"
                @mousedown.middle="$emit('close', file.file)"
            >
                <dl-icon
                    :icon="getFileIcon(file.file)"
                    size="14px"
                    class="dl-file-tabs__icon"
                />
                <span class="dl-file-tabs__name">{{ file.file.name }}</span>
                <span v-if="file.isDirty" class="dl-file-tabs__dirty-indicator"
                >●</span
                >
                <dl-button
                    icon="icon-dl-close"
                    flat
                    round
                    size="10px"
                    class="dl-file-tabs__close"
                    @click.stop="$emit('close', file.file)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { OpenFile, getFileIcon, FileNode } from '../types'
import { DlIcon } from '../../../essential'
import { DlButton } from '../../../basic'

export default defineComponent({
    name: 'FileTabs',
    components: {
        DlIcon,
        DlButton
    },
    props: {
        openFiles: {
            type: Array as PropType<OpenFile[]>,
            required: true
        },
        activeFileId: {
            type: String,
            default: ''
        }
    },
    emits: ['select', 'close'],
    setup() {
        return {
            getFileIcon: (file: FileNode) => getFileIcon(file)
        }
    }
})
</script>

<style scoped lang="scss">
.dl-file-tabs {
    background: var(--dl-color-panel-background);
    border-bottom: 1px solid var(--dl-color-separator);
    min-height: 35px;

    &__container {
        display: flex;
        overflow-x: auto;
        scrollbar-width: thin;

        &::-webkit-scrollbar {
            height: 4px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }

        &::-webkit-scrollbar-thumb {
            background: var(--dl-color-separator);
            border-radius: 2px;
        }
    }

    &__tab {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        cursor: pointer;
        border-right: 1px solid var(--dl-color-separator);
        background: var(--dl-color-bg);
        transition: background-color 0.15s ease;
        min-width: 0;
        max-width: 180px;
        position: relative;

        &:hover {
            background: var(--dl-color-hover);

            .dl-file-tabs__close {
                opacity: 1;
            }
        }

        &--active {
            background: var(--dl-color-panel-background);
            border-bottom: 2px solid var(--dl-color-secondary);

            &::after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 0;
                right: 0;
                height: 1px;
                background: var(--dl-color-panel-background);
            }
        }

        &--dirty {
            .dl-file-tabs__name {
                font-style: italic;
            }
        }
    }

    &__icon {
        flex-shrink: 0;
        color: var(--dl-color-medium);
    }

    &__name {
        font-size: 13px;
        color: var(--dl-color-darker);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__dirty-indicator {
        color: var(--dl-color-warning);
        font-size: 10px;
        margin-left: -4px;
    }

    &__close {
        flex-shrink: 0;
        opacity: 0;
        margin-left: auto;
        transition: opacity 0.15s ease;

        &:hover {
            opacity: 1 !important;
        }
    }
}
</style>
