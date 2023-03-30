<template>
    <div class="dl-time-counter">
        <div
            class="dl-time-counter--item"
            :class="{
                'dl-time-counter--item-active': hour === currentHour
            }"
            @click="handleHourClick(hour)"
        >
            <span>{{ hour }}</span>
        </div>
        <div
            class="dl-time-counter--item"
            :class="{
                'dl-time-counter--item-active': minute === currentMinute
            }"
            @click="handleMinuteClick(minute)"
        >
            <span>{{ minute }}</span>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    props: {
        hour: {
            type: String,
            required: true
        },
        minute: {
            type: String,
            required: true
        },
        currentHour: {
            type: String,
            required: true
        },
        currentMinute: {
            type: String,
            required: true
        }
    },
    emits: ['set-hour', 'set-minute'],
    methods: {
        handleHourClick(value: string) {
            this.$emit('set-hour', value)
        },

        handleMinuteClick(value: string) {
            this.$emit('set-minute', value)
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-time-counter {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &--item {
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 10px;
        cursor: pointer;
        color: var(--dl-color-darker);
    }

    &--item-active {
        font-size: 12px;
        color: var(--dl-color-text-buttons);
        background-color: var(--dl-color-secondary);
    }
}
</style>
