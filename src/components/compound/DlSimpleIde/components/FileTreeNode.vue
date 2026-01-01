<template>
    <div class="dl-file-tree-node">
        <div
            class="dl-file-tree-node__item"
            :class="{
                'dl-file-tree-node__item--selected': node.id === selectedId,
                'dl-file-tree-node__item--folder': node.type === 'folder'
            }"
            :style="{ paddingLeft: `${depth * 12 + 8}px` }"
            @click="handleClick"
            @dblclick="handleDoubleClick"
            @contextmenu.prevent="showContextMenu"
        >
            <dl-icon
                v-if="node.type === 'folder'"
                :icon="
                    node.isExpanded
                        ? 'icon-dl-down-chevron'
                        : 'icon-dl-right-chevron'
                "
                size="10px"
                class="dl-file-tree-node__chevron"
                @click.stop="toggleFolder"
            />
            <span v-else class="dl-file-tree-node__spacer" />
            <dl-icon
                :icon="fileIcon"
                size="14px"
                class="dl-file-tree-node__icon"
                :class="`dl-file-tree-node__icon--${node.type}`"
            />
            <span v-if="!isRenaming" class="dl-file-tree-node__name">
                {{ node.name }}
            </span>
            <input
                v-else
                ref="renameInput"
                v-model="newName"
                class="dl-file-tree-node__rename-input"
                @blur="finishRename"
                @keydown.enter="finishRename"
                @keydown.esc="cancelRename"
                @click.stop
            />
        </div>
        <div
            v-if="node.type === 'folder' && node.isExpanded && node.children"
            class="dl-file-tree-node__children"
        >
            <file-tree-node
                v-for="child in sortedChildren"
                :key="child.id"
                :node="child"
                :selected-id="selectedId"
                :depth="depth + 1"
                :allow-delete="allowDelete"
                :allow-rename="allowRename"
                @select="$emit('select', $event)"
                @toggle="$emit('toggle', $event)"
                @delete="$emit('delete', $event)"
                @rename="(node, name) => $emit('rename', node, name)"
            />
        </div>
        <dl-menu
            v-if="showMenu"
            :model-value="showMenu"
            :offset="[menuPosition.x, menuPosition.y]"
            @update:model-value="showMenu = false"
        >
            <dl-list>
                <dl-list-item v-if="allowRename" clickable @click="startRename">
                    <dl-item-section>
                        <dl-icon icon="icon-dl-edit" size="14px" />
                    </dl-item-section>
                    <dl-item-section>Rename</dl-item-section>
                </dl-list-item>
                <dl-list-item
                    v-if="allowDelete"
                    clickable
                    @click="handleDelete"
                >
                    <dl-item-section>
                        <dl-icon icon="icon-dl-trash" size="14px" />
                    </dl-item-section>
                    <dl-item-section>Delete</dl-item-section>
                </dl-list-item>
            </dl-list>
        </dl-menu>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, nextTick } from 'vue-demi'
import { FileNode, getFileIcon } from '../types'
import { DlIcon, DlMenu, DlList } from '../../../essential'
import { DlListItem } from '../../../basic'
import { DlItemSection } from '../../../shared'

export default defineComponent({
    name: 'FileTreeNode',
    components: {
        DlIcon,
        DlMenu,
        DlList,
        DlListItem,
        DlItemSection
    },
    props: {
        node: {
            type: Object as PropType<FileNode>,
            required: true
        },
        selectedId: {
            type: String,
            default: ''
        },
        depth: {
            type: Number,
            default: 0
        },
        allowDelete: {
            type: Boolean,
            default: true
        },
        allowRename: {
            type: Boolean,
            default: true
        }
    },
    emits: ['select', 'toggle', 'delete', 'rename'],
    setup(props, { emit }) {
        const showMenu = ref(false)
        const menuPosition = ref({ x: 0, y: 0 })
        const isRenaming = ref(false)
        const newName = ref('')
        const renameInput = ref<HTMLInputElement | null>(null)

        const fileIcon = computed(() => getFileIcon(props.node))

        const sortedChildren = computed(() => {
            if (!props.node.children) return []
            return [...props.node.children].sort((a, b) => {
                // Folders first
                if (a.type !== b.type) {
                    return a.type === 'folder' ? -1 : 1
                }
                // Then alphabetically
                return a.name.localeCompare(b.name)
            })
        })

        const handleClick = () => {
            if (props.node.type === 'folder') {
                emit('toggle', props.node)
            }
            emit('select', props.node)
        }

        const handleDoubleClick = () => {
            if (props.node.type === 'file') {
                emit('select', props.node)
            }
        }

        const toggleFolder = () => {
            emit('toggle', props.node)
        }

        const showContextMenu = (event: MouseEvent) => {
            if (props.node.readonly) return
            menuPosition.value = { x: event.clientX, y: event.clientY }
            showMenu.value = true
        }

        const startRename = () => {
            showMenu.value = false
            newName.value = props.node.name
            isRenaming.value = true
            nextTick(() => {
                renameInput.value?.focus()
                renameInput.value?.select()
            })
        }

        const finishRename = () => {
            if (
                isRenaming.value &&
                newName.value &&
                newName.value !== props.node.name
            ) {
                emit('rename', props.node, newName.value)
            }
            isRenaming.value = false
        }

        const cancelRename = () => {
            isRenaming.value = false
            newName.value = ''
        }

        const handleDelete = () => {
            showMenu.value = false
            emit('delete', props.node)
        }

        return {
            showMenu,
            menuPosition,
            isRenaming,
            newName,
            renameInput,
            fileIcon,
            sortedChildren,
            handleClick,
            handleDoubleClick,
            toggleFolder,
            showContextMenu,
            startRename,
            finishRename,
            cancelRename,
            handleDelete
        }
    }
})
</script>

<style scoped lang="scss">
.dl-file-tree-node {
    &__item {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        cursor: pointer;
        transition: background-color 0.15s ease;

        &:hover {
            background: var(--dl-color-hover);
        }

        &--selected {
            background: var(--dl-color-secondary);

            &:hover {
                background: var(--dl-color-secondary);
            }
        }
    }

    &__chevron {
        flex-shrink: 0;
        cursor: pointer;
        opacity: 0.7;

        &:hover {
            opacity: 1;
        }
    }

    &__spacer {
        width: 10px;
        flex-shrink: 0;
    }

    &__icon {
        flex-shrink: 0;

        &--folder {
            color: var(--dl-color-warning);
        }

        &--file {
            color: var(--dl-color-medium);
        }
    }

    &__name {
        font-size: 13px;
        color: var(--dl-color-darker);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
    }

    &__rename-input {
        flex: 1;
        font-size: 13px;
        padding: 2px 4px;
        border: 1px solid var(--dl-color-secondary);
        border-radius: 2px;
        background: var(--dl-color-bg);
        color: var(--dl-color-darker);
        outline: none;

        &:focus {
            border-color: var(--dl-color-secondary);
        }
    }

    &__children {
        // Children are automatically indented via depth prop
    }
}
</style>
