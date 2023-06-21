<template>
    <div>
        <!-- Size L   -->
        <p>size L</p>
        <div class="layout-grid">
            <p>:top-message :info-message :auto-suggest-items</p>
            <dl-input
                v-model="textInputValue"
                style="width: 920px"
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
            <hr>
            <p>slot append</p>
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
                        size="16px"
                    />
                </template>
            </dl-input>
            <hr>
        </div>
        <!-- Size M   -->
        <p>size M</p>
        <div class="layout-grid">
            <p>password error</p>
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
            <hr>
            <p>title warning warning-message info-message</p>
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
            <hr>
            <p>readonly</p>
            <dl-input
                title="Readonly"
                style="width: 220px"
                placeholder="Readonly state"
                size="m"
                readonly
            />
            <hr>
            <p>
                size 'm' title error error-message + warning + warning-message +
                info-message
            </p>
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
            <hr>
        </div>

        <!-- Size S   -->
        <p>size S</p>
        <div class="layout-grid">
            <p>size 's' title warning warning-message info message</p>
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
            <hr>

            <p>size 's' error error-message</p>
            <dl-input
                style="width: 220px"
                placeholder="Select option"
                title="Min"
                required
                size="s"
                error
                error-message="Error message is the strongest."
            />
            <hr>
            <p>size 's' error error-message</p>
            <dl-input
                style="width: 440px"
                placeholder="Select option"
                title="Min"
                size="s"
                error
                error-message="Error message is the strongest."
            />
            <hr>
            <p>size `s` + button</p>
            <div
                class="demo"
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
<style>
.layout-grid {
    width: 100%;
    display: grid;
    grid-template-columns: 10em 1fr;
    /* grid-column-gap: 20px; */
    align-items: center;
}

.layout-grid p {
    padding-bottom: 0.2em;
    margin: 0;
    align-self: end;
}

.layout-grid > * {
    overflow: hidden;
}

.layout-grid hr {
    grid-column: 1 / -1;
    width: 100%;
    opacity: 0.2;
}
</style>
