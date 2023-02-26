<template>
    <div
        v-if="!svg"
        :id="uuid"
        :style="inlineStyles"
        @click="$emit('click', $event)"
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
        style="display: inline"
        @click="$emit('click', $event)"
    >
        <div ref="svgIcon">
            <div ref="childToReplace" />
        </div>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent } from 'vue-demi'
import { getColor, loggerFactory } from '../utils'

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
    emits: ['click'],
    data() {
        return {
            uuid: `dl-icon-${v4()}`,
            externalIconSource: 'material-icons',
            logger_: loggerFactory('dl-icon')
        }
    },
    computed: {
        cssIconVars(): Record<string, string> {
            return {
                '--dl-icon-font-size': `${this.size}`,
                '--dl-icon-color': this.color
                    ? // needed for now until the swap of DLBTN in OA
                      getColor(
                          this.color === 'secondary'
                              ? 'q-color-secondary'
                              : this.color,
                          'dl-color-icon-default'
                      )
                    : 'inherit'
            }
        },
        inlineStyles(): string {
            return this.inline ? 'display: inline' : ''
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
                        : require(`@dataloop-ai/icons/docs/assets/${this.icon}.svg`)
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
    display: inline-block;
    color: var(--dl-icon-color);
    font-size: var(--dl-icon-font-size);
}
</style>
