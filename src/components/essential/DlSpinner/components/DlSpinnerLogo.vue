<template>
    <div class="spinner-wrapper">
        <div
            class="spinner"
            :style="spinnerStyles"
        >
            <div class="spin-bg">
                <svg
                    id="Layer_2"
                    data-name="Layer 2"
                    viewBox="0 0 140 140"
                >
                    <g
                        id="Layer_1-2"
                        data-name="Layer 1"
                    >
                        <path
                            class="dl-svg"
                            d="M70,0C31.33,0,0,31.33,0,70s31.33,70,70,70,70-31.33,70-70S108.67,0,70,0Zm0,131.97c-34.2,0-61.97-27.77-61.97-61.97S35.8,8.03,70,8.03s61.97,27.77,61.97,61.97-27.77,61.97-61.97,61.97Z"
                        />
                    </g>
                </svg>
            </div>
            <div class="spin-loader">
                <svg
                    id="Layer_2"
                    data-name="Layer 2"
                    viewBox="0 0 140 140"
                >
                    <defs>
                        <linearGradient
                            id="linear-gradient"
                            x1="12.53"
                            y1="229.07"
                            x2="119.46"
                            y2="229.07"
                            gradientTransform="translate(0 246.89) scale(1 -1)"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop
                                offset="0"
                                :stop-color="color"
                                stop-opacity="0"
                            />
                            <stop
                                offset=".12"
                                :stop-color="color"
                                stop-opacity="0"
                            />
                            <stop
                                offset=".34"
                                :stop-color="color"
                            />
                            <stop
                                offset=".69"
                                :stop-color="color"
                            />
                            <stop
                                offset=".91"
                                :stop-color="color"
                                stop-opacity="0"
                            />
                        </linearGradient>
                    </defs>
                    <g
                        id="Layer_1-2"
                        data-name="Layer 1"
                    >
                        <g>
                            <path
                                class="spinner-color-bg"
                                d="M70,0C31.33,0,0,31.33,0,70s31.33,70,70,70,70-31.33,70-70S108.67,0,70,0Zm0,131.97c-34.2,0-61.97-27.77-61.97-61.97S35.8,8.03,70,8.03s61.97,27.77,61.97,61.97-27.77,61.97-61.97,61.97Z"
                            />
                            <path
                                class="spinner-color"
                                d="M114.87,25.82c1.38-1.38,2.87-2.75,4.25-4.13,.46-.34,.46-1.03,0-1.49C106.49,7.69,89.16,0,70,0,46.36,0,25.48,11.7,12.74,29.72c-.34,.46-.23,.92,.11,1.38l4.25,4.25c.46,.46,1.15,.34,1.61-.11,11.25-16.52,29.95-27.2,51.3-27.2,16.98,0,32.25,6.77,43.49,17.79,.34,.34,1.03,.34,1.38,0Z"
                            />
                        </g>
                    </g>
                </svg>
            </div>
            <div class="dl-spinner-icon">
                <svg
                    viewBox="0 0 51 45"
                    fill="none"
                >
                    <path
                        d="M23.2962 0.558083H0.830566V32.2536L10.1727 44.284H23.2962V38.5002H12.6195L6.39136 30.4028V6.11058H23.2962V0.558083Z"
                        :fill="iconColor"
                    />
                    <path
                        d="M27.5224 6.11058V0.558083C33.3056 -0.137737 52.8796 3.56565 50.6553 25.0816C48.9091 41.9727 34.3436 44.901 27.5224 44.284V38.5002C41.2242 39.4256 45.0945 29.1689 45.3169 23.9249C46.2067 8.19281 33.8246 5.49365 27.5224 6.11058Z"
                        :fill="iconColor"
                    />
                    <path
                        d="M23.2962 19.0664V13.5139H13.0643V27.3952L16.8457 31.7909H23.2962V26.2384H19.07L18.6251 25.5443V19.0664H23.2962Z"
                        :fill="iconColor"
                    />
                    <path
                        d="M27.5224 19.0664V13.5139C31.2296 13.2054 38.644 14.5782 38.644 22.5367C38.644 30.4953 31.2296 32.0223 27.5224 31.7909V26.2384C29.3018 26.7782 33.3056 26.9038 33.3056 22.9994C33.3056 19.0664 29.5984 18.758 27.5224 19.0664Z"
                        :fill="iconColor"
                    />
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue-demi'

export default defineComponent({
    props: {
        size: {
            type: String,
            default: '140px'
        },
        iconSize: {
            type: String,
            default: '50px'
        },
        borderColor: {
            type: String,
            default: 'var(--dl-color-separator)'
        },
        color: {
            type: String,
            default: 'var(--dl-color-secondary)'
        },
        iconColor: {
            type: String,
            default: 'var(--dl-color-tooltip-background)'
        }
    },
    computed: {
        spinnerStyles() {
            return {
                '--dl-spinner-size': this.size,
                '--dl-spinner-icon-size': this.iconSize,
                '--dl-spinner-border-color': this.borderColor,
                '--icon-top': `${
                    parseInt(this.size) / 2 -
                    parseInt(this.iconSize) / 2 +
                    parseInt(this.iconSize) / 25
                }px`
            }
        }
    }
})
</script>

<style src="../styles/spinnerStyles.scss" />
