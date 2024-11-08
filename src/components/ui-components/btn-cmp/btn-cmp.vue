<template>
    <div 
        class="test-btn" 
        :class="btn_type ? `_${btn_type}` : '_primary'">
        <slot></slot>
        <span class="test-btn__text">{{ btn_text }}</span>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps({
    btn_type: {
        type: String,
        default: 'primary',
        validator: (value: string) => ['primary', 'warning', 'error', 'success'].includes(value)
    },
    btn_text: {
        type: String,
        default: 'button'
    }
})
</script>
