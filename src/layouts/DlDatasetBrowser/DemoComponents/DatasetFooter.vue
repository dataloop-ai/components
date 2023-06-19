<template>
    <div class="footer-content">
        <div style="width: 300px">
            <DlSlider
                text="Thumb size"
                editable
            />
        </div>
        <div style="width: 100%; display: flex; padding-left: 20px">
            <dl-pagination
                v-model="page"
                :max="max"
                :rows-per-page="rowsPerPage"
                :boundary-numbers="boundaryNumbers"
                :boundary-links="boundaryLinks"
                :direction-links="directionLinks"
                :max-pages="maxPages"
                :disabled="disabled"
                :with-legend="withLegend"
                :total-items="total"
                :items-name="itemsName"
                :with-quick-navigation="withQuickNavigation"
                :with-rows-per-page="withRowsPerPage"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlSlider from '../../../compound/DlSlider/DlSlider.vue'
import DlPagination from '../../../compound/DlPagination/DlPagination.vue'

export default defineComponent({
    name: 'DatasetFooter',
    components: {
        DlSlider,
        DlPagination
    },
    setup() {
        const page = ref(18)
        const rowsPerPage = ref(10)
        const boundaryNumbers = ref(true)
        const boundaryLinks = ref(true)
        const directionLinks = ref(true)
        const maxPages = ref(6)
        const disabled = ref(false)
        const withLegend = ref(true)
        const total = ref(200)
        const itemsName = ref('Rows')
        const withQuickNavigation = ref(true)
        const withRowsPerPage = ref(true)

        return {
            page,
            rowsPerPage,
            boundaryNumbers,
            boundaryLinks,
            directionLinks,
            maxPages,
            disabled,
            withLegend,
            total,
            itemsName,
            withQuickNavigation,
            withRowsPerPage
        }
    }
})
</script>

<style scoped lang="scss">
.footer-content {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 15px 0 15px;
    gap: 20px;
}
</style>
