import { mount, type DOMWrapper } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import { DlMarkdown } from '../src/components'

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

describe('DlMarkdown', () => {
    describe('should render the markdown content correctly', () => {
        let wrapper: any
        let markdownContainer: any

        beforeAll(() => {
            wrapper = mount(DlMarkdown, {
                slots: { default: () => rawMD }
            })

            markdownContainer = wrapper.find('div.dl-mark-down')
        })

        it('should render headers', () => {
            const expectedHeaders = [
                '<h1>h1 Hi</h1>',
                '<h2>h2 This is a markdown demo</h2>',
                "<h3>h3 It's a simple demo</h3>",
                "<h4>h4 It's a simple demo</h4>",
                "<h5>h5 It's a simple demo</h5>",
                "<h6>h6 It's a simple demo</h6>"
            ]
            expectedHeaders.forEach((element) =>
                expect(markdownContainer.html()).toContain(element)
            )
        })

        it('should render emphasis paragraph', () => {
            const expectedParagraph = "<p><em>It's a simple demo</em></p>"
            expect(markdownContainer.html()).toContain(expectedParagraph)
        })

        it('should render bold paragraph', () => {
            const expectedParagraph =
                "<p><strong>It's a simple demo</strong></p>"
            expect(markdownContainer.html()).toContain(expectedParagraph)
        })

        it('should render emphasis bold paragraph', () => {
            const expectedParagraph =
                "<p><em><strong>It's a simple demo</strong></em></p>"
            expect(markdownContainer.html()).toContain(expectedParagraph)
        })

        it('should render blockquote', () => {
            const blockquiteElement = markdownContainer.find('blockquote')
            expect(blockquiteElement.exists()).toBe(true)
            expect(blockquiteElement.text()).toBe("It's a simple demo")
        })

        it('should render list', () => {
            const listElement = markdownContainer.find('ul')
            expect(listElement.exists()).toBe(true)
            expect(listElement.findAll('li').length).toBeGreaterThan(0)
        })

        it('should render checkboxes', () => {
            const checkboxElements = markdownContainer.findAll(
                'input[type="checkbox"]'
            )
            expect(checkboxElements.length).toBeGreaterThan(0)
            expect(
                checkboxElements.some(
                    (checkbox: DOMWrapper<HTMLInputElement>) => {
                        return (
                            checkbox.element.disabled &&
                            checkbox.element.checked
                        )
                    }
                )
            ).toBe(true)
        })

        it('should render links', () => {
            const linkElement = markdownContainer.find('a')
            expect(linkElement.exists()).toBe(true)
            expect(linkElement.attributes('href')).toBe(
                "'https://www.google.com'"
            )
            expect(linkElement.text()).toBe("It's a simple demo")
        })

        it('should render inline code', () => {
            const expectedInlineCode = "<code>It's a simple demo</code>"
            expect(markdownContainer.html()).toContain(expectedInlineCode)
        })

        it('should render code block', () => {
            const codeElement = markdownContainer.find('pre > code:first-child')
            expect(codeElement.element.parentElement.tagName).toBe('PRE')
            expect(codeElement.classes().includes('hljs')).toBe(true)
            expect(codeElement.classes().includes('language-javascript')).toBe(
                true
            )
            expect(codeElement.text()).toContain('highlight = ')

            const spanElements = codeElement.findAll('span')
            expect(spanElements.length).toBe(2)
            expect(spanElements.at(0).classes()).toContain('hljs-keyword')
            expect(spanElements.at(0).text()).toContain('const')

            expect(spanElements.at(1).classes()).toContain('hljs-string')
            expect(spanElements.at(1).text()).toContain('code')
        })
    })
})
