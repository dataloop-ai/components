<template>
    <div class="color-type">
        <span class="name">
            {{ name }}
        </span>
        <input
            v-model="modelColor"
            class="value"
        >
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlBox',
    props: {
        name: {
            type: String,
            default: ''
        },
        color: {
            type: String,
            default: ''
        }
    },
    emits: ['inputColor'],
    computed: {
        modelColor: {
            get(): string {
                return this.color
            },
            set(val: string): void {
                this.$emit('inputColor', val)
            }
        }
    }
})
</script>

<style scoped lang="scss">
.color-type {
    display: flex;
    margin-top: 10px;
    font-size: var(--dl-font-size-small);
    height: 28px;
    .name {
        width: 46px;
        height: calc(100% - 2px);
        float: left;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--dl-color-medium);
        border-radius: 2px 0px 0px 2px;
        border: 1px solid var(--dl-color-separator);
        border-right: none;
        font-size: var(--dl-font-size-body);
    }
    .value {
        font-size: var(--dl-font-size-body);
        flex: 1;
        height: 100%;
        min-width: 100px;
        padding: 0 10px;
        border: 0;
        color: var(--dl-color-darker);
        background: none;
        box-sizing: border-box;
        border-radius: 0px 2px 2px 0px;
        border: 1px solid var(--dl-color-separator);
    }
}
</style>
