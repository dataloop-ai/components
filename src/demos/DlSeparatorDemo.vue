<template>
    <div>
        <div style="display: flex">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
                eos amet, nobis unde animi atque itaque? Provident suscipit enim
                eos sequi dolor minima optio tempora error tenetur, autem
                ratione cumque!
            </p>
            <DlSeparator type="vertical" />
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
                eos amet, nobis unde animi atque itaque? Provident suscipit enim
                eos sequi dolor minima optio tempora error tenetur, autem
                ratione cumque!
            </p>
        </div>
        <div>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
                eos amet, nobis unde animi atque itaque? Provident suscipit enim
                eos sequi dolor minima optio tempora error tenetur, autem
                ratione cumque!
            </p>
            <DlSeparator width="100%" />
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
                eos amet, nobis unde animi atque itaque? Provident suscipit enim
                eos sequi dolor minima optio tempora error tenetur, autem
                ratione cumque!
            </p>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue-demi'
import { DlSeparator } from '../components'

export default defineComponent({
    name: 'DlSeparatorDemo',
    components: { DlSeparator }
})
</script>
