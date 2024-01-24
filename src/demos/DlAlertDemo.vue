<template>
    <div>
        <DlAlert type="info" :closable="true" fluid>
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
            <DlAlert type="error" :closable="true">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </DlAlert>
            <DlAlert type="info" text="Alert text" fluid>
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
        <dl-alert style="margin-top: 20px" fluid type="warning">
            this is an annoying message with link, this is an annoying message
            with linkthis is an annoying message with linkthis is an annoying
            message with linkthis is an annoying message with linkthis is an
            annoying message with linkthis is an annoying message with linkthis
            is an annoying message with link
            <span>
                Please
                <dl-link color="dl-color-link">Contact us</dl-link>.</span
            >
        </dl-alert>
        <DlAlert
            type="success"
            text="Text: Lorem ipsum dolor sit amet, consectetur adipisicing elit. "
        >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </DlAlert>
        <dl-alert style="margin-top: 20px" fluid type="warning">
            this is an annoying message with link, this is an annoying message
            with linkthis is an annoying message with linkthis is an annoying
            message with linkthis is an annoying message with linkthis is an
            annoying message with linkthis is an annoying message with linkthis
            is an annoying message with link
            <span>
                Please
                <dl-link color="dl-color-link">Contact us</dl-link>.</span
            >
        </dl-alert>

        <div>
            <dl-button label="Toggle" @click="handleAlertToggle" />
            <DlAlert :type="alertType" :closable="true" fluid>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
                eos amet, nobis unde animi atque itaque? Provident suscipit enim
                eos sequi dolor minima optio tempora error tenetur, autem
                ratione cumque!
            </DlAlert>
        </div>
    </div>
</template>

<script lang="ts">
import { DlAlert, DlLink, DlButton } from '../components'
import { defineComponent } from 'vue-demi'

const alertTypes = ['info', 'success', 'warning', 'error']

export default defineComponent({
    name: 'DlAlertDemo',
    components: {
        DlAlert,
        DlLink,
        DlButton
    },
    data() {
        return {
            alertType: alertTypes[0]
        }
    },
    methods: {
        handleAlertToggle() {
            const index = alertTypes.indexOf(this.alertType)
            this.alertType =
                index === alertTypes.length - 1
                    ? alertTypes[0]
                    : alertTypes[index + 1]
        }
    },
    template: 'dl-alert-demo'
})
</script>
