<template>
    <div>
        <div>
            <dl-input
                v-model="inputValue"
                placeholder="No items selected"
                size="l"
                has-prepend
                padding-prop="0px 0px 0px 0px"
                :border-left="inputBorderLeft"
                @clear="clearAutocomplete"
                @update:model-value="onChange"
                @focus="onActiveInput"
            >
                <template #prepend>
                    <dl-icon
                        style="margin-bottom: 5px"
                        icon="icon-dl-search"
                        size="12px"
                    />
                </template>
            </dl-input>
        </div>
        <div>
            <dl-list clickable>
                <template #default="{ clickable }">
                    <dl-list-item
                        v-for="(item, itemIndex) in results"
                        :key="itemIndex"
                        :clickable="clickable"
                        :border-left="`2px solid ${item.color}`"
                        :end-icon="
                            item.name === inputValue ? `icon-dl-approve` : ''
                        "
                        :style="`background-color: ${activeBackground(
                            item.name
                        )}`"
                        :highlighted="itemIndex === highlightedIndex"
                        @click="handleOption(item)"
                    >
                        <dl-item-section no-wrap>
                            <dl-ellipsis
                                color="dl-color-darker"
                                :text="item.name"
                            />
                        </dl-item-section>
                    </dl-list-item>
                </template>
            </dl-list>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, PropType } from 'vue-demi'
import { useArrowNavigation } from '../../../hooks/use-arrow-navigation'
import {
    DlList,
    DlItemSection,
    DlListItem,
    DlInput,
    DlIcon,
    DlEllipsis
} from '../../../components'

type TListAutocomplete = {
    name: string
    color: string
}

export default defineComponent({
    name: 'ListAutocomplete',
    components: {
        DlList,
        DlItemSection,
        DlListItem,
        DlInput,
        DlIcon,
        DlEllipsis
    },
    props: {
        items: {
            type: Array,
            default: () => Array as PropType<any[]>
        }
    },
    emit: ['selectedOption'],
    setup(props, ctx) {
        const inputValue = ref('')
        const isInputActive = ref(false)
        const inputBorderLeft = ref('')
        const results = ref(null)
        const { selectedItem, highlightedIndex } = useArrowNavigation(
            results,
            isInputActive
        )
        watch(selectedItem, (value: any) => {
            handleOption(value)
        })
        const filterResults = () => {
            results.value = props.items.filter((item: any) => {
                return (
                    item.name
                        .toLowerCase()
                        .indexOf(inputValue.value.toLowerCase()) > -1
                )
            })
        }
        const onChange = () => {
            filterResults()
        }
        const activeBackground = (name: string) =>
            name === inputValue.value ? 'var(--dl-color-fill)' : 'transparent'

        onMounted(() => {
            filterResults()
        })

        const handleOption = (item: TListAutocomplete) => {
            inputValue.value = item.name
            inputBorderLeft.value = `2px solid ${item.color}`
            ctx.emit('selectedOption', item)
        }
        const clearAutocomplete = () => {
            inputBorderLeft.value = ''
            ctx.emit('selectedOption', null)
        }
        const onActiveInput = () => {
            isInputActive.value = true
        }

        return {
            handleOption,
            inputValue,
            clearAutocomplete,
            filterResults,
            results,
            onChange,
            inputBorderLeft,
            activeBackground,
            onActiveInput,
            selectedItem,
            highlightedIndex
        }
    }
})
</script>

<style scoped lang="scss"></style>
