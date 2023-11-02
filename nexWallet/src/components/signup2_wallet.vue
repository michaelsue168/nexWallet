<script setup>
import { User_info,exchangeRates } from '../main';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { sign_up, formData, originalObject, formData2, originalObject2, virtualAccount } from '../handlers/user'

import CryptoJS from 'crypto-js';


let results = '';
const key = 'updatable';
const router = useRouter();

// ==================================get new account=========================================================
const getAccount = async () => {
    message.loading({
        content: 'Loading...',
        key,
        duration: 0, // Setting duration to 0 makes the loading message indefinite
    });
    let net = 'wss://s.altnet.rippletest.net:51233'
    const client = new xrpl.Client(net);
    results = 'Connecting to ' + net + '....';
    let faucetHost = null

    standbyResultField.value = results;


    let amount = '10000';
    await client.connect();

    results += '\nConnected, funding wallet.';
    standbyResultField.value = results;

    const my_wallet = (await client.fundWallet(null, { amount, faucetHost })).wallet;
    results += '\nGot a wallet.';
    standbyResultField.value = results;

    const my_balance = await client.getXrpBalance(my_wallet.address);

    formData.value.address = my_wallet.address;
    formData.value.publicKey = my_wallet.publicKey;
    formData.value.xRPbalance = my_balance
    originalObject.value.privateKey = my_wallet.privateKey;
    originalObject.value.seed = my_wallet.seed;
    results += '\nStandby account created.';
    standbyResultField.value = results;

    seeds.value = standbySeedField.value;
    client.disconnect();
    message.success({
        content: 'Loaded!',
        key,
        duration: 2,
    });
};


// ==================================get new account2=========================================================
const getAccount2 = async () => {
    message.loading({
        content: 'Loading...',
        key,
        duration: 0, // Setting duration to 0 makes the loading message indefinite
    });
    let net = 'wss://s.altnet.rippletest.net:51233'
    const client = new xrpl.Client(net);

    let faucetHost = null
    const exchangePamentRate = exchangeRates.value[formData.value.currency];
    let amount = '10000'
    await client.connect();
    const my_wallet = (await client.fundWallet(null, { amount, faucetHost })).wallet;

    const my_balance = await client.getXrpBalance(my_wallet.address);

    formData2.value.address = my_wallet.address;
    formData2.value.publicKey = my_wallet.publicKey;
    formData2.value.xRPbalance = my_balance
    originalObject2.value.privateKey = my_wallet.privateKey;
    originalObject2.value.seed = my_wallet.seed;

    seeds.value = standbySeedField.value;
    client.disconnect();
    message.success({
        content: 'Loaded!',
        key,
        duration: 2,
    });
};


// ==================================get account from seeds========================================================
const getAccountsFromSeeds = async () => {
    if (!seeds.value) {
        message.error({
            content: 'Error! Please fill in seeds',
            key,
            duration: 3,
        });
    } else {
        message.loading({
            content: 'Loading...',
            key,
            duration: 0, // Setting duration to 0 makes the loading message indefinite
        });
        let net = 'wss://s.altnet.rippletest.net:51233'
        const client = new xrpl.Client(net);
        results = 'Connecting to ' + 'wss://s.altnet.rippletest.net:51233' + '....';
        standbyResultField.value = results;

        await client.connect();
        results += '\nConnected, finding wallets.\n';
        standbyResultField.value = results;

        const standby_wallet = xrpl.Wallet.fromSeed(seeds.value);
        const standby_balance = await client.getXrpBalance(standby_wallet.address);

        formData.value.address = standby_wallet.address;
        formData.value.publicKey = standby_wallet.publicKey;
        formData.value.xRPbalance = standby_balance;
        originalObject.value.privateKey = standby_wallet.privateKey;
        originalObject.value.seed = standby_wallet.seed;

        client.disconnect();
        message.success({
            content: 'Loaded!',
            key,
            duration: 2,
        });
    }

};

// =====================================get virtual Account==========================================
const getVirtualAccount = async () => {
    const randomDigits1 = generateRandomDigits(10);
    const randomDigits2 = generateRandomDigits(10);
    const randomDigits3 = generateRandomDigits(10);
    virtualAccount.value.address = `${virtualAccount.value.bankCode}-${randomDigits1}-${randomDigits2}-${randomDigits3}`;
}

// =====================================get random digits==========================================
const generateRandomDigits = (length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

const handleSubmit = async () => {
    if (!formData.value.publicKey || !formData.value.type) {
        message.error({
            content: 'Please fill in account info',
            key,
            duration: 3,
        });
    } else {
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(originalObject), originalObject.value.password).toString();
        formData.value.encryptedData = encryptedData
        await getVirtualAccount();
        await getAccount2();
        const encryptedData2 = CryptoJS.AES.encrypt(JSON.stringify(originalObject2), originalObject.value.password).toString();
        formData2.value.encryptedData = encryptedData2

        const response = await sign_up(formData.value, virtualAccount.value, formData2.value)
        if (response.code) {
            message.error({
                content: 'This public Key is already been register',
                key,
                duration: 3,
            });
            formData.value.address = ''
            formData.value.publicKey = ''
            formData.value.encryptedData = ''
            originalObject.value.privateKey = ''
            originalObject.value.seed = ''
        } else {
            User_info.value = response.userinfo;
            const decryptedBytes = CryptoJS.AES.decrypt(User_info.value.encryptedData, originalObject.value.password);
            const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

            User_info.value.encryptedData = decryptedData._value;
            message.success({
                content: 'Success! Welcome to NexWallet',
                key,
                duration: 3,
            });
            router.push({ name: 'home' })
        }
    }

}

</script>

<template>
    <form class="row g-3 m-auto" @submit.prevent="handleSubmit">
        <div class="container d-flex">
            <div class="item">
                <div class="circle1">1</div>
                <span>Basic info</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-chevron-right icon" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
            </svg>
            <div class="item">
                <div class="circle2">2</div>
                <span>Wallet info</span>
            </div>
        </div>
        <div class="row" style="padding-top: 10px;">
            <div class="col-8">
                <div class="col-md-12">
                    <label>
                        <h2>Wallet</h2>
                    </label>
                </div>
                <div class="col-md-12">
                    <p>Testnet Servers</p>
                    <input class="form-check-label" type="radio" id="tn" name="server"
                        value="wss://s.altnet.rippletest.net:51233" v-model="formData.server" checked>
                    <label class="form-check-label" for="tn">Testnet</label>
                </div>
                <br />
                <div class="col-12">
                    <button type="button" class="btn btn-outline-primary" @click="getAccountsFromSeeds">Get Accounts From
                        Seeds</button>
                </div>
                <br />
                <div class="col-md-12">
                    <div class="form-floating">
                        <textarea class="form-control" placeholder="Leave a comment here" id="seeds"></textarea>
                        <label for="seeds">Seed</label>
                    </div>
                </div>
                <hr />
                <div class="row">
                    <div class="col-md-12">
                        <button type="button" class="btn btn-outline-primary " @click="getAccount()">Get New
                            Account</button>
                        <br /><br />
                    </div>
                    <div class="col-md-6">
                        <label for="standbyAccountField" class="form-label">Account address</label>
                        <input type="text" class="form-control" id="standbyAccountField" size="40"
                            v-model="formData.address" disabled readonly />
                    </div>
                    <div class="col-md-6">
                        <label for="standbyPubKeyField" class="form-label">Public Key</label>
                        <input type="text" class="form-control" id="standbyPubKeyField" size="40"
                            v-model="formData.publicKey" disabled readonly />
                    </div>
                    <div class="col-md-6">
                        <label for="standbyPrivKeyField" class="form-label">Private Key</label>
                        <input type="text" class="form-control" id="standbyPrivKeyField" size="40"
                            v-model="originalObject.privateKey" disabled readonly />
                    </div>
                    <div class="col-md-6">
                        <label for="standbySeedField" class="form-label">Seed</label>
                        <input type="text" class="form-control" id="standbySeedField" size="40"
                            v-model="originalObject.seed" disabled readonly />
                    </div>
                    <div class="col-md-6">
                        <label for="standbyBalanceField" class="form-label">XRP Balance</label>
                        <input type="text" class="form-control" id="standbyBalanceField" size="40"
                            v-model="formData.xRPbalance" disabled readonly />
                        <br />
                    </div>
                    <div class="col-md-6">
                        <label for="formGroupExampleInput" class="form-label">XRP account type</label>
                        <select class="form-select" id="formGroupExampleInput" aria-label="Floating label select example"
                            v-model="formData.type" required>
                            <option value="Demand">Demand deposit</option>
                            <option value="Fixed">Fixed deposit</option>
                            <option value="Investment">Investment</option>
                        </select>
                        <br />
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <label for="standbyResultField" class="form-label">Result</label>
                <textarea class="form-control" id="standbyResultField" cols="80" rows="20" disabled readonly></textarea>
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