<template>
    <span
        :id="uuid"
        class="dl-text-holder"
    >
        <span v-if="prefix">{{ prefixPreview }}</span>
        <span class="dl-text-holder--value">
            <slot> {{ textPreview }} </slot>
        </span>
        <span v-if="suffix"> {{ suffixPreview }}</span>
    </span>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlTextHolder',
    props: {
        prefix: {
            type: String,
            default: null
        },
        suffix: {
            type: String,
            default: null
        },
        text: {
            type: String,
            required: true
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
            return this.text
        }
    }
})
</script>

<style scoped lang="scss">
.dl-text-holder {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;

    &--value {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
