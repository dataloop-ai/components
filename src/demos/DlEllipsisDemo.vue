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
                split
            />
        </div>
        <div style="white-space: nowrap; width: 350px">
            <p style="font-weight: bold">
                Ellipsis at the 20%
            </p>
            <dl-ellipsis
                text="Lorem ipsum dolor sit amet consectetur adipisicing elit. "
                split
                :split-position="0.2"
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
