<script setup>
import { User_info } from '../main';
import { ref } from 'vue';
import { onMounted } from 'vue';

const showPrivateKey = ref(false);
const privateKeyPassword = ref('');
const showSeed = ref(false);
const seedPassword = ref('');

const toggleShowPrivateKey = () => {
    showPrivateKey.value = !showPrivateKey.value;
    privateKeyPassword.value = ''; 
};

const toggleShowSeed = () => {
    showSeed.value = !showSeed.value;
    seedPassword.value = ''; 
};

// *******************************************************
// ****************** Get Balances ***********************
// *******************************************************

const getBalances = async () => {
    let net = 'wss://s.altnet.rippletest.net:51233'
    const client = new xrpl.Client(net)
    await client.connect()

    const standby_wallet = xrpl.Wallet.fromSeed(User_info.value.encryptedData.seed)
    const standby_balances = await client.request({
        command: "gateway_balances",
        account: standby_wallet.address,
        ledger_index: "validated",
    })
    client.disconnect()
} // End of getBalances()

onMounted(() => {
    getBalances();
})
</script>

<template>
    <main>
        <div class="row mb-3">
            <label class="col-sm-2">Nickname</label>
            <div class="col-sm-10">
                {{ User_info.nickname }}
            </div>
        </div>
        <div class="row mb-3">
            <label class="col-sm-2">Email</label>
            <div class="col-sm-10">
                {{ User_info.email }}
            </div>
        </div>
        <div class="row mb-3">
            <label class="col-sm-2">Country</label>
            <div class="col-sm-10">
                {{ User_info.country }}
            </div>
        </div>
        <div class="row mb-3">
            <label class="col-sm-2">server</label>
            <div class="col-sm-10">
                {{ User_info.server }}
            </div>
        </div>
        <div class="row mb-3">
            <label class="col-sm-2">address</label>
            <div class="col-sm-10">
                {{ User_info.address }}
            </div>
        </div>
        <div class="row mb-3">
            <label class="col-sm-2">Public Key</label>
            <div class="col-sm-10">
                {{ User_info.publicKey }}
            </div>
        </div>
        <div class="row mb-3">
            <label class="col-sm-2">Private Key</label>
            <div class="col-sm-8">
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="toggleShowPrivateKey">{{
                    showPrivateKey ? 'Hide' : 'Show' }}</button>
                <span v-if="showPrivateKey">{{ User_info.encryptedData.privateKey }}</span>
                <span v-else>*******</span>
            </div>
        </div>

        <div class="row mb-3">
            <label class="col-sm-2">Seed</label>
            <div class="col-sm-8">
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="toggleShowSeed">{{ showSeed ? 'Hide'
                    : 'Show' }}</button>
                <span v-if="showSeed">{{ User_info.encryptedData.seed }}</span>
                <span v-else>*******</span>
            </div>
        </div>
    </main>
</template>

<style scoped>
main {
    margin-top: 10px;
}

label {
    font-weight: bold;
}
</style>