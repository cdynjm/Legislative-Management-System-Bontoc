<script setup lang="ts">
import { usePage, Link } from '@inertiajs/vue3';
import { type NavItem, type SharedData } from '@/types';
import { LayoutGrid, Folder, UserCheck, User2 } from 'lucide-vue-next';
import SlowLink from './SlowLink.vue';

const page = usePage<SharedData>();

const mainNavItems: NavItem[] = page.props.auth.user.role === 1
  ? [
      { title: 'Dashboard', href: 'admin.dashboard', icon: LayoutGrid },
      { title: 'Admin', href: 'admin.management', icon: User2 },
      { title: 'Officials', href: 'admin.elected-officials', icon: UserCheck },
      { title: 'File Manager', href: 'admin.file-manager', icon: Folder },
    ]
  : [
      { title: 'Dashboard', href: 'user.dashboard', icon: LayoutGrid },
      { title: 'Officials', href: 'user.elected-officials', icon: UserCheck },
      { title: 'File Manager', href: 'user.file-manager', icon: Folder },
    ];
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-sm block md:hidden">
    <div class="flex justify-around items-center h-10">
      <SlowLink
        v-for="item in mainNavItems"
        :key="item.href"
        :href="route(item.href)"
        class="flex flex-col items-center text-sm"
      >
        <component
          :is="item.icon"
          class="w-5 h-auto mb-0.5"
          :class="route().current(item.href) ? 'text-blue-500' : 'text-gray-500'"
        />
        <span
          class="text-[10px] leading-none"
          :class="route().current(item.href) ? 'text-blue-500' : 'text-gray-500'"
        >
          {{ item.title }}
        </span>
      </SlowLink>
    </div>
  </nav>
</template>
