<!-- components/PaginationControls.vue -->
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'; // or your preferred icons
import { Button } from '@/components/ui/button';

const props = defineProps<{
  currentPage: number;
  lastPage: number;
}>();

const emit = defineEmits<{
  (e: 'previous'): void;
  (e: 'next'): void;
}>();
</script>

<template>
  <div class="flex justify-between items-center mt-8">
    <Button
      :disabled="props.currentPage <= 1"
      @click="$emit('previous')"
      class="cursor-pointer"
    >
      <ArrowLeft />
    </Button>

    <small>Pages {{ props.currentPage }} of {{ props.lastPage }}</small>

    <Button
      :disabled="props.currentPage >= props.lastPage"
      @click="$emit('next')"
      class="cursor-pointer"
    >
      <ArrowRight />
    </Button>
  </div>
</template>
