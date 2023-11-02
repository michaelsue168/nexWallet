<script setup>
import { RouterLink, RouterView,useRouter } from 'vue-router'
import { User_info } from './main';
import { DownOutlined } from '@ant-design/icons-vue';
import { logout } from './handlers/user'

const router = useRouter();

const onlogout = () => {
  logout()
  User_info.value=''
  router.push({name:'home'})
}
</script>

<template>
  <header v-if="User_info">

    <div class="wrapper">
      <img alt="logo" class="logo" src="@/assets/Wlogo.png" width="250" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/transfer">Transfer</RouterLink>
        <RouterLink to="/savings">Savings plan</RouterLink>
          <a-dropdown class="t">
            <template #overlay>
              <a-menu>
                <a-menu-item key="1">
                  <RouterLink to="/profile">Info overview</RouterLink>
                </a-menu-item>
                <a-menu-item key="2" style="font-size: large;" @click="onlogout">
                  logout
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              User profile
              <DownOutlined />
            </a-button>
          </a-dropdown>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.t{
  background-color: rgba(0, 0, 0, 0);
  color: #ffffff;
}
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>

