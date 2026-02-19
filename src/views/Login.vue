<template>
    <input type="text" v-model="usuario">
    <input type="text" v-model="pass">
    <button @click="ingresar()">Login</button>
</template>

<script setup>
import { ref } from 'vue';
import { postData } from '../services/apiClient.js';
import { useAuthStore } from '../store/auth.js';

let usuario = ref("")
let pass = ref("")
const useAuth = useAuthStore()

async function ingresar() {
    try {
        let res = await postData("usuarios/login", {
            email: usuario.value,
            password: pass.value
        })
        console.log(res);
        useAuth.token = res.token

    } catch (error) {
        console.log(error.response);

    }
}

</script>