<template>
    <div class="dl-stepper-demo-wrapper">
        <SimpleStepper />
        <div style="height: 10px" />
        <StepperInDialogBox />
        <div style="height: 10px" />
        <CenteredStepperInDialogBox />
        <div style="height: 10px" />
        <EmptyStateStepper />
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue-demi'
import SimpleStepper from './SimpleStepper.vue'
import EmptyStateStepper from './EmptyStateStepper.vue'
import StepperInDialogBox from './StepperInDialogBox.vue'
import CenteredStepperInDialogBox from './CenteredStepperInDialogBox.vue'

export default defineComponent({
    name: 'DlStepperDemo',
    components: {
        SimpleStepper,
        StepperInDialogBox,
        CenteredStepperInDialogBox,
        EmptyStateStepper
    }
})
</script>

<style lang="scss" scoped></style>
