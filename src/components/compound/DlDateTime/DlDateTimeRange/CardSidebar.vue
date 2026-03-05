<template>
    <div class="card-sidebar">
        <div class="card-sidebar--header">
            <span>Select by</span>
        </div>
        <div class="card-sidebar--content">
            <div
                v-for="option in options"
                :key="option.key"
                class="card-sidebar--item"
                :class="{
                    'card-sidebar--item-active': option.key === currentOption,
                    'card-sidebar--item-disabled': option.disabled
                }"
                @click="handleClick(option)"
            >
                <div class="card-sidebar--focus_helper" />
                {{ capitalizeFirstLetter(option.title) }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DayTypeOption, MonthTypeOption } from './types'

export default defineComponent({
    props: {
        options: {
            type: Array as PropType<DayTypeOption[] | MonthTypeOption[]>,
            default: () => [] as DayTypeOption[]
        },
        currentOption: {
            type: String,
            default: ''
        }
    },
    emits: ['click'],
    methods: {
        handleClick(value: DayTypeOption | MonthTypeOption) {
            if (value.disabled) return
            this.$emit('click', value)
        },
        capitalizeFirstLetter(value: string) {
            return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
        }
    }
})
</script>
<style lang="scss" scoped>
.card-sidebar {
    display: flex;
    flex-direction: column;
    text-align: left;
    border-right: 1px solid var(--dl-color-separator);
    height: 100%;

    &--header {
        color: var(--dl-color-lighter);
        font-size: 10px;
        font-style: normal;
        font-weight: normal;
        line-height: 12px;
        text-transform: uppercase;
        padding: 10px 0 10px 10px;
    }

    &--item {
        position: relative;
        font-size: 12px;
        line-height: 14px;
        line-height: 14px;
        transition: color 0.3s, background-color 0.3s;
        white-space: nowrap;
        padding: 7px 10px;
        cursor: pointer;
        background-color: var(--dell-white);
        color: var(--dell-gray-800);

        &-active {
            background-color: var(--dell-blue-100);
            color: var(--dell-blue-600);
        }

        &-disabled {
            color: var(--dl-color-disabled);
        }
    }

    &--focus_helper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background-color: currentColor;
        opacity: 0;
        transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1),
            opacity 0.4s cubic-bezier(0.25, 0.8, 0.5, 1);
    }
}

.card-sidebar--item:not(.card-sidebar--item-disabled):not(
        .card-sidebar--item-active
    ):hover {
    background-color: var(--dell-blue-100);
    color: var(--dell-blue-600);

    .card-sidebar--focus_helper {
        opacity: 0.15;
    }
}

.card-sidebar--item:not(.card-sidebar--item-disabled):not(
        .card-sidebar--item-active
    ):active {
    background-color: var(--dell-blue-200);
    color: var(--dell-blue-600);

    .card-sidebar--focus_helper {
        opacity: 0.15;
    }
}
</style>
