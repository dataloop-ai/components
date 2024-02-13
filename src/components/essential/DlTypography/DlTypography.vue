<template>
    <component :is="variant" :id="uuid" :class="classes" :style="styles">
        <dl-markdown v-if="markdown"><slot /></dl-markdown>
        <slot v-else />
    </component>
</template>
<script lang="ts">
import { v4 } from 'uuid'

import { defineComponent, PropType, computed } from 'vue-demi'
import { getColor } from '../../../utils'
import { DlTextTransformOptions } from '../../shared/types'

import { DlMarkdown } from '../DlMarkDown'

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'pre'

const sizes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'small', 'pre']

export default defineComponent({
    name: 'DlTypography',
    components: { DlMarkdown },
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
        markdown: Boolean,
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
    setup(props) {
        const uuid = `dl-typography-${v4()}`

        const letterClass = computed(() => {
            if (props.transform === 'default') {
                return 'first-letter-capitalized'
            }
            return null
        })

        const styles = computed(() => {
            const styles: Record<string, string | number> = {
                color: getColor(props.color as string, 'dl-color-darker'),
                textTransform: letterClass.value ? null : props.transform,
                fontWeight: props.bold ? 'bold' : 400
            }

            if (props.size && !sizes.includes(props.size)) {
                styles.fontSize = props.size as string
            }

            return styles
        })

        const classes = computed(() => {
            const classes = [`dl-typography`]

            if (props.size) {
                if (sizes.includes(props.size)) {
                    classes.push(`dl-typography--${props.size}`)
                }
            } else {
                if (sizes.includes(props.variant)) {
                    classes.push(`dl-typography--${props.variant}`)
                } else {
                    classes.push(`dl-typography--body`)
                }
            }

            if (letterClass.value) {
                classes.push(letterClass.value)
            }

            return classes
        })

        return {
            letterClass,
            styles,
            classes,
            uuid
        }
    }
})
</script>
<style lang="scss" scoped>
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
    &--pre {
        display: flex;
        justify-content: center;
        padding: 1rem;
        white-space: pre-wrap;
    }

    // important needed above for sizing of h tags.. quasar conflict
    // to deal with quasar conflicts.
    line-height: initial !important;
}
</style>
