<template>
    <div>
        <DlTh> Table Th component </DlTh>
        <DlTh :auto-width="true"> Table Th component auto width </DlTh>
        <DlTh
            :props="{
                sort: sort,
                col: { sortable: true, align: 'left' }
            }"
        >
            Table Th component
        </DlTh>
    </div>
</template>

<script lang="ts">
import { DlTh } from '../components'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    components: {
        DlTh
    },
    methods: {
        log(e: Event) {
            console.log(e)
        },
        sort(el: any) {
            console.log(el)
        }
    }
})
</script>
