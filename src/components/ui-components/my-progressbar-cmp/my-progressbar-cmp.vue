<template>
    <div :class="['progressbar', { 'shake-animation': is_shaking }]">
        <div class="progressbar">
            <div class="progressbar__container">
                <svg class="progressbar__container__circles" :height="radius * 2" :width="radius * 2">
                    <circle
                        class="progressbar__container__circles__background"
                        :cx="radius"
                        :cy="radius"
                        fill="transparent"
                        :r="inner_radius"
                        stroke="#f6f7fa"
                        :stroke-dasharray="stroke_dash_array"
                        stroke-linecap="round"
                        :stroke-width="stroke_width"
                        :transform="transform"
                    />
                    <circle
                        class="progressbar__container__circles__progress"
                        :cx="radius"
                        :cy="radius"
                        fill="transparent"
                        :r="inner_radius"
                        :stroke="current_color"
                        :stroke-dasharray="stroke_dash_array"
                        :stroke-dashoffset="stroke_offset"
                        stroke-linecap="round"
                        :stroke-width="stroke_width"
                        :transform="transform"
                    />
                </svg>
            </div>
            <div class="progressbar__container__status">
                <span v-if="computed_status === 'in progress'" class="progressbar__container__status__percentage">{{ percent }}%</span>
                <svg v-if="computed_status === 'success'" class="progressbar__container__status__success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="44px" height="44px" fill="#11ce66">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"/>
                </svg>
                <svg v-if="computed_status === 'warning'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="32" height="32">
                    <circle cx="128" cy="128" r="128" fill="#ffb822"/>
                    <path d="M 128 164.939 L 128 164.939 c -3.643 0 -6.638 -2.869 -6.798 -6.504 L 109.93 47.9 c -0.571 -7.605 5.444 -14.088 13.056 -14.088 h 0 c 7.613 0 13.627 6.482 13.056 14.088 l -11.272 110.535 C 134.638 162.071 131.643 164.939 128 164.939 z" fill="#ffffff"/>
                    <circle cx="128" cy="196.67" r="10.84" fill="#ffffff"/>
                </svg>
                <svg v-if="computed_status === 'error'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="68px" height="68px" fill="#ff4949">
                    <path d="M22.6066 21.3934C22.2161 21.0029 21.5829 21.0029 21.1924 21.3934C20.8019 21.7839 20.8019 22.4171 21.1924 22.8076L22.6066 21.3934ZM40.9914 42.6066C41.3819 42.9971 42.0151 42.9971 42.4056 42.6066C42.7961 42.2161 42.7961 41.5829 42.4056 41.1924L40.9914 42.6066ZM21.1924 41.1924C20.8019 41.5829 20.8019 42.2161 21.1924 42.6066C21.5829 42.9971 22.2161 42.9971 22.6066 42.6066L21.1924 41.1924ZM42.4056 22.8076C42.7961 22.4171 42.7961 21.7839 42.4056 21.3934C42.0151 21.0029 41.3819 21.0029 40.9914 21.3934L42.4056 22.8076ZM21.1924 22.8076L40.9914 42.6066L42.4056 41.1924L22.6066 21.3934L21.1924 22.8076ZM22.6066 42.6066L42.4056 22.8076L40.9914 21.3934L21.1924 41.1924L22.6066 42.6066Z"/>
                </svg>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, computed, watch, ref } from 'vue'

const props = defineProps({
    type: { 
        type: String, 
        default: 'circle'  //circle //arc
    },
    percent: { 
        type: Number, 
        default: 0, 
        validator: (value: number) => value >= 0 && value <= 100 
    },
    radius: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        default: 'in progress', 
        validator: (value: string) => ['in progress', 'success', 'warning', 'error'].includes(value) 
    },
})

const stroke_width = computed(() => props.radius * 0.06)
const inner_radius = computed(() => props.radius - stroke_width.value)

// Полная длина окружности
const circumference = computed(() => inner_radius.value * 2 * Math.PI)
const arc_length = computed(() => circumference.value * 0.75)

// Параметры dash-array для отображения прогресса
const dash_array = computed(() => `${arc_length.value} ${circumference.value}`)

// Начальная позиция arc / circle
const transform = computed(() => props.type === 'arc' ? `rotate(135, ${props.radius}, ${props.radius})` : `rotate(-90, ${props.radius}, ${props.radius})`)

// Вычисление dash-array и dash-offset для отображения прогресса
const stroke_dash_array = computed(() => (props.type === 'arc' ? dash_array.value : circumference.value))
const stroke_offset = computed(() => (props.type === 'arc' ? arc_length.value - (props.percent / 100) * arc_length.value : circumference.value - (props.percent / 100) * circumference.value))

const current_color = computed(() => {
    switch (props.status) {
        case 'warning': 
            return '#FFA500'
        case 'error': 
            return '#FF4949'
        case 'success': 
            return '#11CE66'
        default: 
            return '#03AEE2'
    }
})

const is_paused = computed(() => props.status === 'warning' || props.status === 'error')
const is_shaking = ref(false)

// Активация тряски
watch(() => props.status, (new_status) => {
    if (new_status === 'warning' || new_status === 'error') {
        is_shaking.value = true
        setTimeout(() => { is_shaking.value = false }, 500)
    }
})

// 'in progress' / 'success')
const computed_status = computed(() => {
    if (is_paused.value) return props.status
    return props.percent < 100 ? 'in progress' : 'success'
})
</script>

