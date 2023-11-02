<script setup>
import { RouterView, useRouter } from 'vue-router'
import { onMounted } from 'vue';

const router = useRouter();

const switchrouter = (key) => {
  if (key == '1') {
    router.push({ name: 'wallet' });
  } else if (key == '2') {
    router.push({ name: 'login' });
  }else if(key == '3'){
    router.push({ name: 'home' });
  }
}
onMounted(() => {
    router.push({ name: 'basic' });
});
</script>
<template>
    <div class="text-center">
        <img alt="logo" src="@/assets/Wlogo.png" width="250" @click="switchrouter('3')"/>
    </div>
    <RouterView />
</template>

<style scoped>

</style>
  