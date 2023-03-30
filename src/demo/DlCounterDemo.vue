<template>
    <div>
        <dl-counters
            :items="[
                {
                    value: 123,
                    text: 'lorem ipsum'
                },
                {
                    value: 45,
                    text: 'ipsum lorem',
                    subtext:
                        'Cupidatat est labore et nisi do culpa veniam reprehenderit anim consectetur dolor mollit.'
                },
                {
                    value: 6789,
                    text: 'lorem lorem ipsum',
                    subtext: 'Minim exercitation ipsum elit cillum magna.'
                }
            ]"
        />
        <dl-counters
            small
            :items="[
                {
                    text: 'lorem ipsum'
                },
                {
                    value: null,
                    text: 'ipsum lorem',
                    subtext:
                        'Cupidatat est labore et nisi do culpa veniam reprehenderit anim consectetur dolor mollit.'
                },
                {
                    value: 6789,
                    text: 'lorem lorem ipsum',
                    subtext: 'Minim exercitation ipsum elit cillum magna.'
                }
            ]"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlCounters } from '../components'
export default defineComponent({
    name: 'DlCounterDemo',
    components: {
        DlCounters
    }
})
</script>
