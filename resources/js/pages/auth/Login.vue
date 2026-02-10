<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthBase from '@/layouts/AuthLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { LoaderCircle, Eye, EyeClosed, Globe2Icon } from 'lucide-vue-next';
import { ref } from 'vue'; // Added for toggling password visibility
import { MessageCircle } from 'lucide-vue-next';
defineProps<{
    status?: string;
    canResetPassword: boolean;
}>();

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const showPassword = ref(false); // New reactive variable

const submit = () => {
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    });
};
</script>

<template>
    <AuthBase title="Log in to your account" description="Enter account credentials to log in">

        <Head title="Log in" />

        <div v-if="status" class="mb-4 text-center text-sm font-medium text-green-600">
            {{ status }}
        </div>

        <form @submit.prevent="submit" class="flex flex-col gap-6">
            <div class="grid gap-4">
                <div class="grid gap-2">
                    <Label for="email" class="text-[13px]">Email</Label>
                    <Input class="text-[13px]" id="email" type="email" required autofocus :tabindex="1"
                        autocomplete="email" v-model="form.email" placeholder="email@example.com" />
                    <InputError :message="form.errors.email" />
                </div>

                <div class="grid gap-2">
                    <div class="flex items-center justify-between">
                        <Label for="password" class="text-[13px]">Password</Label>
                        <button type="button"
                            class="text-[13px] text-muted-foreground hover:underline flex items-center gap-1 cursor-pointer"
                            @click="showPassword = !showPassword">
                            <span v-if="showPassword == false">
                                <Eye class="w-[18px]" />
                            </span>
                            <span v-if="showPassword == true">
                                <EyeClosed class=" w-[18px]" />
                            </span>
                            {{ showPassword ? 'Hide' : 'Show' }}
                        </button>
                    </div>
                    <Input class="text-[13px]" id="password" :type="showPassword ? 'text' : 'password'" required
                        :tabindex="2" autocomplete="current-password" v-model="form.password" placeholder="Password" />
                    <InputError :message="form.errors.password" />
                </div>

                <div class="flex items-center justify-between">
                    <Label for="remember" class="flex items-center space-x-1">
                        <Checkbox id="remember" v-model="form.remember" :tabindex="3" />
                        <span>Remember me</span>
                    </Label>
                </div>

                <Button type="submit" class="mt-4 w-full" :tabindex="4" :disabled="form.processing">
                    <LoaderCircle v-if="form.processing" class="h-4 w-4 animate-spin" />
                    Log in
                </Button>
            </div>

        </form>

        <footer class=" mt-8">
            <div class="w-full">
                <div class="grid grid-col-1 gap-4 items-center">

                    <!-- Right Section: Jemuel Cadayona -->
                    
    
                    <div class="flex flex-col items-center gap-4">
                        <!-- Legislative Logo + Labels -->
                        <Link :href="'/'" class="flex flex-col items-center">
                      
                        <div class="flex flex-col text-center mt-2">
                            <span class="text-[14px] font-semibold whitespace-nowrap dark:text-white">Legislative
                                MS</span>
                            <span class="text-[12px] text-gray-500">Legislative Management System</span>
                        </div>
                        </Link>

                        <!-- Logos -->
                        <div class="flex gap-4 mt-0">
                            <a href="https://southernleytestateu.edu.ph/index.php/en/" target="_blank"
                                class="flex flex-col items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
                                <img draggable="false" src="/logo-slsu.png" class="h-10 w-10 mb-1" alt="SLSU" />
                                <small>SLSU</small>
                            </a>
                            <a href="https://www.facebook.com/ictsorg" target="_blank"
                                class="flex flex-col items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
                                <img draggable="false" src="/logo-ccsit.jpg" class="h-10 w-10 mb-1" alt="FCSIT" />
                                <small>FCSIT</small>
                            </a>
                            <a href="https://jemcdyn.vercel.app/" target="_blank"
                                class="flex flex-col items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
                                <img draggable="false" src="/jemcdyn.png"
                                    class="h-10 w-10 outline p-1 outline-gray-400 rounded-[50%] mb-1" alt="FCSIT" />
                                <small>JEM, dev.</small>
                            </a>
                        </div>
                    </div>

                    <div class="flex flex-col items-center gap-4">

                        <!-- Labels -->
                        <div class="flex flex-col text-center">
                            <small class="text-gray-700 dark:text-gray-300">
                                Need technical assistance? <a href="https://www.facebook.com/jem.cdyn3" target="_blank"
                                    class="text-green-600">Chat
                                    <MessageCircle class="inline-block h-4 w-4 mb-1" />
                                </a>
                            </small>
                            <hr class="my-1 hidden lg:block">
                            <small class="font-semibold text-black dark:text-white">JEMUEL CADAYONA</small>
                            <small class="text-gray-600 dark:text-gray-400">Software Developer</small>
                            <small class="text-blue-400 dark:text-green-400 underline">
                                <a href="https://jemcdyn.vercel.app/" target="_blank" class="flex items-center gap-1">
                                    <Globe2Icon class="w-5 h-auto" /> https://jemcdyn.vercel.app/
                                </a></small>
                        </div>
                    </div>

                    <hr class="lg:hidden" />


                </div>

            </div>
        </footer>
    </AuthBase>
</template>
