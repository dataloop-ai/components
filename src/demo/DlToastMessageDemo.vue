<template>
    <div style="width: 950px; padding-top: 20px">
        <div class="flex">
            <div>
                <dl-text-area
                    v-model="message"
                    title="Message"
                />
                <dl-text-input
                    v-model="duration"
                    type="number"
                    title="Duration seconds"
                />
                <dl-text-input
                    v-model="classItem"
                    title="Custom class for toast item"
                />
            </div>
            <div class="flex">
                <div>
                    Type
                    <dl-radio
                        v-model="type"
                        value="success"
                        label="Success"
                    />
                    <dl-radio
                        v-model="type"
                        value="warning"
                        label="Warning"
                    />
                    <dl-radio
                        v-model="type"
                        value="error"
                        label="Error"
                    />
                    <dl-radio
                        v-model="type"
                        value="info"
                        label="Info"
                    />
                </div>
                <div>
                    Position
                    <dl-radio
                        v-model="position"
                        value="bottom"
                        label="Bottom"
                    />
                    <dl-radio
                        v-model="position"
                        value="bottom-left"
                        label="Bottom left"
                    />
                    <dl-radio
                        v-model="position"
                        value="bottom-right"
                        label="Bottom right"
                    />
                    <dl-radio
                        v-model="position"
                        value="top"
                        label="Top"
                    />
                    <dl-radio
                        v-model="position"
                        value="top-left"
                        label="Top left"
                    />
                    <dl-radio
                        v-model="position"
                        value="top-right"
                        label="Top right"
                    />
                </div>
                <div>
                    <dl-switch
                        v-model="closable"
                        left-label="Closable"
                    />
                </div>
            </div>
        </div>
        <dl-button @click="showToastMessage">
            Show Toast Message
        </dl-button>
    </div>
</template>

<script lang="ts">
import { DlButton } from '../components'
import { DlToast } from '../components/DlToastMessage'
import { defineComponent, ref } from 'vue-demi'
import DlTextInput from '../components/DlTextInput.vue'
import DlRadio from '../components/DlRadio.vue'
import DlTextArea from '../components/DlTextArea.vue'
import DlSwitch from '../components/DlSwitch.vue'
export default defineComponent({
    name: 'DlToast',
    components: {
        DlSwitch,
        DlTextArea,
        DlRadio,
        DlTextInput,
        DlButton
    },
    setup() {
        const message = ref(
            'This is a sample message with a <a href="https://google.com/">link</a>'
        )
        const duration = ref(10)
        const type = ref('success')
        const position = ref('bottom')
        const closable = ref(true)
        const classItem = ref('demo-toast')
        function showToastMessage() {
            DlToast.open({
                message: message.value,
                position: position.value,
                type: type.value,
                duration: duration.value,
                classItem: classItem.value,
                closable: closable.value
            })
        }
        return {
            showToastMessage,
            message,
            duration,
            type,
            position,
            classItem,
            closable
        }
    }
})
</script>

<style scoped>
.flex {
    display: flex;
}
</style>
