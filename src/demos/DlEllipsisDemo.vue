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
        <div style="white-space: nowrap; width: 350px; max-height: 600px">
            <p style="font-weight: bold">
                Ellipsis with paragraph
            </p>
            <dl-ellipsis
                :text="`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \
Excepteur sint occaecat cupidatat non proident, \
sunt in culpa qui officia deserunt mollit anim id est laborum.`"
                multiline
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
