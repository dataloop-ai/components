import VWave from 'v-wave'
import { isVue2 } from 'vue-demi'

export const { wave, waveTrigger } = VWave.createLocalWaveDirective(
    {},
    isVue2 ? 'vue2' : 'vue3'
)
