<template>
    <div v-if="suggestions.length > 0" class="dl-suggestions-dropdown">
        <dl-menu
            ref="menu"
            :target="defaultTarget"
            :offset="offset"
            :disabled="disabled"
            :model-value="modelValue"
            :arrow-nav-items="suggestions"
            :trigger-percentage="triggerPercentage"
            :auto-close="false"
            :toggle-key="null"
            max-width="250px"
            max-height="40vh"
            :ignore-events="['click']"
            menu-class="DlSmartSearchSuggestionsMenu"
            @update:model-value="emitModelValue($event)"
            @show="onShow"
            @hide="onHide"
            @highlighted-item="setHighlightedIndex"
            @selected-item="handleSelectedItem"
            @escapekey="onEscapeKey"
        >
            <dl-list
                style="height: 100%; max-height: inherit; overflow-y: hidden"
            >
                <DlInfiniteScroll
                    :items="computedSuggestions"
                    :page-size="30"
                    style="height: 100%; max-height: inherit"
                >
                    <template #default="{ item, index }">
                        <dl-list-item
                            :clickable="true"
                            :highlighted="index === highlightedIndex"
                            @click="handleOption(item.value)"
                        >
                            <dl-ellipsis :text="removeQuotes(item.value)" />
                        </dl-list-item>
                    </template>
                </DlInfiniteScroll>
            </dl-list>
        </dl-menu>
    </div>
</template>
<script lang="ts">
import {
    computed,
    defineComponent,
    PropType,
    ref,
    toRefs,
    watch
} from 'vue-demi'
import { DlMenu, DlList, DlEllipsis } from '../../../../essential'
import { DlListItem } from '../../../../basic'
import { DlInfiniteScroll } from '../../../../shared'

export default defineComponent({
    components: {
        DlMenu,
        DlList,
        DlListItem,
        DlEllipsis,
        DlInfiniteScroll
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
        maxWidth: {
            type: String,
            default: null
        },
        /**
         * the % of the parent element that triggers the tooltips visibility
         */
        triggerPercentage: {
            type: Number,
            default: 1
        }
    },
    emits: ['set-input-value', 'update:model-value', 'escapekey', 'enterkey'],
    setup(props, { emit }) {
        const menu = ref(null)
        const { suggestions } = toRefs(props)

        const isMenuOpen = ref(false)
        const highlightedIndex = ref(-1)
        const onShow = () => {
            isMenuOpen.value = true
        }
        const onHide = () => {
            isMenuOpen.value = false
        }

        const setHighlightedIndex = (value: any) => {
            highlightedIndex.value = value

            const element =
                menu.value?.portalEl.querySelectorAll?.('.dl-list-item')[value]
            if (element) {
                if (element.scrollIntoViewIfNeeded) {
                    element.scrollIntoViewIfNeeded()
                } else {
                    element.scrollIntoView()
                }
            }
        }
        const handleSelectedItem = (value: any) => {
            if (!value) {
                // enter occurred on non selected values
                emit('enterkey')
                return
            }
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

        const onEscapeKey = () => {
            emit('escapekey')
            emit('update:model-value', false)
        }

        const removeQuotes = (item: any) => {
            const str = '' + item
            const match = str.match(/^'(.*)'$/)
            return match ? match[1].replace(/\\'/g, "'") : str
        }

        const updatePosition = () => {
            menu.value?.updatePosition()
        }

        watch(suggestions, () => {
            highlightedIndex.value = -1
        })

        const computedSuggestions = computed(() => {
            return (
                suggestions.value?.map((val: string) => ({
                    id: val,
                    value: val,
                    key: val
                })) ?? []
            )
        })

        return {
            menu,
            computedSuggestions,
            defaultTarget,
            setHighlightedIndex,
            handleSelectedItem,
            highlightedIndex,
            removeQuotes,
            onShow,
            onHide,
            emitModelValue,
            handleOption,
            onEscapeKey,
            updatePosition
        }
    }
})
</script>
<style lang="scss">
.DlSmartSearchSuggestionsMenu {
    overflow: hidden !important;
}
</style>
