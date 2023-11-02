<script setup>
import { User_info } from '../main';
import { message } from 'ant-design-vue';
import { ref, watch, computed } from 'vue';
import { onsendXRP } from '../handlers/transfer'
import { allbank } from '../main';
import CryptoJS from 'crypto-js';
import { get, getTo } from '../handlers/bank';
import { onMounted } from 'vue';

const exchangeRates = ref({
    US: 1,
    JP: 145.15,
    NT: 31.89,
    XRP: 0.6308,
});

let results = '';
const key = 'updatable';


const TransferData = ref({
    User: User_info.value.publicKey,
    From: '',
    To: ''.trim(),
    PayAmount: '',
    ConvertAmount: '',
    Currency: '',
    FBalance: '',
    Tbalance: ''
})

const Receivecurrency = ref(null)
const Finfo = ref(null);
const Tinfo = ref(null);
const calculateExchange = () => {
    const exchangePamentRate = exchangeRates.value[TransferData.value.Currency];
    const convertedToUs = parseFloat(TransferData.value.PayAmount) / parseFloat(exchangePamentRate);
    const exchangeReciveRate = exchangeRates.value[Receivecurrency.value];
    TransferData.value.ConvertAmount = parseFloat(convertedToUs) * parseFloat(exchangeReciveRate);
};

const nonfixedAccounts = computed(() => {
    return allbank.value.filter(allbanks => allbanks.type != 'Fixed');
});

// *******************************************************
// ******************** Send XRP *************************
// *******************************************************
const sendXRP = async () => {
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

        Finfo.value = allbank.value.find(item => item.address === TransferData.value.From);

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
} // End of sendXRP()

watch(() => TransferData.value.From, (nV, oV) => {
    Finfo.value = allbank.value.find(item => item.address === nV);
    TransferData.value.Currency = Finfo.value.currency
}, {
    deep: true
});
watch(() => TransferData.value.PayAmount, (nV, oV) => {
    if (Finfo.value) {
        if (Finfo.value.amount < TransferData.value.PayAmount)
            message.error({
                content: 'Insufficient balance',
                duration: 2,
            });
    }
}, {
    deep: true
});
const getallBank = async () => {
    const response = await get()
    allbank.value = response.onbankdata
}
onMounted(() => {
    getallBank()
})
</script>

<template>
    <main class="row" @submit.prevent="handleSubmit">
        <div class="col-6 row">
            <div class="col-md-6">
                <label for="FromAccountField" class="form-label">From</label>
                <select class="form-select" id="floatingSelect" aria-label="Floating label select example" required
                    v-model="TransferData.From">
                    <option v-for="account in nonfixedAccounts" :key="account.address">{{
                        account.address }}
                    </option>
                </select>
            </div>
            <div class="col-md-6">
                <label for="standbyCurrencyField" class="form-label">Payment currency</label>
                <input type="text" class="form-control" id="standbyCurrencyField" v-model="TransferData.Currency" disabled
                    readonly />
            </div>

            <div class="col-md-6">
                <label for="ToAccountField" class="form-label">Destination</label>
                <input type="text" class="form-control" id="ToAccountField" required v-model="TransferData.To" />
            </div>

            <div class="col-md-6">
                <label for="Receivecurrency" class="form-label">Destination currency</label>
                <select class="form-select" id="Receivecurrency" aria-label="Floating label select example"
                    v-model="Receivecurrency" required>
                    <option value="US">US-CBDC</option>
                    <option value="JP">JP-CBDC</option>
                    <option value="NT">NT-CBDC</option>
                </select>
            </div>

            <div class="col-md-6">
                <label for="standbyAmountField" class="form-label">Amount</label>
                <input type="number" class="form-control" min="0" id="standbyAmountField" required
                    v-model="TransferData.PayAmount" />
            </div>
            <div class="col-md-6">
                <label for="passwordInput" class="form-label">Login password</label>
                <input type="password" class="form-control" id="passwordInput" required>
                <br />
            </div>

            <div class="col-12 mb-3">
                <button type="button" class="btn btn-outline-success" @click="sendXRP">Send ></button>
            </div>
        </div>
        <div class="col-6">
            <label for="ResultField" class="form-label">Result</label>
            <textarea class="form-control" id="ResultField" cols="80" rows="10" disabled
                readonly>try to transfer ! test address:rPpD9N6oyFBQkoA3Ww4gPSeyDR5i2rwjp9</textarea>
        </div>
    </main>
</template>

<style scoped>

label {
    font-weight: bold;
}

form {
    width: 60vw;
}

@media (max-width: 768px) {
    form {
        width: 100%;
    }
}

.exchange-rates-board {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.exchange-rate-container {
    display: flex;
    justify-content: space-between;
}

.exchange-rate {
    flex: 1;
    padding: 10px;
    margin-left: 10px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

h3 {
    margin: 0;
}

p {
    font-size: 24px;
    margin: 5px 0;
}

.note {
    text-align: center;
    font-size: large;
    color: rgb(159, 159, 159);
}

label {
    /* font-weight: bold; */
    padding-top: 10px;
}
</style>