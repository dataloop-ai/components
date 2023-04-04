<template>
    <div class="spinner-dl">
        <span>Dl Spinner</span>
        <dl-spinner
            text="Loading data, please wait..."
            :text-styles="{
                marginLeft: '10px',
                marginTop: '10px',
                color: 'var(--dl-color-tooltip-background)'
            }"
        />

        <div class="spinner-semicircle">
            <span>Semicircle Spinner</span>
            <dl-spinner-semicircle size="60px" />
        </div>

        <div class="spinner-grid">
            <span style="margin-bottom: 15px">Grid Spinner</span>
            <dl-spinner-grid size="60px" />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue-demi'
import { DlSpinner, DlSpinnerSemicircle, DlSpinnerGrid } from '../components'

export default defineComponent({
    components: {
        DlSpinner,
        DlSpinnerSemicircle,
        DlSpinnerGrid
    }
})
</script>

<style lang="scss">
.spinner-grid,
.spinner-semicircle {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
