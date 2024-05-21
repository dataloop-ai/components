<template>
    <component :is="variant" :id="uuid" :class="classes" :style="styles">
        <slot />
    </component>
</template>
<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, PropType } from 'vue-demi'
import { getColor } from '../../../utils'
import { DlTextTransformOptions } from '../../shared/types'
import { DlTypographyVariant, DlTypographySizes } from './types'

export default defineComponent({
    name: 'DlTypography',
    props: {
        variant: {
            type: String as PropType<DlTypographyVariant>,
            required: false,
            default: 'p'
        },
        size: {
            type: String,
            required: false,
            default: null
        },
        transform: {
            type: String as PropType<DlTextTransformOptions>,
            default: 'default',
            validator: (value: DlTextTransformOptions): boolean =>
                Object.values(DlTextTransformOptions).includes(value)
        },
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
                textTransform: this.letterClass ? null : this.transform,
                fontWeight: this.bold ? 'bold' : 400
            }

            if (this.size && !DlTypographySizes.includes(this.size)) {
                styles.fontSize = this.size as string
            }

            return styles
        },
        letterClass(): string {
            if (this.transform === 'default') {
                return 'first-letter-capitalized'
            }
            return null
        },
        classes(): string[] {
            const classes = [`dl-typography`]

            if (this.size) {
                if (DlTypographySizes.includes(this.size)) {
                    classes.push(`dl-typography--${this.size}`)
                }
            } else {
                if (DlTypographySizes.includes(this.variant)) {
                    classes.push(`dl-typography--${this.variant}`)
                } else {
                    classes.push(`dl-typography--body`)
                }
            }

            if (this.letterClass) {
                classes.push(this.letterClass)
            }

            return classes
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
    &--h5 {
        font-size: var(--dl-font-size-h5);
    }
    &--h6 {
        font-size: var(--dl-font-size-h6);
    }
    &--body {
        font-size: var(--dl-font-size-body);
    }
    &--small {
        font-size: var(--dl-font-size-small);
    }

    // important needed above for sizing of h tags.. quasar conflict
    // to deal with quasar conflicts.
    line-height: initial !important;
}
</style>
