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
        disabled

        <dl-radio
            v-model="disabledModel"
            label="Option Disabled"
            :value="4"
            disabled
        />
        <dl-radio
            v-model="disabledModel"
            label="Option Disabled not selected"
            :value="5"
            disabled
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
            checkModel: 1,
            disabledModel: 4
        }
    }
}
</script>
