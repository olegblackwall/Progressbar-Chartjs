<template>
    <header class="test-header">
        <nav class="test-header__nav__links">
            <a 
                class="test-header__nav__links__link test__link"
                v-for="(link, idx) in menu" 
                :key="idx"
                :href="link.link"
            >{{ link.name }}</a>
        </nav>
    </header>
</template>
<script lang="ts" setup>
import { defineProps, PropType } from 'vue'
defineProps({
    menu: {
        type: Array as PropType<Array<{ link: string, name: string }>>,
        default: () => [
            {
                link: '/',
                name: 'Задание 1: Progressbar'
            },
            {
                link: '/circle-diagram',
                name: 'Задание 2: Circle diagram'
            },
        ]
    },
})
</script>