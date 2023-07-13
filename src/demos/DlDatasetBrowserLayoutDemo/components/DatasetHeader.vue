<template>
    <div>
        <navbar-kpi />
        <navbar-search />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import NavbarKpi from './NavbarKpi.vue'
import NavbarSearch from './NavbarSearch.vue'

export default defineComponent({
    name: 'DatasetHeader',
    components: {
        NavbarKpi,
        NavbarSearch
    }
})
</script>

<style scoped lang="scss"></style>
