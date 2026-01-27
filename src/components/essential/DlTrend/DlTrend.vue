<template>
    <div :id="uuid" class="trend-wrapper">
        <span
            v-if="withArrow"
            class="direction-arrow"
            :class="{
                down: isDown
            }"
            :style="{ '--trend-triangle-color': computedColor }"
        />
        <span class="value">
            {{ computedValue }}
        </span>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, PropType } from 'vue-demi'
import { getColor } from '../../../utils'

const colorValidator = (val: string | null) =>
    val === 'negative' || val === 'positive' || val === null

const getColorByName = (name: string) => {
    if (name === 'negative') {
        return 'dell-red-500'
    } else if (name === 'positive') {
        return 'dell-green-500'
    } else {
        return 'dell-gray-800'
    }
}

const getColorByDirection = (direction: string) => {
    if (direction === 'up') {
        return 'dell-green-500'
    } else {
        return 'dell-red-500'
    }
}

export default defineComponent({
    name: 'DlTrend',
    props: {
        value: {
            type: [Number, String],
            required: true
        },
        direction: {
            type: String,
            default: 'up',
            validator: (val) => val === 'up' || val === 'down'
        },
        color: {
            type: String as PropType<'negative' | 'positive' | null>,
            default: null,
            validator: colorValidator
        }
    },
    data() {
        return {
            uuid: `dl-trend-${v4()}`
        }
    },
    computed: {
        computedValue(): string {
            if (typeof this.value === 'number') {
                return `${this.value}%`
            }
            return this.value
        },
        isUp(): boolean {
            return this.direction === 'up'
        },
        isDown(): boolean {
            return this.direction === 'down'
        },
        computedColor(): string {
            if (this.color !== null || !colorValidator(this.color)) {
                return getColor(getColorByName(this.color))
            }
            return getColor(getColorByDirection(this.direction))
        },
        withArrow(): boolean {
            return !(this.value === 0 || this.value === '0')
        }
    }
})
</script>
<style scoped lang="scss">
.trend-wrapper {
    display: flex;
    gap: 3px;
    align-items: center;
}
.value {
    font-size: var(--dl-font-size-body);
    line-height: 1;
    padding: 2px 0;
    color: var(--dell-gray-800);
}
.direction-arrow {
    width: 8px;
    height: 8px;
    clip-path: polygon(50% 5%, 4% 80%, 96% 80%);
    background-color: var(--trend-triangle-color);
    &.down {
        transform: rotate(180deg);
    }
}
</style>
