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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table/';

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
                    firstReadingDate
                    secondReadingDate
                    thirdReadingDate
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
            <Card class="py-2 shadow-none">
                <div class="mx-5">
                    <CardDescription
                        class="items-center justify-center gap-2 text-center font-bold md:flex md:justify-between">
                        <div class="flex items-center justify-center gap-2 md:mb-0">
                            <Folder class="mb-[2px] h-auto w-5" />
                            Recent Ordinances
                        </div>
                        <div class="hidden md:flex">Municipality of Bontoc</div>
                    </CardDescription>
                </div>
            </Card>
        </div>

        <div class="rounded-md p-4">
            <Table>
                <TableHeader class="bg-gray-50">
                    <TableRow>
                        <TableHead><small>#</small></TableHead>
                        <TableHead><small>Author & Title</small></TableHead>
                        <TableHead><small>Category</small></TableHead>
                        <TableHead><small>Co-Authors</small></TableHead>
                        <TableHead><small>Status</small></TableHead>
                        <TableHead><small>Updated</small></TableHead>
                        <TableHead class="text-center"><small>File</small></TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableRow v-if="isPending">
                        <TableCell :colspan="10">
                            <SkeletonCard />
                        </TableCell>
                    </TableRow>

                    <TableRow v-else-if="data?.userdashboard.files.length === 0">
                        <TableCell :colspan="10" class="py-16 text-center text-gray-500"> No data found. </TableCell>
                    </TableRow>

                    <template v-else>
                        <TableRow v-for="(files, index) in data?.userdashboard.files" :key="index">
                            <TableCell>{{ +index + 1 }}</TableCell>

                            <TableCell class="max-w-[200px] text-[13px]">
                                <div class="flex flex-col gap-4">
                                    <div class="flex items-center gap-2">
                                        <img draggable="false" :src="'/storage/profile/' + files.author.photo"
                                            class="h-8 w-8 shrink-0 rounded-full object-cover" />
                                        <div>
                                            <p class="text-[13px] font-medium">{{ files.author.name }}</p>
                                            <p class="text-[11px] text-gray-500">{{ files.author.position }}</p>
                                        </div>
                                    </div>
                                    <div class="flex flex-col">
                                        <small class="uppercase">Ordinance No. :</small>
                                        <b>{{ files.ordinanceNumber ?? '-' }}</b>
                                    </div>

                                    <p class="text-wrap">
                                        {{ files.finalTitle ?? files.title }}
                                    </p>
                                </div>
                            </TableCell>

                            <TableCell class="text-[13px] font-bold text-wrap text-gray-600">
                                {{ files.category.category }}
                            </TableCell>

                            <TableCell>
                                <div class="flex flex-col gap-2 text-wrap">
                                    <div v-for="(coauthor, i) in files.coAuthors" :key="i"
                                        class="flex items-center gap-2">
                                        <span class="h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                                        <div>
                                            <p class="text-[12px] font-medium">{{ coauthor.official.name }}</p>
                                            <p class="text-[11px] text-gray-500">{{ coauthor.official.position }}</p>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div class="flex flex-col gap-4">
                                    <div class="flex items-center gap-2">
                                        <small>Municipal: </small>
                                        <div class="flex items-center gap-1 text-[12px]">
                                            <MinusCircle v-if="files.municipalStatus == 1"
                                                class="h-4 w-4 shrink-0 text-red-500" />
                                            <CheckCircle v-else class="h-4 w-4 shrink-0 text-green-500" />
                                            <span
                                                :class="files.municipalStatus == 1 ? 'text-red-500' : 'text-green-500'">
                                                {{ files.municipalStatus == 1 ? 'Draft' : 'Approved' }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <template v-if="files.thirdReadingDate">
                                            <small class="uppercase">3rd Reading:</small>
                                            <p>{{ formatDate(files.thirdReadingDate) }}</p>
                                        </template>
                                        <template v-else-if="files.secondReadingDate">
                                            <small class="uppercase">2nd Reading:</small>
                                            <p>{{ formatDate(files.secondReadingDate) }}</p>
                                        </template>
                                        <template v-else-if="files.firstReadingDate">
                                            <small class="uppercase">1st Reading:</small>
                                            <p>{{ formatDate(files.firstReadingDate) }}</p>
                                        </template>
                                        <template v-else>
                                            <small class="text-gray-400 uppercase">No reading yet</small>
                                        </template>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <small>Provincial: </small>
                                        <div class="flex items-center gap-1 text-[12px]">
                                            <MinusCircle
                                                v-if="files.provincialStatus == null || files.provincialStatus == 1"
                                                class="h-4 w-4 shrink-0 text-red-500" />
                                            <CheckCircle v-else class="h-4 w-4 shrink-0 text-green-500" />
                                            <span :class="[
                                                files.provincialStatus == 1
                                                    ? 'text-red-500'
                                                    : files.provincialStatus == 2
                                                        ? 'text-green-500'
                                                        : 'text-gray-500',
                                            ]">
                                                {{
                                                    files.provincialStatus == 1
                                                        ? 'Disapproved'
                                                        : files.provincialStatus == 2
                                                            ? 'Approved'
                                                            : 'No Status'
                                                }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell class="text-[12px] text-gray-500">
                                {{ formatDateTime(files.updated_at) }}
                            </TableCell>

                            <TableCell class="text-center">
                                <a :href="'/storage/files/' + files.file" target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="link" class="text-[12px]">
                                        <File class="mr-1 h-4 w-4" /> PDF
                                    </Button>
                                </a>
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
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

function formatDate(dateInput: string | Date): string {
    const date = new Date(dateInput);

    const datePart = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return `${datePart}`;
}

</script>
