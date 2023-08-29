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
            :trigger-percentage="triggerPercentage"
            :auto-close="false"
            @update:model-value="emitModelValue($event)"
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
                    :highlighted="suggestionIndex === highlightedIndex"
                    @click="handleOption(item)"
                >
                    {{ item }}
                </dl-list-item>
            </dl-list>
        </dl-menu>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue-demi'
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
        event: 'update:model-value'
    },
    props: {
        parentId: {
            type: String,
            required: true
        },
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
        },
        /**
         * the % of the parent element that triggers the tooltips visibility
         */
        triggerPercentage: {
            type: Number,
            default: 1
        }
    },
    emits: ['set-input-value', 'update:model-value'],
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
            emit('update:model-value', event)
        }
        const handleOption = (item: any) => {
            emit('set-input-value', item)
        }

        const defaultTarget = computed(() => {
            return `#dl-smart-search-input-text-area-${props.parentId}`
        })

        return {
            defaultTarget,
            setHighlightedIndex,
            handleSelectedItem,
            highlightedIndex,
            onShow,
            onHide,
            emitModelValue,
            handleOption
        }
    }
})
</script>
<style lang="scss" scoped></style>
