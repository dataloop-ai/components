<template>
    <div
        :id="uuid"
        class="link-wrapper"
    >
        <a
            :href="link"
            :target="target"
            :rel="rel"
            :style="`color: var(--${textColor});`"
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
        href: { required: true, type: String },
        newtab: { required: false, default: false, type: Boolean },
        external: { required: false, default: false, type: Boolean },
        disabled: { required: false, default: false, type: Boolean },
        color: { required: false, type: String, default: null }
    },
    data() {
        return {
            uuid: `dl-link-${v4()}`
        }
    },
    computed: {
        link(): string {
            return this.external
                ? `${this.href}`
                : `${window.origin}/${this.href}`
        },
        textColor(): string {
            return this.color ?? 'dl-color-studio-secondary'
        },
        target(): string | null {
            return getLinkTarget(this.external || this.newtab)
        },
        rel(): string | null {
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
}

a:hover {
    text-decoration: underline;
}

.disabled {
    pointer-events: none;
    color: var(--dl-color-disabled) !important;
}

.link-wrapper {
    display: inline-block;
}
</style>
