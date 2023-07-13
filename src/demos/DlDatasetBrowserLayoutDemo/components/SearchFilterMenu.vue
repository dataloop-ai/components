<template>
    <div class="search-filter-menu">
        <AddFilter />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import AddFilter from './filters/AddFilter.vue'

export default defineComponent({
    name: 'SearchFilterMenu',
    components: {
        AddFilter
    }
})
</script>

<style scoped lang="scss"></style>
