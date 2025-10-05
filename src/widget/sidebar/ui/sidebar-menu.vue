<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import AvatarUi from '@/shared/avatar/avatar-ui.vue'

const router = useRouter()
const route = useRoute()
console.log(route)
</script>

<template>
  <nav class="menu">
    <AvatarUi class="avatar"></AvatarUi>
    <div class="user-info">
      <span class="user-name">FirstName LastName</span>
      <span class="email">email@eamil.com</span>
    </div>
    <ul>
      <li>
        <button
          :class="{ active: route.fullPath === '/dashboard' }"
          @click="() => router.push('/dashboard')"
        >
          Dashboard
        </button>
      </li>
      <li>
        <button
          :class="{ active: route.fullPath === '/vital' }"
          @click="() => router.push('/vital')"
        >
          Vital Task
        </button>
      </li>
      <li>
        <button
          :class="{ active: route.fullPath === '/tasks' }"
          @click="() => router.push('/tasks')"
        >
          My Task
        </button>
      </li>
      <li>
        <button
          :class="{ active: route.fullPath === '/tasks-category' }"
          @click="() => router.push('/tasks-category')"
        >
          Task Categories
        </button>
      </li>
      <li>
        <button
          :class="{ active: route.fullPath === '/settings' }"
          @click="() => router.push('/settings')"
        >
          Settings
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.avatar {
  height: 86px;
  width: 86px;
  position: absolute;
  left: calc(50% - 43px);
  top: -43px;
  z-index: 50;
  background: #565454;
  border-radius: 50%;
}

.user-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  margin-bottom: 18px;

  & .user-name {
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  & .email {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}

.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: calc(100dvh - 160px);
  width: 100%;
  padding-top: 56px;
  padding-right: 20px;
  padding-left: 20px;
  margin-top: 56px;
  max-width: 365px;
  border-radius: 0 8px 8px 0;
  background: #ff6767;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);

  & ul {
    list-style: none;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  button {
    background: #ff6767;
    text-decoration: none;
    color: #ffffff;
    width: 100%;
    display: flex;
    padding: 20px 0 20px 56px;
    justify-content: start;
    border: none;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    cursor: pointer;

    &:hover {
      border-radius: 14px;
      background: #fff;
      color: #ff6767;
    }

    &.active {
      border-radius: 14px;
      background: #ffffff;
      color: #ff6767;
    }
  }
}
</style>
