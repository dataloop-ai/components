<template>
    <div>
        <dl-button label="Open Popup">
            <dl-popup
                title="Edit Item Description"
                additional-info="Some additional information"
                subtitle="Some text for better explanation."
                with-close-button
                @hide-button-click="handleClear"
            >
                <dl-text-area
                    v-model="text"
                    :max-length="100"
                    show-counter
                    placeholder="Type your text"
                    width="203px"
                />
                <template #hide-button>
                    <dl-button
                        flat
                        style="padding-bottom: 0; padding-top: 0"
                        label="clear"
                        size="m"
                    />
                </template>
                <template #footer>
                    <dl-button fluid>
                        Save
                    </dl-button>
                </template>
            </dl-popup>
        </dl-button>
        <div />
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlButton, DlPopup, DlTextArea } from '../components'

export default defineComponent({
    components: {
        DlButton,
        DlPopup,
        DlTextArea
    },
    data() {
        return {
            text: ''
        }
    },
    methods: {
        handleClear() {
            this.text = ''
        }
    }
})
</script>
