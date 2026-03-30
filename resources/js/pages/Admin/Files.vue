<script setup lang="ts">
import { ref, watchEffect } from 'vue';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/./components/ui/select/';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table/';
import { Textarea } from '@/./components/ui/textarea/';
import Pagination from '@/components/Pagination.vue';
import Skeleton from '@/components/Skeleton.vue';
import SkeletonCard from '@/components/SkeletonCard.vue';
import SlowLink from '@/components/SlowLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import axios from 'axios';
import { CheckCircle, Eye, FileSignatureIcon, Folder, LoaderCircle, MinusCircle, Pencil, Search, Trash2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

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
      files(id: $id, page: $page, first: $first, search: $search) {
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
    queryKey: ['fetchFiles', currentPage],
    queryFn: fetchFiles,
});

watchEffect(() => {
    if (data.value?.files?.filesListPaginated) {
        fileSearchData.value = data.value.files.filesListPaginated.data;
        paginatorInfo.value = data.value.files.filesListPaginated.paginatorInfo;
    }
});

const isSearching = ref<boolean>(false);

const searchQuerybtn = () => {
    if (isSearching.value) return;
    isSearching.value = true;
    setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['fetchFiles'] });
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

const openDialog = ref(false);

function createFileDialog(id: string) {
    createForm.categoryID = id;
    openDialog.value = true;
}

const createForm = useForm({
    categoryID: '' as string,
    municipalStatus: '' as string,
    title: '' as string,
    author: '' as string,
    coauthor: [] as string[],
    file: null as any,
});

const createFile = () => {
    createForm.post(route('create.file'), {
        onSuccess: () => {
            toast.success('File created and uploaded successfully');
            createForm.reset();
            openDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchFiles'] });
        },
        onError: () => {
            toast.error('Error creating file');
            console.error('Error');
        },
    });
};

const handleFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
        input.value = ''; // Clear input
        toast.error('File too large. Please select a smaller file.');
    }
    createForm.file = file;
    console.log('Selected file:', file);
};

const addCoAuthor = () => {
    createForm.coauthor.push('');
};

const removeCoAuthor = (index: number) => {
    createForm.coauthor.splice(index, 1);
};

const editDialog = ref(false);

function editFileDialog(
    id: string,
    categoryID: string,
    municipalStatus: string,
    provincialStatus: string,
    title: string,
    author: string,
    coauthor: string[],
    firstReadingDate: string,
    secondReadingDate: string,
    thirdReadingDate: string,
    ordinanceNumber: string,
    finalTitle: string,
    enactmentDate: string,
    lceapprovalDate: string,
    transmittalDate: string,
    spslapprovalDate: string,
    postStatus: string,
    publishStatus: string,
) {
    updateForm.id = id;
    updateForm.categoryID = categoryID;
    updateForm.municipalStatus = municipalStatus;
    updateForm.provincialStatus = provincialStatus;
    updateForm.title = title;
    updateForm.author = author;
    updateForm.coauthor = coauthor;
    updateForm.firstReadingDate = firstReadingDate;
    updateForm.secondReadingDate = secondReadingDate;
    updateForm.thirdReadingDate = thirdReadingDate;
    updateForm.ordinanceNumber = ordinanceNumber;
    updateForm.finalTitle = finalTitle;
    updateForm.enactmentDate = enactmentDate;
    updateForm.lceapprovalDate = lceapprovalDate;
    updateForm.transmittalDate = transmittalDate;
    updateForm.spslapprovalDate = spslapprovalDate;
    updateForm.postStatus = postStatus;
    updateForm.publishStatus = publishStatus;
    editDialog.value = true;
}

const updateForm = useForm({
    id: '' as string,
    categoryID: '' as string,
    municipalStatus: '' as string,
    provincialStatus: '' as string,
    title: '' as string,
    author: '' as string,
    coauthor: [] as string[],
    firstReadingDate: '' as string,
    secondReadingDate: '' as string,
    thirdReadingDate: '' as string,
    ordinanceNumber: '' as string,
    finalTitle: '' as string,
    enactmentDate: '' as string,
    lceapprovalDate: '' as string,
    transmittalDate: '' as string,
    spslapprovalDate: '' as string,
    postStatus: '' as string,
    publishStatus: '' as string,
    file: null as any,
});

const updateFile = () => {
    updateForm.post(route('update.file'), {
        onSuccess: () => {
            toast.success('File updated successfully');
            updateForm.reset();
            editDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchFiles'] });
        },
        onError: () => {
            toast.error('Error creating file');
            console.error('Error');
        },
    });
};

const handleEditFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
        input.value = ''; // Clear input
        toast.error('File too large. Please select a smaller file.');
    }
    createForm.file = file;
    console.log('Selected file:', file);
};

const addEditCoAuthor = () => {
    updateForm.coauthor.push('');
};

const removeEditCoAuthor = (index: number) => {
    updateForm.coauthor.splice(index, 1);
};

function getCoAuthorIds(coAuthors: { official: { encrypted_id: string } }[]) {
    return coAuthors.map((co) => co.official.encrypted_id);
}

const deleteDialog = ref(false);

function deleteFileDialog(id: string) {
    deleteForm.id = id;
    deleteDialog.value = true;
}

const deleteForm = useForm({
    id: '',
});

const deleteFile = () => {
    deleteForm.delete(route('delete.file'), {
        onSuccess: () => {
            toast.success('File deleted successfully');
            deleteForm.reset();
            deleteDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchFiles'] });
        },
        onError: () => {
            toast.error('Deletion Error');
            console.error('Error');
        },
    });
};

const openCategoryDialog = ref(false);

function createCategoryDialog(id: string) {
    createCategoryForm.id = id;
    openCategoryDialog.value = true;
}

const createCategoryForm = useForm({
    id: '' as string,
    category: '' as string,
});

const createCategory = () => {
    createCategoryForm.post(route('create.subcategory'), {
        onSuccess: () => {
            toast.success('Subcategory created successfully');
            createCategoryForm.reset();
            openCategoryDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchFiles'] });
        },
        onError: () => {
            toast.error('Error creating category');
            console.error('Error');
        },
    });
};

const editCategoryDialog = ref(false);

function updateCategoryDialog(id: string, category: string) {
    updateCategoryForm.id = id;
    updateCategoryForm.category = category;
    editCategoryDialog.value = true;
}

const updateCategoryForm = useForm({
    id: '' as string,
    category: '' as string,
});

const updateCategory = () => {
    updateCategoryForm.patch(route('update.subcategory'), {
        onSuccess: () => {
            toast.success('Subcategory updated successfully');
            updateCategoryForm.reset();
            editCategoryDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchFiles'] });
        },
        onError: () => {
            toast.error('Error updating category');
            console.error('Error');
        },
    });
};

const deleteCategoryDialog = ref(false);

function removeCategoryDialog(id: string) {
    deleteCategoryForm.id = id;
    deleteCategoryDialog.value = true;
}

const deleteCategoryForm = useForm({
    id: '',
});

const deleteCategory = () => {
    deleteCategoryForm.delete(route('delete.subcategory'), {
        onSuccess: () => {
            toast.success('Subcategory deleted successfully');
            deleteCategoryForm.reset();
            deleteCategoryDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchFiles'] });
        },
        onError: () => {
            toast.error('Deletion Error');
            console.error('Error');
        },
    });
};

function navigateTo(name: string, params: Record<string, any> = {}) {
    router.get(route(name, params));
}
</script>

<template>
    <Head title="Files" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-6 p-4">
            <!-- Top Right Add Button -->
            <div class="flex w-full items-center justify-between">
                <div v-if="isFetching">
                    <SkeletonCard />
                </div>

                <div v-else>
                    <h6 class="text-md flex items-center font-bold">
                        <Folder class="mr-2 h-8 w-8 flex-shrink-0 rounded-full border p-1 text-blue-500" fill="currentColor" />
                        {{ data?.files.categoryName.category }}
                    </h6>
                </div>

                <Dialog v-model:open="openCategoryDialog">
                    <DialogTrigger as-child>
                        <Button @click="createCategoryDialog(data?.files.categoryName.encrypted_id)" class="cursor-pointer"> + New </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add Category</DialogTitle>
                            <DialogDescription>
                                Create a sub-category for <b>{{ data?.files.categoryName.category }}</b>
                            </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="createCategory">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Category</Label>
                                    <Input v-model="createCategoryForm.category" placeholder="Category Name" class="col-span-3" required />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" :disabled="createCategoryForm.processing">
                                    <LoaderCircle v-if="createCategoryForm.processing" class="h-4 w-4 animate-spin" />
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="editCategoryDialog">
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription> Edit the details of the selected category </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="updateCategory">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Category</Label>
                                    <Input v-model="updateCategoryForm.category" placeholder="Category Name" class="col-span-3" required />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" :disabled="updateCategoryForm.processing">
                                    <LoaderCircle v-if="updateCategoryForm.processing" class="h-4 w-4 animate-spin" />
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="deleteCategoryDialog">
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Delete Subcategory</DialogTitle>
                            <DialogDescription> Are you sure you want to delete this category? This action cannot be undone. </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="deleteCategory">
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" variant="destructive" :disabled="deleteCategoryForm.processing">
                                    <LoaderCircle v-if="deleteCategoryForm.processing" class="h-4 w-4 animate-spin" />
                                    Delete
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="openDialog">
                    <DialogContent class="w-full sm:max-w-[800px]">
                        <DialogHeader>
                            <DialogTitle>Add New File</DialogTitle>
                            <DialogDescription>
                                Create a new file for <b>{{ data?.files.categoryName.category }}</b>
                            </DialogDescription>
                        </DialogHeader>

                        <form @submit.prevent="createFile" class="space-y-6">
                            <div class="flex flex-col space-y-1">
                                <Label class="text-sm font-medium text-gray-700">Municipal Status</Label>
                                <Select v-model="createForm.municipalStatus" required>
                                    <SelectTrigger class="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="1">Draft Ordinance</SelectItem>
                                            <SelectItem value="2">Approved Ordinance</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div class="flex flex-col space-y-1">
                                <Label class="text-sm font-medium text-gray-700">Title of Ordinance</Label>
                                <Textarea v-model="createForm.title" class="w-full" required />
                            </div>

                            <div class="flex flex-col space-y-1">
                                <Label class="text-sm font-medium text-gray-700">Author</Label>
                                <Select v-model="createForm.author" required>
                                    <SelectTrigger class="w-full">
                                        <SelectValue placeholder="Select an author" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectLabel>Authors</SelectLabel>
                                        <SelectGroup v-for="author in data?.files.authors">
                                            <SelectItem :value="author.encrypted_id">
                                                {{ author.name }}
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div class="flex flex-col space-y-1">
                                <Label class="text-sm font-medium text-gray-700">Co Authors</Label>

                                <div class="space-y-3">
                                    <div v-for="(co, index) in createForm.coauthor" :key="index" class="flex items-center gap-2">
                                        <Select v-model="createForm.coauthor[index]" required>
                                            <SelectTrigger class="w-full">
                                                <SelectValue placeholder="Select an author" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectLabel>Authors</SelectLabel>
                                                <SelectGroup>
                                                    <SelectItem
                                                        v-for="author in data?.files.authors"
                                                        :key="author.encrypted_id"
                                                        :value="author.encrypted_id"
                                                    >
                                                        {{ author.name }}
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>

                                        <!-- Optional: Remove button -->
                                        <button
                                            type="button"
                                            @click="removeCoAuthor(index)"
                                            class="cursor-pointer text-sm text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <!-- Add Co-Author Button -->
                                    <button type="button" @click="addCoAuthor" class="cursor-pointer text-sm text-blue-500 hover:text-blue-700">
                                        + Add
                                    </button>
                                </div>
                            </div>
                            <div class="flex flex-col space-y-1">
                                <Label class="text-sm font-medium text-gray-700">Upload a File</Label>
                                <Input type="file" class="col-span-3" @change="handleFileChange" accept=".pdf" required />
                            </div>
                            <!-- Footer -->
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" :disabled="createForm.processing">
                                    <LoaderCircle v-if="createForm.processing" class="h-4 w-4 animate-spin" />
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="editDialog">
                    <DialogContent class="max-h-[90vh] w-full overflow-y-auto sm:max-w-[800px]">
                        <DialogHeader>
                            <DialogTitle>Edit File</DialogTitle>
                            <DialogDescription>Edit the selected file's details below.</DialogDescription>
                        </DialogHeader>

                        <form @submit.prevent="updateFile" class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label class="text-sm font-medium text-gray-700">Municipal Status</Label>
                                <Select v-model="updateForm.municipalStatus" required>
                                    <SelectTrigger class="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Draft Ordinance</SelectItem>
                                        <SelectItem value="2">Approved Ordinance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label class="text-sm font-medium text-gray-700">Provincial Status</Label>
                                <Select v-model="updateForm.provincialStatus">
                                    <SelectTrigger class="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">No Status Yet</SelectItem>
                                        <SelectItem value="1">Disapproved Ordinance</SelectItem>
                                        <SelectItem value="2">Approved Ordinance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div class="md:col-span-2">
                                <Label class="text-sm font-medium text-gray-700">Title of Ordinance</Label>
                                <Textarea v-model="updateForm.title" class="w-full" required />
                            </div>

                            <div class="md:col-span-2">
                                <Label class="text-sm font-medium text-gray-700">Ordinance Number</Label>
                                <Input v-model="updateForm.ordinanceNumber" type="text" class="w-full" />
                            </div>

                            <div class="md:col-span-2">
                                <Label class="text-sm font-medium text-gray-700">Final Title</Label>
                                <Textarea v-model="updateForm.finalTitle" class="w-full" />
                            </div>

                            <div>
                                <Label class="text-sm font-medium text-gray-700">Author</Label>
                                <Select v-model="updateForm.author" required>
                                    <SelectTrigger class="w-full">
                                        <SelectValue placeholder="Select an author" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem v-for="author in data?.files.authors" :key="author.encrypted_id" :value="author.encrypted_id">
                                            {{ author.name }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <!-- Co Authors -->
                            <div class="md:col-span-2">
                                <Label class="text-sm font-medium text-gray-700">Co Authors</Label>
                                <div class="space-y-3">
                                    <div v-for="(co, index) in updateForm.coauthor" :key="index" class="flex items-center gap-2">
                                        <Select v-model="updateForm.coauthor[index]" required class="flex-1">
                                            <SelectTrigger class="w-full">
                                                <SelectValue placeholder="Select a co-author" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    v-for="author in data?.files.authors"
                                                    :key="author.encrypted_id"
                                                    :value="author.encrypted_id"
                                                >
                                                    {{ author.name }}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <button type="button" @click="removeEditCoAuthor(index)" class="cursor-pointer text-red-500">✕</button>
                                    </div>

                                    <button type="button" @click="addEditCoAuthor" class="cursor-pointer text-sm text-blue-500">+ Add</button>
                                </div>
                            </div>

                            <div>
                                <Label class="text-sm font-medium text-gray-700">1st Reading Date</Label>
                                <Input v-model="updateForm.firstReadingDate" type="date" />
                            </div>
                            <div>
                                <Label class="text-sm font-medium text-gray-700">2nd Reading Date</Label>
                                <Input v-model="updateForm.secondReadingDate" type="date" />
                            </div>
                            <div>
                                <Label class="text-sm font-medium text-gray-700">3rd Reading Date</Label>
                                <Input v-model="updateForm.thirdReadingDate" type="date" />
                            </div>
                            <div>
                                <Label class="text-sm font-medium text-gray-700">Enactment Date</Label>
                                <Input v-model="updateForm.enactmentDate" type="date" />
                            </div>
                            <div>
                                <Label class="text-sm font-medium text-gray-700">LCE Approval Date</Label>
                                <Input v-model="updateForm.lceapprovalDate" type="date" />
                            </div>
                            <div>
                                <Label class="text-sm font-medium text-gray-700">Transmittal Date</Label>
                                <Input v-model="updateForm.transmittalDate" type="date" />
                            </div>
                            <div>
                                <Label class="text-sm font-medium text-gray-700">SPSL Approval Date</Label>
                                <Input v-model="updateForm.spslapprovalDate" type="date" />
                            </div>

                            <div>
                                <Label class="text-sm font-medium text-gray-700">Post Status</Label>
                                <Select v-model="updateForm.postStatus">
                                    <SelectTrigger class="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="0">Not Yet</SelectItem>
                                            <SelectItem value="1">Posted</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label class="text-sm font-medium text-gray-700">Publish Status</Label>
                                <Select v-model="updateForm.publishStatus">
                                    <SelectTrigger class="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="0">Not Yet</SelectItem>
                                            <SelectItem value="1">Published</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div class="md:col-span-2">
                                <Label class="text-sm font-medium text-gray-700">Update File</Label>
                                <Input type="file" @change="handleEditFileChange" accept=".pdf" />
                            </div>

                            <div class="text-right md:col-span-2">
                                <Button type="submit" class="cursor-pointer" :disabled="updateForm.processing">
                                    <LoaderCircle v-if="updateForm.processing" class="h-4 w-4 animate-spin" />
                                    Save
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="deleteDialog">
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Delete File</DialogTitle>
                            <DialogDescription> Are you sure you want to delete this file? This action cannot be undone. </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="deleteFile">
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" variant="destructive" :disabled="deleteForm.processing">
                                    <LoaderCircle v-if="deleteForm.processing" class="h-4 w-4 animate-spin" />
                                    Delete
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
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
                        <TableHead class="text-right"><small>Actions</small></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-if="isFetching">
                        <TableCell colspan="10" class="text-center">
                            <Skeleton />
                        </TableCell>
                    </TableRow>
                    <TableRow v-else-if="data?.files.subCategoriesList.length === 0">
                        <TableCell colspan="5">
                            <small class="flex items-center justify-center text-center text-red-500">
                                <MinusCircle class="mr-2 w-5" />
                                No Data Found
                            </small>
                        </TableCell>
                    </TableRow>
                    <TableRow v-else v-for="(category, index) in data?.files.subCategoriesList" :key="category.id">
                        <TableCell>
                            <small>{{ index + 1 }}</small>
                        </TableCell>
                        <TableCell class="w-[300px] pr-20">
                            <SlowLink :href="route('admin.files', { id: category.encrypted_id })" prefetch>
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

                        <TableCell class="text-right">
                            <Button
                                variant="link"
                                @click="updateCategoryDialog(category.encrypted_id, category.category)"
                                class="ml-2 cursor-pointer"
                            >
                                <Pencil />
                            </Button>
                            <Button variant="destructive" @click="removeCategoryDialog(category.encrypted_id)" class="ml-2 cursor-pointer">
                                <Trash2 />
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <div class="flex flex-wrap items-center justify-between gap-4">
                <h6 class="text-md flex items-center font-bold">
                    <FileSignatureIcon class="mr-2 h-8 w-8 flex-shrink-0 rounded-full border p-1 text-green-500" />
                    Files
                </h6>
                <Button @click="createFileDialog(data?.files.categoryName.encrypted_id)" class="text-sm"> + New </Button>
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
                                        <SlowLink :href="route('admin.view-file', { id: files.encrypted_id })" prefetch>
                                            <Button variant="secondary" size="sm">
                                                <Eye class="h-4 w-4" />
                                            </Button>
                                        </SlowLink>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            @click="
                                                editFileDialog(
                                                    files.encrypted_id,
                                                    files.categoryID,
                                                    files.municipalStatus,
                                                    files.provincialStatus,
                                                    files.title,
                                                    files.author.encrypted_id,
                                                    getCoAuthorIds(files.coAuthors),
                                                    files.firstReadingDate,
                                                    files.secondReadingDate,
                                                    files.thirdReadingDate,
                                                    files.ordinanceNumber,
                                                    files.finalTitle,
                                                    files.enactmentDate,
                                                    files.lceapprovalDate,
                                                    files.transmittalDate,
                                                    files.spslapprovalDate,
                                                    files.postStatus,
                                                    files.publishStatus,
                                                )
                                            "
                                        >
                                            <Pencil class="h-4 w-4" />
                                        </Button>

                                        <Button variant="destructive" size="sm" @click="deleteFileDialog(files.encrypted_id)">
                                            <Trash2 class="h-4 w-4" />
                                        </Button>
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
