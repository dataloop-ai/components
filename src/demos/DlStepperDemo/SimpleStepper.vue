<template>
    <div class="dl-stepper-wrapper">
        <dl-stepper
            v-model="isOpen"
            :hide-close-button="true"
            done-button-label="Create"
            width="calc(100vh-400px)"
            sidebar-width="300px"
            header-title="Create New Task"
            :content-title="`${stepper.currentIndex + 1}. ${
                stepper.currentStep.value
            }`"
            :bg-color="bgColor"
            :state="stepper.currentStep"
            :steps="stepper.steps"
            :disabled-prev-step="!stepper.hasPrevStep()"
            :disabled-next-step="!stepper.hasNextStep()"
            :is-done="stepper.isDone()"
            :next-step="stepper.getNextStep()"
            :prev-step="stepper.getPrevStep()"
            @next="handleNext"
            @prev="handlePrev"
            @done="handleDone"
            @set-step="handleStep"
        >
            <template #content-header="{ state }">
                <div style="display: flex; gap: 20px; align-items: center">
                    <dl-typography size="h3" variant="h3">
                        {{
                            `${stepper.currentIndex + 1}. ${
                                stepper.currentStep.value
                                    .charAt(0)
                                    .toUpperCase() +
                                stepper.currentStep.value.slice(1)
                            }`
                        }}
                    </dl-typography>
                    <dl-chip
                        v-if="state.warning"
                        max-width="100%"
                        color="dl-color-warning-background"
                        text-color="dl-color-darker"
                    >
                        {{ state.warning }}
                    </dl-chip>

                    <dl-counters
                        style="padding: 0; margin-left: auto"
                        small
                        :items="counters"
                    />
                </div>
            </template>
            <template #general>
                <general-step
                    @error-click="stepper.failStep('Custom Error')"
                    @complete-click="stepper.completeStep()"
                    @warning-click="stepper.setStepWarning('Custom Warning')"
                    @reset-click="stepper.resetStep()"
                    @set-subtitle="setSubtitle"
                />
            </template>
            <template #data>
                <data-step
                    @error-click="stepper.failStep('Custom Error')"
                    @complete-click="stepper.completeStep()"
                    @warning-click="stepper.setStepWarning('Custom Warning')"
                    @reset-click="stepper.resetStep()"
                />
            </template>
            <template #instructions>
                <instruction-step
                    @error-click="stepper.failStep('Custom Error')"
                    @complete-click="stepper.completeStep()"
                    @warning-click="stepper.setStepWarning('Custom Warning')"
                    @reset-click="stepper.resetStep()"
                />
            </template>
            <template #assignments>
                <assignments-step
                    @error-click="stepper.failStep('Custom Error')"
                    @complete-click="stepper.completeStep()"
                    @warning-click="stepper.setStepWarning('Custom Warning')"
                    @reset-click="stepper.resetStep()"
                />
            </template>
            <template #quality>
                <quality-step
                    @error-click="stepper.failStep('Custom Error')"
                    @complete-click="stepper.completeStep()"
                    @warning-click="stepper.setStepWarning('Custom Warning')"
                    @reset-click="stepper.resetStep()"
                />
            </template>
        </dl-stepper>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue-demi'
import GeneralStep from './steps/GeneralStep.vue'
import InstructionStep from './steps/InstructionStep.vue'
import DataStep from './steps/DataStep.vue'
import AssignmentsStep from './steps/AssignmentsStep.vue'
import QualityStep from './steps/QualityStep.vue'
import { DlStepper, DlTypography, DlChip, DlCounters } from '../..'
import { StepState } from '../../types'
import { Stepper, Step } from '../../components/compound/DlStepper/models'

class CustomStepper extends Stepper {
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
        AssignmentsStep,
        InstructionStep,
        DataStep,
        GeneralStep,
        QualityStep,
        DlTypography,
        DlChip,
        DlCounters
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
                    subtitle:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae massa porttitor, tempor ex vel, varius felis. ',
                    warning: 'Some issues in the step',
                    completed: true
                },
                {
                    value: 'data',
                    title: 'data',
                    subtitle:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae massa porttitor, tempor ex vel, varius felis. ',
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
        this.stepper = new CustomStepper(steps)
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
        },
        setSubtitle(subtitle: string) {
            this.stepper.currentStep.subtitle = subtitle
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-stepper-wrapper {
    height: calc(100vh - 200px);
}
</style>
