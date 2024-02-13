<template>
    <div>
        <div v-for="(item, index) in typographyTypes" :key="index">
            <DlTypography
                :color="item.color"
                :size="item.size || item.variant"
                :variant="item.variant"
            >
                Typography {{ item ? item.variant : item }}
            </DlTypography>
        </div>

        <dl-typography variant="div" markdown>
            {{ rawMD }}
        </dl-typography>

        <DlButton>
            <dl-typography
                color="dl-color-tooltip-text"
                variant="p"
                size="small"
                bold
            >
                Typography Bold
            </dl-typography>
        </DlButton>
        <br />
        <br />
        <DlButton>
            <dl-typography
                color="dl-color-tooltip-text"
                variant="p"
                size="small"
                uppercase
            >
                Typography Uppercase
            </dl-typography>
        </DlButton>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlButton, DlTypography } from '../components'

export default defineComponent({
    name: 'DlTypographyDemo',
    components: {
        DlTypography,
        DlButton
    },
    data() {
        return {
            typographyTypes: [
                {
                    variant: 'h1'
                },
                {
                    variant: 'h2'
                },
                {
                    variant: 'h3'
                },
                {
                    variant: 'h4'
                },
                {
                    variant: 'h5'
                },
                {
                    variant: 'h6'
                },
                {
                    variant: 'p'
                },
                {
                    variant: 'pre'
                },
                {
                    variant: 'h1',
                    color: 'dl-color-secondary'
                },
                {
                    variant: 'body',
                    size: '30px',
                    color: 'dl-color-positive'
                },
                {
                    variant: 'p',
                    color: 'dl-color-warning'
                }
            ],
            rawMD: `# h1 Hi
## h2 This is a markdown demo
### h3 It's a simple demo
#### h4 It's a simple demo
##### h5 It's a simple demo
###### h6 It's a simple demo

*It's a simple demo*

**It's a simple demo**

***It's a simple demo***

> It's a simple demo
- [ ] It's a simple demo
- [x] It's a simple demo

[It's a simple demo]('https://www.google.com')

\`It's a simple demo\`
\`\`\`javascript
    const highlight = "code";
\`\`\`
`
        }
    }
})
</script>
