<template>
    <div style="width: 700px">
        <dl-pagination
            v-model="page"
            :max="max"
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
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlPagination } from '../components/DlPagination'

export default defineComponent({
    name: 'DlPaginationDemo',
    components: { DlPagination },
    data() {
        return {
            page: 18,
            max: 119,
            maxPages: 6,
            boundaryNumbers: true,
            boundaryLinks: true,
            directionLinks: true,
            total: 200,
            withQuickNavigation: true,
            disabled: false,
            itemsName: 'Rows',
            withLegend: true,
            withRowsPerPage: true
        }
    }
})
</script>
