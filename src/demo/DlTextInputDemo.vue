<template>
    <div>
        <dl-text-input
            v-model="textInputValue"
            style="width: 220px"
            placeholder="Select option"
            size="l"
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
        <dl-text-input
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
        <dl-text-input
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
        <dl-text-input
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
        <dl-text-input
            style="width: 220px"
            placeholder="Select option"
            title="Min"
            required
            size="s"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlTextInput } from '../components'
export default defineComponent({
    name: 'DlTextInputDemo',
    components: {
        DlTextInput
    },
    setup() {
        const textInputValue = ref<string>('')
        const passFieldValue = ref<string>('')
        const warningFieldValue = ref<string>('')
        const errorFieldValue = ref<string>('')

        return {
            textInputValue,
            passFieldValue,
            warningFieldValue,
            errorFieldValue
        }
    }
})
</script>
