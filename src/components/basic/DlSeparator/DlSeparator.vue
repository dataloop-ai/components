<template>
    <div :style="style" />
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { includes } from '../../../utils'

export default defineComponent({
    name: 'DlSeparator',
    props: {
        color: {
            type: String,
            default: 'var(--dl-color-separator)'
        },
        type: {
            type: String,
            default: 'horizontal',
            validator: (value: string) =>
                includes(['horizontal', 'vertical'], value)
        },
        width: {
            type: String,
            default: null
        },
        height: {
            type: String,
            default: null
        },
        margin: {
            type: String,
            default: '10px'
        }
    },
    setup(props) {
        const { type, width, height, margin, color } = props
        let style

        switch (type) {
            case 'horizontal':
                style = {
                    backgroundColor: color,
                    width: width || '300px',
                    height: height || '1px',
                    marginTop: margin,
                    marginBottom: margin
                }
                break
            case 'vertical':
                style = {
                    backgroundColor: color,
                    width: width || '1px',
                    height: height || '300px',
                    marginLeft: margin,
                    marginRight: margin
                }
                break
        }

        return { style }
    }
})
</script>
