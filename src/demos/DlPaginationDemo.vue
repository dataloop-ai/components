<template>
    <div style="align-items: stretch">
        <div class="row">
            <dl-input
                v-model="rowsPerPage"
                title="rowsPerPage"
            />
            <dl-input
                v-model="total"
                title="total items"
            />
            <dl-input
                v-model="max"
                title="max"
            />
            <dl-input
                v-model="maxPages"
                title="maxPages"
            />
            <dl-input
                v-model="itemsName"
                title="itemsName"
            />
        </div>
        <div class="row">
            <dl-checkbox
                v-model="boundaryNumbers"
                label="boundaryNumbers"
            />
            <dl-checkbox
                v-model="boundaryLinks"
                label="boundaryLinks"
            />
            <dl-checkbox
                v-model="directionLinks"
                label="directionLinks"
            />
            <dl-checkbox
                v-model="disabled"
                label="disabled"
            />
            <dl-checkbox
                v-model="withLegend"
                label="withLegend"
            />
            <dl-checkbox
                v-model="withQuickNavigation"
                label="withQuickNavigation"
            />
            <dl-checkbox
                v-model="withRowsPerPage"
                label="withRowsPerPage"
            />
        </div>
        <div style="width: 700px">
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
        <div>
            <h4>case 1</h4>
            <p>with exactly 30 items, 15 per row. should be exactly 2 pages</p>
            <dl-pagination
                v-model="page"
                :total-items="30"
                :rows-per-page="15"
            />
            <h4>case 2</h4>
            <p>with 31 items, 15 per row. should be exactly 3 pages</p>
            <dl-pagination
                v-model="page"
                :total-items="31"
                :rows-per-page="15"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlPagination } from '../components'
import DlInput from '../components/compound/DlInput/DlInput.vue'
import DlCheckbox from '../components/essential/DlCheckbox/DlCheckbox.vue'

export default defineComponent({
    name: 'DlPaginationDemo',
    components: { DlCheckbox, DlInput, DlPagination },
    data() {
        return {
            page: 18,
            max: 119,
            maxPages: 6,
            rowsPerPage: 10,
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
