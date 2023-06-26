<template>
    <div
        :theme="theme"
        class="code-editor"
        :class="{
            'hide-header': !header,
            scroll: scroll,
            'read-only': readOnly,
            wrap: wrap
        }"
        :style="{
            width: width,
            height: height,
            zIndex: zIndex,
            maxWidth: maxWidth,
            minWidth: minWidth,
            maxHeight: maxHeight,
            minHeight: minHeight
        }"
    >
        <div
            class="hljs"
            :style="{ borderRadius: borderRadius }"
        >
            <div
                v-if="header"
                class="header"
                :class="{ border: showLineNums }"
                :style="{
                    borderRadius: borderRadius + ' ' + borderRadius + ' 0 0'
                }"
            >
                <div class="row header-content">
                    <dl-select
                        v-if="displayLanguage"
                        v-model="selectedLanguage"
                        without-borders
                        :options="languagesOptions"
                        :disabled="languagesOptions.length <= 1"
                        :disabled-tooltip="null"
                        width="fit-content"
                    />
                    <dl-button
                        v-if="copyButton"
                        icon-color="dl-color-medium"
                        icon="icon-dl-copy"
                        size="14px"
                        round
                        flat
                        @click="copy"
                    />
                </div>
            </div>
            <div
                class="code-area"
                :style="{
                    borderRadius: header
                        ? '0 0 ' + borderRadius + ' ' + borderRadius
                        : borderRadius
                }"
            >
                <div
                    v-if="showLineNums"
                    ref="lineNums"
                    class="line-nums hljs"
                    :style="{
                        fontSize: fontSize,
                        paddingTop: header ? '10px' : padding,
                        paddingBottom: padding,
                        top: top + 'px'
                    }"
                >
                    <div>1</div>
                    <div
                        v-for="(num, index) in lineNum"
                        :key="index"
                    >
                        {{ num + 1 }}
                    </div>
                    <div>&nbsp;</div>
                </div>
                <textarea
                    ref="textarea"
                    title="textarea"
                    :readOnly="readOnly"
                    :style="{
                        fontSize: fontSize,
                        padding: !header
                            ? padding
                            : lineNums
                                ? '10px ' + padding + ' ' + padding
                                : '0 ' + padding + ' ' + padding,
                        marginLeft: showLineNums ? lineNumsWidth + 'px' : '0',
                        width: showLineNums
                            ? 'calc(100% - ' + lineNumsWidth + 'px)'
                            : '100%'
                    }"
                    :autofocus="autofocus"
                    spellcheck="false"
                    :value="modelValue == undefined ? content : modelValue"
                    @keydown.tab.prevent.stop="tab"
                    @scroll="calcScrollDistance"
                    @input="updateValue"
                />
                <pre
                    :style="{
                        paddingRight: scrollBarWidth + 'px',
                        paddingBottom: scrollBarHeight + 'px',
                        marginLeft: showLineNums ? lineNumsWidth + 'px' : '0',
                        width: showLineNums
                            ? 'calc(100% - ' + lineNumsWidth + 'px)'
                            : '100%'
                    }"
                >
        <code
          ref="code"
          :class="languageClass"
          :style="{
            top: top + 'px',
            left: left + 'px',
            fontSize: fontSize,
            padding: !header ? padding : lineNums ? '10px ' + padding + ' ' + padding : '0 ' + padding + ' ' + padding,
          }"
/>
      </pre>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import hljs from 'highlight.js'
import { computed, defineComponent, nextTick, PropType, ref } from 'vue-demi'
import { DlButton } from '../../../basic'
import { DlSelect } from '../../DlSelect'
import { DlToast } from '../../DlToast'
import '../styles/themes.css'
import '../styles/themes-base16.css'

export default defineComponent({
    name: 'CodeEditor',
    components: {
        DlSelect,
        DlButton
    },
    directives: {
        highlight: {
            mounted(el, binding) {
                nextTick(() => {
                    el.textContent = binding.value
                    hljs.highlightElement(el)
                })
            },
            updated(el, binding) {
                if (el.scrolling) {
                    el.scrolling = false
                } else {
                    el.textContent = binding.value
                    hljs.highlightElement(el)
                }
            }
        }
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            required: true,
            type: String
        },
        value: {
            type: String,
            default: null
        },
        lineNums: {
            type: Boolean,
            default: false
        },
        theme: {
            type: String,
            default: 'vs'
        },
        tabSpaces: {
            type: Number,
            default: 2
        },
        wrap: {
            type: Boolean,
            default: false
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        autofocus: {
            type: Boolean,
            default: false
        },
        header: {
            type: Boolean,
            default: true
        },
        width: {
            type: String,
            default: '540px'
        },
        height: {
            type: String,
            default: 'auto'
        },
        maxWidth: {
            type: String,
            default: 'inherit'
        },
        minWidth: {
            type: String,
            default: 'inherit'
        },
        maxHeight: {
            type: String,
            default: 'inherit'
        },
        minHeight: {
            type: String,
            default: 'inherit'
        },
        borderRadius: {
            type: String,
            default: '12px'
        },
        languages: {
            type: Array as PropType<string[][]>,
            default: () => [['javascript', 'JS']] as string[][]
        },
        langListWidth: {
            type: String,
            default: '110px'
        },
        langListHeight: {
            type: String,
            default: 'auto'
        },
        langListDisplay: {
            type: Boolean,
            default: false
        },
        displayLanguage: {
            type: Boolean,
            default: true
        },
        copyButton: {
            type: Boolean,
            default: true
        },
        zIndex: {
            type: String,
            default: '0'
        },
        fontSize: {
            type: String,
            default: '17px'
        },
        padding: {
            type: String,
            default: '20px'
        }
    },
    setup(props: any, { emit }) {
        const scrollBarWidth = ref(0)
        const scrollBarHeight = ref(0)
        const top = ref(0)
        const left = ref(0)
        const languageClass = ref('hljs language-' + props.languages[0][0])
        const languageTitle = ref(
            props.languages[0][1]
                ? props.languages[0][1]
                : props.languages[0][0]
        )
        const content = ref(props.value)
        const cursorPosition = ref(0)
        const insertTab = ref(false)
        const lineNum = ref(0)
        const lineNumsWidth = ref(0)
        const scrolling = ref(false)
        const textareaHeight = ref(0)
        const showLineNums = ref(props.wrap ? false : props.lineNums)
        const languagesOptions = computed(() => {
            return props.languages.map((lang: string[]) => {
                return {
                    value: lang[0],
                    label: lang[1] ? lang[1] : lang[0]
                }
            })
        })
        const selectedLanguage = ref(languagesOptions.value[0])

        return {
            scrollBarWidth,
            scrollBarHeight,
            top,
            left,
            languageClass,
            languageTitle,
            content,
            cursorPosition,
            insertTab,
            lineNum,
            lineNumsWidth,
            scrolling,
            textareaHeight,
            showLineNums,
            selectedLanguage,
            languagesOptions
        }
    },
    computed: {
        tabWidth() {
            let result = ''
            for (let i = 0; i < this.tabSpaces; i++) {
                result += ' '
            }
            return result
        },
        contentValue() {
            return this.modelValue == undefined
                ? this.content + '\n'
                : this.modelValue + '\n'
        },
        scroll() {
            return this.height == 'auto' ? false : true
        }
    },
    mounted() {
        this.$emit('lang', this.languages[0][0])
        this.$emit('content', this.content)
        this.$emit('textarea', this.$refs.textarea)
        this.resizer()
        ;(this.$refs.code as HTMLElement).textContent = this.contentValue
        hljs.highlightElement(this.$refs.code as HTMLElement)
    },
    updated() {
        if (this.insertTab) {
            (this.$refs.textarea as HTMLTextAreaElement).setSelectionRange(
                this.cursorPosition,
                this.cursorPosition
            )
            this.insertTab = false
        }
        if (this.lineNums) {
            if (this.scrolling) {
                this.scrolling = false
            } else {
                this.getLineNum()
            }
        }
    },
    methods: {
        updateValue(e: any) {
            if (this.modelValue == undefined) {
                this.content = e.target.value
            } else {
                this.$emit('update:modelValue', e.target.value)
            }
        },
        changeLang(lang: string[][]) {
            this.languageTitle = lang[1] ? lang[1] : lang[0]
            this.languageClass = 'language-' + lang[0]
            this.$emit('lang', lang[0])
        },
        tab() {
            if (document.execCommand('insertText')) {
                document.execCommand('insertText', false, this.tabWidth)
            } else {
                const cursorPosition = (
                    this.$refs.textarea as HTMLTextAreaElement
                ).selectionStart
                this.content =
                    this.content.substring(0, cursorPosition) +
                    this.tabWidth +
                    this.content.substring(cursorPosition)
                this.cursorPosition = cursorPosition + this.tabWidth.length
                this.insertTab = true
            }
        },
        calcScrollDistance(e: any) {
            (this.$refs.code as any).scrolling = true
            this.scrolling = true
            this.top = -e.target.scrollTop
            this.left = -e.target.scrollLeft
        },
        resizer() {
            // textareaResizer
            const textareaResizer = new ResizeObserver((entries) => {
                this.scrollBarWidth =
                    (entries[0].target as HTMLElement).offsetWidth -
                    entries[0].target.clientWidth
                this.scrollBarHeight =
                    (entries[0].target as HTMLElement).offsetHeight -
                    entries[0].target.clientHeight
                this.textareaHeight = (
                    entries[0].target as HTMLElement
                ).offsetHeight
            })
            textareaResizer.observe(this.$refs.textarea as HTMLElement)
            // lineNumsResizer
            const lineNumsResizer = new ResizeObserver((entries) => {
                this.lineNumsWidth = (
                    entries[0].target as HTMLElement
                ).offsetWidth
            })
            if (this.$refs.lineNums) {
                lineNumsResizer.observe(this.$refs.lineNums as HTMLElement)
            }
        },
        async copy() {
            try {
                await navigator.clipboard.writeText(
                    (this.$refs.textarea as HTMLTextAreaElement).value
                )
                DlToast.success('Copied to clipboard')
            } catch (e) {
                DlToast.error('Failed to copy to clipboard')
            }
        },
        getLineNum() {
            // lineNum
            const str = (this.$refs.textarea as HTMLTextAreaElement).value
            let lineNum = 0
            let position = str.indexOf('\n')
            while (position !== -1) {
                lineNum++
                position = str.indexOf('\n', position + 1)
            }
            // heightNum
            const singleLineHeight = (
                (this.$refs.lineNums as HTMLDivElement)
                    .firstChild as HTMLElement
            ).offsetHeight
            const heightNum =
                Math.round(this.textareaHeight / singleLineHeight) - 1
            // displayed lineNum
            this.lineNum =
                this.height == 'auto'
                    ? lineNum
                    : lineNum > heightNum
                    ? lineNum
                    : heightNum
        }
    }
})
</script>

<style scoped lang="scss">
.code-editor {
    position: relative;
}
.code-editor > div {
    width: 100%;
    height: 100%;
}
/* header */
.code-editor .header {
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    height: 34px;
}
.code-editor .header > .dropdown {
    position: absolute;
    top: 12px;
    left: 18px;
}
.code-editor .header > .copy-code {
    position: absolute;
    top: 10px;
    right: 12px;
}
/* code-area */
.code-editor .code-area {
    position: relative;
    z-index: 0;
    text-align: left;
    overflow: hidden;
}
/* font style */
.code-editor .code-area > textarea,
.code-editor .code-area > pre > code,
.code-editor .line-nums > div {
    font-family: Consolas, Monaco, monospace;
    line-height: 1.5;
}
.code-editor .code-area > textarea:hover,
.code-editor .code-area > textarea:focus-visible {
    outline: none;
}
.code-editor .code-area > textarea {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    overflow-y: hidden;
    box-sizing: border-box;
    caret-color: rgb(127, 127, 127);
    color: transparent;
    white-space: pre;
    word-wrap: normal;
    border: 0;
    width: 100%;
    height: 100%;
    background: none;
    resize: none;
}
.code-editor .code-area > pre {
    box-sizing: border-box;
    position: relative;
    z-index: 0;
    overflow: hidden;
    font-size: 0;
    margin: 0;
}
.code-editor .code-area > pre > code {
    background: none;
    display: block;
    position: relative;
    overflow-x: visible !important;
    border-radius: 0;
    box-sizing: border-box;
    margin: 0;
}
/* wrap code */
.code-editor.wrap .code-area > textarea,
.code-editor.wrap .code-area > pre > code {
    white-space: pre-wrap;
    word-wrap: break-word;
}
/* hide-header */
.code-editor.hide-header.scroll .code-area {
    height: 100%;
}
/* scroll */
.code-editor.scroll .code-area {
    height: calc(100% - 34px);
}
.code-editor.scroll .code-area > textarea {
    overflow: auto;
}
.code-editor.scroll .code-area > pre {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
/* dropdown */
.code-editor .list {
    -webkit-user-select: none;
    user-select: none;
    height: 100%;
    font-family: sans-serif;
}
.code-editor .list > .lang-list {
    border-radius: 5px;
    box-sizing: border-box;
    overflow: auto;
    font-size: 13px;
    padding: 0;
    margin: 0;
    list-style: none;
    text-align: left;
}
.code-editor .list > .lang-list > li {
    font-size: 13px;
    transition: background 0.16s ease, color 0.16s ease;
    box-sizing: border-box;
    padding: 0 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 30px;
}
.code-editor .list > .lang-list > li:first-child {
    padding-top: 5px;
}
.code-editor .list > .lang-list > li:last-child {
    padding-bottom: 5px;
}
.code-editor .list > .lang-list > li:hover {
    background: rgba(160, 160, 160, 0.4);
}
/* line-nums */
.code-editor .line-nums {
    min-width: 36px;
    text-align: right;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    padding-right: 8px;
    padding-left: 8px;
    opacity: 0.3;
}
.code-editor .line-nums::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-right: 1px solid currentColor;
    opacity: 0.5;
}
.code-editor .header.border::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: 0;
    left: 0;
    background: currentColor;
    opacity: 0.15;
}

.code-editor {
    .header-content {
        $dl-select-palceholder-color: var(--dl-color-medium);
        height: 100%;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
    }
}
</style>
