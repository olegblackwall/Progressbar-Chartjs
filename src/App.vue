<template>
    <main class="test">
        <headerCmp />
        <section class="test__container">
            <router-view></router-view>
        </section>
    </main>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue'
import headerCmp from './components/base/header/header-cmp.vue'

defineComponent({
    components: {
        headerCmp
    }
})
</script>