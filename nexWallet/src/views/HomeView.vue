<script setup>
import { User_info } from '../main';
import home_overview from '../components/home_overview.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const switchrouter = (key) => {
  if (key == '1') {
    router.push({ name: 'signup' });
  } else if (key == '2') {
    router.push({ name: 'login' });
  }
}
</script>

<template>
  <main>
    <home_overview v-if="User_info" />
    <div class="row" style="height: 50vh;margin-top: 5vh;" v-else>
      <div class="text-center col-sm-12">
        <img alt="logo" src="@/assets/Wlogo.png" width="250" @click="switchrouter('3')" />
      </div>
      <div class="col-sm-6 mb-3">
        <a-button :size="large" style="width: 100%;height: 100%;" @click="switchrouter('1')" ghost>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-person-vcard"
            viewBox="0 0 16 16">
            <path
              d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5ZM9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8Zm1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Z" />
            <path
              d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2ZM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96c.026-.163.04-.33.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1.006 1.006 0 0 1 1 12V4Z" />
          </svg>
          <h1>Sign up</h1>
        </a-button>
      </div>
      <div class="col-sm-6 mb-3">
        <a-button :size="large" style="width: 100%;height: 100%;" @click="switchrouter('2')" ghost>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"
            class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" />
            <path fill-rule="evenodd"
              d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
          </svg>
          <h1>Log in</h1>
        </a-button>
      </div>
    </div>
  </main>
</template>
