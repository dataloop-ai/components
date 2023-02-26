<template>
    <div>
        <dl-radio
            v-model="checkModel"
            label="Option 1"
            :value="1"
            sub-label="this is a lot of text this is a lot of text this is a lot of text this is a lot of text this is a lot of text this is a lot of text "
        />
        <dl-radio
            v-model="checkModel"
            label="Option 2"
            :value="2"
        />
        <dl-radio
            v-model="checkModel"
            label="Option 3"
            :value="3"
        />
    </div>
</template>

<script lang="ts">
import { DlRadio } from '../components'

export default {
    components: {
        DlRadio
    },
    data() {
        return {
            checkModel: 1
        }
    }
}
</script>
