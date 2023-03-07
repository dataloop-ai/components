<template>
    <div class="root-container">
        <div>
            <dl-button
                v-if="hasBackButton"
                label="Back"
                icon="icon-dl-arrow-left"
                flat
                text-color="dl-color-medium"
                style="padding: 0; margin-bottom: 10px"
                @click.stop.prevent="$emit('onClose')"
            />
            <h2
                v-if="hasTitle"
                class="title"
            >
                <slot name="title">
                    {{ title }}
                </slot>
            </h2>
            <p
                v-if="hasSubtitle"
                class="subtitle"
            >
                <slot name="subtitle">
                    {{ subtitle }}
                </slot>
            </p>
        </div>
        <dl-button
            v-if="closeButton"
            class="close-button"
            icon="icon-dl-close"
            size="s"
            flat
            text-color="dl-color-darker"
            @click="$emit('onClose')"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlButton } from '../DlButton'

export default defineComponent({
    name: 'DlDialogBoxHeader',
    components: {
        DlButton
    },
    props: {
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        closeButton: { type: Boolean, default: true },
        hasBackButton: Boolean
    },
    emits: ['onClose'],
    computed: {
        hasTitle() {
            return !!this.title || this.$slots.title
        },
        hasSubtitle() {
            return !!this.subtitle || this.$slots.subtitle
        }
    }
})
</script>

<style lang="scss" scoped>
.root-container {
    display: flex;
    width: 100%;
    align-items: flex-start;
    justify-content: space-between;
}

.title {
    font-size: var(--dl-font-size-h2);
    margin: 0;
    color: var(--dl-color-darker);
}

.subtitle {
    font-size: var(--dl-font-size-body);
    margin: 3px 0 0 0;
    color: var(--dl-color-medium);
}

.close-button {
    margin-right: -6px;
    margin-top: -6px;
}
</style>
