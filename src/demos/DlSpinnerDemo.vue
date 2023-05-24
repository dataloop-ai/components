<template>
    <div class="spinner-dl">
        <div class="spinner-container">
            <span class="spinner-title">Dl Spinner</span>
            <dl-spinner
                type="default"
                text="Loading..."
                :text-styles="{
                    marginLeft: '10px'
                }"
            />
        </div>

        <div class="spinner-container">
            <span class="spinner-title">Circle Spinner</span>
            <dl-spinner type="circle" />
        </div>

        <div class="spinner-container">
            <span class="spinner-title">Grid Spinner</span>
            <dl-spinner type="grid" />
        </div>

        <div class="spinner-container">
            <span class="spinner-title">Dots Spinner</span>
            <dl-spinner type="dots" />
        </div>

        <div class="spinner-container">
            <span class="spinner-title">Clock Spinner</span>
            <dl-spinner type="clock" />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue-demi'
import { DlSpinner } from '../components'

export default defineComponent({
    components: {
        DlSpinner
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
