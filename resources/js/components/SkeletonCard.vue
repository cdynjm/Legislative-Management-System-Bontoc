<script setup lang="ts">
import { Skeleton } from './ui/skeleton';
</script>

<template>

    <div class="flex items-center space-x-4 w-full">
  <Skeleton class="h-12 w-12 rounded-full shrink-0" />
  <div class="space-y-2 w-full">
    <Skeleton class="h-4 w-full" />
    <Skeleton class="h-4 w-5/6" />
  </div>
</div>


</template>