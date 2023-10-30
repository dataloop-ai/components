<template>
    <div>
        <dl-avatar tooltip="kekokokkokok">
            <dl-icon
                icon="icon-dl-creator"
                size="12px"
            />
        </dl-avatar>
        <dl-avatar
            color="rgb(70, 200, 100)"
            size="40px"
        >
            SA
        </dl-avatar>
        <dl-avatar
            color="dl-color-warning"
            size="48px"
            tooltip="johndoe@mail.com"
            name="John Doe"
        />
        <dl-avatar
            color="dl-color-darker"
            size="64px"
            tooltip="john@mail.com"
            name="John"
        />
        <dl-avatar
            name="test"
            tooltip="popcat@gmail.com"
            size="72px"
        >
            <img src="https://popcat.click/twitter-card.jpg">
        </dl-avatar>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlAvatar, DlIcon } from '../components'

export default defineComponent({
    components: { DlAvatar, DlIcon }
})
</script>
