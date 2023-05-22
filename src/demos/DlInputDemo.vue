<template>
    <div>
        <dl-input
            v-model="textInputValue"
            style="width: 220px"
            placeholder="Select option"
            size="l"
            margin="20px"
            title="Input Title"
            required
            tooltip="Quis fugiat et non eu proident sit et amet."
            top-message="Pariatur consequat non sit aliqua labore ad reprehenderit deserunt ullamco incididunt non irure laborum deserunt."
            info-message="Ipsum amet quis velit amet. Anim consectetur nostrud sunt eu non non consequat sint eu amet."
            :auto-suggest-items="[
                'foo',
                'bar',
                'foobar',
                'barfoo',
                'foo bar foobarv'
            ]"
            show-counter
            :max-length="20"
        />

        <dl-input
            v-model="saveInputValue"
            style="width: 220px"
            placeholder="Input with icon"
            size="l"
            has-append
        >
            <template #append>
                <dl-icon
                    style="margin-bottom: 5px"
                    icon="icon-dl-save"
                    size="12px"
                />
            </template>
        </dl-input>

        <dl-input
            v-model="passFieldValue"
            title="Password"
            style="width: 220px"
            placeholder="Select option"
            size="m"
            type="password"
            error
            error-message="The password entered is incorrect."
            info-message="This won't show, error is true"
        />
        <dl-input
            v-model="warningFieldValue"
            title="Warning Example"
            style="width: 220px"
            placeholder="Select option"
            size="m"
            warning
            warning-message="Something isn't right."
            info-message="This won't show, error is true"
            optional
        />
        <dl-input
            v-model="warningFieldValue"
            title="Warning Example"
            style="width: 220px"
            placeholder="Select option"
            size="s"
            warning
            warning-message="Something isn't right."
            info-message="This won't show, error is true"
            optional
        />
        <dl-input
            v-model="errorFieldValue"
            title="Error Example"
            style="width: 220px"
            placeholder="Select option"
            size="m"
            error
            error-message="Error message is the strongest."
            warning
            warning-message="This won't show, error is true"
            info-message="This won't show, error is true"
        />
        <dl-input
            style="width: 220px"
            placeholder="Select option"
            title="Min"
            required
            size="s"
            error
            error-message="Error message is the strongest."
        />

        <dl-input
            style="width: 440px"
            placeholder="Select option"
            title="Min"
            size="s"
            error
            error-message="Error message is the strongest."
        />
        <p>input in a row with button</p>
        <div
            class="row"
            style="align-items: center"
        >
            <dl-input
                class="input-parts"
                style="width: 440px"
                placeholder="Select option"
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
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlInput, DlIcon, DlButton } from '../components'
export default defineComponent({
    name: 'DlInputDemo',
    components: {
        DlInput,
        DlIcon,
        DlButton
    },
    setup() {
        const textInputValue = ref<string>('')
        const passFieldValue = ref<string>('')
        const warningFieldValue = ref<string>('')
        const errorFieldValue = ref<string>('')
        const saveInputValue = ref<string>('')

        return {
            textInputValue,
            passFieldValue,
            warningFieldValue,
            errorFieldValue,
            saveInputValue
        }
    }
})
</script>
<style></style>
