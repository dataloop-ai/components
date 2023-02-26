<template>
    <div
        v-if="suggestions.length > 0"
        class="dl-suggestions-dropdown"
    >
        <dl-menu
            :target="defaultTarget"
            :offset="offset"
            :disabled="disabled"
            fit
            :model-value="modelValue"
            @update:modelValue="$emit('update:modelValue', $event)"
        >
            <dl-list>
                <dl-list-item
                    v-for="item in suggestions"
                    :key="item"
                    :clickable="true"
                    @click="$emit('set-input-value', item)"
                >
                    {{ item }}
                </dl-list-item>
            </dl-list>
        </dl-menu>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlMenu } from '../DlMenu'
import DlList from '../DlList.vue'
import { DlListItem } from '../DlListItem'

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
    computed: {
        defaultTarget() {
            return '.dl-smart-search-input__textarea'
        }
    }
})
</script>
<style lang="scss" scoped></style>
