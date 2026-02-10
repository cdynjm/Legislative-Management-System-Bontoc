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

const queryClient = useQueryClient()

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Elected Officials',
        href: '/user/elected-officials',
    },
];

const fetchOfficials = async () => {
    const query = `
    query {
      userofficials {
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
    queryKey: ['userfetchOfficials'],
    queryFn: fetchOfficials,
});


</script>

<template>

    <Head title="Elected Officials" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-4 space-y-6">

            <div class="flex w-full justify-between items-center">
                <h6 class="flex-1 text-md font-bold">Elected Officials</h6>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-[50px]"><small>#</small></TableHead>
                        <TableHead class="w-[300px]"><small>Name</small></TableHead>
                        <TableHead><small>Position</small></TableHead>
                        <TableHead><small>Address</small></TableHead>
                        <TableHead class="text-right"><small>Status</small></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-if="isPending">
                        <TableCell colspan="10" class="text-center">
                            <Skeleton />
                        </TableCell>
                    </TableRow>
                    <TableRow v-else-if="data?.userofficials.length === 0">
                        <TableCell colspan="5">
                            <small class="text-center text-red-500 flex items-center justify-center">
                                <MinusCircle class="mr-2 w-5" />
                                No Data Found
                            </small>
                        </TableCell>
                    </TableRow>
                    <TableRow v-else v-for="(official, index) in data?.userofficials" :key="official.id">
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
