<template>
    <div>
        Normal switch
        <dl-switch v-model="changingValue" />
        Switch with disabled
        <dl-switch
            v-model="switchValue"
            disabled
        />
        Switch with value not updating
        <dl-switch v-model="switchValue" />
        Switch with left-label
        <dl-switch
            v-model="switchValue"
            left-label="Left label"
        />
        <div style="width: 500px">
            <dl-switch
                v-model="switchValue"
                left-label="Left label"
                fluid
            />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue-demi'
import { DlSwitch } from '../components'

export default defineComponent({
    components: { DlSwitch },
    setup() {
        const val = ref(false)
        const changeVal = ref(false)

        const switchValue = computed({
            get() {
                return val.value
            },
            set(value) {
                console.log('not setting the value to:', value)
            }
        })
        const changingValue = computed({
            get() {
                return changeVal.value
            },
            set(value: boolean) {
                changeVal.value = value
                console.log('changed value to:', value)
            }
        })

        return {
            changingValue,
            switchValue
        }
    }
})
</script>
