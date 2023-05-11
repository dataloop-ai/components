<template>
    <div class="navbar-kpi">
        <div style="display: flex; height: 100%; align-items: center">
            <div style="padding-left: 25px">
                <dl-typography
                    color="dl-color-lighter"
                    size="10px"
                >
                    dataset
                </dl-typography>
                <dl-typography
                    color="dl-color-darker"
                    size="30px"
                >
                    Fruit
                </dl-typography>
            </div>
        </div>
        <div
            style="
                display: flex;
                height: 100%;
                align-items: center;
                justify-content: end;
                padding-right: 10px;
            "
        >
            <dl-counters
                counter-font-size="20px"
                title-font-size="12px"
                :items="[
                    {
                        value: 200,
                        text: 'All dataset items'
                    },
                    {
                        value: 100,
                        text: 'Selected items'
                    },
                    {
                        value: 12,
                        text: 'Annotated items'
                    },
                    {
                        value: 17,
                        text: 'Annotations'
                    }
                ]"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import DlTypography from '../../../essential/DlTypography/DlTypography.vue'
import DlCounters from '../../../compound/DlCounters/DlCounters.vue'

export default defineComponent({
    name: 'NavbarKpi',
    components: {
        DlTypography,
        DlCounters
    }
})
</script>

<style scoped>
.navbar-kpi {
    height: 100px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    justify-self: center;
    justify-content: center;
    background-color: var(--dl-color-body-background);
}
</style>
