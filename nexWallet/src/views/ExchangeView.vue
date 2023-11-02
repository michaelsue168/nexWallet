<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { User_info } from '../main';
import { allbank,exchangeRates } from '../main';

import { watch } from 'vue';
import { onChange } from '../handlers/transfer';

const ChangeData = ref({
  User: User_info.value.publicKey,
  From: '',
  To: ''.trim(),
  PayAmount: '',
  ConvertAmount: '',
  Currency: ''
})

const handleChange = async () => {
  const result = calculateExchange()
  ChangeData.value.ConvertAmount = result;

  if (selectedBank.value.amount < ChangeData.value.PayAmount) {
    message.error({
      content: 'Insufficient balance',
      duration: 3,
    });
  }
  else {
    const response = await onChange(ChangeData.value)
    if (!response) {
      message.error({
        content: 'Destination address not found',
        duration: 3,
      });
    } else {
      message.success({
        content: 'success',
        duration: 3,
      });
    }
  }
};


const Receivecurrency = ref(null)
const selectedBank = ref(null);
const calculateExchange = () => {
  const selectedCurrency = selectedBank.value.currency;
  const exchangePamentRate = exchangeRates.value[selectedCurrency];
  const convertedToUs = parseFloat(ChangeData.value.PayAmount) / parseFloat(exchangePamentRate);
  const exchangeReciveRate = exchangeRates.value[Receivecurrency.value];
  const convertedAmount = parseFloat(convertedToUs) * parseFloat(exchangeReciveRate);
  return convertedAmount
};

watch(() => ChangeData.value.From, (nV, oV) => {
  selectedBank.value = allbank.value.find(item => item.address === nV);
  ChangeData.value.Currency = selectedBank.value.currency
}, {
  deep: true
});
watch(() => ChangeData.value.PayAmount, (nV, oV) => {
  if (selectedBank.value) {
    if (selectedBank.value.amount < ChangeData.value.PayAmount)
      message.error({
        content: 'Insufficient balance',
        duration: 2,
      });
  }
}, {
  deep: true
});
</script>

<template>
  <div class="exchange-rates-board">
    <h2>International exchange rate</h2>
    <div class="exchange-rate-container">
      <div class="exchange-rate">
        <h3>US<small> -CBDC</small></h3>
        <p>{{ exchangeRates.US }}</p>
      </div>
      <div class="exchange-rate">
        <h3>JP<small> -CBDC</small></h3>
        <p>{{ exchangeRates.JP }}</p>
      </div>
      <div class="exchange-rate">
        <h3>NT<small> -CBDC</small></h3>
        <p>{{ exchangeRates.NT }}</p>
      </div>
      <div class="exchange-rate">
        <h3>XRP</h3>
        <p>{{ exchangeRates.XRP }}</p>
      </div>
    </div>
    <p class="note">Based on $1 US-CBDC</p>
  </div>

  <form class="row m-auto" @submit.prevent="handleChange">
    <div class="col-md-6">
      <label for="FromAccountField" class="form-label">From</label>
      <select class="form-select" id="floatingSelect" aria-label="Floating label select example" required
        v-model="ChangeData.From">
        <option v-for="(allbanks, index) in allbank" :key="index" :value="allbanks.address">{{ allbanks.address }}
        </option>
      </select>
    </div>

    <div class="col-md-6">
      <label for="standbyCurrencyField" class="form-label">Payment currency</label>
      <input type="text" class="form-control" id="standbyCurrencyField" v-model="ChangeData.Currency" disabled readonly />
    </div>

    <div class="col-md-6">
      <label for="ToAccountField" class="form-label">To</label>
      <input type="text" class="form-control" id="ToAccountField" required v-model="ChangeData.To" />
    </div>

    <div class="col-md-6">
      <label for="Receivecurrency" class="form-label">Recive currency</label>
      <select class="form-select" id="Receivecurrency" aria-label="Floating label select example"
        v-model="Receivecurrency" required>
        <option value="US">US-CBDC</option>
        <option value="JP">JP-CBDC</option>
        <option value="NT">NT-CBDC</option>
      </select>
    </div>

    <div class="col-md-12">
      <label for="standbyAmountField" class="form-label">Amount</label>
      <input type="number" class="form-control" min="0" id="standbyAmountField" required v-model="ChangeData.PayAmount" />
    </div>

    <div class="col-md-12 text-center">
      <br />
      <button type="submit" class="btn btn-outline-success">Exchange</button>
    </div>
  </form>
</template>



<style>
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
  padding-top: 10px;
}
</style>
