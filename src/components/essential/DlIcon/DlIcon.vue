<template>
    <div
        v-if="!svg"
        :id="uuid"
        :style="[inlineStyles, computedStyles]"
        @click="$emit('click', $event)"
        @mousedown="$emit('mousedown', $event)"
        @mouseup="$emit('mouseup', $event)"
        @mousemove="$emit('mousemove', $event)"
    >
        <i
            class="dl-icon"
            :class="`${icon} ${externalIcon ? externalIconSource : ''}`"
            aria-hidden="true"
            role="presentation"
            :style="cssIconVars"
        >
            {{ externalIcon ? icon : null }}
        </i>
        <slot />
    </div>
    <div
        v-else
        :id="uuid"
        :style="[inlineStyles, computedStyles]"
        @click="$emit('click', $event)"
        @mousedown="$emit('mousedown', $event)"
        @mouseup="$emit('mouseup', $event)"
        @mousemove="$emit('mousemove', $event)"
    >
        <div ref="svgIcon">
            <div ref="childToReplace" />
        </div>
    </div>
</template>

<script lang="ts">
import { isString } from 'lodash'
import { v4 } from 'uuid'
import { defineComponent } from 'vue-demi'
import { getColor, loggerFactory, stringStyleToRecord } from '../../../utils'

export default defineComponent({
    name: 'DlIcon',
    props: {
        color: {
            type: String,
            default: null
        },
        icon: {
            type: String,
            required: true
        },
        size: {
            type: String,
            default: '12px'
        },
        styles: {
            type: [String, Object],
            default: null
        },
        svg: {
            type: Boolean,
            default: false
        },
        inline: {
            type: Boolean,
            default: true
        },
        svgSource: {
            type: String,
            default: null
        }
    },
    emits: ['click', 'mousemove', 'mouseup', 'mousedown'],
    data() {
        return {
            uuid: `dl-icon-${v4()}`,
            externalIconSource: 'material-icons',
            logger_: loggerFactory('dl-icon')
        }
    },
    computed: {
        computedStyles(): Record<string, string> {
            return isString(this.styles)
                ? stringStyleToRecord(this.styles)
                : this.styles
        },
        cssIconVars(): Record<string, string> {
            return {
                '--dl-icon-font-size': `${this.size}`,
                '--icon-color': this.color
                    ? // todo: remove this. this is needed for now until the swap of DLBTN in OA
                      getColor(
                          this.color === 'secondary'
                              ? 'q-color-secondary'
                              : this.color,
                          'dl-color-icon-default'
                      )
                    : 'inherit'
            }
        },
        inlineStyles(): Record<string, string> {
            return { display: this.inline ? 'inline-flex' : 'flex' }
        },
        // needed to allow external source of icons that do not use class based
        externalIcon(): boolean {
            return (
                !this.icon.startsWith('icon-dl-') &&
                !this.icon.startsWith('fas') &&
                !this.icon.startsWith('fa-')
            )
        }
    },
    mounted() {
        const possibleToLoadSvg = this.svg && this.icon && this.icon !== ''
        if (possibleToLoadSvg) {
            this.loadSvg()
        }
    },
    methods: {
        loadSvg() {
            return new Promise<void>((resolve, reject) => {
                const svgElement = new Image()
                svgElement.setAttribute('height', this.size)
                svgElement.setAttribute('width', this.size)

                svgElement.onload = () => {
                    // @ts-ignore // In order to handle events and loading that occur mid unmounting.
                    if (this._isDestroyed || this._isBeingDestroyed) {
                        return
                    }
                    const container = this.$refs.svgIcon as HTMLDivElement
                    if (!container) {
                        reject(new Error('No Ref'))
                        return
                    }
                    container.setAttribute('height', this.size)
                    container.setAttribute('width', this.size)
                    container?.firstChild?.replaceWith(svgElement)
                    resolve()
                }

                try {
                    svgElement.src = this.svgSource
                        ? `${this.svgSource}/${this.icon}.svg`
                        : `https://raw.githubusercontent.com/dataloop-ai/icons/main/assets/${this.icon}.svg`
                } catch (e) {
                    reject(e)
                }
            })
        }
    }
})
</script>

<style scoped lang="scss">
.dl-icon {
    display: inline-flex;
    color: var(var(--dl-icon-color), var(--icon-color));
    font-size: var(--dl-icon-font-size);
}
</style>
