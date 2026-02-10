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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import axios from 'axios';
import { Pencil, Trash2, MinusCircle, Loader2Icon } from 'lucide-vue-next';
import { toast } from 'vue-sonner'
import Skeleton from '@/components/Skeleton.vue';
import { LoaderCircle, UserCircle2 } from 'lucide-vue-next';
import NavFooterFix from '@/components/NavFooterFix.vue';

const queryClient = useQueryClient()

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Management',
        href: '/admin/admin-management',
    },
];

const fetchAdmins = async () => {
    const query = `
    query {
      admins {
        encrypted_id
        name
        email
        role
      }
    }
  `
    const response = await axios.post(import.meta.env.VITE_APP_GRAPHQL_ENDPOINT, { query })
    return response.data.data
}

const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['fetchAdmins'],
    queryFn: fetchAdmins,
});

const openDialog = ref(false);

function createAdminDialog() {
    openDialog.value = true;
}

const createForm = useForm({
    name: '',
    email: '',
    password: '',
});

const createAdmin = () => {
    createForm.post(route('create.admin'), {
        onSuccess: () => {
            toast.success('Admin account created successfully');
            createForm.reset();
            openDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchAdmins'] });
        },
        onError: () => {
            toast.error('Email already exists');
            console.error('Error');
        },
    });
};

const editDialog = ref(false);

function editAdminDialog(id: string, name: string, email: string) {
    updateForm.id = id;
    updateForm.name = name;
    updateForm.email = email;
    editDialog.value = true;
}

const updateForm = useForm({
    id: '',
    name: '',
    email: '',
    password: '',
});

const updateAdmin = () => {
    updateForm.patch(route('update.admin'), {
        onSuccess: () => {
            toast.success('Admin account updated successfully');
            updateForm.reset();
            editDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchAdmins'] });
        },
        onError: () => {
            toast.error('Email already exists');
            console.error('Error');
        },
    });
};

const deleteDialog = ref(false);

function deleteAdminDialog(id: string) {
    deleteForm.id = id;
    deleteDialog.value = true;
}

const deleteForm = useForm({
    id: '',
});

const deleteAdmin = () => {
    deleteForm.delete(route('delete.admin'), {
        onSuccess: () => {
            toast.success('Admin account deleted successfully');
            deleteForm.reset();
            deleteDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchAdmins'] });
        },
        onError: () => {
            toast.error('Deletion Error');
            console.error('Error');
        },
    });
};


</script>

<template>

    <Head title="Admin Management" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-4 space-y-6">

            <!-- Top Right Add Button -->
            <div class="flex w-full justify-between items-center">

                <h6 class="flex-1 text-md font-bold">Administrators</h6>

                <Dialog v-model:open="openDialog">
                    <DialogTrigger as-child>
                        <Button @click="createAdminDialog" class="cursor-pointer">
                            + New
                        </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add Admin</DialogTitle>
                            <DialogDescription>
                                Enter details for a new admin
                            </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="createAdmin">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Name</Label>
                                    <Input v-model="createForm.name" placeholder="John Doe" class="col-span-3"
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
                                Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="editDialog">
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Edit Admin</DialogTitle>
                            <DialogDescription>
                                Update details for the admin
                            </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="updateAdmin">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Name</Label>
                                    <Input v-model="updateForm.name" placeholder="John Doe" class="col-span-3"
                                        required />
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
                            <DialogTitle>Delete Admin</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this admin? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="deleteAdmin">
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
                        <TableHead><small>Name</small></TableHead>
                        <TableHead><small>Email</small></TableHead>
                        <TableHead><small>Role</small></TableHead>
                        <TableHead class="text-right"><small>Actions</small></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-if="isPending">
                        <TableCell colspan="5" class="text-center">
                           <Skeleton />
                        </TableCell>
                    </TableRow>
                    <TableRow v-else-if="data?.admins.length === 0">
                        <TableCell colspan="10">
                            <small class="text-center text-red-500 flex items-center justify-center">
                                <MinusCircle class="mr-2 w-5" />
                                No Data Found
                            </small>
                        </TableCell>
                    </TableRow>
                    <TableRow v-else v-for="(admin, index) in data?.admins" :key="admin.encrypted_id">
                        <TableCell><small>{{ index + 1 }}</small></TableCell>
                        <TableCell>
                            <div class="flex items-center gap-2">
                                <UserCircle2 class="text-gray-500" />
                                <span>{{ admin.name }}</span>
                            </div>
                        </TableCell>
                        <TableCell>{{ admin.email }}</TableCell>
                        <TableCell>{{ admin.role == 1 ? 'Admin' : '' }}</TableCell>
                        <TableCell class="text-right">
                            <Button variant="link" class="ml-2 cursor-pointer"
                                @click="editAdminDialog(admin.encrypted_id, admin.name, admin.email)">
                                <Pencil />
                            </Button>
                            <Button variant="destructive" @click="deleteAdminDialog(admin.encrypted_id)" class="ml-2 cursor-pointer">
                                <Trash2 />
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
        
    </AppLayout>
</template>
