<template>
    <div>
        <div style="width: 100%">
            <dl-accordion
                v-model="isAccordionOpen"
                title="Controlled with 'Animal Farm' quote and overflowing title (text to trigger overflowing)"
            >
                Some of the animals remembered -- or thought they remembered --
                that the Sixth Commandment decreed, 'No animal shall kill any
                other animal.' And though no one cared to mention it in the
                hearing of the pigs or the dogs, it was felt that the killings
                which had taken place did not square with this.
            </dl-accordion>
        </div>

        <div style="width: 100%">
            <dl-accordion
                v-model="isAccordionOpen"
                title="Background color and custom open close icons"
                closed-icon="icon-dl-caret-right"
                opened-icon="icon-dl-caret-down"
                with-background
                background-color="dl-color-fill"
                font-weight="500"
                font-size="14px"
            >
                Some of the animals remembered -- or thought they remembered --
                that the Sixth Commandment decreed, 'No animal shall kill any
                other animal.' And though no one cared to mention it in the
                hearing of the pigs or the dogs, it was felt that the killings
                which had taken place did not square with this.
            </dl-accordion>
        </div>

        <div style="width: 100%">
            <p>Accordion in an accordion</p>
            <dl-accordion
                default-opened
                title="Title Accordion in an accordion"
            >
                <template #header>
                    Custom header content 1
                    <dl-switch v-model="switchModel" :value="2" />
                </template>

                <dl-accordion default-opened>
                    <template #header>
                        Custom header content 2
                        <dl-switch v-model="switchModel" :value="2" />
                    </template>
                    <template #default>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                    </template>
                </dl-accordion>
            </dl-accordion>
        </div>
        <div style="width: 100%">
            <dl-accordion
                additional-info="Some additional info"
                title="Uncontrolled with Lorem Ipsum"
                :right-side="true"
                font-size="12px"
                title-color="dl-color-medium"
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
            </dl-accordion>
        </div>
        <div style="width: 100%">
            <dl-accordion>
                <template #header>
                    Custom header content
                    <dl-switch v-model="switchModel" :value="2" />
                </template>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
            </dl-accordion>
        </div>
        <div style="width: 100%">
            <dl-accordion
                v-model="isAccordionOpen"
                title="Empty State Component"
                is-empty
            />
        </div>
        <div style="width: 100%">
            <dl-accordion default-opened>
                <template #header>
                    Custom header content
                    <dl-switch v-model="switchModel" :value="2" />
                </template>

                <dl-accordion default-opened>
                    <template #header>
                        Custom header content
                        <dl-switch v-model="switchModel" :value="2" />
                    </template>
                    <template #default>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                    </template>
                </dl-accordion>
            </dl-accordion>
        </div>
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
