<template>
    <div>
        <dl-search
            v-model="searchValue"
            size="l"
            with-search-button
            highlight-matches
            placeholder="Search here"
            :auto-suggest-items="suggestItems"
        />

        <dl-search
            v-model="searchValue"
            size="m"
            with-search-button
            highlight-matches
            placeholder="Search here"
            :auto-suggest-items="suggestItems"
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
        const suggestItems = ['foo', 'foo bar', 'bar', 'bar foo', '!@#$%^&*(){}[+-*]']
        return { searchValue, suggestItems }
    }
})
</script>
