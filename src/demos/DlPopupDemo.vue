<template>
    <div>
        <dl-button label="Open Popup">
            <dl-popup
                title="Edit Item Description"
                additional-info="Some additional information"
                subtitle="Some text for better explanation."
                with-close-button
                @close-button-click="handleClear"
            >
                <dl-text-area
                    v-model="text"
                    :max-length="100"
                    show-counter
                    placeholder="Type your text"
                    width="203px"
                />
                <template #footer>
                    <dl-button fluid>
                        Save
                    </dl-button>
                </template>
            </dl-popup>
        </dl-button>
        <dl-button label="Open Popup persistent">
            <dl-popup
                title="Edit Item Description"
                additional-info="Some additional information"
                subtitle="Some text for better explanation."
                with-close-button
                persistent
            >
                <dl-text-area
                    v-model="text"
                    :max-length="100"
                    show-counter
                    placeholder="Type your text"
                    width="203px"
                />
                <template #close-button>
                    <dl-button
                        flat
                        style="padding-bottom: 0; padding-top: 0"
                        label="clear"
                        size="m"
                        @click="handleClear"
                    />
                </template>
                <template #footer>
                    <dl-button fluid>
                        Save
                    </dl-button>
                </template>
            </dl-popup>
        </dl-button>
        <dl-button label="Open Popup with max height 50px">
            <dl-popup
                title="Edit Item Description"
                additional-info="Some additional information"
                subtitle="Some text for better explanation."
                with-close-button
                max-height="50px"
            >
                <dl-text-area
                    v-model="text"
                    :max-length="100"
                    show-counter
                    placeholder="Type your text"
                    width="203px"
                />
                <template #close-button>
                    <dl-button
                        flat
                        style="padding-bottom: 0; padding-top: 0"
                        label="clear"
                        size="m"
                        @click="handleClear"
                    />
                </template>
                <template #footer>
                    <dl-button fluid>
                        Save
                    </dl-button>
                </template>
            </dl-popup>
        </dl-button>
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
