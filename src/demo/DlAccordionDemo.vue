<template>
    <div>
        <dl-accordion
            v-model="isAccordionOpen"
            title="Controlled with 'Animal Farm' quote and overflowing title (text to trigger overflowing)"
        >
            Some of the animals remembered -- or thought they remembered -- that
            the Sixth Commandment decreed, 'No animal shall kill any other
            animal.' And though no one cared to mention it in the hearing of the
            pigs or the dogs, it was felt that the killings which had taken
            place did not square with this.
        </dl-accordion>
        <dl-accordion
            additional-info="Some additional info"
            title="Uncontrolled with Lorem Ipsum"
            :right-side="true"
            font-size="12px"
            title-color="dl-color-medium"
        >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
        </dl-accordion>
        <dl-accordion>
            <template #header>
                Custom header content
                <dl-switch
                    v-model="switchModel"
                    :value="2"
                />
            </template>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
        </dl-accordion>
    </div>
</template>

<script lang="ts">
import { DlAccordion, DlSwitch } from '../components'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    components: {
        DlAccordion,
        DlSwitch
    },
    data() {
        return {
            isAccordionOpen: true,
            switchModel: []
        }
    }
})
</script>
