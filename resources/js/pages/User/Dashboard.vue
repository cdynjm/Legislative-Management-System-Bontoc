<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/vue3';
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card'
import { Users, Folder, File, UserCheck } from 'lucide-vue-next'
import SkeletonCard from '@/components/SkeletonCard.vue';
import { Bell, Check, PenIcon, CheckCircle, MinusCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import SkeletonBox from '@/components/SkeletonBox.vue';
import SlowLink from '@/components/SlowLink.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/user/dashboard',
    },
];

const queryClient = useQueryClient()

const fetchDashboard = async () => {
    const query = `
        query {
            userdashboard {
                officialsCount
                categoriesCount
                filesCount
                files {
                    municipalStatus
                    provincialStatus
                    title
                    ordinanceNumber
                    finalTitle
                    file
                    updated_at
                    author {
                        name
                        photo
                        position
                    }
                    coAuthors {
                        official {
                            name
                            position
                        }
                    }
                    category {
                        category
                    }
                }
            }
        }
    `

    const response = await axios.post(import.meta.env.VITE_APP_GRAPHQL_ENDPOINT, { query });
    return response.data.data;
}

const { isPending, data, error, isFetching } = useQuery({
    queryKey: ['userfetchDashboard'],
    queryFn: fetchDashboard
});

</script>

<template>

    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <SlowLink :href="route('user.file-manager')" prefetch>
            <Card class="pt-0 shadow-none">
                <CardHeader class="flex items-center justify-between bg-blue-50 py-2">
                    <CardTitle class="text-[13px]">Categories</CardTitle>
                    <Folder class="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent v-if="isPending">
                    <SkeletonCard />
                </CardContent>
                <CardContent v-else>
                    <p class="text-2xl font-bold">{{ data?.userdashboard.categoriesCount }}</p>
                </CardContent>
            </Card>
            </SlowLink>

            <SlowLink :href="route('user.file-manager')" prefetch>
            <Card class="pt-0 shadow-none">
                <CardHeader class="flex items-center justify-between bg-red-50 py-2">
                    <CardTitle class="text-[13px]">Files</CardTitle>
                    <File class="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent v-if="isPending">
                    <SkeletonCard />
                </CardContent>
                <CardContent v-else>
                    <p class="text-2xl font-bold">{{ data?.userdashboard.filesCount }}</p>
                </CardContent>
            </Card>
            </SlowLink>

            <SlowLink :href="route('user.elected-officials')" prefetch>
            <Card class="pt-0 shadow-none">
                <CardHeader class="flex items-center justify-between bg-orange-50 py-2">
                    <CardTitle class="text-[13px]">Officials</CardTitle>
                    <UserCheck class="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent v-if="isPending">
                    <SkeletonCard />
                </CardContent>
                <CardContent v-else>
                    <p class="text-2xl font-bold">{{ data?.userdashboard.officialsCount }}</p>
                </CardContent>
            </Card>
            </SlowLink>
        </div>

         <div class="grid grid-cols-1 gap-4 p-4 py-0">
            <Card class="shadow-none py-2">
                <div class="mx-5">
                    <CardDescription
                        class="text-center font-bold md:flex items-center gap-2 justify-center md:justify-between">
                        <div class="flex justify-center items-center gap-2 md:mb-0">
                            <Folder class="mb-[2px] w-5 h-auto" />
                            Recent Ordinances
                        </div>
                        <div class="md:flex hidden">
                            Municpality of Sogod
                        </div>
                    </CardDescription>
                </div>
            </Card>
        </div>

        <div class="grid grid-cols-1 gap-4 p-4" v-if="data?.userdashboard.files.length === 0 && !isPending">
            <Card class="shadow-none">
                <CardDescription class="text-red-500 flex items-center justify-center text-[12px] gap-2">
                    <MinusCircle class="w-5 h-auto" /> No Data Found
                </CardDescription>
            </Card>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4">

            <Card v-if="isPending" class="shadow-none" v-for="n in 3">
                <CardHeader class="text-[14px]">
                    <SkeletonCard />
                </CardHeader>
                <CardContent class="grid gap-4">
                    <SkeletonBox />
                </CardContent>
            </Card>

            <Card v-else class="shadow-none flex flex-col h-full" v-for="(files, index) in data?.userdashboard.files">
                <CardHeader class="text-[14px]">
                    <CardTitle>Ordinance Number</CardTitle>
                    <CardDescription>{{ files.ordinanceNumber != null ? files.ordinanceNumber : '-' }}</CardDescription>
                    <div class=" flex items-center space-x-4 rounded-md border p-4">
                        <img draggable="false" :src="'/storage/profile/' + files.author.photo"
                            class="w-10 h-10 rounded-full object-cover" />
                        <div class="flex-1 space-y-1">
                            <p class="text-sm font-medium leading-none">
                                {{ files.author.name }}
                            </p>
                            <p class="text-[13px] text-muted-foreground">
                                {{ files.author.position }}
                            </p>
                        </div>
                        <PenIcon class="h-auto w-5" />
                    </div>
                </CardHeader>
                <CardContent class="grid gap-4">
                   <div class="text-[14px] font-bold text-gray-600">{{ files.category.category }}</div>
                    <div>
                        <p class="text-[14px]">{{ files.finalTitle == null ? files.title : files.finalTitle }}</p>
                    </div>
                    <div>
                        <div class="text-[14px] mb-4 font-bold text-blue-500">Co-Authors</div>
                        <div v-for="(coauhor, index) in files.coAuthors"
                            class="mb-4 grid grid-cols-[25px_minmax(0,1fr)] items-start pb-0 last:mb-0 last:pb-0">
                            <span class="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                            <div class="space-y-1">
                                <p class="text-sm font-medium leading-none">
                                    {{ coauhor.official.name }}
                                </p>
                                <p class="text-[12px] text-muted-foreground">
                                    {{ coauhor.official.position }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="text-gray-500 text-[13px] flex items-center gap-2">
                        <div v-if="files.municipalStatus == 1">
                            <MinusCircle class="w-5 h-5 text-red-500" />
                        </div>
                        <div v-else>
                            <CheckCircle class="w-5 h-5 text-green-500" />
                        </div>
                        Municipal Status: <span
                            :class="files.municipalStatus == 1 ? 'text-red-500' : 'text-green-500'">{{
                                files.municipalStatus == 1 ? 'Draft Ordinance' : 'Approved Ordinance'
                            }}</span>
                    </div>

                    <div class="text-gray-500 text-[13px] flex items-center gap-2">
                        <!-- Municipal Status Icon -->
                        <div v-if="files.provincialStatus == null || files.provincialStatus == 1">
                            <MinusCircle class="w-5 h-5 text-red-500" />
                        </div>
                        <div v-else>
                            <CheckCircle class="w-5 h-5 text-green-500" />
                        </div>
                        Provincial Status:
                        <span :class="[
                            files.provincialStatus == 1 ? 'text-red-500' :
                                files.provincialStatus == 2 ? 'text-green-500' :
                                    'text-gray-500'
                        ]">
                            {{
                                files.provincialStatus == 1
                                    ? 'Disapproved'
                                    : files.provincialStatus == 2
                                        ? 'Approved Ordinance'
                                        : 'No Status Yet'
                            }}
                        </span>
                    </div>
                    <small class="text-gray-500">{{ formatDateTime(files.updated_at) }}</small>
                </CardContent>

                <CardFooter class="mt-auto">
                    <Button class="w-full text-[12px] cursor-pointer">
                        <a :href="'/storage/files/' + files.file" class="flex items-center gap-2" target="_blank">
                            <File /> Open PDF File
                        </a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </AppLayout>
</template>

<script lang="ts">

function formatDateTime(dateInput: string | Date): string {
    const date = new Date(dateInput);

    const datePart = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const timePart = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    return `${datePart} | ${timePart}`;
}

</script>
