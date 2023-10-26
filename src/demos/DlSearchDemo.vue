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

        <div style="width: 100%">
            search in flex div
            <div style="display: flex; width: 30%">
                <dl-search
                    v-model="searchValue"
                    size="l"
                    with-search-button
                    highlight-matches
                    style="width: 100%; max-width: 100%"
                    placeholder="Search here"
                    :auto-suggest-items="suggestItems"
                />
            </div>
            <div style="display: flex; width: 30%">
                <dl-search
                    v-model="searchValue"
                    size="l"
                    style="width: 100%; max-width: 100%"
                    placeholder="Search here"
                />
            </div>
        </div>
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
