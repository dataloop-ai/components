<template>
    <div class="left-drawer-content">
        <div style="padding-bottom: 10px">
            <dl-typography
                size="12px"
                color="dl-color-dark"
            >
                Search in:
            </dl-typography>
        </div>
        <dl-radio
            v-model="checkModel"
            label="All Dataset items"
            :value="1"
        />
        <dl-radio
            v-model="checkModel"
            label="Folders"
            :value="2"
        />
        <dl-radio
            v-model="checkModel"
            label="Tasks"
            :value="3"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlRadio from '../../../essential/DlRadio/DlRadio.vue'
import DlTypography from '../../../essential/DlTypography/DlTypography.vue'

export default defineComponent({
    name: 'LeftDrawerContent',
    components: {
        DlRadio,
        DlTypography
    },
    setup() {
        const checkModel = ref('')

        return {
            checkModel
        }
    }
})
</script>

<style scoped lang="scss">
.left-drawer-content {
    position: relative;
    padding: 10px;
}
</style>
