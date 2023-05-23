<template>
    <div>
        <DlAlert
            type="info"
            :closable="true"
            fluid
        >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas eos
            amet, nobis unde animi atque itaque? Provident suscipit enim eos
            sequi dolor minima optio tempora error tenetur, autem ratione
            cumque!
        </DlAlert>
        <DlAlert type="warning">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem
            ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum
            dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit
            amet, consectetur adipisicing elit
            Pneumonoultramicroscopicsilicovolcanoconiosis/Pneumonoultramicroscopicsilicovolcanoconiosis/Pneumonoultramicroscopicsilicovolcanoconiosis.
        </DlAlert>
        <div style="display: flex; justify-content: space-between">
            <DlAlert
                type="error"
                :closable="true"
            >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </DlAlert>
            <DlAlert
                type="info"
                text="Alert text"
                fluid
            >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </DlAlert>
        </div>
        <DlAlert
            type="info"
            text="Text: Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
            :closable="true"
        >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </DlAlert>
        <dl-alert
            style="margin-top: 20px"
            fluid
            type="warning"
        >
            this is an annoying message with link, this is an annoying message
            with linkthis is an annoying message with linkthis is an annoying
            message with linkthis is an annoying message with linkthis is an
            annoying message with linkthis is an annoying message with linkthis
            is an annoying message with link
            <span>
                Please
                <dl-link color="dl-color-link">Contact us</dl-link>.</span>
        </dl-alert>
        <DlAlert
            type="success"
            text="Text: Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
        >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </DlAlert>
        <dl-alert
            style="margin-top: 20px"
            fluid
            type="warning"
        >
            this is an annoying message with link, this is an annoying message
            with linkthis is an annoying message with linkthis is an annoying
            message with linkthis is an annoying message with linkthis is an
            annoying message with linkthis is an annoying message with linkthis
            is an annoying message with link
            <span>
                Please
                <dl-link color="dl-color-link">Contact us</dl-link>.</span>
        </dl-alert>
    </div>
</template>

<script lang="ts">
import { DlAlert, DlLink } from '../components'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlAlertDemo',
    components: {
        DlAlert,
        DlLink
    },
    template: 'dl-alert-demo'
})
</script>
