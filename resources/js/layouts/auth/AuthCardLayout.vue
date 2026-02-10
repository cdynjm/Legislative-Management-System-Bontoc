<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/vue3';

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-4">
        <div class="flex w-full max-w-md flex-col gap-6">
            <div class="flex flex-col gap-6">
                <Card class="rounded-xl shadow-none">
                    <CardHeader class="px-10 pb-0 pt-4 text-center">
                        <Link :href="route('home')"
                            class="flex items-center justify-center gap-2 self-center font-medium">
                        <div class="flex h-10 w-10 items-center justify-center">
                            <AppLogoIcon class="size-9 fill-current text-black dark:text-white" />
                        </div>
                        <span class="font-semibold text-black dark:text-white text-[14px]">Legislative MS</span>
                        </Link>
                        <hr class="my-2">
                        <CardTitle class="mt-0 text-[14px]">{{ title }}</CardTitle>
                        <CardDescription class="text-[12px]">
                            {{ description }}
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="px-10 py-4">
                        <slot />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>

</template>
