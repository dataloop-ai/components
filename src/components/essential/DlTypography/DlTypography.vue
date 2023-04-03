<template>
    <component
        :is="variant"
        :id="uuid"
        :class="classes"
        :style="styles"
    >
        <slot />
    </component>
</template>
<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, PropType } from 'vue-demi'
import { getColor } from '../../../utils'

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'

const sizes = ['h1', 'h2', 'h3', 'h4', 'body', 'small']

export default defineComponent({
    name: 'DlTypography',
    props: {
        variant: {
            type: String as PropType<Variant>,
            required: false,
            default: 'p'
        },
        size: {
            type: String,
            required: false,
            default: null
        },
        uppercase: Boolean,
        bold: Boolean,
        color: {
            type: String,
            default: 'dl-color-darker'
        }
    },
    data() {
        return {
            uuid: `dl-typography-${v4()}`
        }
    },
    computed: {
        styles(): Record<string, string | number> {
            const styles: Record<string, string | number> = {
                color: getColor(this.color as string, 'dl-color-darker'),
                textTransform: this.uppercase ? 'uppercase' : 'none',
                fontWeight: this.bold ? 'bold' : 400
            }

            if (!this.size) {
                if (sizes.includes(this.variant)) {
                    styles.fontSize = this.variant as string
                }
            } else {
                styles.fontSize = this.size as string
            }

            return styles
        },
        classes(): string[] {
            return [`dl-typography dl-typography--${this.size}`]
        }
    }
})
</script>
<style scoped lang="scss">
.dl-typography {
    margin: 0;
    padding: 0;
    &--h1 {
        font-size: var(--dl-font-size-h1);
    }
    &--h2 {
        font-size: var(--dl-font-size-h2);
    }
    &--h3 {
        font-size: var(--dl-font-size-h3);
    }
    &--h4 {
        font-size: var(--dl-font-size-h4);
    }
    &--body {
        font-size: var(--dl-font-size-body);
    }
    &--small {
        font-size: var(--dl-font-size-small);
    }

    // to deal with quasar conflicts.
    line-height: initial !important;
}
</style>
