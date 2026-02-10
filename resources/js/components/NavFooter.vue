<script setup lang="ts">
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Folder } from 'lucide-vue-next';
import { Link } from '@inertiajs/vue3';
import { MessageCircle, Globe2Icon } from 'lucide-vue-next';
</script>

<template>
    <footer class="m-4 mb-[50px] md:mb-[20px]">
        <div class="w-full">
            <div class="grid lg:gap-20 gap-4 md:grid-cols-1 lg:grid-cols-2 items-center">

                <!-- Right Section: Jemuel Cadayona -->
                <div class="flex flex-col items-center lg:flex-row lg:justify-end lg:items-center gap-4">
                    <!-- Image -->
                    <img draggable="false" src="/help-desk (1).png" class="h-40 w-40 object-contain" alt="Help Desk" />

                    <!-- Labels -->
                    <div class="flex flex-col text-center lg:text-left">
                        <small class="text-gray-700 dark:text-gray-300">
                            Need technical assistance? <a href="https://www.facebook.com/jem.cdyn3" target="_blank" class="text-green-600">Chat <MessageCircle class="inline-block h-4 w-4 mb-1" /></a>
                        </small>
                        <hr class="my-1 hidden lg:block">
                        <small class="font-semibold text-black dark:text-white">JEMUEL CADAYONA</small>
                        <small class="text-gray-600 dark:text-gray-400">Software Developer</small>
                        <small class="text-blue-400 dark:text-green-400 underline">
                            <a href="https://jemcdyn.vercel.app/" target="_blank" class="flex items-center gap-1">
                                <Globe2Icon class="w-5 h-auto" /> https://jemcdyn.vercel.app/
                            </a></small>
                    </div>
                </div>

                <hr class="lg:hidden" />
                <!-- Left 
      Section: Logo + Labels + Affiliates -->
                <div class="flex flex-col items-center lg:items-start gap-4">
                    <!-- Legislative Logo + Labels -->
                    <Link :href="'/'"
                        class="flex flex-col items-center lg:flex-row lg:items-center lg:space-x-3 rtl:space-x-reverse">
                    <img draggable="false" src="/app-logo.gif" class="h-10 w-10" alt="App Logo" />
                    <div class="flex flex-col text-center lg:text-left mt-2 lg:mt-0">
                        <span class="text-[14px] font-semibold whitespace-nowrap dark:text-white">Legislative MS</span>
                        <span class="text-[12px] text-gray-500">Legislative Management System</span>
                    </div>
                    </Link>

                    <!-- Logos -->
                    <div class="flex gap-4 mt-0">
                        <a href="https://southernleytestateu.edu.ph/index.php/en/" target="_blank"
                            class="flex flex-col items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
                            <img draggable="false" src="/logo-slsu.png" class="h-10 w-10 mb-1" alt="SLSU" />
                            <small>SLSU</small>
                        </a>
                        <a href="https://www.facebook.com/ictsorg" target="_blank"
                            class="flex flex-col items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
                            <img draggable="false" src="/logo-ccsit.jpg" class="h-10 w-10 mb-1" alt="FCSIT" />
                            <small>FCSIT</small>
                        </a>
                        <a href="https://jemcdyn.vercel.app/" target="_blank"
                            class="flex flex-col items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
                            <img draggable="false" src="/jemcdyn.png" class="h-10 w-10 outline p-1 outline-gray-400 rounded-[50%] mb-1" alt="FCSIT" />
                            <small>JEM, dev.</small>
                        </a>
                    </div>
                </div>


            </div>

        </div>
    </footer>





</template>
