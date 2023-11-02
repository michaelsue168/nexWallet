<script setup>
import { ref } from 'vue';
import { allbank } from '../main';
import { computed } from 'vue';
import { User_info } from '../main';
import { watch } from 'vue';
import { message } from 'ant-design-vue';
import { fixed, getF, get, getP } from '../handlers/bank'
import { onMounted } from 'vue';


const open = ref(false);

const showModal = () => {
    open.value = true;
};

const fixedAccounts = computed(() => {
    return allbank.value.filter(allbanks => allbanks.type === 'Fixed');
});

const fixedData = ref({
    User: User_info.value.publicKey,
    Address: '',
    Rate: ''.trim(),
})

const selectedBank = ref(null);
const tempdata = ref({
    name: '',
    code: '',
    balance: '',
    currency: ''
})
watch(() => fixedData.value.Address, (nV, oV) => {

    selectedBank.value = allbank.value.find(item => item.address === nV);
    tempdata.value.name = selectedBank.value.bankName
    tempdata.value.code = selectedBank.value.bankCode
    tempdata.value.balance = selectedBank.value.amount
    tempdata.value.currency = selectedBank.value.currency
}, {
    deep: true
});


const handleOk = async () => {
    if (fixedData.value.Address === '' || fixedData.value.Rate === '') {
        message.error({
            content: 'Incomplete',
            duration: 3,
        });
    } else {
        const response = await fixed(fixedData.value)
        await getallF()
        open.value = false;
        message.success({
            content: 'success',
            duration: 3,
        });

    }
};

const getallBank = async () => {
    const response = await get()
    allbank.value = response.onbankdata
}
const allF = ref()
const allP = ref()

const getallF = async () => {
    const response = await getF()
    allF.value = response.onFdata
}
const getallP = async () => {
    const response = await getP()
    allP.value = response.onPdata
}
const Finfo = ref(null);

const saving = async (id,Flexaddress) => {

    if (!User_info) {
        message.error({
            content: 'Please Sign in',
            key,
            duration: 3,
        });
    } else {
        message.loading({
            content: 'Loading...',
            key,
            duration: 0, // Setting duration to 0 makes the loading message indefinite
        });
        results = "Connecting to the selected ledger.\n"
        ResultField.value = results
        let net = 'wss://s.altnet.rippletest.net:51233'
        results = 'Connecting to ' + 'wss://s.altnet.rippletest.net:51233' + '....'
        const client = new xrpl.Client(net)
        await client.connect()

        results += "\nConnected. Sending XRP.\n"
        ResultField.value = results
        
        Finfo.value = allbank.value.find(item => item.address === Flexaddress);

        const decryptedBytes = CryptoJS.AES.decrypt(Finfo.value.encryptedData, passwordInput.value);
        const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
        const standby_wallet = xrpl.Wallet.fromSeed(decryptedData._value.seed)

        const res = await getTo(TransferData.value.To);
        Tinfo.value = res.todata.xrpaddress

        const sendAmount = TransferData.value.PayAmount
        const sendCurrency = TransferData.value.Currency
        calculateExchange()

        results += "\nstandby_wallet.address: = " + standby_wallet.address
        ResultField.value = results
        const prepared = await client.autofill({
            "TransactionType": "Payment",
            "Account": standby_wallet.address,
            "Amount": xrpl.xrpToDrops(TransferData.value.PayAmount),
            "Destination": Tinfo.value,
        })

        const signed = standby_wallet.sign(prepared)

        const tx = await client.submitAndWait(signed.tx_blob)

        results += "\nBalance changes: " +
            JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
        ResultField.value = results
        TransferData.value.FBalance = (await client.getXrpBalance(standby_wallet.address))
        TransferData.value.Tbalance = (await client.getXrpBalance(Tinfo.value))

        await onsendXRP(TransferData.value)
        client.disconnect()
        message.success({
            content: 'Success Transfer!',
            key,
            duration: 3,
        });
    }





}
onMounted(() => {
    getallF()
    getallP()
    getallBank()
})
</script>
<template>
    <div style="margin-top: 10px;">
        <a-modal v-model:open="open" title="Add fixed pocket" @ok="handleOk">
            <div class="mb-3 row">
                <div class="col-6">
                    <label for="formGroupExampleInput" class="form-label">Fixed Address</label>
                    <select class="form-select" id="floatingSelect" aria-label="Floating label select example"
                        v-model="fixedData.Address" required>
                        <option v-for="account in fixedAccounts" :key="account.address">{{
                            account.address }}
                        </option>
                    </select>
                </div>
                <div class="col-6">
                    <label for="formGroupExampleInput" class="form-label">Deposit rate<small> %</small></label>
                    <input type="number" class="form-control" id="formGroupExampleInput" min="1" max="95"
                        v-model="fixedData.Rate" required>
                </div>
            </div>
            <div class="mb-3 row">
                <div class="col-3">
                    <label for="formGroupExampleInput" class="form-label">Bank name</label>
                    <input type="text" class="form-control" id="formGroupExampleInput" v-model="tempdata.name" readonly
                        disabled>
                </div>
                <div class="col-3">
                    <label for="formGroupExampleInput" class="form-label">Bank code</label>
                    <input type="number" class="form-control" id="formGroupExampleInput" v-model="tempdata.code" readonly
                        disabled>
                </div>
                <div class="col-3">
                    <label for="formGroupExampleInput" class="form-label">Balance</label>
                    <input type="number" class="form-control" id="formGroupExampleInput" v-model="tempdata.balance" readonly
                        disabled>
                </div>
                <div class="col-3">
                    <label for="formGroupExampleInput" class="form-label">Currency</label>
                    <input type="text" class="form-control" id="formGroupExampleInput" v-model="tempdata.currency" readonly
                        disabled>
                </div>
            </div>
        </a-modal>
    </div>
    <div class="row">
        <h1>Fixed pocket</h1>
        <hr />
        <p style="color: rgb(237, 41, 41);" v-if="fixedAccounts.length == 0">No fixed deposit account yet.</p>
        <div class="col-md-4 mb-3" v-for="allFs in allF">
            <div class="card border-light" style="height: 100%;">
                <div class="card-body">
                    <p class="card-text" style="font-size: large;"><strong>Rate : </strong>{{ allFs.rate }}<small>
                            %</small></p>
                    <p class="card-text" style="font-size: large;"><strong>address :</strong><br>{{ allFs.address }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-3">
            <a-button class="col-sm-12 mb-3" type="dashed" :size="large" style="width: 100%;height: 100%;"
                @click="showModal" ghost>
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-piggy-bank"
                    viewBox="0 0 16 16">
                    <path
                        d="M5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm1.138-1.496A6.613 6.613 0 0 1 7.964 4.5c.666 0 1.303.097 1.893.273a.5.5 0 0 0 .286-.958A7.602 7.602 0 0 0 7.964 3.5c-.734 0-1.441.103-2.102.292a.5.5 0 1 0 .276.962z" />
                    <path fill-rule="evenodd"
                        d="M7.964 1.527c-2.977 0-5.571 1.704-6.32 4.125h-.55A1 1 0 0 0 .11 6.824l.254 1.46a1.5 1.5 0 0 0 1.478 1.243h.263c.3.513.688.978 1.145 1.382l-.729 2.477a.5.5 0 0 0 .48.641h2a.5.5 0 0 0 .471-.332l.482-1.351c.635.173 1.31.267 2.011.267.707 0 1.388-.095 2.028-.272l.543 1.372a.5.5 0 0 0 .465.316h2a.5.5 0 0 0 .478-.645l-.761-2.506C13.81 9.895 14.5 8.559 14.5 7.069c0-.145-.007-.29-.02-.431.261-.11.508-.266.705-.444.315.306.815.306.815-.417 0 .223-.5.223-.461-.026a.95.95 0 0 0 .09-.255.7.7 0 0 0-.202-.645.58.58 0 0 0-.707-.098.735.735 0 0 0-.375.562c-.024.243.082.48.32.654a2.112 2.112 0 0 1-.259.153c-.534-2.664-3.284-4.595-6.442-4.595zM2.516 6.26c.455-2.066 2.667-3.733 5.448-3.733 3.146 0 5.536 2.114 5.536 4.542 0 1.254-.624 2.41-1.67 3.248a.5.5 0 0 0-.165.535l.66 2.175h-.985l-.59-1.487a.5.5 0 0 0-.629-.288c-.661.23-1.39.359-2.157.359a6.558 6.558 0 0 1-2.157-.359.5.5 0 0 0-.635.304l-.525 1.471h-.979l.633-2.15a.5.5 0 0 0-.17-.534 4.649 4.649 0 0 1-1.284-1.541.5.5 0 0 0-.446-.275h-.56a.5.5 0 0 1-.492-.414l-.254-1.46h.933a.5.5 0 0 0 .488-.393zm12.621-.857a.565.565 0 0 1-.098.21.704.704 0 0 1-.044-.025c-.146-.09-.157-.175-.152-.223a.236.236 0 0 1 .117-.173c.049-.027.08-.021.113.012a.202.202 0 0 1 .064.199z" />
                </svg>
                <h3>Add fixed pocket</h3>
            </a-button>
        </div>
    </div>
    <div class="row">
        <h1>Pending transactions</h1>
        <hr />
        <div class="col-md-4 mb-3" v-for="allPs in allP" :key="allPs.address">
            <div class="card border-light" style="height: 100%;">
                <div class="card-body">
                    <p class="card-text" style="font-size: large;"><strong>Rate : </strong>{{ allPs.rate }}<small>
                            %</small></p>
                    <p class="card-text" style="font-size: large;"><strong>Amount : </strong>{{ allPs.amount }}</p>
                    <p class="card-text" style="font-size: large;"><strong>Pocket address :</strong><br>{{ allPs.address }}
                    </p>
                    <p class="card-text" style="font-size: large;"><strong>From :</strong><br>{{ allPs.from }}</p>
                    <p class="card-text" style="font-size: large;"><strong>To :</strong><br>{{ allPs.to }}</p>
                    <p class="card-text" style="font-size: large;"><strong>Totalamount :</strong><br>{{ allPs.totalamount }}
                    </p>
                    <p class="card-text" style="font-size: large;"><strong>Created_at :</strong><br>{{ allPs.created_at }}
                    </p>
                    <button type="button" class="btn btn-outline-warning">saving</button>
                </div>
            </div>
        </div>
        <div class="col-6">
        <label for="ResultField" class="form-label">Result</label>
        <textarea class="form-control" id="ResultField" cols="80" rows="25" disabled readonly>Handling "saving" functionality is under development</textarea>
    </div>
    </div>

</template>
  
<style scoped>
.card {
    background-color: rgba(0, 0, 0, 0);
    color: #ffffff;
}</style>