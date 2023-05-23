<template>
    <span
        v-show="!!value.length"
        :id="uuid"
        :class="classes"
    >
        {{ value }}
    </span>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlInfoErrorMessage',
    props: {
        error: {
            type: Boolean,
            default: false
        },
        warning: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: ''
        },
        position: {
            type: String,
            default: 'below',
            validator(value: string): boolean {
                return ['above', 'below'].includes(value)
            }
        }
    },
    data() {
        return {
            uuid: `dl-info-error-message-${v4()}`
        }
    },
    computed: {
        classes(): string[] {
            const classes = []

            if (this.error) {
                classes.push('text-error')
            } else if (this.warning) {
                classes.push('text-warning')
            }

            classes.push(this.position === 'below' ? 'text' : 'text-above')

            return classes
        }
    }
})
</script>

<style scoped lang="scss">
.text {
    font-size: var(--dl-font-size-small);
    color: var(--dl-color-lighter);
    text-overflow: ellipsis;
    line-height: 11px;
    max-height: 22px;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
}

.text-error {
    color: var(--dl-color-negative) !important;
}

.text-warning {
    color: var(--dl-color-warning) !important;
}

.text-above {
    font-size: var(--dl-font-size-body);
    color: var(--dl-color-darker);
    text-overflow: ellipsis;
    line-height: 13px;
    max-height: 26px;
    white-space: pre-wrap;
    overflow: hidden;
    display: inline-block;
}
</style>
