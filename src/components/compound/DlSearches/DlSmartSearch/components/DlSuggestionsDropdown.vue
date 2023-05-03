<template>
    <div
        v-if="suggestions.length > 0"
        class="dl-suggestions-dropdown"
    >
        <dl-menu
            :target="defaultTarget"
            :offset="offset"
            :disabled="disabled"
            fit-container
            :model-value="modelValue"
            :arrow-nav-items="suggestions"
            @update:modelValue="emitModelValue($event)"
            @show="onShow"
            @hide="onHide"
            @highlightedIndex="setHighlightedIndex"
            @handleSelectedItem="handleSelectedItem"
        >
            <dl-list>
                <dl-list-item
                    v-for="(item, suggestionIndex) in suggestions"
                    :key="item"
                    :clickable="true"
                    :is-highlighted="suggestionIndex === highlightedIndex"
                    @click="handleOption(item)"
                >
                    {{ item }}
                </dl-list-item>
            </dl-list>
        </dl-menu>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue-demi'
import { DlMenu, DlList } from '../../../../essential'
import { DlListItem } from '../../../../basic'

export default defineComponent({
    components: {
        DlMenu,
        DlList,
        DlListItem
    },
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: {
        expanded: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        modelValue: {
            type: Boolean,
            default: false
        },
        suggestions: {
            type: Array as PropType<string[]>,
            default: () => [] as string[]
        },
        offset: {
            type: Array as PropType<number[]>,
            default: () => [0, 0]
        }
    },
    emits: ['set-input-value', 'update:modelValue'],
    setup(props, { emit }) {
        const isMenuOpen = ref(false)
        const highlightedIndex = ref(-1)
        const onShow = (value: any) => {
            isMenuOpen.value = !!value
        }
        const onHide = (value: any) => {
            isMenuOpen.value = !value
        }

        const setHighlightedIndex = (value: any) => {
            highlightedIndex.value = value
        }
        const handleSelectedItem = (value: any) => {
            handleOption(value)
        }
        const emitModelValue = (event: any) => {
            emit('update:modelValue', event)
        }
        const handleOption = (item: any) => {
            emit('set-input-value', item)
        }

        return {
            setHighlightedIndex,
            handleSelectedItem,
            highlightedIndex,
            onShow,
            onHide,
            emitModelValue,
            handleOption
        }
    },
    computed: {
        defaultTarget() {
            return '.dl-smart-search-input__textarea'
        }
    }
})
</script>
<style lang="scss" scoped></style>
