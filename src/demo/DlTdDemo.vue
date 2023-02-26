<template>
    <div>
        <DlTd> Table Td component </DlTd>
        <DlTd :auto-width="true">
            Table Td component auto width
        </DlTd>
    </div>
</template>

<script lang="ts">
import { DlTd } from '../components'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    components: {
        DlTd
    }
})
</script>
