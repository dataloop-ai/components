<template>
    <div>
        <dl-search
            v-model="searchValue"
            size="l"
            with-search-btn
            highlight-matches
            placeholder="Search here"
            :auto-suggest-items="['foo', 'bar']"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlSearch } from '../components'
export default defineComponent({
    name: 'DlSearchDemo',
    components: {
        DlSearch
    },
    setup() {
        const searchValue = ref<string>('')
        return { searchValue }
    }
})
</script>
