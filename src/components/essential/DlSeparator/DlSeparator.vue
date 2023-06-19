<template>
    <div :style="styles" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue-demi'
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
        indent: {
            type: String,
            default: '10px'
        }
    },
    setup(props) {
        const { color, height, type, indent, width } = props
        const styles = computed(() => {
            let styles
            switch (type) {
                case 'horizontal':
                    styles = {
                        backgroundColor: color,
                        width: width ?? 'auto',
                        height: height ?? '1px',
                        marginTop: indent,
                        marginBottom: indent
                    }
                    break
                case 'vertical':
                    styles = {
                        backgroundColor: color,
                        width: width ?? '1px',
                        height: height ?? 'auto',
                        marginLeft: indent,
                        marginRight: indent
                    }
                    break
                default:
                    styles = {}
            }
            return styles
        })
        return { styles }
    }
})
</script>
