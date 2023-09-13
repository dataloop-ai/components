<template>
    <div>
        <dl-input
            v-model="textInputValue"
            max-width="100%"
            style="width: 920px"
            title="Input with full width"
            placeholder="and suggestions"
            size="l"
            margin="20px"
            required
            tooltip="Quis fugiat et non eu proident sit et amet."
            top-message="Pariatur consequat non sit aliqua labore ad reprehenderit deserunt ullamco incididunt non irure laborum deserunt."
            info-message="Ipsum amet quis velit amet. Anim consectetur nostrud sunt eu non non consequat sint eu amet."
            :auto-suggest-items="[
                {
                    suggestion: 'clickable',
                    image: 'https://picsum.photos/100/100',
                    click: true
                },
                {
                    suggestion: '@suggestion',
                    image: 'https://picsum.photos/100/100',
                    click: true
                },
                {
                    suggestion: '@john-doe',
                    image: 'https://picsum.photos/100/100',
                    click: true
                },
                {
                    suggestion: 'unclickable',
                    image: 'https://picsum.photos/100/100'
                }
            ]"
            show-counter
            :max-length="20"
            @suggestion-click="log"
        />
        <dl-input
            v-model="saveInputValue"
            style="width: 220px"
            title="Expandable input"
            placeholder="with file upload"
            size="l"
            :files="files"
            expandable
            @file-update="updateFiles"
        >
            <template #append>
                <label for="file-upload">
                    <dl-icon
                        :inline="false"
                        class="attach-icon"
                        icon="icon-dl-attach"
                    />
                </label>
                <input
                    id="file-upload"
                    style="display: none"
                    type="file"
                    @change="addFile"
                >
            </template>
        </dl-input>
        <dl-input
            v-model="passFieldValue"
            title="Password"
            style="width: 220px"
            placeholder="Input type password"
            size="m"
            type="password"
            error
            error-message="The password entered is incorrect."
            info-message="This won't show, error is true"
        />
        <dl-input
            v-model="warningFieldValue"
            title="Fixed Height Example"
            style="width: 220px"
            placeholder="Fixed height"
            height="100px"
            size="m"
            info-message="This input has fixed height"
            optional
            expandable
        />

        <span>size S with long text (no max width)</span>
        <dl-input
            v-model="sizeSFieldValue"
            title="Warning Example"
            size="s"
            warning
            warning-message="Something isn't right."
            info-message="This won't show, error is true"
            optional
        />
        <p>input in a row with button</p>
        <div
            class="row"
            style="align-items: center"
        >
            <dl-input
                max-width="220px"
                class="input-parts"
                style="width: 440px"
                title="Min"
                dense
                size="s"
            />
            <dl-button
                dense
                flat
                icon="icon-dl-add"
                size="m"
            />
        </div>
        <dl-input
            :model-value="'Readonly text'"
            title="Readonly"
            style="width: 220px"
            size="m"
            readonly
        />

        <p>input in a limited size and action slot size m</p>
        <div style="align-items: center; width: 250px; overflow: scroll">
            <dl-input class="input-parts">
                <template #action>
                    <dl-button
                        dense
                        flat
                        icon="icon-dl-add"
                        size="m"
                    />
                </template>
            </dl-input>
        </div>
    </div>
</template>
<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, ref } from 'vue-demi'
import { DlInput, DlButton, DlIcon } from '../components'
import { InputFile } from '../components/compound/DlInput/types'
export default defineComponent({
    name: 'DlInputDemo',
    components: {
        DlInput,
        DlButton,
        DlIcon
    },
    setup() {
        const textInputValue = ref<string>('')
        const passFieldValue = ref<string>('')
        const warningFieldValue = ref<string>('')
        const sizeSFieldValue = ref<string>('')
        const errorFieldValue = ref<string>('')
        const saveInputValue = ref<string>('')

        const files = ref<InputFile[]>([])
        const addFile = (e: Event) => {
            const input = e.target as HTMLInputElement
            const file = input.files[0]
            if (file) {
                const reader = new FileReader()

                reader.onload = (e) => {
                    const arrayBuffer = e.target.result
                    files.value.push({
                        id: v4(),
                        name: file.name,
                        image: null,
                        data: arrayBuffer as ArrayBuffer
                    })
                }

                reader.readAsArrayBuffer(file)
            }
            input.value = ''
        }
        const updateFiles = (val: InputFile[]) => {
            console.log(val)
            files.value = val
        }

        return {
            log: console.log,
            textInputValue,
            passFieldValue,
            warningFieldValue,
            errorFieldValue,
            saveInputValue,
            sizeSFieldValue,
            files,
            updateFiles,
            addFile
        }
    }
})
</script>
<style>
.attach-icon {
    margin-top: 7px;
    cursor: pointer;
}
</style>
