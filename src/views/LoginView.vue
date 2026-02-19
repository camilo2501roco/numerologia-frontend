<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth.js';
import authService from '../services/authService.js';



const email = ref('');
const password = ref('');
const errorMsg = ref('');
const authStore = useAuthStore();


const handleLogin = async () => {
    errorMsg.value = '';


    try {
        console.log("intentando login con:", email.value);

        const response = await authService.login(email.value, password.value);
        console.log('respuesta del servidor', response);


        if (response.token) {
            authStore.setToken(response.token);
            console.log('LOGIN EXITOSO: TOKEN GUARDADO EN LOCAL STORAGE');

        }
        else {
            errorMsg.value = 'No se recibio token del servidor';
        }

    } catch (error) {
        console.error("error en login", error);




    }
};



</script>


<template>

    <div>

        <h1>Login</h1>

        <form @submit.prevent="handleLogin">
            <div style="margin-bottom: 10px;">

                <label> Email:</label>

                <input v-model="email" type="email" placeholder="Correo" />

            </div>


            <div style="margin-bottom: 10px;">

                <label> Password:</label>
                <input v-model="password" type="password" placeholder="Contraseña" />
            </div>


            <button type="submit">Ingresar</button>

        </form>



        <div v-if="errorMsg" style="color: red; margin-top: 20px;">

            Error:{{ errorMsg }}
        </div>
    </div>



</template>