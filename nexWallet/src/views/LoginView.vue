<script setup>
import { login } from '../handlers/user';
import CryptoJS from 'crypto-js';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { User_info } from '../main';

const logindata = ref({
    pbk: '',
    pwd: ''
})
const key = 'updatable';

const router = useRouter();
const handelLogin = async () => {
    message.loading({
        content: 'Loading...',
        key,
        duration: 0, // Setting duration to 0 makes the loading message indefinite
    });
    const encryptedData = CryptoJS.AES.encrypt(logindata.value.pwd.trim(), logindata.value.pbk.trim()).toString();
    const response = await login(logindata.value.pbk.trim(), encryptedData)
    if (response) {
        User_info.value = response.userinfo;
        const decryptedBytes = CryptoJS.AES.decrypt(User_info.value.encryptedData, logindata.value.pwd.trim());
        const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

        User_info.value.encryptedData = decryptedData._value;

        router.push({ name: 'home' })
        message.success({
            content: `${User_info.value.nickname} welcome !`,
            key,

            duration: 3,
        });
    } else {
        message.error({
            content: 'Public Key or Password is incorrect',
            duration: 3,
        });
    }

}

const switchrouter = (key) => {
    if (key == '1') {
        router.push({ name: 'wallet' });
    } else if (key == '2') {
        router.push({ name: 'login' });
    } else if (key == '3') {
        router.push({ name: 'home' });
    }
}
</script>

<template>
    <div class="text-center">
        <img alt="logo" src="@/assets/Wlogo.png" width="250" @click="switchrouter('3')" />
    </div>
    <main>
        <div class="mb-3">
            <label for="publicKeyInput" class="form-label">Public Key</label>
            <input type="text" class="form-control" id="publicKeyInput" v-model="logindata.pbk">
        </div>
        <div class="mb-3">
            <label for="passwordInput" class="form-label">Password</label>
            <input type="password" class="form-control" id="passwordInput" v-model="logindata.pwd">
        </div>
        <div class="mb-3">
            <button class="btn btn-primary" @click="handelLogin()">Login</button>
        </div>
    </main>
</template>

<style scoped>
main {
    padding: 5vw 15vw;
}
</style>