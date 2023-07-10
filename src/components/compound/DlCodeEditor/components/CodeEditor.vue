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
                    ref="lineNumsEl"
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
                    :style="textAreaStyle"
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
            padding: !header ? padding : lineNumsRef ? '10px ' + padding + ' ' + padding : '0 ' + padding + ' ' + padding,
          }"
/>
      </pre>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import hljs from 'highlight.js'
import {
    computed,
    defineComponent,
    isVue2,
    nextTick,
    onBeforeUnmount,
    onMounted,
    onUpdated,
    PropType,
    ref,
    toRef,
    watch
} from 'vue-demi'
import { DlButton } from '../../../basic'
import { DlSelect } from '../../DlSelect'
import { DlToast } from '../../DlToast'
import '../styles/themes.css'
import '../styles/themes-base16.css'
import { text } from 'stream/consumers'

export default defineComponent({
    name: 'CodeEditor',
    components: {
        DlSelect,
        DlButton
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            required: false,
            type: String,
            default: null
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
        const lineNumsRef = toRef(props, 'lineNums')
        const wrapRef = toRef(props, 'wrap')
        const showLineNums = computed(() => {
            return wrapRef.value ? false : !!lineNumsRef.value
        })
        const languagesOptions = computed(() => {
            return props.languages.map((lang: string[]) => {
                return {
                    value: lang[0],
                    label: lang[1] ? lang[1] : lang[0]
                }
            })
        })
        const selectedLanguage = ref(languagesOptions.value[0])
        const tabWidthRef = toRef(props, 'tabSpaces')
        const modelRef = toRef(props, 'modelValue')
        const heightRef = toRef(props, 'height')
        const code = ref<HTMLElement>(null as any)
        const textarea = ref<HTMLTextAreaElement>(null as any)
        const lineNumsEl = ref<HTMLDivElement>(null as any)

        const tabWidth = computed(() => {
            let result = ''
            for (let i = 0; i < tabWidthRef.value; i++) {
                result += ' '
            }
            return result
        })

        const contentValue = computed(() => {
            return !modelRef.value && modelRef.value !== ''
                ? content.value + '\n'
                : props.modelValue + '\n'
        })

        const scroll = computed(() => {
            return heightRef.value == 'auto' ? false : true
        })

        watch(contentValue, () => {
            nextTick(() => {
                code.value!.textContent = contentValue.value
                hljs.highlightElement(code.value!)
            })
        })

        const textareaResizer = ref<ResizeObserver>(null as any)
        const lineNumsResizer = ref<ResizeObserver>(null as any)

        const setupTextAreaResizer = () => {
            textareaResizer.value = new ResizeObserver((entries) => {
                scrollBarWidth.value =
                    (entries[0].target as HTMLElement).offsetWidth -
                    entries[0].target.clientWidth
                scrollBarHeight.value =
                    (entries[0].target as HTMLElement).offsetHeight -
                    entries[0].target.clientHeight
                textareaHeight.value = (
                    entries[0].target as HTMLElement
                ).offsetHeight
            })

            textareaResizer.value.observe(textarea.value)
        }

        const setupLineNumsResizer = () => {
            lineNumsResizer.value = new ResizeObserver((entries) => {
                lineNumsWidth.value = (
                    entries[0].target as HTMLElement
                ).offsetWidth
            })

            lineNumsResizer.value.observe(lineNumsEl.value)
        }

        const disposeTextAreaResizer = () => {
            if (!textareaResizer.value) return
            textareaResizer.value.disconnect()
            textareaResizer.value = null as any
        }
        const disposeLineNumsResizer = () => {
            if (!lineNumsResizer.value) return
            lineNumsResizer.value.disconnect()
            lineNumsResizer.value = null as any
        }

        const getLineNum = () => {
            if (!lineNumsEl.value) return

            // lineNum
            const str = textarea.value.value
            let localLineNum = 0
            let position = str.indexOf('\n')
            while (position !== -1) {
                localLineNum++
                position = str.indexOf('\n', position + 1)
            }
            // heightNum
            const singleLineHeight = (
                lineNumsEl.value.firstChild as HTMLElement
            ).offsetHeight
            const heightNum =
                Math.round(textareaHeight.value / singleLineHeight) - 1
            // displayed lineNum
            lineNum.value =
                heightRef.value == 'auto'
                    ? localLineNum
                    : localLineNum > heightNum
                    ? localLineNum
                    : heightNum
        }

        onMounted(() => {
            emit('lang', props.languages[0][0])
            emit('content', props.content)
            emit('textarea', textarea.value)
            setupTextAreaResizer()
            if (showLineNums.value) {
                setupLineNumsResizer()
            }
            code.value.textContent = contentValue.value
            hljs.highlightElement(code.value)
        })

        onBeforeUnmount(() => {
            disposeTextAreaResizer()
            disposeLineNumsResizer()
        })

        onUpdated(() => {
            if (insertTab.value) {
                textarea.value.setSelectionRange(
                    cursorPosition.value,
                    cursorPosition.value
                )
                insertTab.value = false
            }
        })

        watch(showLineNums, (newVal, oldVal) => {
            nextTick(() => {
                if (newVal) {
                    setupLineNumsResizer()
                } else {
                    disposeLineNumsResizer()
                }
                if (lineNumsRef.value) {
                    if (scrolling.value) {
                        scrolling.value = false
                    } else {
                        getLineNum()
                    }
                }
            })
        })

        const copy = async () => {
            try {
                await navigator.clipboard.writeText(textarea.value.value)
                DlToast.success('Copied to clipboard')
            } catch (e) {
                DlToast.error('Failed to copy to clipboard')
            }
        }

        const calcScrollDistance = (e: any) => {
            const codeEl = code.value as any
            codeEl.scrolling = true
            scrolling.value = true
            top.value = -e.target.scrollTop
            left.value = -e.target.scrollLeft
        }

        const tab = () => {
            if (document.execCommand('insertText')) {
                document.execCommand('insertText', false, tabWidth.value)
            } else {
                const localCursorPosition = textarea.value.selectionStart
                content.value =
                    content.value.substring(0, localCursorPosition) +
                    tabWidth.value +
                    content.value.substring(localCursorPosition)
                cursorPosition.value =
                    localCursorPosition + tabWidth.value.length
                insertTab.value = true
            }
        }

        const changeLang = (lang: string[][]) => {
            languageTitle.value = lang[1] ? lang[1] : lang[0]
            languageClass.value = 'language-' + lang[0]
            emit('lang', lang[0])
        }

        const updateValue = (e: any) => {
            if (!props.modelValue && props.modelValue !== '') {
                content.value = e.target.value
            } else {
                emit('update:model-value', e.target.value)
            }
        }

        const fontSizeRef = toRef(props, 'fontSize')
        const headerRef = toRef(props, 'header')
        const paddingRef = toRef(props, 'padding')

        const textAreaStyle = computed<Record<string, any>>(() => {
            const padding = lineNumsRef.value
                ? '10px ' + paddingRef.value + ' ' + paddingRef.value
                : '0 ' + paddingRef.value + ' ' + paddingRef.value

            return {
                fontSize: fontSizeRef.value,
                padding: !headerRef.value ? paddingRef.value : padding,
                marginLeft: showLineNums.value
                    ? lineNumsWidth.value + 'px'
                    : '0',
                width: showLineNums.value
                    ? 'calc(100% - ' + lineNumsWidth.value + 'px)'
                    : '100%'
            }
        })

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
            languagesOptions,
            tabWidth,
            contentValue,
            scroll,
            code,
            textarea,
            lineNumsEl,
            lineNumsRef,
            copy,
            calcScrollDistance,
            tab,
            changeLang,
            updateValue,
            textAreaStyle
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
