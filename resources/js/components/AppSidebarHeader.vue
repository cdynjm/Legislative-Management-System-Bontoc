<script setup lang="ts">
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import UserInfo from '@/components/UserInfo.vue';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItemType } from '@/types';
import { LucideUserCircle, User2Icon, UserCircle2Icon, UserCircleIcon, UserIcon, LogOut } from 'lucide-vue-next'

import { usePage, Link, router } from '@inertiajs/vue3';
import { type SharedData, type User } from '@/types';
import { getInitials } from '@/composables/useInitials';

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import SlowLink from '@/components/SlowLink.vue';



const page = usePage<SharedData>();
const user = page.props.auth.user as User;

withDefaults(defineProps<{
  breadcrumbs?: BreadcrumbItemType[];
}>(), {
  breadcrumbs: () => []
});

const handleLogout = () => {
    router.flushAll();
};
</script>

<template>
  <header
    class="flex justify-between h-16 items-center gap-2 border-b border-sidebar-border/70 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
    <!-- Left: Sidebar trigger + breadcrumbs -->
    <div class="flex items-center gap-2">
      <SidebarTrigger class="-ml-1" />
      <template v-if="breadcrumbs && breadcrumbs.length > 0">
        <Breadcrumbs :breadcrumbs="breadcrumbs" />
      </template>
    </div>
    <!-- Right: Profile (no dropdown) -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-800 dark:text-white">Hi, {{ user.name.split(' ')[0] }}</span>
            <LucideUserCircle class="text-blue-500" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56 mr-5 mt-2">
        <DropdownMenuLabel>
        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserInfo :user="user" :show-email="true" />
        </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <SlowLink :href="route('profile.edit')">
              <span>Profile</span>
            </SlowLink>
            <DropdownMenuShortcut><User2Icon /></DropdownMenuShortcut>
          </DropdownMenuItem>
        <DropdownMenuItem>
          <Link method="post" :href="route('logout')" @click="handleLogout" as="button">
            <span>Log Out</span>
          </Link>
          <DropdownMenuShortcut><LogOut /></DropdownMenuShortcut>
        </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </header>

</template>
