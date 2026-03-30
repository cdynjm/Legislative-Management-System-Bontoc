<script setup lang="ts">
import { ref, watchEffect } from 'vue';

import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/vue3';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table/';
import Pagination from '@/components/Pagination.vue';
import Skeleton from '@/components/Skeleton.vue';
import SkeletonCard from '@/components/SkeletonCard.vue';
import SlowLink from '@/components/SlowLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import axios from 'axios';
import { CheckCircle, Eye, FileSignatureIcon, Folder, LoaderCircle, MinusCircle, Search } from 'lucide-vue-next';

const props = defineProps<{
    id: string;
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
});

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
            search: searchQuery.value,
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
        <div class="space-y-6 p-4">
            <div class="flex w-full items-center justify-between">
                <div v-if="isFetching">
                    <SkeletonCard />
                </div>

                <div v-else>
                    <h6 class="text-md flex items-center font-bold">
                        <Folder class="mr-2 h-8 w-8 flex-shrink-0 rounded-full border p-1 text-blue-500" fill="currentColor" />
                        {{ data?.userfiles.categoryName.category }}
                    </h6>
                </div>
            </div>

            <div class="flex w-full items-center gap-2 sm:w-auto">
                <Input v-model="searchQuery" placeholder="Search..." class="w-full text-sm sm:w-72" />
                <Button @click="searchQuerybtn" :disabled="isSearching" class="flex items-center gap-1 text-sm">
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
                            <small class="flex items-center justify-center text-center text-red-500">
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
                                        <Folder class="h-8 w-8 flex-shrink-0 rounded-full border p-1 text-blue-500" fill="currentColor" />
                                    </div>
                                    <div>
                                        <div class="font-medium">{{ category.category }}</div>
                                    </div>
                                </div>
                            </SlowLink>
                        </TableCell>
                        <TableCell>{{ category.totalFiles }}</TableCell>
                        <TableCell
                            ><small>{{ formatDateTime(category.created_at) }}</small></TableCell
                        >
                    </TableRow>
                </TableBody>
            </Table>

            <div class="flex flex-wrap items-center justify-between gap-4">
                <h6 class="text-md flex items-center font-bold">
                    <FileSignatureIcon class="mr-2 h-8 w-8 flex-shrink-0 rounded-full border p-1 text-green-500" />
                    Files
                </h6>
            </div>

            <div class="rounded-md p-4">
                <Table>
                    <TableHeader class="bg-gray-50">
                        <TableRow>
                            <TableHead><small>#</small></TableHead>
                            <TableHead><small>Author & Title</small></TableHead>
                            <TableHead><small>Co-Authors</small></TableHead>
                            <TableHead><small>Status</small></TableHead>
                            <TableHead><small>Updated</small></TableHead>
                            <TableHead class="text-center"><small>Actions</small></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        <TableRow v-if="isFetching">
                            <TableCell :colspan="9">
                                <SkeletonCard />
                            </TableCell>
                        </TableRow>

                        <TableRow v-else-if="fileSearchData.length === 0">
                            <TableCell :colspan="9" class="py-16 text-center text-gray-500"> No data found. </TableCell>
                        </TableRow>

                        <template v-else>
                            <TableRow v-for="(files, index) in fileSearchData" :key="index">
                                <TableCell>{{ index + 1 }}</TableCell>

                                <TableCell class="max-w-[200px] text-[13px]">
                                    <div class="flex flex-col gap-4">
                                        <div class="flex items-center gap-2">
                                            <img
                                                draggable="false"
                                                :src="'/storage/profile/' + files.author.photo"
                                                class="h-8 w-8 shrink-0 rounded-full object-cover"
                                            />
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

                                <TableCell>
                                    <div class="flex flex-col gap-2 text-wrap">
                                        <div v-for="(coauthor, i) in files.coAuthors" :key="i" class="flex items-center gap-2">
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
                                                <MinusCircle v-if="files.municipalStatus == 1" class="h-4 w-4 shrink-0 text-red-500" />
                                                <CheckCircle v-else class="h-4 w-4 shrink-0 text-green-500" />
                                                <span :class="files.municipalStatus == 1 ? 'text-red-500' : 'text-green-500'">
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
                                                    class="h-4 w-4 shrink-0 text-red-500"
                                                />
                                                <CheckCircle v-else class="h-4 w-4 shrink-0 text-green-500" />
                                                <span
                                                    :class="[
                                                        files.provincialStatus == 1
                                                            ? 'text-red-500'
                                                            : files.provincialStatus == 2
                                                              ? 'text-green-500'
                                                              : 'text-gray-500',
                                                    ]"
                                                >
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

                                <TableCell>
                                    <div class="flex items-center justify-center gap-1">
                                        <SlowLink :href="route('user.view-file', { id: files.encrypted_id })" prefetch>
                                            <Button variant="secondary" size="sm">
                                                <Eye class="h-4 w-4" />
                                            </Button>
                                        </SlowLink>

                                        <a :href="'/storage/files/' + files.file" target="_blank" rel="noopener noreferrer">
                                            <Button size="sm" variant="link" class="text-[12px]"> PDF </Button>
                                        </a>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </template>
                    </TableBody>
                </Table>

                <Pagination
                    :current-page="paginatorInfo.currentPage"
                    :last-page="paginatorInfo.lastPage"
                    @next="goToNextPage"
                    @previous="goToPreviousPage"
                />
            </div>
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

function trimTitle(title: string, limit: number = 50): string {
    if (title.length <= limit) return title;
    return title.slice(0, limit).trim() + '...';
}
</script>
