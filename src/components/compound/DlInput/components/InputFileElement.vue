<template>
    <div
        class="input-file-element"
        @mouseenter="visibleMenu = true"
        @mouseleave="visibleMenu = false"
    >
        <div
            v-if="file.image"
            class="file-image"
            :style="`background-image: url(${file.image})`"
        />
        <div
            v-else
            class="file-image input-file-element--default"
        >
            <dl-icon
                size="50px"
                icon="icon-dl-file"
            />
        </div>
        <div
            v-if="visibleMenu"
            class="input-file-element__menu"
        >
            <dl-icon
                v-if="file.image"
                class="input-file-element--icon"
                icon="icon-dl-zoom-in"
                @click="$emit('zoom-image', file)"
            />
            <dl-icon
                class="input-file-element--icon"
                icon="icon-dl-edit"
                @click="$emit('rename-file', file)"
            />
            <dl-icon
                class="input-file-element--icon"
                icon="icon-dl-discard"
                @click="$emit('remove-file', file.id)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlInputFile } from '../types'
import { DlIcon } from '../../../essential'
export default defineComponent({
    components: {
        DlIcon
    },
    props: {
        file: {
            type: Object as PropType<DlInputFile>,
            default: null
        }
    },
    emits: ['remove-file', 'zoom-image', 'rename-file'],
    data() {
        return {
            visibleMenu: false
        }
    }
})
</script>

<style lang="scss" scoped>
.input-file-element {
    position: relative;
    &--default {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &__menu {
        background-color: var(--dl-color-panel-background);
        border-radius: 2px;
        padding: 5px;
        display: flex;
        gap: 5px;
        position: absolute;
        top: 5px;
        right: 5px;
    }
    &--icon {
        cursor: pointer;
    }
    padding: 5px;
}
.file-image {
    width: 100px;
    height: 100px;
    background-size: cover;
    background-position: center;
}
</style>
