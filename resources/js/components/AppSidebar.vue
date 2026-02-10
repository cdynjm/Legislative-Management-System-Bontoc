<script setup lang="ts">
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';
import { BookOpen, Folder, LayoutGrid, User2, UserCheck } from 'lucide-vue-next';
import AppLogo from './AppLogo.vue';
import SlowLink from './SlowLink.vue';

const page = usePage<SharedData>();

const mainNavItems: NavItem[] = page.props.auth.user.role === 1
  ? [
      { title: 'Dashboard', href: 'admin.dashboard', icon: LayoutGrid },
      { title: 'Admin Management', href: 'admin.management', icon: User2 },
      { title: 'Elected Officials', href: 'admin.elected-officials', icon: UserCheck },
      { title: 'File Manager', href: 'admin.file-manager', icon: Folder },
    ]
  : [
      { title: 'Dashboard', href: 'user.dashboard', icon: LayoutGrid },
      { title: 'Elected Officials', href: 'user.elected-officials', icon: UserCheck },
      { title: 'File Manager', href: 'user.file-manager', icon: Folder },
    ];

</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <SlowLink :href="page.props.auth.user.role == 1 ? route('admin.dashboard') : route('user.dashboard')">
                        <AppLogo />
                        </SlowLink>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter>
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
