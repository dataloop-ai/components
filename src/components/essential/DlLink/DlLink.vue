<template>
    <div :id="uuid" class="link-wrapper">
        <a
            :href="link"
            :target="target"
            :rel="rel"
            :style="linkStyles"
            :class="`${disabled ? 'disabled' : ''}`"
            @click="$emit('click')"
        >
            <slot />
        </a>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent } from 'vue-demi'
import { getLinkTarget, getLinkRel } from './utils'

export default defineComponent({
    name: 'DlLink',
    props: {
        href: { required: false, type: String, default: null },
        newtab: { required: false, default: false, type: Boolean },
        external: { required: false, default: false, type: Boolean },
        disabled: { required: false, default: false, type: Boolean },
        color: { required: false, type: String, default: null },
        hoverColor: { required: false, type: String, default: null }
    },
    data() {
        return {
            uuid: `dl-link-${v4()}`
        }
    },
    computed: {
        link(): string {
            if (!this.href) {
                return null
            }
            return this.external
                ? `${this.href}`
                : `${window.origin}/${this.href}`
        },
        linkStyles(): Record<string, string> {
            const textColor = this.color ?? 'dell-blue-600'
            const hoverTextColor = this.hoverColor
                ? this.hoverColor
                : this.color
                ? this.color
                : 'dell-blue-700'
            return {
                '--link-color': `var(--${textColor})`,
                '--link-hover-color': `var(--${hoverTextColor})`
            }
        },
        target(): string | null {
            if (!this.href) {
                return null
            }
            return getLinkTarget(this.newtab)
        },
        rel(): string | null {
            if (!this.href) {
                return null
            }
            return getLinkRel(this.external)
        }
    },
    template: 'dl-link'
})
</script>

<style scoped lang="css">
a {
    text-decoration: none;
    font-size: var(--dl-font-size-body);
    color: var(--link-color) !important;
}

a:hover {
    text-decoration: underline;
    cursor: pointer;
    color: var(--link-hover-color) !important;
}

.disabled {
    pointer-events: none;
    color: var(--dl-color-disabled) !important;
    text-decoration: none !important;
}

.link-wrapper {
    display: inline-block;
}
</style>
