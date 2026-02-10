<script setup lang="ts">
import { ref } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/vue3';
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
import { Pencil, Trash2, MinusCircle, Loader2Icon, LoaderCircle } from 'lucide-vue-next';
import { toast } from 'vue-sonner'
import Skeleton from '@/components/Skeleton.vue';
import NavFooterFix from '@/components/NavFooterFix.vue';

const queryClient = useQueryClient()

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Elected Officials',
        href: '/admin/elected-officials',
    },
];

const fetchOfficials = async () => {
    const query = `
    query {
      officials {
        encrypted_id
        name
        address
        position
        status
        photo
        user {
           email
        }
      }
    }
  `
    const response = await axios.post(import.meta.env.VITE_APP_GRAPHQL_ENDPOINT, { query })
    return response.data.data
}

const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['fetchOfficials'],
    queryFn: fetchOfficials,
});

const openDialog = ref(false);

function createOfficialDialog() {
    openDialog.value = true;
}

const createForm = useForm({
    name: '',
    address: '',
    position: '',
    status: '',
    email: '',
    password: '',
    picture: null as any
});

const createOfficial = () => {
    createForm.post(route('create.official'), {
        onSuccess: () => {
            toast.success('Official created successfully');
            createForm.reset();
            openDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchOfficials'] });
        },
        onError: () => {
            toast.error('Email already exists');
            console.error('Error');
        },
    });
};

const editDialog = ref(false);

function editOfficialDialog(id: string, name: string, address: string, position: string, status: string, email: string) {
    updateForm.id = id;
    updateForm.name = name;
    updateForm.address = address;
    updateForm.position = position;
    updateForm.status = status;
    updateForm.email = email;
    editDialog.value = true;
}

const updateForm = useForm({
    id: '',
    name: '',
    address: '',
    position: '',
    status: '',
    email: '',
    password: '',
    picture: null as any
});

const updateOfficial = () => {
    updateForm.post(route('update.official'), {
        onSuccess: () => {
            toast.success('Official updated successfully');
            updateForm.reset();
            editDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchOfficials'] });
        },
        onError: () => {
            toast.error('Email already exists');
            console.error('Error');
        },
    });
};

const deleteDialog = ref(false);

function deleteOfficialDialog(id: string) {
    deleteForm.id = id;
    deleteDialog.value = true;
}

const deleteForm = useForm({
    id: '',
});

const deleteOfficial = () => {
    deleteForm.delete(route('delete.official'), {
        onSuccess: () => {
            toast.success('Official deleted successfully');
            deleteForm.reset();
            deleteDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchOfficials'] });
        },
        onError: () => {
            toast.error('Deletion Error');
            console.error('Error');
        },
    });
};

const handlePictureChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.type.startsWith('image')) {
        try {
            if (file.size > maxSizeInBytes) {
                input.value = ''; // Clear input
                toast.error('File too large. Please select a smaller file.');
            }
            const compressedFile = await compressImage(file, {
                quality: 0.3,
                type: file.type,
            });
            createForm.picture = compressedFile;
        } catch (err) {
            console.error('Compression error:', err);
        }
    }
};

const handleUpdatePictureChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.type.startsWith('image')) {
        try {
            if (file.size > maxSizeInBytes) {
                input.value = ''; // Clear input
                toast.error('File too large. Please select a smaller file.');
            }
            const compressedFile = await compressImage(file, {
                quality: 0.3,
                type: file.type,
            });
            updateForm.picture = compressedFile;
        } catch (err) {
            console.error('Compression error:', err);
        }
    }
};

</script>

<template>

    <Head title="Elected Officials" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-4 space-y-6">

            <!-- Top Right Add Button -->
            <div class="flex w-full justify-between items-center">

                <h6 class="flex-1 text-md font-bold">Elected Officials</h6>

                <Dialog v-model:open="openDialog">
                    <DialogTrigger as-child>
                        <Button @click="createOfficialDialog" class="cursor-pointer">
                            + New
                        </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add Official</DialogTitle>
                            <DialogDescription>
                                Enter details for a new official
                            </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="createOfficial">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Name</Label>
                                    <Input v-model="createForm.name" placeholder="John Doe" class="col-span-3"
                                        required />
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Address</Label>
                                    <Input v-model="createForm.address" placeholder="Address" class="col-span-3"
                                        required />
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Position</Label>
                                    <Select v-model="createForm.position" class="col-span-3" required>
                                        <SelectTrigger class="w-[180px]">
                                            <SelectValue placeholder="Select a position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Positions</SelectLabel>
                                                <SelectItem value="Mayor">
                                                    Mayor
                                                </SelectItem>
                                                <SelectItem value="Vice Mayor">
                                                    Vice Mayor
                                                </SelectItem>
                                                <SelectItem value="SB Member">
                                                    SB Member
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Status</Label>
                                    <Select v-model="createForm.status" class="col-span-3" required>
                                        <SelectTrigger class="w-[180px]">
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                <SelectItem value="1">
                                                    Active
                                                </SelectItem>
                                                <SelectItem value="2">
                                                    Inactive
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Picture</Label>
                                    <Input type="file" class="col-span-3" @change="handlePictureChange" accept="image/*"
                                        required />
                                </div>


                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Email</Label>
                                    <Input v-model="createForm.email" type="email" placeholder="john@example.com"
                                        class="col-span-3" required />
                                </div>
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-start">Password</Label>
                                    <Input v-model="createForm.password" placeholder="Password" type="password"
                                        class="col-span-3" required />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" :disabled="createForm.processing">
                                <LoaderCircle v-if="createForm.processing" class="h-4 w-4 animate-spin" />
                                Save</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="editDialog">
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Edit Official</DialogTitle>
                            <DialogDescription>
                                Update the details of the official
                            </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="updateOfficial">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Name</Label>
                                    <Input v-model="updateForm.name" placeholder="John Doe" class="col-span-3"
                                        required />
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Address</Label>
                                    <Input v-model="updateForm.address" placeholder="Address" class="col-span-3"
                                        required />
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Position</Label>
                                    <Select v-model="updateForm.position" class="col-span-3" required>
                                        <SelectTrigger class="w-[180px]">
                                            <SelectValue placeholder="Select a position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Positions</SelectLabel>
                                                <SelectItem value="Mayor">
                                                    Mayor
                                                </SelectItem>
                                                <SelectItem value="Vice Mayor">
                                                    Vice Mayor
                                                </SelectItem>
                                                <SelectItem value="SB Member">
                                                    SB Member
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Status</Label>
                                    <Select v-model="updateForm.status" class="col-span-3" required>
                                        <SelectTrigger class="w-[180px]">
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                <SelectItem value="1">
                                                    Active
                                                </SelectItem>
                                                <SelectItem value="2">
                                                    Inactive
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-left">Change Picture</Label>
                                    <Input type="file" class="col-span-3" @change="handleUpdatePictureChange"
                                        accept="image/*" />
                                </div>


                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Email</Label>
                                    <Input v-model="updateForm.email" type="email" placeholder="john@example.com"
                                        class="col-span-3" required />
                                </div>
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-start">Change Password</Label>
                                    <Input v-model="updateForm.password" placeholder="Password" type="password"
                                        class="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" :disabled="updateForm.processing">
                                <LoaderCircle v-if="updateForm.processing" class="h-4 w-4 animate-spin" />
                                Save</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="deleteDialog">
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Delete Official</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this official? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="deleteOfficial">
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" variant="destructive" :disabled="deleteForm.processing">
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
                        <TableHead class="w-[300px]"><small>Name</small></TableHead>
                        <TableHead><small>Position</small></TableHead>
                        <TableHead><small>Address</small></TableHead>
                        <TableHead class="text-right"><small>Status</small></TableHead>
                        <TableHead class="text-right"><small>Actions</small></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-if="isPending">
                        <TableCell colspan="10" class="text-center">
                            <Skeleton />
                        </TableCell>
                    </TableRow>
                    <TableRow v-else-if="data?.officials.length === 0">
                        <TableCell colspan="10">
                            <small class="text-center text-red-500 flex items-center justify-center">
                                <MinusCircle class="mr-2 w-5" />
                                No Data Found
                            </small>
                        </TableCell>
                    </TableRow>
                    <TableRow v-else v-for="(official, index) in data?.officials" :key="official.id">
                        <TableCell>
                            <small>{{ index + 1 }}</small>
                        </TableCell>
                        <TableCell class="w-[300px] pr-20">
                            <div class="flex items-center space-x-3">
                                <!-- Picture -->
                                <img draggable="false" :src="'/storage/profile/' + official.photo" alt="Profile"
                                    class="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <div class="font-medium">{{ official.name }}</div>
                                    <small class="text-gray-500">{{ official.user.email }}</small>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{{ official.position }}</TableCell>
                        <TableCell>{{ official.address }}</TableCell>
                        <TableCell class="text-right">
                            <span v-if="official.status == 1" class="text-green-500">Active</span>
                            <span v-else class="text-red-500">Inactive</span>
                        </TableCell>
                        <TableCell class="text-right">
                            <Button variant="link"
                                @click="editOfficialDialog(official.encrypted_id, official.name, official.address, official.position, official.status, official.user.email)"
                                class="ml-2 cursor-pointer">
                                <Pencil />
                            </Button>
                            <Button variant="destructive" @click="deleteOfficialDialog(official.encrypted_id)"
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

type CompressOptions = {
    quality?: number;
    type?: string;
};

const compressImage = async (
    file: File,
    { quality = 0.3, type = 'image/jpeg' }: CompressOptions
): Promise<File> => {
    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    ctx.drawImage(imageBitmap, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, type, quality)
    );

    if (!blob) throw new Error('Image compression failed: blob is null');

    return new File([blob], file.name, { type: blob.type });
};

</script>
