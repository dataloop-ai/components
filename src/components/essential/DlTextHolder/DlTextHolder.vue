<template>
    <span
        :id="uuid"
        class="dl-text-holder"
    >
        <span v-if="prefix">{{ prefixPreview }}</span>
        <dl-ellipsis
            :text="textPreview"
            :split="split"
            :split-position="splitPosition"
        />
        <span v-if="suffix"> {{ suffixPreview }}</span>
    </span>
</template>

<script lang="ts">
import { v4 } from 'uuid'
// todo: this causes an issue
import { DlEllipsis } from '../../'

import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlTextHolder',
    components: { DlEllipsis },
    props: {
        /**
         * Prefix to be displayed
         */
        prefix: {
            type: String,
            default: null
        },
        /**
         * Suffix to be displayed
         */
        suffix: {
            type: String,
            default: null
        },
        /**
         * Text to be displayed
         */
        text: {
            type: String,
            default: ''
        },
        /**
         * Allows to split the text in two parts
         */
        split: {
            type: Boolean,
            default: false,
            required: false
        },
        /**
         * Position of the split in the text, % of the text length
         */
        splitPosition: {
            type: Number,
            required: false,
            default: 0.5,
            validator: (value: number) => value >= 0 && value <= 1
        }
    },
    data() {
        return {
            uuid: `dl-text-holder-${v4()}`
        }
    },
    computed: {
        prefixPreview(): string {
            return this.prefix?.trim() ?? ''
        },
        suffixPreview(): string {
            return this.suffix?.trim() ?? ''
        },
        textPreview(): string {
            return this.text || ''
        }
    }
})
</script>

<style scoped lang="scss">
.dl-text-holder {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    white-space: nowrap;
}
</style>
../DlEllipsis
