<template>
    <div style="width: 90%">
        <div style="white-space: nowrap; width: 350px">
            <p style="font-weight: bold">
                Ellipsis at the end
            </p>
            <dl-ellipsis
                text="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            />
        </div>
        <div style="white-space: nowrap; width: 350px">
            <p style="font-weight: bold">
                Ellipsis at the middle
            </p>
            <dl-ellipsis
                text="Lorem ipsum dolor sit amet consectetur adipisicing elit. "
                middle-ellipsis="true"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlEllipsis } from '../components'

export default defineComponent({
    components: { DlEllipsis }
})
</script>
