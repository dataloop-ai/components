<template>
    <div
        style="
            align-items: stretch;
            justify-content: center;
            width: 100%;
            display: flex;
        "
    >
        <div style="display: flex; width: 100%; justify-content: center">
            <dl-input
                v-model="rowsPerPage"
                width="100px"
                title="rowsPerPage"
            />
            <dl-input
                v-model="total"
                width="100px"
                title="total items"
            />
            <dl-input
                v-model="max"
                width="100px"
                title="max"
            />
            <dl-input
                v-model="maxDisplayRange"
                width="100px"
                title="maxDisplayRange"
            />
            <dl-input
                v-model="itemsName"
                width="100px"
                title="itemsName"
            />
        </div>
        <div
            class="row"
            style="display: flex; width: 100%; justify-content: center"
        >
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
        <div style="display: flex; width: 100%; justify-content: center">
            <dl-pagination
                v-model="page"
                :max="max"
                :rows-per-page="rowsPerPage"
                :boundary-numbers="boundaryNumbers"
                :boundary-links="boundaryLinks"
                :direction-links="directionLinks"
                :max-display-range="maxDisplayRange"
                :disabled="disabled"
                :with-legend="withLegend"
                :total-items="total"
                :items-name="itemsName"
                :with-quick-navigation="withQuickNavigation"
                :with-rows-per-page="withRowsPerPage"
            />
        </div>
        <div
            style="
                display: flex;
                flex-direction: column;
                width: 100%;
                justify-content: center;
            "
        >
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
            maxDisplayRange: 6,
            rowsPerPage: 10,
            boundaryNumbers: true,
            boundaryLinks: true,
            directionLinks: true,
            total: 99,
            withQuickNavigation: true,
            disabled: false,
            itemsName: 'Rows',
            withLegend: true,
            withRowsPerPage: true
        }
    }
})
</script>
