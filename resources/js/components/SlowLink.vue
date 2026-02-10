<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const props = defineProps({
  href: { type: String, required: true },
  class: {
    type: [String, Object, Array],
    default: '',
  },
});

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 50,
  easing: 'ease',
  speed: 300
});

const loading = ref(false);

function handleClick(event: Event) {
  event.preventDefault();

  if (loading.value) return;

  loading.value = true;
  NProgress.start();

  document.querySelectorAll('a').forEach((link) => {
    link.classList.add('pointer-events-none');
  });

  setTimeout(() => {
    router.visit(props.href, {
      onFinish: () => {
        loading.value = false;
        NProgress.done();

        document.querySelectorAll('a').forEach((link) => {
          link.classList.remove('pointer-events-none');
        });
      },
    });
  }, 1000);
}
</script>

<template>
  <a
    :href="props.href"
    :class="[
      props.class,
      { 'opacity-50': loading }
    ]"
    @click="handleClick"
  >
    <slot />
  </a>
</template>
