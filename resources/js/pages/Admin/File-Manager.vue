<script setup lang="ts">
import { ref } from 'vue';
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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table/';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import axios from 'axios';
import { Pencil, Trash2, MinusCircle, Loader2Icon, Folder, LoaderCircle } from 'lucide-vue-next';
import { toast } from 'vue-sonner'
import Skeleton from '@/components/Skeleton.vue';
import NavFooter from '@/components/NavFooter.vue';
import NavFooterFix from '@/components/NavFooterFix.vue';
import SlowLink from '@/components/SlowLink.vue';

const queryClient = useQueryClient()

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'File Manager',
        href: '/admin/file-manager',
    },
];

const fetchCategories = async () => {
    const query = `
    query {
      categories {
        categoriesList {
            encrypted_id
            category
            parentID
            created_at
            totalFiles
        }
      }
    }
  `
    const response = await axios.post(import.meta.env.VITE_APP_GRAPHQL_ENDPOINT, { query })
    return response.data.data
}

const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['fetchCategories'],
    queryFn: fetchCategories,
});

const openDialog = ref(false);

function createCategoryDialog() {
    openDialog.value = true;
}

const createForm = useForm({
    category: '' as string,
});

const createCategory = () => {
    createForm.post(route('create.category'), {
        onSuccess: () => {
            toast.success('Category created successfully');
            createForm.reset();
            openDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchCategories'] });
        },
        onError: () => {
            toast.error('Error creating category');
            console.error('Error');
        },
    });
};

const editDialog = ref(false);

function editCategoryDialog(id: string, category: string) {
    updateForm.id = id;
    updateForm.category = category;
    editDialog.value = true;
}

const updateForm = useForm({
    id: '' as string,
    category: '' as string,
});

const updateCategory = () => {
    updateForm.patch(route('update.category'), {
        onSuccess: () => {
            toast.success('Category updated successfully');
            updateForm.reset();
            editDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchCategories'] });
        },
        onError: () => {
            toast.error('Error updating category');
            console.error('Error');
        },
    });
};

const deleteDialog = ref(false);

function deleteCategoryDialog(id: string) {
    deleteForm.id = id;
    deleteDialog.value = true;
}

const deleteForm = useForm({
    id: '',
});

const deleteCategory = () => {
    deleteForm.delete(route('delete.category'), {
        onSuccess: () => {
            toast.success('Category deleted successfully');
            deleteForm.reset();
            deleteDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchCategories'] });
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

    <Head title="File Manager" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-4 space-y-6">

            <!-- Top Right Add Button -->
            <div class="flex w-full justify-between items-center">

                <h6 class="flex-1 text-md font-bold">Categories</h6>

                <Dialog v-model:open="openDialog">
                    <DialogTrigger as-child>
                        <Button @click="createCategoryDialog" class="cursor-pointer">
                            + New
                        </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add Category</DialogTitle>
                            <DialogDescription>
                                Create a new category for the files
                            </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="createCategory">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Category</Label>
                                    <Input v-model="createForm.category" placeholder="Category Name" class="col-span-3"
                                        required />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer"
                                    :disabled="createForm.processing">
                                <LoaderCircle v-if="createForm.processing" class="h-4 w-4 animate-spin" />
                                    Save</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="editDialog">
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>
                                Edit the details of the selected category
                            </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="updateCategory">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Category</Label>
                                    <Input v-model="updateForm.category" placeholder="Category Name" class="col-span-3"
                                        required />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer"
                                    :disabled="updateForm.processing">
                                    <LoaderCircle v-if="updateForm.processing" class="h-4 w-4 animate-spin" />
                                    Save</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="deleteDialog">
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Delete Category</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this category? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="deleteCategory">
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" variant="destructive"
                                    :disabled="deleteForm.processing">
                                    <LoaderCircle v-if="deleteForm.processing" class="h-4 w-4 animate-spin" />
                                    Delete</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
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
                    <TableRow v-if="isPending">
                        <TableCell colspan="10" class="text-center">
                            <Skeleton />
                        </TableCell>
                    </TableRow>
                    <TableRow v-else-if="data?.categories.categoriesList.length === 0">
                        <TableCell colspan="5">
                            <small class="text-center text-red-500 flex items-center justify-center">
                                <MinusCircle class="mr-2 w-5" />
                                No Data Found
                            </small>
                        </TableCell>
                    </TableRow>
                    <TableRow v-else v-for="(category, index) in data?.categories.categoriesList" :key="category.id">
                        <TableCell>
                            <small>{{ index + 1 }}</small>
                        </TableCell>
                        <TableCell class="w-[300px] pr-20">
                            <SlowLink :href="route('admin.files', { id: category.encrypted_id })" prefetch>
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

                        <TableCell class="text-right">
                            <Button variant="link" @click="editCategoryDialog(category.encrypted_id, category.category)"
                                class="ml-2 cursor-pointer">
                                <Pencil />
                            </Button>
                            <Button variant="destructive" @click="deleteCategoryDialog(category.encrypted_id)"
                                class="ml-2 cursor-pointer">
                                <Trash2 />
                            </Button>
                        </TableCell>
                    </TableRow>

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

</script>
