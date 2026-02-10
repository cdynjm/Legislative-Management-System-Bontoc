<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
</script>

<template>
    <div class="flex aspect-square size-8 shadow-sm items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <AppLogoIcon class="size-10 fill-current text-white dark:text-black" />
    </div>
    <div class="ml-1 grid flex-1 text-left text-sm">
        <div class="flex flex-col">
        <span class=" truncate font-bold leading-none">Legislative MS</span>
        <span class=" font-thin leading-none text-[10px] mt-[5px]">Legislative Management System</span>
        </div>
        
    </div>
</template>
