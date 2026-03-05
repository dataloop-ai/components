<template>
    <div :id="uuid" class="dl-progress-wrapper" :style="`width: ${width};`">
        <p
            v-if="label || labelSlot"
            data-test-id="progress-label"
            align="left"
            class="dl-progress-bar-label"
        >
            {{ label }}
            <slot name="label"> </slot>
        </p>
        <div class="progress-container">
            <span
                role="progressbar"
                class="dl-progress-bar"
                :aria-valuenow="indeterminate ? undefined : computedValue"
                :aria-valuemin="indeterminate ? undefined : 0"
                :aria-valuemax="indeterminate ? undefined : 100"
            >
                <span
                    :style="cssVars"
                    :class="{
                        indeterminate,
                        'dl-progress-bar-indicator': true
                    }"
                />
            </span>
            <p
                v-if="showValue && !indeterminate && !summary"
                class="dl-progress-bar-value"
            >
                {{ computedValue }}{{ showPercentage ? '%' : '' }}
            </p>
        </div>
        <div v-if="summary" class="summary">
            <div>
                {{ summary }}
            </div>
            <div>{{ computedValue }}%</div>
        </div>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent } from 'vue-demi'
import { getColor } from '../../../utils'

export default defineComponent({
    name: 'DlProgressBar',
    props: {
        color: {
            type: String,
            default: 'dell-blue-500'
        },
        label: {
            type: String,
            default: null
        },
        labelSlot: {
            type: Boolean,
            default: false
        },
        showValue: {
            type: Boolean,
            required: false,
            default: false
        },
        showPercentage: {
            type: Boolean,
            default: false
        },
        value: {
            type: Number,
            default: 0,
            validator: (value: number) => value >= 0 && value <= 1
        },
        indeterminate: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '5px'
        },
        summary: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            uuid: `dl-progress-bar-${v4()}`
        }
    },
    computed: {
        computedValue(): number {
            return Number((this.value * 100).toFixed(2).replace(/[.,]00$/, ''))
        },
        cssVars(): Record<string, string> {
            return {
                '--dl-progress-bar-width': `${this.computedValue}%`,
                '--dl-progress-bar-height': `${this.height}`,
                '--dl-progress-bar-bg': getColor(this.color)
            }
        }
    }
})
</script>

<style scoped lang="scss">
.dl-progress-bar-label {
    margin: 0;
    font-size: var(--dl-font-size-body);
    line-height: 1;
    color: var(--dell-gray-600);
}
.dl-progress-bar-value {
    margin: 0;
    font-size: var(--dl-font-size-body);
    line-height: 1;
    color: var(--dell-gray-800);
}
.dl-progress-bar {
    overflow: hidden;
    width: 100%;
    height: var(--dl-progress-bar-height);
    border-radius: 2px;
    background-color: var(--dell-gray-300);
    margin: 6px 0;
}
.dl-progress-bar-indicator {
    transition: width 0.5s;
    display: block;
    height: var(--dl-progress-bar-height);
    border-radius: 2px;
    background-color: var(--dl-progress-bar-bg);
    width: var(--dl-progress-bar-width);
}
.progress-container {
    display: flex;
    column-gap: 10px;
    align-items: center;
}
.indeterminate {
    animation: indeterminate-loading;
    animation-duration: 3s;
    animation-iteration-count: infinite;
}

.summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
    text-transform: capitalize;
    font-feature-settings: 'cpsp' on;
    color: var(--dell-gray-500);
}
@keyframes indeterminate-loading {
    0% {
        width: 0%;
        margin-left: 0%;
    }
    25% {
        width: 60%;
        margin-left: 25%;
    }
    50% {
        width: 30%;
        margin-left: 100%;
    }
    50.1% {
        width: 0%;
        margin-left: 0%;
    }
    75% {
        width: 70%;
        margin-left: 30%;
    }
    100% {
        width: 10%;
        margin-left: 100%;
    }
}
</style>
