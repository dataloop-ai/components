import { DlMarkdown } from '../'

export default {
    title: 'Library/Components/DlMarkDown',
    component: DlMarkdown
}

const Template = () => ({
    components: { DlMarkdown },
    setup() {
        const rawMD = `# h1 Hi
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
        return {
            rawMD
        }
    },
    template: `
    <div>
        <dl-markdown>{{rawMD}}</dl-markdown>
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {}
