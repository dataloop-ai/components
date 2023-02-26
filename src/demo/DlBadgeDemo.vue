<template>
    <div>
        <dl-button>
            <dl-badge
                with-border
                floating
                align="top"
                color="red"
            />
            button with badge
        </dl-button>
        <p>Badge with content:</p>
        <dl-badge color="green">
            <p>21</p>
        </dl-badge>
        <p>Badge as indicator:</p>
        <div style="display: flex; align-items: center">
            <dl-badge color="green" /> Test indicator
        </div>
        <p>Badge with multi-line:</p>
        <div style="display: flex; align-items: center">
            <dl-badge
                color="green"
                multiline
            >
                <div style="width: 30px">
                    Test Multi
                </div>
            </dl-badge>
        </div>

        <p>Badge with single-line:</p>
        <div style="display: flex; align-items: center">
            <dl-badge style="max-width: 55px">
                Test Single
            </dl-badge>
        </div>

        <p>Outline badge:</p>
        <div style="display: flex; align-items: center">
            <dl-badge
                color="green"
                outline
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlButton, DlBadge } from '../components'

export default defineComponent({
    name: 'BadgeDemo',
    components: {
        DlButton,
        DlBadge
    }
})
</script>
<style scoped>
p {
    margin: 0 auto;
}
</style>
