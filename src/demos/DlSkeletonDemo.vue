<template>
    <div>
        <DlSkeleton
            height="200px"
            width="200px"
        />
        <div />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlSkeleton } from '../components'
export default defineComponent({
    name: 'DlSkeletonDemo',
    components: {
        DlSkeleton
    }
})
</script>
