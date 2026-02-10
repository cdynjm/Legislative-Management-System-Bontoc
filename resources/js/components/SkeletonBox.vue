<script lang="ts" setup>
import { Skeleton } from './ui/skeleton';
</script>

<template>
  <!-- Responsive Flex Row -->
  <div class="flex items-center space-x-4 w-full min-w-0">
    <Skeleton class="h-12 w-12 rounded-full shrink-0" />
    <div class="space-y-2 w-full">
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-5/6" />
    </div>
  </div>

  <!-- Responsive Flex Column -->
  <div class="flex flex-col space-y-3 w-full">
    <Skeleton class="h-[120px] w-full rounded-xl" />
    <div class="space-y-2 w-full">
      <Skeleton class="h-4 w-full " />
      <Skeleton class="h-4 w-5/6" />
    </div>
  </div>
</template>
