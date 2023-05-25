<template>
    <div>
        <div class="dl-text-holder-demo">
            <dl-text-holder
                prefix="home/Desktop/"
                suffix=".mp3"
                text="very-loooooooooooong-named-song"
            />

            <dl-text-holder
                prefix="home/Desktop/"
                suffix=".mp3"
                text="very-loooooooooooong-named-song"
                split
            />

            <dl-text-holder
                prefix="home/Desktop/"
                suffix=".mp3"
                text="very-loooooooooooong-named-song"
                split
                :split-position="0.7"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlTextHolder } from '../components'

export default defineComponent({
    components: {
        DlTextHolder
    }
})
</script>

<style scoped>
.dl-text-holder-demo {
    display: flex;
    flex-wrap: wrap;
    resize: horizontal;
    overflow: auto;
    width: 300px;
    box-shadow: var(--dl-menu-shadow);
    padding: 5px;
    word-wrap: break-word;
}
</style>
