<script setup>
import { exchangeRates } from '../main';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { add, get, getL } from '../handlers/bank'
import { onMounted } from 'vue';
import { allbank } from '../main';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import CryptoJS from 'crypto-js';

const open = ref(false);
ChartJS.register(ArcElement, Tooltip, Legend);

const virtualAccount = ref({
  bankName: '',
  bankCode: '',
  currency: '',
  address: '',
  type: ''
});

const showModal = () => {
  open.value = true;
};

const originalObject = ref({
  password: '',
  privateKey: '',
  seed: ''
});

const fakexrpdata = ref({
  address: '',
  publicKey: '',
  xRPbalance: '',
  encryptedData: ''
})


const handleOk = async () => {
  if (virtualAccount.value.address === '') {
    message.error({
      content: 'Click "Get virtual address" to get an account',
      duration: 3,
    });
  } else {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(originalObject), originalObject.value.password).toString();
    fakexrpdata.value.encryptedData = encryptedData
    const response = await add(virtualAccount.value, fakexrpdata.value)
    await getallBank()
    open.value = false;
    message.success({
      content: 'success',
      duration: 3,
    });
  }
};


const key = 'updatable';

// ==================================get new account=========================================================
const getAccount = async () => {
  message.loading({
    content: 'Loading...',
    key,
    duration: 0, // Setting duration to 0 makes the loading message indefinite
  });
  let net = "wss://s.altnet.rippletest.net:51233";
  const client = new xrpl.Client(net);
  let faucetHost = null


  const exchangePamentRate = exchangeRates.value[virtualAccount.value.currency];

  let amount = '10000';

  await client.connect();
  const my_wallet = (await client.fundWallet(null, { amount, faucetHost })).wallet;


  const my_balance = await client.getXrpBalance(my_wallet.address);

  fakexrpdata.value.address = my_wallet.address;
  fakexrpdata.value.publicKey = my_wallet.publicKey;
  fakexrpdata.value.xRPbalance = my_balance
  originalObject.value.privateKey = my_wallet.privateKey;
  originalObject.value.seed = my_wallet.seed;

  client.disconnect();
  message.success({
    content: 'Loaded!',
    key,
    duration: 2,
  });
};

const getVirtualAccount = async () => {
  if (virtualAccount.value.bankName === '' || virtualAccount.value.bankCode === '' || virtualAccount.value.currency === '') {
    message.error({
      content: 'Incomplete',
      duration: 2,
    });
  } else {
    const randomDigits1 = generateRandomDigits(10);
    const randomDigits2 = generateRandomDigits(10);
    const randomDigits3 = generateRandomDigits(10);
    await getAccount()
    virtualAccount.value.address = `${virtualAccount.value.bankCode}-${randomDigits1}-${randomDigits2}-${randomDigits3}`;
  }
}
const generateRandomDigits = (length) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

const options = {
  responsive: true,
  maintainAspectRatio: true,
}

const data = ref({
  labels: [],
  datasets: [
    {
      backgroundColor: [],
      data: [],
    },
  ],
});



const getallBank = async () => {
  const response = await get();
  allbank.value = response.onbankdata;

  allbank.value.forEach(item => {

    data.value.labels.push(item.bankName);
    data.value.datasets[0].backgroundColor.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    data.value.datasets[0].data.push(item.amount);
  });


};

const alllog = ref();
const getlog = async () => {
  const response = await getL();
  alllog.value = response.onLdata;
}
onMounted(() => {
  getlog()
  getallBank()
})

</script>

<template>
  <div style="margin-top: 10px;">
    <a-modal v-model:open="open" title="Add sub account" @ok="handleOk">
      <div class="mb-3 row">
        <div class="col-4">
          <label for="formGroupExampleInput" class="form-label">Bank name</label>
          <input type="text" class="form-control" id="formGroupExampleInput" v-model="virtualAccount.bankName"
            placeholder="e.g, nexBank..">
        </div>
        <div class="col-4">
          <label for="formGroupExampleInput" class="form-label">Bank code</label>
          <input type="number" class="form-control" id="formGroupExampleInput" v-model="virtualAccount.bankCode"
            placeholder="e.g, 004.." min="1" max="9998">
        </div>
        <div class="col-4">
          <label for="formGroupExampleInput" class="form-label">Currency</label>
          <select class="form-select" id="formGroupExampleInput" aria-label="Floating label select example"
            v-model="virtualAccount.currency" required>
            <option value="US">US-CBDC</option>
            <option value="JP">JP-CBDC</option>
            <option value="NT">NT-CBDC</option>
          </select>
        </div>
      </div>
      <div class="mb-3 row">
        <label for="formGroupExampleInput2" class="form-label">Account address</label>
        <div class="col-7">
          <input type="text" class="form-control" id="formGroupExampleInput2" v-model="virtualAccount.address" disabled
            readonly>
        </div>
        <div class="col-5">
          <button type="button" class="btn btn-outline-primary" style="width: 100%;" @click="getVirtualAccount">Get
            virtual address</button>
        </div>
      </div>

      <div class="mb-3 row">
        <div class="col-md-4">
          <label for="formGroupExampleInput" class="form-label">Type</label>
          <select class="form-select" id="formGroupExampleInput" aria-label="Floating label select example"
            v-model="virtualAccount.type" required>
            <option value="Demand">Demand deposit</option>
            <option value="Fixed">Fixed deposit</option>
            <option value="Investment">Investment</option>
          </select>
        </div>
        <div class="col-6">
          <label for="formGroupExampleInput" class="form-label">Login password</label>
          <input type="password" class="form-control" id="formGroupExampleInput" v-model="originalObject.password"
            required>
        </div>
      </div>

    </a-modal>
  </div>
  <h1>Overview</h1>
  <div class="row" style="margin-top: 20px;">
    <div class="col-sm-3 mb-3" v-for="allbanks in allbank">
      <div class="card border-light" style="width: 100%;height: 100%;">
        <div class="card-body">
          <a-popover title="Info" trigger="hover" placement="bottom">
            <template #content>
              <p>Bank code: {{ allbanks.bankCode }}</p>
              <p>Address: {{ allbanks.address }}</p>
            </template>
            <h6 class="card-text">{{ allbanks.bankName }}</h6>
            <div class="d-flex justify-content-between align-items-baseline">
              <div>
                <h3 class="card-text">{{ allbanks.amount.toFixed(2) }} <span style="font-size: medium;">{{
                  allbanks.currency
                }}</span></h3>
              </div>
              <span class="card-text badge rounded-pill text-bg-light" style="align-self: flex-end;">{{ allbanks.type
              }}</span>
            </div>
          </a-popover>
        </div>
      </div>
    </div>
    <div class="col-sm-3 mb-3">
      <a-button type="dashed button" :size="large" style="width: 100%;height: 100%;" @click="showModal" ghost>
        Add bank account
        <br />
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          class="bi bi-plus-circle-dotted" viewBox="0 0 16 16">
          <path
            d="M8 0c-.176 0-.35.006-.523.017l.064.998a7.117 7.117 0 0 1 .918 0l.064-.998A8.113 8.113 0 0 0 8 0zM6.44.152c-.346.069-.684.16-1.012.27l.321.948c.287-.098.582-.177.884-.237L6.44.153zm4.132.271a7.946 7.946 0 0 0-1.011-.27l-.194.98c.302.06.597.14.884.237l.321-.947zm1.873.925a8 8 0 0 0-.906-.524l-.443.896c.275.136.54.29.793.459l.556-.831zM4.46.824c-.314.155-.616.33-.905.524l.556.83a7.07 7.07 0 0 1 .793-.458L4.46.824zM2.725 1.985c-.262.23-.51.478-.74.74l.752.66c.202-.23.418-.446.648-.648l-.66-.752zm11.29.74a8.058 8.058 0 0 0-.74-.74l-.66.752c.23.202.447.418.648.648l.752-.66zm1.161 1.735a7.98 7.98 0 0 0-.524-.905l-.83.556c.169.253.322.518.458.793l.896-.443zM1.348 3.555c-.194.289-.37.591-.524.906l.896.443c.136-.275.29-.54.459-.793l-.831-.556zM.423 5.428a7.945 7.945 0 0 0-.27 1.011l.98.194c.06-.302.14-.597.237-.884l-.947-.321zM15.848 6.44a7.943 7.943 0 0 0-.27-1.012l-.948.321c.098.287.177.582.237.884l.98-.194zM.017 7.477a8.113 8.113 0 0 0 0 1.046l.998-.064a7.117 7.117 0 0 1 0-.918l-.998-.064zM16 8a8.1 8.1 0 0 0-.017-.523l-.998.064a7.11 7.11 0 0 1 0 .918l.998.064A8.1 8.1 0 0 0 16 8zM.152 9.56c.069.346.16.684.27 1.012l.948-.321a6.944 6.944 0 0 1-.237-.884l-.98.194zm15.425 1.012c.112-.328.202-.666.27-1.011l-.98-.194c-.06.302-.14.597-.237.884l.947.321zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a6.999 6.999 0 0 1-.458-.793l-.896.443zm13.828.905c.194-.289.37-.591.524-.906l-.896-.443c-.136.275-.29.54-.459.793l.831.556zm-12.667.83c.23.262.478.51.74.74l.66-.752a7.047 7.047 0 0 1-.648-.648l-.752.66zm11.29.74c.262-.23.51-.478.74-.74l-.752-.66c-.201.23-.418.447-.648.648l.66.752zm-1.735 1.161c.314-.155.616-.33.905-.524l-.556-.83a7.07 7.07 0 0 1-.793.458l.443.896zm-7.985-.524c.289.194.591.37.906.524l.443-.896a6.998 6.998 0 0 1-.793-.459l-.556.831zm1.873.925c.328.112.666.202 1.011.27l.194-.98a6.953 6.953 0 0 1-.884-.237l-.321.947zm4.132.271a7.944 7.944 0 0 0 1.012-.27l-.321-.948a6.954 6.954 0 0 1-.884.237l.194.98zm-2.083.135a8.1 8.1 0 0 0 1.046 0l-.064-.998a7.11 7.11 0 0 1-.918 0l-.064.998zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
        </svg>
      </a-button>
    </div>
  </div>
  <hr />
  <h1>Transfer out record</h1>
  <table class="table table-dark table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">from</th>
        <th scope="col">to</th>
        <th scope="col">Amount</th>
        <th scope="col">Balence</th>
        <th scope="col">create time</th>
      </tr>
    </thead>
    <tbody v-for="(alllogs, index) in alllog">
      <tr>
        <th scope="row">{{ index + 1 }}</th>
        <td>{{ alllogs.from }}</td>
        <td>{{ alllogs.to }}</td>
        <td>{{ alllogs.payAmount }}</td>
        <td>{{ alllogs.Tbalance }}</td>
        <td>{{ alllogs.created_at }}</td>
      </tr>
    </tbody>
  </table>

  <h1 v-if="!alllog">No Data</h1>
</template>

<style scoped>
.card {
  background-color: rgba(0, 0, 0, 0);
  color: #ffffff;
}
</style>