<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';

import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link, router } from '@inertiajs/vue3';
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

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table/';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import axios from 'axios';
import { Pencil, Trash2, MinusCircle, CheckCircle, PenIcon, Search, Loader2Icon, FileSignatureIcon, Folder, File, LucideFileText, LoaderCircle, Eye, ArrowRightCircle, ArrowLeftCircle, ArrowRight, ArrowLeft } from 'lucide-vue-next';
import { toast } from 'vue-sonner'
import { Textarea } from '@/./components/ui/textarea/'
import Skeleton from '@/components/Skeleton.vue';
import SkeletonCard from '@/components/SkeletonCard.vue';
import SkeletonBox from '@/components/SkeletonBox.vue';
import Pagination from '@/components/Pagination.vue';
import SlowLink from '@/components/SlowLink.vue';

const props = defineProps<{
    id: string
}>();

const queryClient = useQueryClient();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Files',
        href: '/admin/files/' + props.id,
    },
];

const currentPage = ref(1);
const fileSearchData = ref<any[]>([]);
const searchQuery = ref<string>('');

const paginatorInfo = ref({
    currentPage: 1,
    lastPage: 1,
    hasMorePages: false,
})

const fetchFiles = async () => {
    const query = `
    query ($id: String!, $page: Int!, $first: Int!, $search: String) {
      userfiles(id: $id, page: $page, first: $first, search: $search) {
        categoryName {
          encrypted_id
          category
        }
        authors {
          encrypted_id
          name
        }
        filesListPaginated {
          data {
            encrypted_id
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
            updated_at
            author {
              encrypted_id
              name
              position
              photo
            }
            coAuthors {
              official {
                encrypted_id
                name
                position
              }
            }
          }
          paginatorInfo {
            currentPage
            lastPage
            total
            perPage
            hasMorePages
          }
        }
        subCategoriesList {
          encrypted_id
          category
          parentID
          created_at
          totalFiles
        }
      }
    }
  `;

    const response = await axios.post(import.meta.env.VITE_APP_GRAPHQL_ENDPOINT, {
        query,
        variables: {
            id: props.id,
            page: currentPage.value,
            first: 20,
            search: searchQuery.value
        },
    });

    return response.data.data;
};

const { data, isPending, isFetching, isLoading } = useQuery({
    queryKey: ['userfetchFiles', currentPage],
    queryFn: fetchFiles,
});

watchEffect(() => {
    if (data.value?.userfiles?.filesListPaginated) {
        fileSearchData.value = data.value.userfiles.filesListPaginated.data;
        paginatorInfo.value = data.value.userfiles.filesListPaginated.paginatorInfo;
    }
});

const isSearching = ref<boolean>(false);

const searchQuerybtn = () => {
    if (isSearching.value) return;
    isSearching.value = true;
    setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['userfetchFiles'] });
        isSearching.value = false;
    }, 2000);
};

const goToNextPage = () => {
    if (currentPage.value < paginatorInfo.value.lastPage) {
        currentPage.value++;
    }
};

const goToPreviousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

function navigateTo(name: string, params: Record<string, any> = {}) {
    router.get(route(name, params));
}

</script>

<template>

    <Head title="Files" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-4 space-y-6">

            <div class="flex w-full justify-between items-center">

                <div v-if="isFetching">
                    <SkeletonCard />
                </div>

                <div v-else>
                    <h6 class="flex text-md font-bold items-center">
                        <Folder class="h-8 w-8 mr-2 flex-shrink-0 rounded-full border p-1 text-blue-500"
                            fill="currentColor" />
                        {{ data?.userfiles.categoryName.category }}
                    </h6>
                </div>

            </div>

           <div class="flex items-center gap-2 w-full sm:w-auto">
                <Input v-model="searchQuery" placeholder="Search..." class="w-full sm:w-72 text-sm" />
                <Button @click="searchQuerybtn" :disabled="isSearching" class="text-sm flex items-center gap-1">
                    <LoaderCircle v-if="isSearching" class="h-4 w-4 animate-spin" />
                    <Search v-else />
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-[50px]"><small>#</small></TableHead>
                        <TableHead class="w-[300px]"><small>Category</small></TableHead>
                        <TableHead><small>No. of Files</small></TableHead>
                        <TableHead><small>Creation Date</small></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-if="isFetching">
                        <TableCell colspan="10" class="text-center">
                            <Skeleton />
                        </TableCell>
                    </TableRow>
                    <TableRow v-else-if="data?.userfiles.subCategoriesList.length === 0">
                        <TableCell colspan="5">
                            <small class="text-center text-red-500 flex items-center justify-center">
                                <MinusCircle class="mr-2 w-5" />
                                No Data Found
                            </small>
                        </TableCell>
                    </TableRow>
                    <TableRow v-else v-for="(category, index) in data?.userfiles.subCategoriesList" :key="category.id">
                        <TableCell>
                            <small>{{ index + 1 }}</small>
                        </TableCell>
                        <TableCell class="w-[300px] pr-20">
                            <SlowLink :href="route('user.files', { id: category.encrypted_id })" prefetch>
                            <div class="flex items-center space-x-3">
                                <div>
                                    <Folder class="h-8 w-8 flex-shrink-0 rounded-full border p-1 text-blue-500"
                                        fill="currentColor" />
                                </div>
                                <div>
                                    <div class="font-medium">{{ category.category }}</div>
                                </div>
                            </div>
                            </SlowLink>
                        </TableCell>
                        <TableCell>{{ category.totalFiles }}</TableCell>
                        <TableCell><small>{{ formatDateTime(category.created_at) }}</small></TableCell>
                    </TableRow>

                </TableBody>
            </Table>

            <div class="flex flex-wrap items-center justify-between gap-4">
                <h6 class="flex text-md font-bold items-center">
                    <FileSignatureIcon class="h-8 w-8 mr-2 flex-shrink-0 rounded-full border p-1 text-green-500"/>
                    Files
                </h6>
            </div>

            <div class="grid grid-cols-1 gap-4" v-if="fileSearchData.length === 0 && !isFetching">
                <Card class="shadow-none">
                    <CardDescription class="text-red-500 flex items-center justify-center text-[12px] gap-2">
                        <MinusCircle class="w-5 h-auto" /> No Data Found
                    </CardDescription>
                </Card>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <Card v-if="isFetching" class="shadow-none" v-for="n in 3">
                    <CardHeader class="text-[14px]">
                        <SkeletonCard />
                    </CardHeader>
                    <CardContent class="grid gap-4">
                        <SkeletonBox />
                    </CardContent>
                </Card>

                <Card v-else class="shadow-none flex flex-col h-full" v-for="(files, index) in fileSearchData">
                    <CardHeader class="text-[14px]">
                        <CardTitle>Ordinance Number</CardTitle>
                        <CardDescription>{{ files.ordinanceNumber != null ? files.ordinanceNumber : '-' }}
                        </CardDescription>
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

                            <SlowLink :href="route('user.view-file', { id: files.encrypted_id })" prefetch>
                            <Button variant="link" class="ml-0 cursor-pointer">
                                <Eye />
                            </Button>
                            </SlowLink>

                        </div>
                    </CardHeader>
                    <CardContent class="grid gap-4">

                        <div>
                            <p class="text-[14px]">{{ files.finalTitle == null ? files.title : files.finalTitle }}
                            </p>
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
            <Pagination :current-page="paginatorInfo.currentPage" :last-page="paginatorInfo.lastPage"
                @next="goToNextPage" @previous="goToPreviousPage" />
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

function trimTitle(title: string, limit: number = 50): string {
    if (title.length <= limit) return title;
    return title.slice(0, limit).trim() + '...';
}

</script>
