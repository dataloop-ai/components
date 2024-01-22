<template>
    <div>
        <DlMarkdown :text="mdText" />
    </div>
</template>

<script lang="ts">
import { DlMarkdown } from '../components'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    components: {
        DlMarkdown
    },
    setup() {
        const mdText = `# Hi
## This is a markdown demo
### It's a simple demo
#### It's a simple demo
##### It's a simple demo

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
        return {
            mdText
        }
    }
})
</script>
