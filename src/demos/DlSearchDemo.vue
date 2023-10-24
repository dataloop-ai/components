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
        <dl-search
            v-model="searchValue"
            size="s"
            with-search-button
            highlight-matches
            placeholder="Search here"
            :auto-suggest-items="suggestItems"
        />
        <dl-search
            v-model="searchValue"
            size="s"
            with-search-button
            highlight-matches
            placeholder="Search here"
            :auto-suggest-items="suggestItems"
            style="height: 28px"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlSearch } from '../components'
import { DlInputSuggestion } from '../components/compound/DlInput/types'
export default defineComponent({
    name: 'DlSearchDemo',
    components: {
        DlSearch
    },
    setup() {
        const searchValue = ref<string>('')
        const suggestItems: DlInputSuggestion[] = [
            { suggestion: 'foo' },
            { suggestion: 'foo bar' },
            { suggestion: 'bar' },
            { suggestion: 'bar foo' }
        ]
        return { searchValue, suggestItems }
    }
})
</script>
