<template>
    <div class="spinner-dl">
        <span>Dl Spinner</span>
        <dl-spinner
            size="100px"
            icon-size="30px"
            text="Loading data, please wait..."
            :text-styles="{
                marginLeft: '10px',
                marginTop: '10px',
                color: 'var(--dl-color-tooltip-background)'
            }"
        />

        <div class="spinner-container">
            <span class="spinner-title">Circle Spinner</span>
            <dl-spinner-circle size="60px" />
        </div>

        <div class="spinner-container">
            <span class="spinner-title">Grid Spinner</span>
            <dl-spinner-grid size="60px" />
        </div>

        <div class="spinner-container">
            <span class="spinner-title">Dots Spinner</span>
            <dl-spinner-dots />
        </div>

        <div class="spinner-container">
            <span class="spinner-title">Clock Spinner</span>
            <dl-spinner-clock />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue-demi'
import {
    DlSpinner,
    DlSpinnerCircle,
    DlSpinnerGrid,
    DlSpinnerDots,
    DlSpinnerClock
} from '../components'

export default defineComponent({
    components: {
        DlSpinner,
        DlSpinnerCircle,
        DlSpinnerGrid,
        DlSpinnerDots,
        DlSpinnerClock
    }
})
</script>

<style lang="scss">
.spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.spinner-title {
    margin-bottom: 20px;
}
</style>
