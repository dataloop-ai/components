<template>
    <div :style="styles" />
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
        indent: {
            type: String,
            default: '10px'
        }
    },
    computed: {
        styles() {
            let styles
            switch (this.type) {
                case 'horizontal':
                    styles = {
                        backgroundColor: this.color,
                        width: this.width || '300px',
                        height: this.height || '1px',
                        marginTop: this.indent,
                        marginBottom: this.indent
                    }
                    break
                case 'vertical':
                    styles = {
                        backgroundColor: this.color,
                        width: this.width || '1px',
                        height: this.height || '300px',
                        marginLeft: this.indent,
                        marginRight: this.indent
                    }
                    break
            }
            return styles
        }
    }
})
</script>
