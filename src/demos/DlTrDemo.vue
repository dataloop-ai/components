<template>
    <div>
        <DlTr :no-hover="true">
            Table Tr component
        </DlTr>
    </div>
</template>

<script lang="ts">
import { DlTr } from '../components'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    components: {
        DlTr
    }
})
</script>
