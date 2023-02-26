<template>
    <div
        :id="uuid"
        class="avatar"
        :style="cssVars"
        @click="handleClick"
    >
        <span class="avatar-content">
            <span v-if="name">
                {{ computedLetters }}
            </span>
            <slot v-else />
            <dl-tooltip v-if="tooltip">
                {{ tooltip }}
            </dl-tooltip>
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import DlTooltip from './DlTooltip.vue'
import { getColor } from '../utils'
import { v4 } from 'uuid'

export default defineComponent({
    components: {
        DlTooltip
    },
    props: {
        textColor: { type: String, default: 'dl-color-white' },
        color: { type: String, default: 'dl-color-secondary' },
        size: { type: String, default: '20px' },
        name: { type: String, default: null },
        tooltip: { type: String, default: null }
    },
    data() {
        return {
            uuid: `dl-avatar-${v4()}`
        }
    },
    computed: {
        computedLetters(): string {
            const firstLetters = this.name
                .split(' ')
                .map((w) => w[0])
                .join('')
            if (firstLetters.length === 1) {
                return firstLetters[0]
            }
            return `${firstLetters[0]}${firstLetters[firstLetters.length - 1]}`
        },
        cssVars(): Record<string, string> {
            return {
                '--dl-avatar-bg-color': getColor(
                    this.color,
                    'dl-color-secondary'
                ),
                '--dl-avatar-text-color': getColor(
                    this.textColor,
                    'dl-color-white'
                ),
                '--dl-avatar-size': this.size
            }
        }
    },
    methods: {
        handleClick(e: MouseEvent) {
            this.$emit('click', e)
        }
    }
})
</script>

<style lang="scss" scoped>
.avatar {
    width: var(--dl-avatar-size);
    height: var(--dl-avatar-size);
    border-radius: 50%;
    user-select: none;
    overflow: hidden;
    color: var(--dl-avatar-text-color);
    background-color: var(--dl-avatar-bg-color);
    &::v-deep img {
        height: var(--dl-avatar-size);
        width: var(--dl-avatar-size);
    }
}

.avatar-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: calc(var(--dl-avatar-size) / 10 * 6);
    line-height: 1;
}
</style>
