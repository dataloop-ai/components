<template>
    <div style="width: 950px; padding-top: 20px">
        <div class="flex">
            <div>
                <dl-text-area
                    v-model="message"
                    title="Message"
                />
                <dl-input
                    v-model="duration"
                    type="number"
                    title="Duration seconds"
                />
                <dl-input
                    v-model="collapseCount"
                    type="number"
                    title="Collapse count"
                />
                <dl-input
                    v-model="width"
                    title="Custom width for toast item"
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
        <dl-button @click="showToastMessageCustom">
            Show Toast Message
        </dl-button>
        <dl-button @click="showToastMultiLine">
            Multi Line
        </dl-button>
        <div class="flex-row" style="margin-top: 8px">
            <dl-button @click="showToastWithLink">
                Toast with link
            </dl-button>
            <dl-switch
                v-model="htmlEnabled"
                :left-label="htmlEnabled ? 'HTML true' : 'HTML false'"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, h } from 'vue-demi'
import {
    DlButton,
    DlInput,
    DlRadio,
    DlSwitch,
    DlTextArea,
    DlToast
} from '../components'
import { DlToastPositions, DlToastTypes } from '../components/types'

export default defineComponent({
    name: 'DlToast',
    components: {
        DlTextArea,
        DlSwitch,
        DlRadio,
        DlInput,
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
        const width = ref('auto')
        const collapseCount = ref(null)
        const htmlEnabled = ref(false)
        function showToastMessage() {
            DlToast.open({
                message: message.value,
                position: position.value as DlToastPositions,
                type: type.value as DlToastTypes,
                duration: Number(duration.value) || 1000,
                closable: closable.value,
                width: width.value,
                collapseCount: collapseCount.value
            })
        }

        function showToastMessageCustom() {
            DlToast.open(
                {
                    message: message.value,
                    position: position.value as DlToastPositions,
                    type: type.value as DlToastTypes,
                    duration: Number(duration.value) || 1000,
                    closable: closable.value,
                    width: width.value,
                    collapseCount: collapseCount.value
                },
                {
                    message: (...args: any) => {
                        const vNode = h(DlButton, {
                            label: 'Click me',
                            props: { label: 'Click Me' }
                        } as any)
                        return vNode
                    }
                }
            )
        }
        function showToastMultiLine() {
            DlToast.open({
                message:
                    'This is an page-level alert that communicates an\ninformational message.',
                position: position.value as DlToastPositions,
                type: DlToastTypes.SUCCESS,
                duration: Number(duration.value) || 1000,
                closable: closable.value,
                width: width.value,
                collapseCount: collapseCount.value,
                html: false,
                multiLine: true
            } as any)
        }
        function showToastWithLink() {
            const linkHtml =
                '<a href="https://docs.dataloop.ai/" target="_blank" rel="noopener noreferrer">Link to another page.</a>'
            DlToast.open({
                message: `This is an page-level alert that communicates an informational message.\n${linkHtml}`,
                position: position.value as DlToastPositions,
                type: DlToastTypes.SUCCESS,
                duration: Number(duration.value) || 1000,
                closable: closable.value,
                width: width.value,
                collapseCount: collapseCount.value,
                html: htmlEnabled.value,
                multiLine: true
            } as any)
        }
        return {
            showToastMessageCustom,
            showToastMessage,
            showToastMultiLine,
            showToastWithLink,
            message,
            duration,
            type,
            position,
            closable,
            width,
            collapseCount,
            htmlEnabled
        }
    }
})
</script>

<style scoped>
.flex {
    display: flex;
}

.flex-row {
    display: flex;
    align-items: center;
    gap: 12px;
}
</style>
