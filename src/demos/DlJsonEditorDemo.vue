<template>
    <div
        style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        "
    >
        <div style="height: 200px; width: 500px">
            <dl-json-editor v-model="jsonModel" />
        </div>
        <span>JSON: {{ jsonModel }}</span>

        <dl-button @click="dialogState = !dialogState">
            JsonEditor
        </dl-button>
        <dl-dialog-box
            v-model="dialogState"
            volatile
            :width="700"
        >
            <template #header>
                <dl-dialog-box-header
                    title="JsonEditor"
                    @onClose="dialogState = false"
                />
            </template>
            <template #body>
                <div style="height: 350px">
                    <dl-json-editor v-model="dialogJsonModel" />
                </div>
            </template>
        </dl-dialog-box>
        <span>Dialog JSON: {{ dialogJsonModel }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import {
    DlJsonEditor,
    DlDialogBox,
    DlDialogBoxHeader,
    DlButton
} from '../components'
export default defineComponent({
    components: { DlJsonEditor, DlDialogBox, DlDialogBoxHeader, DlButton },
    setup() {
        const jsonModel = ref('')
        const dialogJsonModel = ref('')
        const dialogState = ref(false)
        return {
            jsonModel,
            dialogState,
            dialogJsonModel
        }
    }
})
</script>
