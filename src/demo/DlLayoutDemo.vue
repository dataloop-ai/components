<template>
    <div style="width: 90%">
        <DlLayout />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlLayout } from '../components/essential'

export default defineComponent({
    name: 'DlKpiDemo',
    components: {
        DlLayout
    },
    setup() {
        return {}
    }
})
</script>

<style scoped lang="scss">
.inlineKpi {
    display: flex;
    width: 100%;
    gap: 30px;
}
.autoWidth {
    width: min(100%, 50rem);
    height: 100%;
}
</style>
