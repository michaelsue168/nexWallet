<script setup>
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { formData, originalObject, virtualAccount } from '../handlers/user'

const router = useRouter();

const handleSubmit = async () => {
    if (inputPassword2.value != originalObject.value.password) {
        message.error({
            content: 'Passwords do not match',
            duration: 3,
        });
        inputPassword2.value = ''
        originalObject.value.password = ''
    } else { router.push({ name: 'wallet' }) }
}

</script>

<template>
    <form class="row g-3 m-auto" @submit.prevent="handleSubmit">
        <div class="container d-flex">
            <div class="item">
                <div class="circle2">1</div>
                <span>Basic info</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-chevron-right icon" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
            </svg>
            <div class="item">
                <div class="circle1">2</div>
                <span>Wallet info</span>
            </div>
        </div>
        <div class="col-12">
            <div class="col-md-12">
                <label>
                    <h2>Basic info</h2>
                </label>
            </div>
            <div class="col-md-12">
                <label for="inputNickname" class="form-label">Nickname</label>
                <input type="text" class="form-control" id="inputNickname" v-model="formData.nickname" required>
            </div>
            <div class="col-md-12">
                <label for="inputEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="inputEmail" v-model="formData.email" required>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <label for="inputPassword" class="form-label">Password</label>
                    <input type="password" class="form-control" id="inputPassword" v-model="originalObject.password"
                        required>
                </div>
                <div class="col-md-6">
                    <label for="inputPassword2" class="form-label">Enter password again</label>
                    <input type="password" class="form-control" id="inputPassword2" required>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <label for="inputCountry" class="form-label">Country</label>
                    <input type="text" class="form-control" id="inputCountry" placeholder="e.g, USA, Taiwan..."
                        v-model="formData.country" required>
                </div>
                <div class="col-md-6">
                    <label for="inputcurrency" class="form-label">Main account currency</label>
                    <select class="form-select" id="inputcurrency" aria-label="Floating label select example" required
                        v-model="virtualAccount.currency">
                        <option value="US">US-CBDC</option>
                        <option value="JP">JP-CBDC</option>
                        <option value="NT">NT-CBDC</option>
                    </select>
                </div>
            </div>
            <div class="col-md-6">
                <label for="formGroupExampleInput" class="form-label">Main account type</label>
                <select class="form-select" id="formGroupExampleInput" aria-label="Floating label select example"
                    v-model="virtualAccount.type" required>
                    <option value="Demand">Demand deposit</option>
                    <option value="Fixed">Fixed deposit</option>
                    <option value="Investment">Investment</option>
                </select>
                <br />
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-primary">Next</button>
            </div>
        </div>
    </form>
</template>

<style scoped>
form {
    margin-top: 20px;
    width: 60vw;
    padding-top: 5vh;
}

@media (max-width: 768px) {
    form {
        margin-top: 20px;
        width: 100%;
        padding-top: 5vh;
    }
}

label {
    padding-top: 10px;
}

.item {
    display: flex;
    align-items: center;
}

.circle1 {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #0D6EFD;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    color: #FFFFFF;
    font-weight: bold;
}

.circle2 {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: rgba(169, 169, 169, 0.333);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    color: #FFFFFF;
    font-weight: bold;
}

.icon {
    width: 20px;
    height: 20px;
    margin: 5px 10px;
}
</style>