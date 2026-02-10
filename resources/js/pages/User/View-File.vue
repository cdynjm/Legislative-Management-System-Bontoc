<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';

import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/vue3';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';


import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/./components/ui/select/';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table/';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import axios from 'axios';
import { Calendar, Calendar1, Calendar1Icon, CalendarArrowDown, CheckCircle, File, FileBoxIcon, FileCheckIcon, Folder, MinusCircle, UserCircle2, Users2Icon } from 'lucide-vue-next';
import { toast } from 'vue-sonner'
import { Textarea } from '@/./components/ui/textarea/'
import { CalendarCell } from 'reka-ui';
import SkeletonBox from '@/components/SkeletonBox.vue';

const props = defineProps<{
    id: string
}>();

const queryClient = useQueryClient();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'View File',
        href: '/user/view-file/' + props.id,
    },
];

const fetchViewedFile = async () => {
    const query = `
    query ($id: String!) {
        userviewFile(id: $id) {
            file {
                municipalStatus
                provincialStatus
                title
                firstReadingDate
                secondReadingDate
                thirdReadingDate
                ordinanceNumber
                finalTitle
                enactmentDate
                lceapprovalDate
                transmittalDate
                spslapprovalDate
                postStatus
                publishStatus
                file
                author {
                    name
                }
                coAuthors {
                    official {
                        name
                    }
                }
                category {
                    category
                }
            }
        }
    }
  `;

    const response = await axios.post(import.meta.env.VITE_APP_GRAPHQL_ENDPOINT, {
        query,
        variables: {
            id: props.id,
        },
    });

    return response.data.data;
};

const { data, isPending, isFetching, isLoading } = useQuery({
    queryKey: ['userfetchViewedFile'],
    queryFn: fetchViewedFile,
});

</script>

<template>

    <Head title="View File" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-4 space-y-6">

            <Card class="w-full shadow-none outline-none" v-if="isFetching">
                <CardHeader>
                    <SkeletonBox />
                </CardHeader>
            </Card>

            <Card v-else class="w-full shadow-none outline-none">
                <CardHeader>
                    <CardTitle><span class="text-[13px] mr-2">Ordinance Number: </span>{{
                        data?.userviewFile.file.ordinanceNumber != null ? data?.userviewFile.file.ordinanceNumber : '--' }}
                    </CardTitle>
                    <CardDescription class="mt-2">{{ data?.userviewFile.file.title }}</CardDescription>
                    <CardDescription class="font-bold text-blue-500">{{ data?.userviewFile.file.category.category }}</CardDescription>
                </CardHeader>
                <CardContent>
                    <hr>
                    <div class="mt-6">
                        <div class="text-gray-500 text-[13px] flex items-center gap-2 mb-2">
                            <div v-if="data?.userviewFile.file.municipalStatus == 1">
                                <MinusCircle class="w-5 h-5 text-red-500" />
                            </div>
                            <div v-else>
                                <CheckCircle class="w-5 h-5 text-green-500" />
                            </div>
                            Municipal Status: <span
                                :class="data?.userviewFile.file.municipalStatus == 1 ? 'text-red-500' : 'text-green-500'">{{
                                    data?.userviewFile.file.municipalStatus == 1 ? 'Draft Ordinance' : 'Approved Ordinance'
                                }}</span>
                        </div>

                        <div class="text-gray-500 text-[13px] flex items-center gap-2 mb-2">
                            <!-- Municipal Status Icon -->
                            <div
                                v-if="data?.userviewFile.file.provincialStatus == null || data?.userviewFile.file.provincialStatus == 1">
                                <MinusCircle class="w-5 h-5 text-red-500" />
                            </div>
                            <div v-else>
                                <CheckCircle class="w-5 h-5 text-green-500" />
                            </div>
                            Provincial Status: 
                            <span :class="[
                                data?.userviewFile.file.provincialStatus == 1 ? 'text-red-500' :
                                    data?.userviewFile.file.provincialStatus == 2 ? 'text-green-500' :
                                        'text-gray-500'
                            ]">
                                {{
                                    data?.userviewFile.file.provincialStatus == 1
                                        ? 'Disapproved'
                                        : data?.userviewFile.file.provincialStatus == 2
                                ? 'Approved Ordinance'
                                : 'No Status Yet'
                                }}
                            </span>
                        </div>

                        <div class="text-gray-500 text-[13px] flex items-center gap-2 mb-2">
                            <div>
                                <UserCircle2 class="w-5 h-5 text-blue-500" />
                            </div>
                            Author: <span class="font-bold">{{ data?.userviewFile.file.author.name }}</span>
                        </div>

                        <div class="mb-6">
                            <div class="text-gray-500 text-[13px] flex items-center gap-2 mb-2">
                                <div>
                                    <Users2Icon class="w-5 h-5 text-blue-500" />
                                </div>
                                Co-Authors: <span>{{ data?.userviewFile.file.coAuthors == '' ? 'None' : '' }}</span>
                            </div>
                            <div v-for="(coauthor, index) in data?.userviewFile.file.coAuthors" class="text-[13px] text-gray-500 ml-10">
                                <div class="flex items-center gap-2 mb-1">
                                <UserCircle2 class="w-4 h-4" />
                                {{ coauthor.official.name }}
                                </div>
                            </div>
                        </div>

                        <hr>

                        <div class="text-gray-500 text-[13px] flex items-center gap-2 mb-3 mt-6">
                            <div>
                                <FileBoxIcon class="w-5 h-5 text-green-500" />
                            </div>
                            Final Title:
                        </div>

                        <div class="text-gray-500 text-[13px]">{{ data?.userviewFile.file.finalTitle != null ? data?.userviewFile.file.finalTitle : '-' }}</div>
                        <hr class="my-4">
                        <div class="text-gray-500 text-[13px] flex items-center gap-2 mb-2">
                            <div>
                                <Calendar1Icon class="w-5 h-5 text-green-500" />
                            </div>
                            1st Reading: <span>{{ data?.userviewFile.file.firstReadingDate != null ? formatDate(data?.userviewFile.file.firstReadingDate) : '-' }}</span>
                        </div>

                        <div class="text-gray-500 text-[13px] flex items-center gap-2 mb-2">
                            <div>
                                <Calendar1Icon class="w-5 h-5 text-green-500" />
                            </div>
                            2nd Reading: <span>{{ data?.userviewFile.file.secondReadingDate != null ? formatDate(data?.userviewFile.file.secondReadingDate) : '-' }}</span>
                        </div>

                        <div class="text-gray-500 text-[13px] flex items-center gap-2 mb-2">
                            <div>
                                <Calendar1Icon class="w-5 h-5 text-green-500" />
                            </div>
                            3rd Reading: <span>{{ data?.userviewFile.file.thirdReadingDate != null ? formatDate(data?.userviewFile.file.thirdReadingDate) : '-' }}</span>
                        </div>

                        <div class="text-gray-500 text-[13px] flex items-center gap-2 mb-2">
                            <div>
                                <Calendar1Icon class="w-5 h-5 text-green-500" />
                            </div>
                            Enactment: <span>{{ data?.userviewFile.file.enactmentDate != null ? formatDate(data?.userviewFile.file.enactmentDate) : '-' }}</span>
                        </div>

                        <div class="text-gray-500 text-[13px] flex items-center gap-2 mb-2">
                            <div>
                                <Calendar1Icon class="w-5 h-5 text-green-500" />
                            </div>
                            LCE Approval: <span>{{ data?.userviewFile.file.lceapprovalDate != null ? formatDate(data?.userviewFile.file.lceapprovalDate) : '-' }}</span>
                        </div>

                        <div class="text-gray-500 text-[13px] flex items-center gap-2 mb-2">
                            <div>
                                <Calendar1Icon class="w-5 h-5 text-green-500" />
                            </div>
                            Transmittal: <span>{{ data?.userviewFile.file.transmittalDate != null ? formatDate(data?.userviewFile.file.transmittalDate) : '-' }}</span>
                        </div>

                        <div class="text-gray-500 text-[13px] flex items-center gap-2 mb-2">
                            <div>
                                <Calendar1Icon class="w-5 h-5 text-green-500" />
                            </div>
                            SPSL Approval: <span>{{ data?.userviewFile.file.spslapprovalDate != null ? formatDate(data?.userviewFile.file.spslapprovalDate) : '-' }}</span>
                        </div>

                        <div class="text-gray-500 text-[13px] flex items-center gap-2 mb-2">
                            <div>
                                <FileCheckIcon class="w-5 h-5 text-green-500" />
                            </div>
                            Post Status: <span>{{ data?.userviewFile.file.postStatus == 1 ? 'Posted' : '-' }}</span>
                        </div>

                        <div class="text-gray-500 text-[13px] flex items-center gap-2 mb-2">
                            <div>
                                <FileCheckIcon class="w-5 h-5 text-green-500" />
                            </div>
                            Publish Status: <span>{{ data?.userviewFile.file.publishStatus == 1 ? 'Published' : '-' }}</span>
                        </div>

                    </div>
                </CardContent>
                <CardFooter class="flex justify-between px-6 pb-6">
                    <Button class="text-[12px]">
                        <a :href="`/storage/files/${data?.userviewFile.file.file}`" target="_blank">Open PDF File</a>
                    </Button>
                </CardFooter>
            </Card>

        </div>
    </AppLayout>
</template>

<script lang="ts">

function formatDate(dateInput: string | Date): string {
    const date = new Date(dateInput);

    const datePart = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return `${datePart}`;
}

function trimTitle(title: string, limit: number = 50): string {
    if (title.length <= limit) return title;
    return title.slice(0, limit).trim() + '...';
}

</script>
