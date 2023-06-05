<template>
    <div class="dl-stepper-wrapper">
        <dl-stepper
            v-model="isOpen"
            :hide-close-button="true"
            done-button-label="Create"
            width="calc(100vh-400px)"
            header-title="Create New Task"
            :content-title="`${stepper.currentIndex + 1}. ${
                stepper.currentStep.value
            }`"
            :bg-color="bgColor"
            :state="stepper.currentStep"
            :steps="stepper.steps"
            :disabled-prev-step="true"
            :disabled-next-step="true"
            :is-done="stepper.isDone()"
            :next-step="stepper.getNextStep()"
            :prev-step="stepper.getPrevStep()"
            is-empty
            :empty-state-props="{
                responsive: true,
                style: 'min-height: 350px;',
                bgSize: '130px',
                bgImage: `url(https://raw.githubusercontent.com/dataloop-ai/icons/main/assets/usage.svg)`,
                title: 'Lorem ipsum',
                subtitle:
                    'Lorem ipsum dolor sit amet consectetur. Senectus condimentum dolor sit',
                info: 'To learn more about this analytics, read our documentation.'
            }"
            @next="handleNext"
            @prev="handlePrev"
            @done="handleDone"
            @set-step="handleStep"
        >
            <template #links="">
                <div style="display: flex; gap: 5px; padding: 0 20px">
                    <dl-button
                        padding="0px"
                        icon="icon-dl-sdk-documentation"
                        flat
                        uppercase
                        label="SDK"
                    />
                    <div class="break" />
                    <dl-button
                        padding="0px"
                        icon="icon-dl-file"
                        flat
                        label="Documentation"
                    />
                    <div class="break" />
                    <dl-button
                        padding="0px"
                        icon="icon-dl-youtube"
                        flat
                        label="Video"
                    />
                </div>
            </template>
        </dl-stepper>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlStepper, DlButton } from '../..'
import { StepState } from '../../types'
import { Stepper, Step } from '../../components/compound/DlStepper/models'

class EmptyStateStepper extends Stepper {
    constructor(steps: Step[]) {
        super(steps)
    }

    public completeStep() {
        super.completeStep()
        console.log('COMPLETED')
    }
}

export default defineComponent({
    components: {
        DlStepper,
        DlButton
    },
    data() {
        const stepper: Stepper = null

        return {
            counters: [{ value: 3, text: 'Assigmments' }],
            isOpen: true,
            stepper,
            steps: [
                {
                    value: 'general',
                    title: 'general',
                    warning: 'Some issues in the step',
                    completed: true
                },
                {
                    value: 'data',
                    title: 'data',
                    completed: true
                },
                {
                    value: 'instructions',
                    title: 'instructions'
                },
                {
                    value: 'assignments',
                    title: 'assignments'
                },
                {
                    value: 'quality',
                    title: 'quality',
                    optional: true
                }
            ] as StepState[],
            bgColor: 'dl-color-fill-third'
        }
    },
    beforeMount() {
        const steps = this.steps.map((step) => new Step(step))
        this.stepper = new EmptyStateStepper(steps)
    },
    methods: {
        handleNext() {
            this.stepper.moveToNextStep()
        },
        handlePrev() {
            this.stepper.moveToPrevStep()
        },
        handleDone() {
            console.log('DONE')
        },
        handleStep(step: Step) {
            this.stepper.currentIndex = this.stepper.steps.findIndex(
                (s) => s.value === step.value
            )
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-stepper-wrapper {
    height: calc(100vh - 200px);
}
</style>
