<template>
    <div class="dl-file-explorer">
        <div class="dl-file-explorer__header">
            <span class="dl-file-explorer__title">{{ title }}</span>
            <div class="dl-file-explorer__actions">
                <dl-button
                    v-if="showOpenFolder"
                    icon="icon-dl-folder-open"
                    flat
                    round
                    size="12px"
                    tooltip="Open Folder"
                    @click="$emit('open-folder')"
                />
                <dl-button
                    v-if="allowCreate"
                    icon="icon-dl-add"
                    flat
                    round
                    size="12px"
                    tooltip="New File"
                    @click="$emit('create-file')"
                />
                <dl-button
                    v-if="allowCreate"
                    icon="icon-dl-folder-filled"
                    flat
                    round
                    size="12px"
                    tooltip="New Folder"
                    @click="$emit('create-folder')"
                />
            </div>
        </div>
        <div v-if="files.length === 0" class="dl-file-explorer__empty">
            <p>No files loaded</p>
            <dl-button
                v-if="showOpenFolder"
                label="Open Folder"
                icon="icon-dl-folder-open"
                @click="$emit('open-folder')"
            />
        </div>
        <div v-else class="dl-file-explorer__tree">
            <file-tree-node
                v-for="node in files"
                :key="node.id"
                :node="node"
                :selected-id="selectedId"
                :depth="0"
                :allow-delete="allowDelete"
                :allow-rename="allowRename"
                @select="handleSelect"
                @toggle="handleToggle"
                @delete="handleDelete"
                @rename="handleRename"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { FileNode } from '../types'
import FileTreeNode from './FileTreeNode.vue'
import { DlButton } from '../../../basic'

export default defineComponent({
    name: 'FileExplorer',
    components: {
        FileTreeNode,
        DlButton
    },
    props: {
        files: {
            type: Array as PropType<FileNode[]>,
            required: true
        },
        selectedId: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: 'Explorer'
        },
        allowCreate: {
            type: Boolean,
            default: true
        },
        allowDelete: {
            type: Boolean,
            default: true
        },
        allowRename: {
            type: Boolean,
            default: true
        },
        showOpenFolder: {
            type: Boolean,
            default: true
        }
    },
    emits: [
        'select',
        'toggle',
        'create-file',
        'create-folder',
        'delete',
        'rename',
        'open-folder'
    ],
    setup(props, { emit }) {
        const handleSelect = (node: FileNode) => {
            emit('select', node)
        }

        const handleToggle = (node: FileNode) => {
            emit('toggle', node)
        }

        const handleDelete = (node: FileNode) => {
            emit('delete', node)
        }

        const handleRename = (node: FileNode, newName: string) => {
            emit('rename', node, newName)
        }

        return {
            handleSelect,
            handleToggle,
            handleDelete,
            handleRename
        }
    }
})
</script>

<style scoped lang="scss">
.dl-file-explorer {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--dl-color-bg);
    border-right: 1px solid var(--dl-color-separator);
    user-select: none;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        border-bottom: 1px solid var(--dl-color-separator);
        background: var(--dl-color-panel-background);
    }

    &__title {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--dl-color-medium);
        letter-spacing: 0.5px;
    }

    &__actions {
        display: flex;
        gap: 2px;
    }

    &__tree {
        flex: 1;
        overflow-y: auto;
        padding: 4px 0;
    }

    &__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        height: 100%;
        text-align: center;

        p {
            font-size: 13px;
            color: var(--dl-color-medium);
            margin-bottom: 12px;
        }
    }
}
</style>
