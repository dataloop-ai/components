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

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div'

const legacySizes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'small']
const newTypographySizes = [
    'header1',
    'header4',
    'header5',
    'header6',
    'header6-medium',
    'body1',
    'body1-medium',
    'body2',
    'body2-medium',
    'body3'
]
const sizes = [...legacySizes, ...newTypographySizes]

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
        transform: {
            type: String as PropType<DlTextTransformOptions>,
            default: 'default',
            validator: (value: DlTextTransformOptions): boolean =>
                Object.values(DlTextTransformOptions).includes(value)
        },
        bold: Boolean,
        color: {
            type: String,
            default: null
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
                '--dl-typography-color': this.color
                    ? getColor(this.color as string, 'dell-gray-800')
                    : 'inherit',
                '--dl-typography-text-transform': this.letterClass
                    ? null
                    : this.transform,
                '--dl-typography-font-weight': this.bold ? 500 : 400
            }

            if (this.size && !sizes.includes(this.size)) {
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
                if (sizes.includes(this.size)) {
                    classes.push(`dl-typography--${this.size}`)
                }
            } else {
                if (sizes.includes(this.variant)) {
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
    color: var(--dl-typography-color);
    text-transform: var(--dl-typography-text-transform);
    font-weight: var(--dl-typography-font-weight);

    // important needed below for sizing of h tags.. quasar conflict
    // to deal with quasar conflicts.
    line-height: initial !important;

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

    &--header1 {
        font-family: var(--dl-typography-header-h1-font-family);
        font-size: var(--dl-typography-header-h1-font-size);
        line-height: var(--dl-typography-header-h1-line-height) !important;
        font-weight: var(--dl-typography-header-h1-font-weight);
    }
    &--header4 {
        font-family: var(--dl-typography-header-h4-font-family);
        font-size: var(--dl-typography-header-h4-font-size);
        line-height: var(--dl-typography-header-h4-line-height) !important;
        font-weight: var(--dl-typography-header-h4-font-weight);
    }
    &--header5 {
        font-family: var(--dl-typography-header-h5-font-family);
        font-size: var(--dl-typography-header-h5-font-size);
        line-height: var(--dl-typography-header-h5-line-height) !important;
        font-weight: var(--dl-typography-header-h5-font-weight);
    }
    &--header6 {
        font-family: var(--dl-typography-header-h6-font-family);
        font-size: var(--dl-typography-header-h6-font-size);
        line-height: var(--dl-typography-header-h6-line-height) !important;
        font-weight: var(--dl-typography-header-h6-font-weight);
    }
    &--header6-medium {
        font-family: var(--dl-typography-header-h6-font-family);
        font-size: var(--dl-typography-header-h6-font-size);
        line-height: var(--dl-typography-header-h6-line-height) !important;
        font-weight: var(--dl-typography-header-h6-medium-font-weight);
    }
    &--body1 {
        font-family: var(--dl-typography-body-body1-font-family);
        font-size: var(--dl-typography-body-body1-font-size);
        line-height: var(--dl-typography-body-body1-line-height) !important;
        font-weight: var(--dl-typography-body-body1-font-weight);
    }
    &--body1-medium {
        font-family: var(--dl-typography-body-body1-font-family);
        font-size: var(--dl-typography-body-body1-font-size);
        line-height: var(--dl-typography-body-body1-line-height) !important;
        font-weight: var(--dl-typography-body-body1-medium-font-weight);
    }
    &--body2 {
        font-family: var(--dl-typography-body-body2-font-family);
        font-size: var(--dl-typography-body-body2-font-size);
        line-height: var(--dl-typography-body-body2-line-height) !important;
        font-weight: var(--dl-typography-body-body2-font-weight);
    }
    &--body2-medium {
        font-family: var(--dl-typography-body-body2-font-family);
        font-size: var(--dl-typography-body-body2-font-size);
        line-height: var(--dl-typography-body-body2-line-height) !important;
        font-weight: var(--dl-typography-body-body2-medium-font-weight);
    }
    &--body3 {
        font-family: var(--dl-typography-body-body3-font-family);
        font-size: var(--dl-typography-body-body3-font-size);
        line-height: var(--dl-typography-body-body3-line-height) !important;
        font-weight: var(--dl-typography-body-body3-font-weight);
    }

    &:active {
        color: var(--dl-typography-color-active, var(--dl-typography-color));
    }
}
</style>
